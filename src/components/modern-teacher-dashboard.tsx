'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import type { Student } from '@/lib/types';
import DashboardClient from '@/components/dashboard-client';
import RealUserManagement from '@/components/real-user-management';
import StudentIdGenerator from '@/components/student-id-generator';
import EnhancedStudentForm from '@/components/enhanced-student-form';
import StudentListManager from '@/components/student-list-manager';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, CreditCard, GraduationCap, BarChart3, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import RealPinSessionManager from '@/components/real-pin-session-manager';
import SubjectManagement from '@/components/subject-management';
import RoomManagement from '@/components/room-management';
import EnrollmentManagement from '@/components/enrollment-management';

interface ModernTeacherDashboardProps {
  initialStudents: Student[];
}

export default function ModernTeacherDashboard({
  initialStudents
}: ModernTeacherDashboardProps) {
  const { user } = useAuth();
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50/50 via-white to-purple-50/30 dark:from-slate-950/50 dark:via-background dark:to-purple-950/30">
      <div className="container-modern section-padding space-y-8">
        {/* Modern Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card p-6 lg:p-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-responsive-xl font-bold font-headline tracking-tight gradient-text">
                Teacher Dashboard
              </h1>
              <p className="text-muted-foreground text-responsive-sm max-w-2xl text-balance">
                Manage your classes, students, and attendance records with our modern interface
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="px-4 py-2 rounded-xl text-sm font-medium">
                <Users className="w-4 h-4 mr-2" />
                {totalStudents} Student{totalStudents !== 1 ? 's' : ''}
              </Badge>
              {recentlyAdded > 0 && (
                <Badge variant="secondary" className="px-4 py-2 rounded-xl text-sm font-medium bg-primary/10 text-primary border-primary/20">
                  <UserPlus className="w-4 h-4 mr-2" />
                  +{recentlyAdded} This Week
                </Badge>
              )}
            </div>
          </div>
        </motion.div>

        {/* Modern Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="card-floating p-6 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300">
                <Users className="h-6 w-6" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-foreground">{totalStudents}</div>
                <div className="text-xs text-muted-foreground font-medium">Total Students</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Active in your classes
            </p>
          </div>
          
          <div className="card-floating p-6 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500/20 transition-colors duration-300">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-foreground">{studentsWithEmail}</div>
                <div className="text-xs text-muted-foreground font-medium">Complete Profiles</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              With email addresses
            </p>
          </div>
          
          <div className="card-floating p-6 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 group-hover:bg-orange-500/20 transition-colors duration-300">
                <Settings className="h-6 w-6" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-foreground">{studentsWithEmergencyContact}</div>
                <div className="text-xs text-muted-foreground font-medium">Emergency Contacts</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Safety information on file
            </p>
          </div>
          
          <div className="card-floating p-6 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500/20 transition-colors duration-300">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-foreground">
                  {students.reduce((sum, s) => sum + s.attendance.length, 0)}
                </div>
                <div className="text-xs text-muted-foreground font-medium">Attendance Records</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Total records tracked
            </p>
          </div>
        </motion.div>

        {/* Modern Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-card p-2"
        >
          <Tabs defaultValue="attendance" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-6 h-auto p-2 bg-muted/30 rounded-2xl">
              <TabsTrigger
                value="attendance"
                className="rounded-xl px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
              >
                <span className="hidden sm:inline">Attendance</span>
                <span className="sm:hidden">Att.</span>
              </TabsTrigger>
              <TabsTrigger
                value="subjects"
                className="rounded-xl px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
              >
                <span className="hidden sm:inline">Subjects</span>
                <span className="sm:hidden">Sub.</span>
              </TabsTrigger>
              <TabsTrigger
                value="rooms"
                className="rounded-xl px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
              >
                <span className="hidden sm:inline">Rooms</span>
                <span className="sm:hidden">Rooms</span>
              </TabsTrigger>
              <TabsTrigger
                value="students"
                className="rounded-xl px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
              >
                <span className="hidden sm:inline">Students</span>
                <span className="sm:hidden">Stud.</span>
              </TabsTrigger>
              <TabsTrigger
                value="enrollments"
                className="rounded-xl px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
              >
                <span className="hidden sm:inline">Enrollments</span>
                <span className="sm:hidden">Enroll.</span>
              </TabsTrigger>
              <TabsTrigger
                value="tools"
                className="rounded-xl px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
              >
                <span className="hidden sm:inline">Tools</span>
                <span className="sm:hidden">Tools</span>
              </TabsTrigger>
            </TabsList>
        
            <TabsContent value="attendance" className="mt-8 p-6 space-y-8">
              {/* PIN Session Manager */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Settings className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">PIN Attendance Sessions</h2>
                </div>
                <div className="card-modern p-6">
                  <RealPinSessionManager />
                </div>
              </motion.div>
              
              {/* Traditional Attendance Management */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">Manual Attendance</h2>
                </div>
                <div className="card-modern p-6">
                  <DashboardClient initialStudents={students} />
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="subjects" className="mt-8 p-6 space-y-8">
              {/* Subject Management Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-6"
              >
                <SubjectManagement teacherId={user?.id || ''} />
              </motion.div>
            </TabsContent>

            <TabsContent value="rooms" className="mt-8 p-6 space-y-8">
              {/* Room Management Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-6"
              >
                <RoomManagement teacherId={user?.id || ''} />
              </motion.div>
            </TabsContent>

            <TabsContent value="enrollments" className="mt-8 p-6 space-y-8">
              {/* Enrollment Management Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-6"
              >
                <EnrollmentManagement teacherId={user?.id || ''} />
              </motion.div>
            </TabsContent>

            <TabsContent value="students" className="mt-8 p-6 space-y-8">
              {/* Student Creation Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">Add New Students</h2>
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="card-floating p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">Quick Registration</h3>
                      <p className="text-sm text-muted-foreground">
                        Fast student account creation with basic information
                      </p>
                    </div>
                    <div className="pt-4 border-t border-border/50">
                      <RealUserManagement userRole="teacher" onSuccess={handleStudentCreated} />
                    </div>
                  </div>
                  
                  <div className="card-floating p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">Detailed Registration</h3>
                      <p className="text-sm text-muted-foreground">
                        Complete student profile with contact and medical information
                      </p>
                    </div>
                    <div className="pt-4 border-t border-border/50">
                      <EnhancedStudentForm onSuccess={handleStudentCreated} />
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Student Management Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">Current Students</h2>
                </div>
                <div className="card-modern p-6">
                  <StudentListManager 
                    students={students} 
                    onStudentDeleted={handleStudentDeleted}
                    onStudentUpdated={handleStudentUpdated}
                  />
                </div>
              </motion.div>
            </TabsContent>
        
            <TabsContent value="tools" className="mt-8 p-6 space-y-8">
              {/* ID Generator Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">ID Pass Generator</h2>
                </div>
                <div className="card-modern p-6">
                  <StudentIdGenerator students={students} />
                </div>
              </motion.div>
              
              {/* Additional Tools Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <Settings className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">Additional Tools</h2>
                </div>
                <div className="card-floating p-8">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
                      <Settings className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">More Features Coming Soon</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Bulk import, Export reports, Grade management, and more powerful tools will be available here
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 pt-4">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">Bulk Import</span>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium">Export Reports</span>
                      <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium">Grade Management</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}