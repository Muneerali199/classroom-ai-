'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TeacherService } from '@/lib/teacher-service';
import { CalendarCheck, Clock, UserCheck, Users, Calendar } from 'lucide-react';
import type { Teacher, AttendanceStatus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface TeacherAttendanceManagerProps {
  teachers: Teacher[];
  onAttendanceMarked?: () => void;
}

export default function TeacherAttendanceManager({ 
  teachers, 
  onAttendanceMarked 
}: TeacherAttendanceManagerProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<Record<string, { status: string; notes: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { toast } = useToast();

  const attendanceOptions = [
    { value: 'Present', label: 'Present', color: 'bg-green-100 text-green-800' },
    { value: 'Absent', label: 'Absent', color: 'bg-red-100 text-red-800' },
    { value: 'Late', label: 'Late', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Excused', label: 'Excused', color: 'bg-blue-100 text-blue-800' },
    { value: 'Sick Leave', label: 'Sick Leave', color: 'bg-purple-100 text-purple-800' },
    { value: 'Personal Leave', label: 'Personal Leave', color: 'bg-orange-100 text-orange-800' },
  ];

  const handleAttendanceChange = (teacherId: string, status: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [teacherId]: {
        status,
        notes: prev[teacherId]?.notes || ''
      }
    }));
  };

  const handleNotesChange = (teacherId: string, notes: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [teacherId]: {
        status: prev[teacherId]?.status || 'Present',
        notes
      }
    }));
  };

  const submitAttendance = async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const promises = teachers.map(async (teacher) => {
        const data = attendanceData[teacher.id];
        if (data) {
          return TeacherService.markTeacherAttendance(
            teacher.id,
            selectedDate,
            data.status,
            data.notes
          );
        }
        // Default to Present if not explicitly set
        return TeacherService.markTeacherAttendance(
          teacher.id,
          selectedDate,
          'Present'
        );
      });

      const results = await Promise.all(promises);
      const failedResults = results.filter(result => !result.success);

      if (failedResults.length > 0) {
        setError(`Failed to mark attendance for ${failedResults.length} teacher(s)`);
      } else {
        setSuccess(`Attendance successfully recorded for ${teachers.length} teacher(s)`);
        toast({
          title: 'Attendance Recorded',
          description: `Teacher attendance for ${new Date(selectedDate).toLocaleDateString()} has been saved.`,
        });
        onAttendanceMarked?.();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit attendance');
      toast({
        title: 'Error',
        description: 'Failed to submit teacher attendance',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const markAllPresent = () => {
    const newData: Record<string, { status: string; notes: string }> = {};
    teachers.forEach(teacher => {
      newData[teacher.id] = { status: 'Present', notes: '' };
    });
    setAttendanceData(newData);
  };

  const getAttendanceColor = (status: string) => {
    const option = attendanceOptions.find(opt => opt.value === status);
    return option?.color || 'bg-gray-100 text-gray-800';
  };

  // Get today's attendance for display
  const getTodayAttendance = (teacher: Teacher) => {
    return teacher.attendance.find(att => att.date === selectedDate);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarCheck className="h-5 w-5" />
          Teacher Attendance Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Mark daily attendance for all teaching staff. Select date and set attendance status for each teacher.
          </p>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTitle className="text-red-800">Error</AlertTitle>
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertTitle className="text-green-800">Success</AlertTitle>
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          {/* Date Selection and Bulk Actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <Label htmlFor="date">Date:</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={markAllPresent}>
                <UserCheck className="h-4 w-4 mr-2" />
                Mark All Present
              </Button>
              <Button 
                onClick={submitAttendance} 
                disabled={isSubmitting || teachers.length === 0}
              >
                <Clock className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit Attendance'}
              </Button>
            </div>
          </div>

          {teachers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No teachers found. Add teachers first to manage their attendance.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-medium">Teacher Attendance for {new Date(selectedDate).toLocaleDateString()}:</h4>
              
              <div className="grid gap-4">
                {teachers.map((teacher) => {
                  const currentAttendance = attendanceData[teacher.id];
                  const todayAttendance = getTodayAttendance(teacher);
                  
                  return (
                    <div key={teacher.id} className="p-4 border rounded-lg bg-background">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="font-medium">{teacher.name}</h5>
                            {teacher.department && <Badge variant="secondary">{teacher.department}</Badge>}
                            {teacher.employment_status && (
                              <Badge variant="outline">{teacher.employment_status}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            ID: {teacher.teacher_id || teacher.id} 
                            {teacher.subject && ` • ${teacher.subject}`}
                          </p>
                          {todayAttendance && (
                            <div className="mt-1">
                              <Badge className={getAttendanceColor(todayAttendance.status)}>
                                Current: {todayAttendance.status}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`status-${teacher.id}`}>Attendance Status</Label>
                          <Select
                            value={currentAttendance?.status || 'Present'}
                            onValueChange={(value) => handleAttendanceChange(teacher.id, value)}
                          >
                            <SelectTrigger id={`status-${teacher.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {attendanceOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor={`notes-${teacher.id}`}>Notes (Optional)</Label>
                          <Textarea
                            id={`notes-${teacher.id}`}
                            placeholder="Additional notes..."
                            value={currentAttendance?.notes || ''}
                            onChange={(e) => handleNotesChange(teacher.id, e.target.value)}
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Summary */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span>Total Teachers: {teachers.length}</span>
                  <span>
                    Present: {Object.values(attendanceData).filter(data => data.status === 'Present').length + 
                             (teachers.length - Object.keys(attendanceData).length)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}