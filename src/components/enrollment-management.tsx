'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Edit, Trash2, Users, BookOpen, MapPin, Search, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Subject, Room, Student, SubjectStudent, RoomStudent } from '@/lib/database.types';

interface EnrollmentManagementProps {
  teacherId: string;
}

interface EnrollmentWithDetails {
  id: number;
  subject_id: number;
  student_id: string;
  room_id?: number;
  created_at: string;
  subject: Subject;
  student: Student;
  room?: Room;
}

export default function EnrollmentManagement({ teacherId }: EnrollmentManagementProps) {
  const { toast } = useToast();
  const [enrollments, setEnrollments] = useState<EnrollmentWithDetails[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [conflicts, setConflicts] = useState<string[]>([]);

  // Fetch data
  const fetchData = async () => {
    try {
      const [enrollmentsRes, subjectsRes, roomsRes, studentsRes] = await Promise.all([
        fetch('/api/enrollments'),
        fetch('/api/subjects'),
        fetch('/api/rooms'),
        fetch('/api/students')
      ]);

      if (enrollmentsRes.ok) {
        const enrollmentsData = await enrollmentsRes.json();
        setEnrollments(enrollmentsData);
      }

      if (subjectsRes.ok) {
        const subjectsData = await subjectsRes.json();
        setSubjects(subjectsData);
      }

      if (roomsRes.ok) {
        const roomsData = await roomsRes.json();
        setRooms(roomsData);
      }

      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setStudents(studentsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load enrollment data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Check for conflicts when selections change
  useEffect(() => {
    if (selectedSubject && selectedRoom && selectedStudent) {
      checkConflicts();
    } else {
      setConflicts([]);
    }
  }, [selectedSubject, selectedRoom, selectedStudent]);

  const checkConflicts = () => {
    const newConflicts: string[] = [];

    // Check if student is already enrolled in this subject
    const existingSubjectEnrollment = enrollments.find(
      e => e.subject_id === parseInt(selectedSubject) && e.student_id === selectedStudent
    );
    if (existingSubjectEnrollment) {
      newConflicts.push('Student is already enrolled in this subject');
    }

    // Check room capacity
    const room = rooms.find(r => r.id === parseInt(selectedRoom));
    if (room?.capacity) {
      const roomEnrollments = enrollments.filter(e => e.room_id === parseInt(selectedRoom));
      if (roomEnrollments.length >= room.capacity) {
        newConflicts.push('Room capacity exceeded');
      }
    }

    // Check if room is already assigned to this subject (assuming one room per subject for simplicity)
    const roomSubjectConflict = enrollments.find(
      e => e.room_id === parseInt(selectedRoom) && e.subject_id !== parseInt(selectedSubject)
    );
    if (roomSubjectConflict) {
      newConflicts.push('Room is already assigned to another subject');
    }

    setConflicts(newConflicts);
  };

  // Filter enrollments based on search term
  const filteredEnrollments = enrollments.filter(enrollment =>
    enrollment.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.room?.room_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle enrollment creation
  const handleCreateEnrollment = async () => {
    if (!selectedSubject || !selectedStudent) {
      toast({
        title: 'Error',
        description: 'Please select a subject and student',
        variant: 'destructive'
      });
      return;
    }

    if (conflicts.length > 0) {
      toast({
        title: 'Conflicts Detected',
        description: 'Please resolve conflicts before creating enrollment',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject_id: parseInt(selectedSubject),
          student_id: selectedStudent,
          room_id: selectedRoom ? parseInt(selectedRoom) : null,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Student enrolled successfully'
        });
        setSelectedSubject('');
        setSelectedRoom('');
        setSelectedStudent('');
        setIsCreateDialogOpen(false);
        fetchData();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.message || 'Failed to create enrollment',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error creating enrollment:', error);
      toast({
        title: 'Error',
        description: 'Failed to create enrollment',
        variant: 'destructive'
      });
    }
  };

  // Handle enrollment deletion
  const handleDeleteEnrollment = async (enrollmentId: number) => {
    try {
      const response = await fetch(`/api/enrollments/${enrollmentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Enrollment removed successfully'
        });
        fetchData();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.message || 'Failed to remove enrollment',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error deleting enrollment:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove enrollment',
        variant: 'destructive'
      });
    }
  };

  // Get enrollment statistics
  const getStats = () => {
    const totalEnrollments = enrollments.length;
    const uniqueStudents = new Set(enrollments.map(e => e.student_id)).size;
    const uniqueSubjects = new Set(enrollments.map(e => e.subject_id)).size;
    const assignedRooms = new Set(enrollments.filter(e => e.room_id).map(e => e.room_id)).size;

    return { totalEnrollments, uniqueStudents, uniqueSubjects, assignedRooms };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="h-32 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Student Enrollments</h2>
          <p className="text-muted-foreground">Manage student assignments to subjects and rooms</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Enroll Student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Enroll Student</DialogTitle>
              <DialogDescription>
                Assign a student to a subject and optional room.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {subject.name} {subject.code && `(${subject.code})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="student">Student *</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} {student.student_id && `(${student.student_id})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="room">Room (Optional)</Label>
                <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id.toString()}>
                        {room.room_number} {room.building && `(${room.building})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {conflicts.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc list-inside">
                      {conflicts.map((conflict, index) => (
                        <li key={index}>{conflict}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCreateEnrollment}
                disabled={conflicts.length > 0}
              >
                Enroll Student
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueSubjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Rooms</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assignedRooms}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search enrollments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Enrollments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Current Enrollments ({filteredEnrollments.length})
          </CardTitle>
          <CardDescription>
            Student assignments to subjects and rooms
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEnrollments.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No enrollments found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by enrolling your first student.'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Enroll Student
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Enrolled Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnrollments.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{enrollment.student.name}</div>
                        {enrollment.student.student_id && (
                          <div className="text-sm text-muted-foreground">
                            ID: {enrollment.student.student_id}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{enrollment.subject.name}</div>
                        {enrollment.subject.code && (
                          <Badge variant="secondary" className="text-xs">
                            {enrollment.subject.code}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {enrollment.room ? (
                        <div>
                          <div className="font-medium">{enrollment.room.room_number}</div>
                          {enrollment.room.building && (
                            <div className="text-sm text-muted-foreground">
                              {enrollment.room.building}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Not assigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(enrollment.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Enrollment</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove {enrollment.student.name} from {enrollment.subject.name}?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteEnrollment(enrollment.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}