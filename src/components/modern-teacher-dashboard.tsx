'use client';

import { useEffect, useState } from 'react';
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
import PerformanceCharts from '@/components/performance-charts';
import { getSupabase } from '@/lib/supabase';

interface ModernTeacherDashboardProps {
  initialStudents: Student[];
}

export default function ModernTeacherDashboard({
  initialStudents
}: ModernTeacherDashboardProps) {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [refreshKey, setRefreshKey] = useState(0);

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

  // Build performance analytics from real attendance data
  const buildWeeklyGradeTrend = () => {
    // Last 8 weeks (W1 oldest ... W8 latest)
    const now = new Date();
    const weeks: { weekStart: Date; label: string }[] = [];
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * 7);
      const label = `W${8 - i}`;
      weeks.push({ weekStart: d, label });
    }

    return weeks.map(({ weekStart, label }, idx) => {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      let total = 0;
      let present = 0;
      students.forEach((s) => {
        (s.attendance || []).forEach((a) => {
          const ad = new Date(a.date);
          if (ad >= weekStart && ad < weekEnd) {
            total += 1;
            if (a.status === 'Present') present += 1;
          }
        });
      });

      const rate = total > 0 ? Math.round((present / total) * 100) : (idx > 0 ? 0 : 0);
      return { week: label, grade: rate };
    });
  };

  const buildMonthlyAttendance = () => {
    // Last 6 calendar months including current
    const months: { key: string; label: string; start: Date; end: Date }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      const label = d.toLocaleString(undefined, { month: 'short' });
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      months.push({ key, label, start, end });
    }

    return months.map(({ label, start, end }) => {
      let present = 0;
      let total = 0;
      students.forEach((s) => {
        (s.attendance || []).forEach((a) => {
          const ad = new Date(a.date);
          if (ad >= start && ad < end) {
            total += 1;
            if (a.status === 'Present') present += 1;
          }
        });
      });
      return { month: label, present, total };
    });
  };

  const gradeTrend = buildWeeklyGradeTrend();
  const monthlyAttendance = buildMonthlyAttendance();

  // Realtime: subjects, assignments, timetables, meetings, attendance
  useEffect(() => {
    const supabase = getSupabase();
    const channels = [
      supabase.channel('rt-teacher-subjects').on('postgres_changes', { event: '*', schema: 'public', table: 'subjects' }, () => {
        window.dispatchEvent(new CustomEvent('notify', { detail: { title: 'Subjects Updated', message: 'A subject was added or updated', ts: Date.now() } }));
      }).subscribe(),
      supabase.channel('rt-teacher-assignments').on('postgres_changes', { event: '*', schema: 'public', table: 'assignments' }, () => {
        window.dispatchEvent(new CustomEvent('notify', { detail: { title: 'Assignments Updated', message: 'An assignment changed', ts: Date.now() } }));
      }).subscribe(),
      supabase.channel('rt-teacher-timetables').on('postgres_changes', { event: '*', schema: 'public', table: 'timetables' }, () => {
        window.dispatchEvent(new CustomEvent('notify', { detail: { title: 'Timetable Updated', message: 'A timetable was published', ts: Date.now() } }));
      }).subscribe(),
      supabase.channel('rt-teacher-meetings').on('postgres_changes', { event: '*', schema: 'public', table: 'meetings' }, () => {
        window.dispatchEvent(new CustomEvent('notify', { detail: { title: 'Meetings Updated', message: 'A meeting was created or changed', ts: Date.now() } }));
      }).subscribe(),
      supabase.channel('rt-teacher-attendance-sessions').on('postgres_changes', { event: '*', schema: 'public', table: 'attendance_sessions' }, () => {
        window.dispatchEvent(new CustomEvent('notify', { detail: { title: 'Attendance Sessions', message: 'Attendance session updated', ts: Date.now() } }));
        setRefreshKey((k) => k + 1);
      }).subscribe(),
      supabase.channel('rt-teacher-attendance-records').on('postgres_changes', { event: '*', schema: 'public', table: 'session_attendance_records' }, () => {
        window.dispatchEvent(new CustomEvent('notify', { detail: { title: 'Attendance Recorded', message: 'A student attendance record changed', ts: Date.now() } }));
        setRefreshKey((k) => k + 1);
      }).subscribe(),
    ];

    return () => { channels.forEach((c) => supabase.removeChannel(c)); };
  }, []);

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

        {/* Enhanced Quick Stats with Better Visual Hierarchy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="neumorphic-card p-8 group hover:scale-105 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
              <div className="w-full h-full neumorphic-sm-inset rounded-full"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 neumorphic-sm-inset rounded-2xl text-gray-600 group-hover:neumorphic-sm transition-all duration-300">
                  <Users className="h-7 w-7" />
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-gray-700 mb-1">{totalStudents}</div>
                  <div className="text-sm text-gray-500 font-medium">Total Students</div>
                </div>
              </div>
              <div className="neumorphic-sm-inset p-3 rounded-xl">
                <p className="text-sm text-gray-600 font-medium">
                  Active in your classes
                </p>
              </div>
            </div>
          </div>
          
          <div className="neumorphic-card p-8 group hover:scale-105 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
              <div className="w-full h-full neumorphic-sm-inset rounded-full"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 neumorphic-sm-inset rounded-2xl text-gray-600 group-hover:neumorphic-sm transition-all duration-300">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-gray-700 mb-1">{studentsWithEmail}</div>
                  <div className="text-sm text-gray-500 font-medium">Complete Profiles</div>
                </div>
              </div>
              <div className="neumorphic-sm-inset p-3 rounded-xl">
                <p className="text-sm text-gray-600 font-medium">
                  With email addresses
                </p>
              </div>
            </div>
          </div>
          
          <div className="neumorphic-card p-8 group hover:scale-105 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
              <div className="w-full h-full neumorphic-sm-inset rounded-full"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 neumorphic-sm-inset rounded-2xl text-gray-600 group-hover:neumorphic-sm transition-all duration-300">
                  <Settings className="h-7 w-7" />
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-gray-700 mb-1">{studentsWithEmergencyContact}</div>
                  <div className="text-sm text-gray-500 font-medium">Emergency Contacts</div>
                </div>
              </div>
              <div className="neumorphic-sm-inset p-3 rounded-xl">
                <p className="text-sm text-gray-600 font-medium">
                  Safety information on file
                </p>
              </div>
            </div>
          </div>
          
          <div className="neumorphic-card p-8 group hover:scale-105 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
              <div className="w-full h-full neumorphic-sm-inset rounded-full"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 neumorphic-sm-inset rounded-2xl text-gray-600 group-hover:neumorphic-sm transition-all duration-300">
                  <BarChart3 className="h-7 w-7" />
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-gray-700 mb-1">
                    {students.reduce((sum, s) => sum + s.attendance.length, 0)}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">Attendance Records</div>
                </div>
              </div>
              <div className="neumorphic-sm-inset p-3 rounded-xl">
                <p className="text-sm text-gray-600 font-medium">
                  Total records tracked
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Performance Analytics - Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="neumorphic-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Performance Analytics</h2>
            <span className="text-xs text-gray-500">Demo data</span>
          </div>
          <PerformanceCharts gradeData={gradeTrend} attendanceData={monthlyAttendance} />
        </motion.div>

        {/* Enhanced Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="neumorphic-card p-6"
        >
          <Tabs defaultValue="attendance" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-6 h-auto p-3 neumorphic-sm-inset rounded-2xl gap-2">
              <TabsTrigger
                value="attendance"
                className="rounded-xl px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-gray-600 data-[state=active]:neumorphic-sm data-[state=active]:text-gray-700 transition-all duration-300 flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Attendance</span>
                <span className="sm:hidden">Att.</span>
              </TabsTrigger>
              <TabsTrigger
                value="subjects"
                className="rounded-xl px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-gray-600 data-[state=active]:neumorphic-sm data-[state=active]:text-gray-700 transition-all duration-300 flex items-center gap-2"
              >
                <GraduationCap className="h-4 w-4" />
                <span className="hidden sm:inline">Subjects</span>
                <span className="sm:hidden">Sub.</span>
              </TabsTrigger>
              <TabsTrigger
                value="rooms"
                className="rounded-xl px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-gray-600 data-[state=active]:neumorphic-sm data-[state=active]:text-gray-700 transition-all duration-300 flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Rooms</span>
                <span className="sm:hidden">Rooms</span>
              </TabsTrigger>
              <TabsTrigger
                value="students"
                className="rounded-xl px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-gray-600 data-[state=active]:neumorphic-sm data-[state=active]:text-gray-700 transition-all duration-300 flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Students</span>
                <span className="sm:hidden">Stud.</span>
              </TabsTrigger>
              <TabsTrigger
                value="enrollments"
                className="rounded-xl px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-gray-600 data-[state=active]:neumorphic-sm data-[state=active]:text-gray-700 transition-all duration-300 flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Enrollments</span>
                <span className="sm:hidden">Enroll.</span>
              </TabsTrigger>
              <TabsTrigger
                value="tools"
                className="rounded-xl px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-gray-600 data-[state=active]:neumorphic-sm data-[state=active]:text-gray-700 transition-all duration-300 flex items-center gap-2"
              >
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Tools</span>
                <span className="sm:hidden">Tools</span>
              </TabsTrigger>
            </TabsList>
        
            <TabsContent value="attendance" className="mt-8 space-y-8">
              {/* PIN Session Manager */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-6"
              >
                <div className="neumorphic-sm-inset p-6 rounded-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 neumorphic-sm rounded-xl text-gray-600">
                      <Settings className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-700">PIN Attendance Sessions</h2>
                      <p className="text-sm text-gray-600">Create and manage attendance sessions with PIN codes</p>
                    </div>
                  </div>
                  <div className="neumorphic-card p-8">
                    <RealPinSessionManager />
                  </div>
                </div>
              </motion.div>
              
              {/* Traditional Attendance Management */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6"
              >
                <div className="neumorphic-sm-inset p-6 rounded-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 neumorphic-sm rounded-xl text-gray-600">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-700">Manual Attendance</h2>
                      <p className="text-sm text-gray-600">Track attendance manually and view detailed reports</p>
                    </div>
                  </div>
                  <div className="neumorphic-card p-8">
                    <DashboardClient initialStudents={students} />
                  </div>
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