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
    <div className="min-h-screen text-gray-700" style={{
      background: 'linear-gradient(135deg, #e3e3e3 0%, #d6d6d6 100%)'
    }}>
      {/* Subtle floating elements with neumorphic style */}
      <div className="fixed top-20 left-10 w-16 h-16 rounded-full pointer-events-none z-0 animate-pulse"
        style={{
          background: 'linear-gradient(145deg, #f0f0f0, #d0d0d0)',
          boxShadow: '8px 8px 16px #bebebe, -8px -8px 16px #ffffff'
        }}
      />
      <div className="fixed top-60 right-16 w-12 h-12 rounded-full pointer-events-none z-0 animate-pulse"
        style={{
          background: 'linear-gradient(145deg, #ebebeb, #d5d5d5)',
          boxShadow: '6px 6px 12px #c4c4c4, -6px -6px 12px #ffffff'
        }}
      />
      <div className="fixed bottom-32 left-24 w-20 h-20 rounded-full pointer-events-none z-0 animate-pulse"
        style={{
          background: 'linear-gradient(145deg, #ededed, #d7d7d7)',
          boxShadow: '10px 10px 20px #c0c0c0, -10px -10px 20px #ffffff'
        }}
      />

      <div className="container-modern section-padding space-y-8">
        {/* Modern Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="neumorphic-card p-6 lg:p-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-responsive-xl font-bold font-headline tracking-tight text-gray-700">
                Teacher Dashboard
              </h1>
              <p className="text-gray-600 text-responsive-sm max-w-2xl text-balance">
                Manage your classes, students, and attendance records with our modern interface
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="neumorphic-sm px-4 py-2 rounded-xl text-sm font-medium text-gray-700">
                <Users className="w-4 h-4 mr-2 inline" />
                {totalStudents} Student{totalStudents !== 1 ? 's' : ''}
              </div>
              {recentlyAdded > 0 && (
                <div className="neumorphic-sm px-4 py-2 rounded-xl text-sm font-medium text-gray-700">
                  <UserPlus className="w-4 h-4 mr-2 inline" />
                  +{recentlyAdded} This Week
                </div>
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
          <div className="neumorphic-card p-6 group hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 neumorphic-sm-inset rounded-2xl text-gray-600 group-hover:neumorphic-sm transition-all duration-300">
                <Users className="h-6 w-6" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-700">{totalStudents}</div>
                <div className="text-xs text-gray-500 font-medium">Total Students</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Active in your classes
            </p>
          </div>
          
          <div className="neumorphic-card p-6 group hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 neumorphic-sm-inset rounded-2xl text-gray-600 group-hover:neumorphic-sm transition-all duration-300">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-700">{studentsWithEmail}</div>
                <div className="text-xs text-gray-500 font-medium">Complete Profiles</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              With email addresses
            </p>
          </div>
          
          <div className="neumorphic-card p-6 group hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 neumorphic-sm-inset rounded-2xl text-gray-600 group-hover:neumorphic-sm transition-all duration-300">
                <Settings className="h-6 w-6" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-700">{studentsWithEmergencyContact}</div>
                <div className="text-xs text-gray-500 font-medium">Emergency Contacts</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Safety information on file
            </p>
          </div>
          
          <div className="neumorphic-card p-6 group hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 neumorphic-sm-inset rounded-2xl text-gray-600 group-hover:neumorphic-sm transition-all duration-300">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-700">
                  {students.reduce((sum, s) => sum + s.attendance.length, 0)}
                </div>
                <div className="text-xs text-gray-500 font-medium">Attendance Records</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Total records tracked
            </p>
          </div>
        </motion.div>

        {/* Modern Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="neumorphic-card p-2"
        >
          <Tabs defaultValue="attendance" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-6 h-auto p-2 neumorphic-sm-inset rounded-2xl">
              <TabsTrigger
                value="attendance"
                className="neumorphic-tab rounded-xl px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium text-gray-600 data-[state=active]:active data-[state=active]:text-gray-700 transition-all duration-300"
              >
                <span className="hidden sm:inline">Attendance</span>
                <span className="sm:hidden">Att.</span>
              </TabsTrigger>
              <TabsTrigger
                value="subjects"
                className="neumorphic-tab rounded-xl px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium text-gray-600 data-[state=active]:active data-[state=active]:text-gray-700 transition-all duration-300"
              >
                <span className="hidden sm:inline">Subjects</span>
                <span className="sm:hidden">Sub.</span>
              </TabsTrigger>
              <TabsTrigger
                value="rooms"
                className="neumorphic-tab rounded-xl px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium text-gray-600 data-[state=active]:active data-[state=active]:text-gray-700 transition-all duration-300"
              >
                <span className="hidden sm:inline">Rooms</span>
                <span className="sm:hidden">Rooms</span>
              </TabsTrigger>
              <TabsTrigger
                value="students"
                className="neumorphic-tab rounded-xl px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium text-gray-600 data-[state=active]:active data-[state=active]:text-gray-700 transition-all duration-300"
              >
                <span className="hidden sm:inline">Students</span>
                <span className="sm:hidden">Stud.</span>
              </TabsTrigger>
              <TabsTrigger
                value="enrollments"
                className="neumorphic-tab rounded-xl px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium text-gray-600 data-[state=active]:active data-[state=active]:text-gray-700 transition-all duration-300"
              >
                <span className="hidden sm:inline">Enrollments</span>
                <span className="sm:hidden">Enroll.</span>
              </TabsTrigger>
              <TabsTrigger
                value="tools"
                className="neumorphic-tab rounded-xl px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium text-gray-600 data-[state=active]:active data-[state=active]:text-gray-700 transition-all duration-300"
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
                  <div className="p-2 neumorphic-sm-inset rounded-xl text-gray-600">
                    <Settings className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-700">PIN Attendance Sessions</h2>
                </div>
                <div className="neumorphic-card p-6">
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
                  <div className="p-2 neumorphic-sm-inset rounded-xl text-gray-600">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-700">Manual Attendance</h2>
                </div>
                <div className="neumorphic-card p-6">
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
                  <div className="p-2 neumorphic-sm-inset rounded-xl text-gray-600">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-700">Add New Students</h2>
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="neumorphic-card p-6 space-y-4 hover:scale-105 transition-transform duration-300">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-700">Quick Registration</h3>
                      <p className="text-sm text-gray-600">
                        Fast student account creation with basic information
                      </p>
                    </div>
                    <div className="pt-4 border-t border-gray-300/50">
                      <RealUserManagement userRole="teacher" onSuccess={handleStudentCreated} />
                    </div>
                  </div>
                  
                  <div className="neumorphic-card p-6 space-y-4 hover:scale-105 transition-transform duration-300">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-700">Detailed Registration</h3>
                      <p className="text-sm text-gray-600">
                        Complete student profile with contact and medical information
                      </p>
                    </div>
                    <div className="pt-4 border-t border-gray-300/50">
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
                  <div className="p-2 neumorphic-sm-inset rounded-xl text-gray-600">
                    <Users className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-700">Current Students</h2>
                </div>
                <div className="neumorphic-card p-6">
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
                  <div className="p-2 neumorphic-sm-inset rounded-xl text-gray-600">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-700">ID Pass Generator</h2>
                </div>
                <div className="neumorphic-card p-6">
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
                  <div className="p-2 neumorphic-sm-inset rounded-xl text-gray-600">
                    <Settings className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-700">Additional Tools</h2>
                </div>
                <div className="neumorphic-card p-8 hover:scale-105 transition-transform duration-300">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto neumorphic-sm-inset rounded-2xl flex items-center justify-center">
                      <Settings className="h-8 w-8 text-gray-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-700">More Features Coming Soon</h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Bulk import, Export reports, Grade management, and more powerful tools will be available here
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 pt-4">
                      <span className="px-3 py-1 neumorphic-sm rounded-full text-gray-700 text-xs font-medium">Bulk Import</span>
                      <span className="px-3 py-1 neumorphic-sm rounded-full text-gray-700 text-xs font-medium">Export Reports</span>
                      <span className="px-3 py-1 neumorphic-sm rounded-full text-gray-700 text-xs font-medium">Grade Management</span>
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