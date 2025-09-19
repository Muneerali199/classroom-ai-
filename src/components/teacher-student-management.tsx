'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  UserPlus, 
  Edit2, 
  Trash2, 
  Shield, 
  ShieldOff, 
  BookOpen, 
  MapPin, 
  Users,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import { TeacherStudentService, CreateStudentData, UpdateStudentData } from '@/lib/teacher-student-service';
import { useForm } from 'react-hook-form';

interface Student {
  id: string;
  name: string;
  email: string;
  student_id: string;
  grade: string;
  phone_number?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_notes?: string;
  created_at: string;
  subject_students?: Array<{
    subject_id: number;
    subjects: { name: string; code: string };
  }>;
}

interface Subject {
  id: number;
  name: string;
  code: string;
  description?: string;
}

interface Room {
  id: number;
  room_number: string;
  capacity?: number;
  building?: string;
  floor?: number;
}

export default function TeacherStudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [operationLoading, setOperationLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const createForm = useForm<CreateStudentData>();
  const editForm = useForm<UpdateStudentData>();

  // Load initial data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [studentsRes, subjectsRes, roomsRes] = await Promise.all([
        TeacherStudentService.getStudents(),
        TeacherStudentService.getSubjects(),
        TeacherStudentService.getRooms()
      ]);

      if (studentsRes.success) setStudents(studentsRes.data);
      if (subjectsRes.success) setSubjects(subjectsRes.data);
      if (roomsRes.success) setRooms(roomsRes.data);
    } catch (error) {
      showMessage('error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleCreateStudent = async (data: CreateStudentData) => {
    setOperationLoading('create');
    try {
      const result = await TeacherStudentService.createStudent(data);
      if (result.success) {
        showMessage('success', 'Student account created successfully');
        setIsCreateDialogOpen(false);
        createForm.reset();
        loadAllData();
      } else {
        showMessage('error', result.error || 'Failed to create student');
      }
    } catch (error) {
      showMessage('error', 'An unexpected error occurred');
    } finally {
      setOperationLoading(null);
    }
  };

  const handleUpdateStudent = async (data: UpdateStudentData) => {
    if (!selectedStudent) return;
    
    setOperationLoading('update');
    try {
      const result = await TeacherStudentService.updateStudent(selectedStudent.id, data);
      if (result.success) {
        showMessage('success', 'Student updated successfully');
        setIsEditDialogOpen(false);
        setSelectedStudent(null);
        editForm.reset();
        loadAllData();
      } else {
        showMessage('error', result.error || 'Failed to update student');
      }
    } catch (error) {
      showMessage('error', 'An unexpected error occurred');
    } finally {
      setOperationLoading(null);
    }
  };

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (!confirm(`Are you sure you want to delete student "${studentName}"? This action cannot be undone.`)) {
      return;
    }

    setOperationLoading(`delete-${studentId}`);
    try {
      const result = await TeacherStudentService.deleteStudent(studentId);
      if (result.success) {
        showMessage('success', 'Student deleted successfully');
        loadAllData();
      } else {
        showMessage('error', result.error || 'Failed to delete student');
      }
    } catch (error) {
      showMessage('error', 'An unexpected error occurred');
    } finally {
      setOperationLoading(null);
    }
  };

  const handleBlockStudent = async (studentId: string, isBlocked: boolean, studentName: string) => {
    const action = isBlocked ? 'block' : 'unblock';
    if (!confirm(`Are you sure you want to ${action} student "${studentName}"?`)) {
      return;
    }

    setOperationLoading(`block-${studentId}`);
    try {
      const result = await TeacherStudentService.blockStudent(studentId, isBlocked);
      if (result.success) {
        showMessage('success', `Student ${action}ed successfully`);
        loadAllData();
      } else {
        showMessage('error', result.error || `Failed to ${action} student`);
      }
    } catch (error) {
      showMessage('error', 'An unexpected error occurred');
    } finally {
      setOperationLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <Alert className={message.type === 'error' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'}>
          <AlertDescription className={message.type === 'error' ? 'text-red-700' : 'text-green-700'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Student Management</h1>
          <p className="text-muted-foreground">Create, edit, and manage student accounts</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Create Student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Student Account</DialogTitle>
              <DialogDescription>
                Create a complete student profile with login credentials
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={createForm.handleSubmit(handleCreateStudent)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    {...createForm.register('name', { required: 'Name is required' })}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="studentId">Student ID *</Label>
                  <Input
                    id="studentId"
                    {...createForm.register('studentId', { required: 'Student ID is required' })}
                    placeholder="STU-2024-001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...createForm.register('email', { required: 'Email is required' })}
                    placeholder="student@school.edu"
                  />
                </div>
                <div>
                  <Label htmlFor="gradeLevel">Grade Level *</Label>
                  <Select onValueChange={(value) => createForm.setValue('gradeLevel', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9th">9th Grade</SelectItem>
                      <SelectItem value="10th">10th Grade</SelectItem>
                      <SelectItem value="11th">11th Grade</SelectItem>
                      <SelectItem value="12th">12th Grade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...createForm.register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                    placeholder="Enter password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    {...createForm.register('phoneNumber')}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyContactName">Emergency Contact</Label>
                  <Input
                    id="emergencyContactName"
                    {...createForm.register('emergencyContactName')}
                    placeholder="Parent/Guardian name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  {...createForm.register('address')}
                  placeholder="Student's address"
                  rows={2}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={operationLoading === 'create'} className="flex-1">
                  {operationLoading === 'create' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Student'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4">
          {students.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground">No Students Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Create your first student account to get started</p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create First Student
                </Button>
              </CardContent>
            </Card>
          ) : (
            students.map((student) => (
              <Card key={student.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {student.name}
                        <Badge variant="outline">{student.grade}</Badge>
                      </CardTitle>
                      <CardDescription>
                        {student.student_id} • {student.email}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedStudent(student);
                          editForm.reset(student);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBlockStudent(student.id, true, student.name)}
                        disabled={operationLoading === `block-${student.id}`}
                      >
                        {operationLoading === `block-${student.id}` ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ShieldOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteStudent(student.id, student.name)}
                        disabled={operationLoading === `delete-${student.id}`}
                      >
                        {operationLoading === `delete-${student.id}` ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {student.phone_number && (
                      <p className="text-sm">📞 {student.phone_number}</p>
                    )}
                    {student.emergency_contact_name && (
                      <p className="text-sm">🚨 Emergency: {student.emergency_contact_name}</p>
                    )}
                    {student.subject_students && student.subject_students.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className="text-sm text-muted-foreground">Subjects:</span>
                        {student.subject_students.map((enrollment) => (
                          <Badge key={enrollment.subject_id} variant="secondary">
                            {enrollment.subjects.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Edit Student Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Student: {selectedStudent?.name}</DialogTitle>
            <DialogDescription>
              Update student information and manage subject assignments
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
              <TabsTrigger value="rooms">Room Assignments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4">
              <form onSubmit={editForm.handleSubmit(handleUpdateStudent)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input
                      id="edit-name"
                      {...editForm.register('name')}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-student_id">Student ID</Label>
                    <Input
                      id="edit-student_id"
                      {...editForm.register('student_id')}
                      placeholder="STU-2024-001"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      {...editForm.register('email')}
                      placeholder="student@school.edu"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-grade">Grade Level</Label>
                    <Select 
                      value={editForm.watch('grade') || ''} 
                      onValueChange={(value) => editForm.setValue('grade', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9th">9th Grade</SelectItem>
                        <SelectItem value="10th">10th Grade</SelectItem>
                        <SelectItem value="11th">11th Grade</SelectItem>
                        <SelectItem value="12th">12th Grade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-phone_number">Phone Number</Label>
                    <Input
                      id="edit-phone_number"
                      {...editForm.register('phone_number')}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-emergency_contact_name">Emergency Contact</Label>
                    <Input
                      id="edit-emergency_contact_name"
                      {...editForm.register('emergency_contact_name')}
                      placeholder="Parent/Guardian name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-address">Address</Label>
                  <Textarea
                    id="edit-address"
                    {...editForm.register('address')}
                    placeholder="Student's address"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-medical_notes">Medical Notes</Label>
                  <Textarea
                    id="edit-medical_notes"
                    {...editForm.register('medical_notes')}
                    placeholder="Medical conditions, allergies, etc."
                    rows={2}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={operationLoading === 'update'} className="flex-1">
                    {operationLoading === 'update' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Student'
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="subjects" className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Assign to Subject</h4>
                <div className="grid gap-2">
                  {subjects.map((subject) => {
                    const isAssigned = selectedStudent?.subject_students?.some(
                      (enrollment) => enrollment.subject_id === subject.id
                    );
                    
                    return (
                      <div key={subject.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <h5 className="font-medium">{subject.name}</h5>
                          <p className="text-sm text-muted-foreground">{subject.code}</p>
                        </div>
                        <Button
                          variant={isAssigned ? "outline" : "default"}
                          size="sm"
                          onClick={() => {
                            if (!isAssigned && selectedStudent) {
                              TeacherStudentService.assignStudentToSubject(selectedStudent.id, subject.id)
                                .then((result) => {
                                  if (result.success) {
                                    showMessage('success', 'Student assigned to subject');
                                    loadAllData();
                                  } else {
                                    showMessage('error', result.error || 'Assignment failed');
                                  }
                                });
                            }
                          }}
                          disabled={isAssigned}
                        >
                          {isAssigned ? (
                            <>
                              <BookOpen className="mr-2 h-4 w-4" />
                              Assigned
                            </>
                          ) : (
                            'Assign'
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="rooms" className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Assign Room to Subject</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Select a subject and room to create room assignments
                </p>
                
                <div className="space-y-4">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="border rounded p-4">
                      <h5 className="font-medium mb-2">{subject.name}</h5>
                      <div className="grid gap-2">
                        {rooms.map((room) => (
                          <Button
                            key={room.id}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              TeacherStudentService.assignRoomToSubject(room.id, subject.id)
                                .then((result) => {
                                  if (result.success) {
                                    showMessage('success', 'Room assigned to subject');
                                    loadAllData();
                                  } else {
                                    showMessage('error', result.error || 'Assignment failed');
                                  }
                                });
                            }}
                            className="justify-start"
                          >
                            <MapPin className="mr-2 h-4 w-4" />
                            Room {room.room_number}
                            {room.building && ` (${room.building})`}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}