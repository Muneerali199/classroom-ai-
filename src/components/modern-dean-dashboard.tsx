'use client';

import { useState } from 'react';
import type { Teacher } from '@/lib/types';
import UserManagement from '@/components/user-management';
import TeacherIdGenerator from '@/components/teacher-id-generator';
import EnhancedTeacherForm from '@/components/enhanced-teacher-form';
import TeacherListManager from '@/components/teacher-list-manager';
import TeacherAttendanceManager from '@/components/teacher-attendance-manager';
import DeanDashboard from '@/components/dean-dashboard';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, CreditCard, GraduationCap, BarChart3, Settings, Calendar, Shield, Brain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ModernDeanDashboardProps {
  initialTeachers: Teacher[];
}

export default function ModernDeanDashboard({ 
  initialTeachers 
}: ModernDeanDashboardProps) {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);

  const handleTeacherDeleted = (deletedTeacherId: string) => {
    setTeachers(prevTeachers => 
      prevTeachers.filter(teacher => teacher.id !== deletedTeacherId)
    );
  };

  const handleTeacherUpdated = (updatedTeacher: Teacher) => {
    setTeachers(prevTeachers => 
      prevTeachers.map(teacher => 
        teacher.id === updatedTeacher.id ? updatedTeacher : teacher
      )
    );
  };

  const handleTeacherCreated = () => {
    // Refresh the page or fetch updated teacher list
    window.location.reload();
  };

  const handleAttendanceMarked = () => {
    // Refresh teacher data to show updated attendance
    window.location.reload();
  };

  // Calculate statistics
  const totalTeachers = teachers.length;
  const fullTimeTeachers = teachers.filter(t => t.employment_status === 'Full-time').length;
  const teachersWithEmail = teachers.filter(t => t.email).length;
  const teachersWithEmergencyContact = teachers.filter(t => t.emergency_contact_name).length;
  const recentlyAdded = teachers.filter(t => {
    if (!t.created_at) return false;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(t.created_at) > weekAgo;
  }).length;

  // Department statistics
  const departments = teachers.reduce((acc, teacher) => {
    if (teacher.department) {
      acc[teacher.department] = (acc[teacher.department] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            Dean Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your institution, faculty, and staff members
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            <Shield className="h-3 w-3 mr-1" />
            Administrator
          </Badge>
          <Badge variant="outline" className="text-sm">
            {totalTeachers} Teacher{totalTeachers !== 1 ? 's' : ''}
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
            <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeachers}</div>
            <p className="text-xs text-muted-foreground">
              {fullTimeTeachers} full-time
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complete Profiles</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachersWithEmail}</div>
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
            <div className="text-2xl font-bold">{teachersWithEmergencyContact}</div>
            <p className="text-xs text-muted-foreground">
              Safety information on file
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(departments).length}</div>
            <p className="text-xs text-muted-foreground">
              Active departments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Department Overview */}
      {Object.keys(departments).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Department Overview</CardTitle>
            <CardDescription>Faculty distribution across departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(departments).map(([dept, count]) => (
                <Badge key={dept} variant="secondary">
                  {dept}: {count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Main Content Tabs */}
      <Tabs defaultValue="teachers" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="analytics">AI Analytics</TabsTrigger>
          <TabsTrigger value="teachers">Teacher Management</TabsTrigger>
          <TabsTrigger value="attendance">Attendance Tracking</TabsTrigger>
          <TabsTrigger value="tools">Tools & Reports</TabsTrigger>
          <TabsTrigger value="system">System Overview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics" className="mt-6">
          <DeanDashboard />
        </TabsContent>
        
        <TabsContent value="teachers" className="mt-6">
          <div className="space-y-6">
            {/* Teacher Creation Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Add New Faculty
              </h2>
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Registration</CardTitle>
                    <CardDescription>
                      Fast faculty account creation with basic information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserManagement userRole="dean" onSuccess={handleTeacherCreated} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Detailed Registration</CardTitle>
                    <CardDescription>
                      Complete faculty profile with employment and contact information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EnhancedTeacherForm onSuccess={handleTeacherCreated} />
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Teacher Management Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Current Faculty
              </h2>
              <TeacherListManager 
                teachers={teachers} 
                onTeacherDeleted={handleTeacherDeleted}
                onTeacherUpdated={handleTeacherUpdated}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="attendance" className="mt-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Faculty Attendance Management
              </h2>
              <TeacherAttendanceManager 
                teachers={teachers} 
                onAttendanceMarked={handleAttendanceMarked}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="tools" className="mt-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Faculty ID Pass Generator
              </h2>
              <TeacherIdGenerator teachers={teachers} />
            </div>
            
            {/* Additional tools placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Administrative Tools</CardTitle>
                <CardDescription>
                  More features coming soon: Faculty reports, Performance analytics, System settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Additional administrative tools and features will be available here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="mt-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                System Overview
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Institution Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Faculty:</span>
                      <span className="font-medium">{totalTeachers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Full-time Staff:</span>
                      <span className="font-medium">{fullTimeTeachers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Departments:</span>
                      <span className="font-medium">{Object.keys(departments).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Complete Profiles:</span>
                      <span className="font-medium">{teachersWithEmail}/{totalTeachers}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">{recentlyAdded}</span> new faculty added this week
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{teachersWithEmergencyContact}</span> faculty with emergency contacts
                      </div>
                      <div className="text-sm text-muted-foreground">
                        System running smoothly
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}