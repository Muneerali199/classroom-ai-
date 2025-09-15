'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AuthService } from '@/lib/auth';
import { Loader2, Trash2, Users, AlertTriangle, Eye, Calendar } from 'lucide-react';
import type { Student } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import EditStudentForm from './edit-student-form';
import ResetStudentPassword from './reset-student-password';
import { Badge } from '@/components/ui/badge';

interface StudentListManagerProps {
  students: Student[];
  onStudentDeleted?: (studentId: string) => void;
  onStudentUpdated?: (updatedStudent: Student) => void;
}

export default function StudentListManager({ students, onStudentDeleted, onStudentUpdated }: StudentListManagerProps) {
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    setDeletingStudentId(studentId);
    setError(null);

    try {
      const result = await AuthService.deleteStudent(studentId);

      if (result.success) {
        toast({
          title: 'Student Deleted',
          description: `${studentName} has been successfully removed from the system.`,
        });
        onStudentDeleted?.(studentId);
      } else {
        setError(result.error || 'Failed to delete student');
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete student',
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
      setDeletingStudentId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Manage Students
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            View and manage your students. You can create, edit, and delete student profiles.
          </p>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="text-red-800">Error</AlertTitle>
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          {students.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No students found. Use the forms above to add students to your class.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <h4 className="font-medium">Current Students ({students.length}):</h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {students.map((student) => (
                  <div key={student.id} className="p-4 border rounded-lg bg-background hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h5 className="font-medium">{student.name}</h5>
                          {student.grade && <Badge variant="secondary">{student.grade}</Badge>}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm text-muted-foreground">
                          <div>Student ID: {student.student_id || student.id}</div>
                          {student.email && <div>Email: {student.email}</div>}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Attendance: {student.attendance.length} records
                          </div>
                          {student.emergency_contact_name && (
                            <div>Emergency: {student.emergency_contact_name}</div>
                          )}
                        </div>
                        
                        {student.created_at && (
                          <div className="text-xs text-muted-foreground">
                            Added: {new Date(student.created_at).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <EditStudentForm 
                          student={student} 
                          onSuccess={onStudentUpdated}
                        />
                        
                        <ResetStudentPassword 
                          student={student}
                          onSuccess={() => {
                            toast({
                              title: 'Password Reset',
                              description: `Password updated for ${student.name}`,
                            });
                          }}
                        />
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              disabled={deletingStudentId === student.id}
                            >
                              {deletingStudentId === student.id ? (
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
                              <AlertDialogTitle>Delete Student</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete <strong>{student.name}</strong>? 
                                This action cannot be undone and will permanently remove:
                                <br /><br />
                                • Student account and profile
                                <br />
                                • All attendance records ({student.attendance.length} records)
                                <br />
                                • Access to the system
                                <br /><br />
                                <strong className="text-red-600">This action is permanent and cannot be reversed.</strong>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteStudent(student.id, student.name)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete Student
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
                  <strong>Teacher Permissions:</strong> You can create, edit, and delete student profiles. 
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