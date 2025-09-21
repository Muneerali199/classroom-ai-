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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {studentData?.name || 'Student'}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your studies today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendancePercentage.toFixed(1)}%</div>
            <Progress value={attendancePercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingClasses.length}</div>
            <p className="text-xs text-muted-foreground">
              Next: {upcomingClasses[0]?.time}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assignments.filter(a => a.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Due this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Student ID</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{studentData?.student_id || 'STU-2025-0001'}</div>
            <p className="text-xs text-muted-foreground">
              {studentData?.grade || '10th Grade'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Today&apos;s Classes</CardTitle>
                <CardDescription>Your schedule for today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingClasses.map((cls, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{cls.subject}</p>
                      <p className="text-sm text-muted-foreground">{cls.teacher} • {cls.room}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{cls.time}</p>
                      <Badge variant="outline">
                        <Clock className="w-3 h-3 mr-1" />
                        Upcoming
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Attendance */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Attendance</CardTitle>
                <CardDescription>Your attendance for the past week</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {attendanceData.slice(0, 5).map((record, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{record.subject}</p>
                      <p className="text-sm text-muted-foreground">{record.date}</p>
                    </div>
                    <Badge 
                      variant={
                        record.status === 'Present' ? 'default' :
                        record.status === 'Late' ? 'secondary' : 'destructive'
                      }
                    >
                      {record.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                <Button variant="outline" className="h-20 flex-col">
                  <QrCode className="h-6 w-6 mb-2" />
                  Scan QR Code
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Pin className="h-6 w-6 mb-2" />
                  Enter PIN
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <User className="h-6 w-6 mb-2" />
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
              <CardDescription>Complete record of your attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {attendanceData.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{record.subject}</p>
                      <p className="text-sm text-muted-foreground">{record.date}</p>
                    </div>
                    <Badge 
                      variant={
                        record.status === 'Present' ? 'default' :
                        record.status === 'Late' ? 'secondary' : 'destructive'
                      }
                    >
                      {record.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>Your complete class schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingClasses.map((cls, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{cls.subject}</h3>
                        <p className="text-sm text-muted-foreground">{cls.teacher}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{cls.time}</p>
                        <p className="text-sm text-muted-foreground">{cls.room}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assignments</CardTitle>
              <CardDescription>Track your homework and projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {assignments.map((assignment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{assignment.title}</p>
                      <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Due: {assignment.dueDate}</p>
                      <Badge 
                        variant={assignment.status === 'submitted' ? 'default' : 'secondary'}
                      >
                        {assignment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Profile</CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <p className="text-sm text-muted-foreground">{studentData?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Student ID</label>
                  <p className="text-sm text-muted-foreground">{studentData?.student_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-muted-foreground">{studentData?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Grade Level</label>
                  <p className="text-sm text-muted-foreground">{studentData?.grade}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Enrollment Date</label>
                  <p className="text-sm text-muted-foreground">{studentData?.created_at ? new Date(studentData.created_at).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}