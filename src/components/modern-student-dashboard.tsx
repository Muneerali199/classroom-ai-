'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, BookOpen, TrendingUp, User, QrCode, Pin } from 'lucide-react';
import { AuthService } from '@/lib/auth';
import { getStudents } from '@/lib/data';
import type { Student } from '@/lib/types';

export default function ModernStudentDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        setCurrentUser(user);

        if (user) {
          // Try to find student data by email or ID
          const students = await getStudents();
          const student = students.find(s => 
            s.email === user.email || 
            s.id === user.id ||
            s.auth_user_id === user.id
          );
          
          if (student) {
            setStudentData(student);
          } else {
            // Student not found - this should not happen in a properly managed system
            console.warn('Student data not found for authenticated user:', user.id);
            setStudentData(null);
          }
        }
      } catch (error) {
        console.error('Error loading student data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, []);

  // Mock attendance data
  const attendanceData = [
    { date: '2025-01-20', status: 'Present', subject: 'Mathematics' },
    { date: '2025-01-19', status: 'Present', subject: 'English' },
    { date: '2025-01-18', status: 'Late', subject: 'Science' },
    { date: '2025-01-17', status: 'Present', subject: 'History' },
    { date: '2025-01-16', status: 'Present', subject: 'Mathematics' },
  ];

  const attendanceStats = {
    present: attendanceData.filter(a => a.status === 'Present').length,
    late: attendanceData.filter(a => a.status === 'Late').length,
    absent: attendanceData.filter(a => a.status === 'Absent').length,
    total: attendanceData.length,
  };

  const attendancePercentage = ((attendanceStats.present + attendanceStats.late) / attendanceStats.total) * 100;

  // Mock upcoming classes
  const upcomingClasses = [
    { subject: 'Mathematics', time: '09:00 AM', room: 'Room 101', teacher: 'Ms. Johnson' },
    { subject: 'English Literature', time: '10:30 AM', room: 'Room 205', teacher: 'Mr. Smith' },
    { subject: 'Physics', time: '01:00 PM', room: 'Lab 301', teacher: 'Dr. Brown' },
    { subject: 'History', time: '02:30 PM', room: 'Room 150', teacher: 'Mrs. Davis' },
  ];

  // Mock assignments
  const assignments = [
    { subject: 'Mathematics', title: 'Algebra Problem Set', dueDate: '2025-01-25', status: 'pending' },
    { subject: 'English', title: 'Essay on Shakespeare', dueDate: '2025-01-27', status: 'submitted' },
    { subject: 'Science', title: 'Lab Report', dueDate: '2025-01-30', status: 'pending' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700" style={{
        background: 'linear-gradient(135deg, #e3e3e3 0%, #d6d6d6 100%)'
      }}>
        <div className="neumorphic-card p-8 rounded-3xl">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-600 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

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

      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="neumorphic-card p-6 rounded-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-700">
            Welcome back, {studentData?.name || 'Student'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here&apos;s what&apos;s happening with your studies today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="neumorphic-card p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-gray-700">Attendance Rate</h3>
              <TrendingUp className="h-4 w-4 text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-700">{attendancePercentage.toFixed(1)}%</div>
            <div className="mt-2 neumorphic-sm-inset rounded-full h-2">
              <div 
                className="neumorphic-sm rounded-full h-2 transition-all duration-500" 
                style={{ width: `${attendancePercentage}%` }}
              />
            </div>
          </div>

          <div className="neumorphic-card p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-gray-700">Classes Today</h3>
              <Calendar className="h-4 w-4 text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-700">{upcomingClasses.length}</div>
            <p className="text-xs text-gray-600">
              Next: {upcomingClasses[0]?.time}
            </p>
          </div>

          <div className="neumorphic-card p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-gray-700">Pending Assignments</h3>
              <BookOpen className="h-4 w-4 text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-700">
              {assignments.filter(a => a.status === 'pending').length}
            </div>
            <p className="text-xs text-gray-600">
              Due this week
            </p>
          </div>

          <div className="neumorphic-card p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-gray-700">Student ID</h3>
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div className="text-lg font-bold text-gray-700">{studentData?.student_id || 'STU-2025-0001'}</div>
            <p className="text-xs text-gray-600">
              {studentData?.grade || '10th Grade'}
            </p>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-4">
          <div className="neumorphic-card p-2 rounded-2xl">
            <TabsList className="neumorphic-sm-inset rounded-xl">
              <TabsTrigger 
                value="dashboard" 
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:neumorphic-sm data-[state=active]:text-gray-700 transition-all duration-300"
              >
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="attendance" 
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:neumorphic-sm data-[state=active]:text-gray-700 transition-all duration-300"
              >
                Attendance
              </TabsTrigger>
              <TabsTrigger 
                value="schedule" 
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:neumorphic-sm data-[state=active]:text-gray-700 transition-all duration-300"
              >
                Schedule
              </TabsTrigger>
              <TabsTrigger 
                value="assignments" 
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:neumorphic-sm data-[state=active]:text-gray-700 transition-all duration-300"
              >
                Assignments
              </TabsTrigger>
              <TabsTrigger 
                value="profile" 
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:neumorphic-sm data-[state=active]:text-gray-700 transition-all duration-300"
              >
                Profile
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Today's Schedule */}
              <div className="neumorphic-card p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Today&apos;s Classes</h3>
                  <p className="text-sm text-gray-600">Your schedule for today</p>
                </div>
                <div className="space-y-3">
                  {upcomingClasses.map((cls, index) => (
                    <div key={index} className="flex items-center justify-between p-3 neumorphic-sm-inset rounded-lg">
                      <div>
                        <p className="font-medium text-gray-700">{cls.subject}</p>
                        <p className="text-sm text-gray-600">{cls.teacher} • {cls.room}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">{cls.time}</p>
                        <div className="neumorphic-sm px-2 py-1 rounded-full text-xs text-gray-600 mt-1">
                          <Clock className="w-3 h-3 mr-1 inline" />
                          Upcoming
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Attendance */}
              <div className="neumorphic-card p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Recent Attendance</h3>
                  <p className="text-sm text-gray-600">Your attendance for the past week</p>
                </div>
                <div className="space-y-3">
                  {attendanceData.slice(0, 5).map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-3 neumorphic-sm-inset rounded-lg">
                      <div>
                        <p className="font-medium text-gray-700">{record.subject}</p>
                        <p className="text-sm text-gray-600">{record.date}</p>
                      </div>
                      <div className={`neumorphic-sm px-3 py-1 rounded-full text-xs font-medium ${
                        record.status === 'Present' ? 'text-green-700' :
                        record.status === 'Late' ? 'text-yellow-700' : 'text-red-700'
                      }`}>
                        {record.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="neumorphic-card p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Quick Actions</h3>
                <p className="text-sm text-gray-600">Common tasks and shortcuts</p>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <button className="neumorphic-button h-20 flex-col rounded-xl hover:scale-105 transition-transform duration-300">
                  <QrCode className="h-6 w-6 mb-2 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Scan QR Code</span>
                </button>
                <button className="neumorphic-button h-20 flex-col rounded-xl hover:scale-105 transition-transform duration-300">
                  <Pin className="h-6 w-6 mb-2 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Enter PIN</span>
                </button>
                <button className="neumorphic-button h-20 flex-col rounded-xl hover:scale-105 transition-transform duration-300">
                  <User className="h-6 w-6 mb-2 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">View Profile</span>
                </button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <div className="neumorphic-card p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Attendance History</h3>
                <p className="text-sm text-gray-600">Complete record of your attendance</p>
              </div>
              <div className="space-y-3">
                {attendanceData.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 neumorphic-sm-inset rounded-lg">
                    <div>
                      <p className="font-medium text-gray-700">{record.subject}</p>
                      <p className="text-sm text-gray-600">{record.date}</p>
                    </div>
                    <div className={`neumorphic-sm px-3 py-1 rounded-full text-xs font-medium ${
                      record.status === 'Present' ? 'text-green-700' :
                      record.status === 'Late' ? 'text-yellow-700' : 'text-red-700'
                    }`}>
                      {record.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="neumorphic-card p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Weekly Schedule</h3>
                <p className="text-sm text-gray-600">Your complete class schedule</p>
              </div>
              <div className="space-y-4">
                {upcomingClasses.map((cls, index) => (
                  <div key={index} className="p-4 neumorphic-sm-inset rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-700">{cls.subject}</h3>
                        <p className="text-sm text-gray-600">{cls.teacher}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-700">{cls.time}</p>
                        <p className="text-sm text-gray-600">{cls.room}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4">
            <div className="neumorphic-card p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Assignments</h3>
                <p className="text-sm text-gray-600">Track your homework and projects</p>
              </div>
              <div className="space-y-3">
                {assignments.map((assignment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 neumorphic-sm-inset rounded-lg">
                    <div>
                      <p className="font-medium text-gray-700">{assignment.title}</p>
                      <p className="text-sm text-gray-600">{assignment.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">Due: {assignment.dueDate}</p>
                      <div className={`neumorphic-sm px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                        assignment.status === 'submitted' ? 'text-green-700' : 'text-yellow-700'
                      }`}>
                        {assignment.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <div className="neumorphic-card p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Student Profile</h3>
                <p className="text-sm text-gray-600">Your personal information</p>
              </div>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="neumorphic-sm-inset p-4 rounded-lg">
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-600 mt-1">{studentData?.name}</p>
                  </div>
                  <div className="neumorphic-sm-inset p-4 rounded-lg">
                    <label className="text-sm font-medium text-gray-700">Student ID</label>
                    <p className="text-sm text-gray-600 mt-1">{studentData?.student_id}</p>
                  </div>
                  <div className="neumorphic-sm-inset p-4 rounded-lg">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-600 mt-1">{studentData?.email}</p>
                  </div>
                  <div className="neumorphic-sm-inset p-4 rounded-lg">
                    <label className="text-sm font-medium text-gray-700">Grade Level</label>
                    <p className="text-sm text-gray-600 mt-1">{studentData?.grade}</p>
                  </div>
                  <div className="neumorphic-sm-inset p-4 rounded-lg md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Enrollment Date</label>
                    <p className="text-sm text-gray-600 mt-1">{studentData?.created_at ? new Date(studentData.created_at).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}