'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TeacherService } from '@/lib/teacher-service';
import { Loader2, Trash2, Users, AlertTriangle, Calendar, Briefcase } from 'lucide-react';
import type { Teacher } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import EditTeacherForm from './edit-teacher-form';
import ResetTeacherPassword from './reset-teacher-password';
import { Badge } from '@/components/ui/badge';

interface TeacherListManagerProps {
  teachers: Teacher[];
  onTeacherDeleted?: (teacherId: string) => void;
  onTeacherUpdated?: (updatedTeacher: Teacher) => void;
}

export default function TeacherListManager({ teachers, onTeacherDeleted, onTeacherUpdated }: TeacherListManagerProps) {
  const [deletingTeacherId, setDeletingTeacherId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDeleteTeacher = async (teacherId: string, teacherName: string) => {
    setDeletingTeacherId(teacherId);
    setError(null);

    try {
      const result = await TeacherService.deleteTeacher(teacherId);

      if (result.success) {
        toast({
          title: 'Teacher Deleted',
          description: `${teacherName} has been successfully removed from the system.`,
        });
        onTeacherDeleted?.(teacherId);
      } else {
        setError(result.error || 'Failed to delete teacher');
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete teacher',
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setDeletingTeacherId(null);
    }
  };

  const getEmploymentStatusColor = (status?: string) => {
    switch (status) {
      case 'Full-time': return 'bg-green-100 text-green-800';
      case 'Part-time': return 'bg-blue-100 text-blue-800';
      case 'Contract': return 'bg-orange-100 text-orange-800';
      case 'Substitute': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Manage Teachers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            View and manage your teaching staff. You can create, edit, delete teacher profiles, and manage their attendance.
          </p>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="text-red-800">Error</AlertTitle>
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          {teachers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No teachers found. Use the forms above to add teachers to your institution.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <h4 className="font-medium">Current Teachers ({teachers.length}):</h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {teachers.map((teacher) => (
                  <div key={teacher.id} className="p-4 border rounded-lg bg-background hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="font-medium">{teacher.name}</h5>
                          {teacher.department && <Badge variant="secondary">{teacher.department}</Badge>}
                          {teacher.employment_status && (
                            <Badge className={getEmploymentStatusColor(teacher.employment_status)}>
                              {teacher.employment_status}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm text-muted-foreground">
                          <div>Teacher ID: {teacher.teacher_id || teacher.id}</div>
                          {teacher.email && <div>Email: {teacher.email}</div>}
                          {teacher.subject && <div>Subject: {teacher.subject}</div>}
                          {teacher.phone_number && <div>Phone: {teacher.phone_number}</div>}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Attendance: {teacher.attendance.length} records
                          </div>
                          {teacher.hire_date && (
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              Hired: {new Date(teacher.hire_date).toLocaleDateString()}
                            </div>
                          )}
                          {teacher.emergency_contact_name && (
                            <div>Emergency: {teacher.emergency_contact_name}</div>
                          )}
                        </div>
                        
                        {teacher.created_at && (
                          <div className="text-xs text-muted-foreground">
                            Added: {new Date(teacher.created_at).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <EditTeacherForm 
                          teacher={teacher} 
                          onSuccess={onTeacherUpdated}
                        />
                        
                        <ResetTeacherPassword 
                          teacher={teacher}
                          onSuccess={() => {
                            toast({
                              title: 'Password Reset',
                              description: `Password updated for ${teacher.name}`,
                            });
                          }}
                        />
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              disabled={deletingTeacherId === teacher.id}
                            >
                              {deletingTeacherId === teacher.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </>
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Teacher</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete <strong>{teacher.name}</strong>? 
                                This action cannot be undone and will permanently remove:
                                <br /><br />
                                • Teacher account and profile
                                <br />
                                • All attendance records ({teacher.attendance.length} records)
                                <br />
                                • Access to the system
                                <br />
                                • All associated course and student data
                                <br /><br />
                                <strong className="text-red-600">This action is permanent and cannot be reversed.</strong>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteTeacher(teacher.id, teacher.name)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete Teacher
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Summary Information */}
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Dean Permissions:</strong> You can create, edit, delete teacher profiles, reset passwords, and mark attendance. 
                  All changes are tracked and timestamped for record keeping.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}