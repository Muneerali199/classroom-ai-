'use client';

import { useState } from 'react';
import type { Student } from '@/lib/types';
import DashboardClient from '@/components/dashboard-client';
import UserManagement from '@/components/user-management';
import StudentIdGenerator from '@/components/student-id-generator';
import EnhancedStudentForm from '@/components/enhanced-student-form';
import StudentListManager from '@/components/student-list-manager';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, CreditCard, GraduationCap, BarChart3, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ModernTeacherDashboardProps {
  initialStudents: Student[];
}

export default function ModernTeacherDashboard({ 
  initialStudents 
}: ModernTeacherDashboardProps) {
  const [students, setStudents] = useState<Student[]>(initialStudents);

  const handleStudentDeleted = (deletedStudentId: string) => {
    setStudents(prevStudents => 
      prevStudents.filter(student => student.id !== deletedStudentId)
    );
  };

  const handleStudentUpdated = (updatedStudent: Student) => {
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
  };

  const handleStudentCreated = () => {
    // Refresh the page or fetch updated student list
    window.location.reload();
  };

  // Calculate statistics
  const totalStudents = students.length;
  const studentsWithEmail = students.filter(s => s.email).length;
  const studentsWithEmergencyContact = students.filter(s => s.emergency_contact_name).length;
  const recentlyAdded = students.filter(s => {
    if (!s.created_at) return false;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(s.created_at) > weekAgo;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            Teacher Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your classes, students, and attendance records
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {totalStudents} Student{totalStudents !== 1 ? 's' : ''}
          </Badge>
          {recentlyAdded > 0 && (
            <Badge variant="secondary" className="text-sm">
              +{recentlyAdded} This Week
            </Badge>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Active in your classes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complete Profiles</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentsWithEmail}</div>
            <p className="text-xs text-muted-foreground">
              With email addresses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency Contacts</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentsWithEmergencyContact}</div>
            <p className="text-xs text-muted-foreground">
              Safety information on file
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Records</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.reduce((sum, s) => sum + s.attendance.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total records tracked
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Main Content Tabs */}
      <Tabs defaultValue="attendance" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="attendance">Attendance Management</TabsTrigger>
          <TabsTrigger value="students">Student Management</TabsTrigger>
          <TabsTrigger value="tools">Tools & Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="attendance" className="mt-6">
          <DashboardClient initialStudents={students} />
        </TabsContent>
        
        <TabsContent value="students" className="mt-6">
          <div className="space-y-6">
            {/* Student Creation Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Add New Students
              </h2>
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Registration</CardTitle>
                    <CardDescription>
                      Fast student account creation with basic information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserManagement userRole="teacher" onSuccess={handleStudentCreated} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Detailed Registration</CardTitle>
                    <CardDescription>
                      Complete student profile with contact and medical information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EnhancedStudentForm onSuccess={handleStudentCreated} />
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Student Management Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Current Students
              </h2>
              <StudentListManager 
                students={students} 
                onStudentDeleted={handleStudentDeleted}
                onStudentUpdated={handleStudentUpdated}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="tools" className="mt-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                ID Pass Generator
              </h2>
              <StudentIdGenerator students={students} />
            </div>
            
            {/* Additional tools can be added here */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Tools</CardTitle>
                <CardDescription>
                  More features coming soon: Bulk import, Export reports, Grade management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Additional tools and features will be available here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}