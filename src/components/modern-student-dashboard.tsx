'use client';

import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, BookOpen, TrendingUp, User, QrCode, Pin } from 'lucide-react';
import { AuthService } from '@/lib/auth';
// import { getStudents } from '@/lib/data';
import type { Student } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import RealPinAttendanceStudent from '@/components/real-pin-attendance-student';
import AILectureSummarizer from '@/components/ai-lecture-summarizer';
import AIResourceRecommender from '@/components/ai-resource-recommender';
import { Subject } from '@/lib/database.types';

export default function ModernStudentDashboard() {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [liveNote, setLiveNote] = useState<string>('');
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [lastMarked, setLastMarked] = useState<any | null>(null);
  const [liveActive, setLiveActive] = useState<any | null>(null);
  const [liveCountdown, setLiveCountdown] = useState<string>("");
  const [liveProgress, setLiveProgress] = useState<number>(0);
  const [attendanceStats, setAttendanceStats] = useState<any>(null);

  // Fetch last marked and active session chips
  const fetchAttendanceChips = async () => {
    try {
      const [lastRes, activeRes] = await Promise.all([
        fetch('/api/attendance/students/me/last'),
        fetch('/api/attendance/students/me/active')
      ]);
      if (lastRes.ok) {
        const last = await lastRes.json();
        setLastMarked(last || null);
      }
      if (activeRes.ok) {
        const act = await activeRes.json();
        setLiveActive(act || null);
      }
    } catch {}
  };

  // Fetch attendance stats for graphs
  const fetchAttendanceStats = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      if (!user) return;
      
      // First get the actual student record ID
      const supabase = getSupabase();
      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('auth_user_id', user.id)
        .maybeSingle();
      
      if (!student) return;
      
      const res = await fetch(`/api/attendance/students/${student.id}/stats`);
      if (res.ok) {
        const stats = await res.json();
        setAttendanceStats(stats);
      }
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
    }
  };

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        setCurrentUser(user);

        if (user) {
          // Fetch student's own profile directly (avoid broad table reads under RLS)
          const supabase = getSupabase();
          const { data, error } = await (supabase as any)
            .from('students')
            .select('*')
            .eq('auth_user_id', user.id)
            .single();
          if (!error && data) {
            setStudentData(data as any);
          } else {
            console.warn('Student profile not found for auth user:', user.id, error?.message);
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
    // Initial fetch for subjects/assignments
    fetchSubjects();
    fetchAssignments();
    fetchAttendanceChips();
    fetchAttendanceStats();
  }, []);

  // Countdown for active session end
  useEffect(() => {
    if (!liveActive?.end_time) { setLiveCountdown(""); return; }
    const update = () => {
      const end = new Date(liveActive.end_time).getTime();
      const start = new Date(liveActive.start_time).getTime();
      const now = Date.now();
      const diff = Math.max(0, end - now);
      const total = end - start;
      const elapsed = now - start;
      const progress = Math.min(100, Math.max(0, (elapsed / total) * 100));
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setLiveCountdown(`Ends in ${m}m ${s}s`);
      setLiveProgress(progress);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [liveActive?.end_time, liveActive?.start_time]);

  const fetchSubjects = async () => {
    try {
      const supabase = getSupabase();
      // Get enrollments for this student
      const user = await AuthService.getCurrentUser();
      if (!user) return;

      // Map auth user to student record ID first
      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('auth_user_id', user.id)
        .maybeSingle();
      if (!student) {
        setSubjects([]);
        return;
      }

      const { data: enrollments, error: enrErr } = await supabase
        .from('subject_students')
        .select('subject_id')
        .eq('student_id', student.id);
      if (enrErr) return;
      const subjectIds = (enrollments || []).map((e: any) => e.subject_id);
      if (subjectIds.length === 0) {
        setSubjects([]);
        return;
      }
      const { data: subs, error: subErr } = await supabase
        .from('subjects')
        .select('*')
        .in('id', subjectIds)
        .order('name');
      if (!subErr) setSubjects((subs || []) as Subject[]);
    } catch {}
  };

  const fetchAssignments = async () => {
    try {
      const res = await fetch('/api/assignments');
      if (res.ok) {
        const data = await res.json();
        setAssignments(Array.isArray(data) ? data : []);
      }
    } catch {
      // Keep fallback mock below if API not available
      if (assignments.length === 0) {
        setAssignments([
          { subject: 'Mathematics', title: 'Algebra Problem Set', dueDate: '2025-01-25', status: 'pending' },
          { subject: 'English', title: 'Essay on Shakespeare', dueDate: '2025-01-27', status: 'submitted' },
          { subject: 'Science', title: 'Lab Report', dueDate: '2025-01-30', status: 'pending' },
        ]);
      }
    }
  };

  // Realtime classroom and attendance notifications
  useEffect(() => {
    if (!currentUser?.id) return;
    const supabase = getSupabase();

    const subjectsChannel = supabase
      .channel('rt-subjects')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'subjects' }, (payload) => {
        const name = (payload.new as any)?.name || 'New subject';
        toast({ title: 'New Class Added', description: `${name} is now available.`, duration: 4000 });
        setLiveNote(`New class: ${name}`);
        fetchSubjects();
        // Notify header bell
        window.dispatchEvent(new CustomEvent('notify', { detail: { title: 'New Class', message: `${name} added`, ts: Date.now() } }));
      })
      .subscribe();

    const sessionsChannel = supabase
      .channel('rt-attendance-sessions')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'attendance_sessions' }, (payload) => {
        const course = (payload.new as any)?.course_id || 'Class';
        toast({ title: 'Attendance Open', description: `PIN active for ${course}.`, duration: 4000 });
        setLiveNote(`Attendance PIN active for ${course}`);
        window.dispatchEvent(new CustomEvent('notify', { detail: { title: 'Attendance Open', message: `${course} PIN active`, ts: Date.now() } }));
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'attendance_sessions' }, (payload) => {
        if ((payload.new as any)?.end_time) {
          const course = (payload.new as any)?.course_id || 'Class';
          toast({ title: 'Attendance Closed', description: `${course} session ended.`, duration: 4000 });
          window.dispatchEvent(new CustomEvent('notify', { detail: { title: 'Attendance Closed', message: `${course} session ended`, ts: Date.now() } }));
        }
      })
      .subscribe();

    const myAttendanceChannel = supabase
      .channel(`rt-my-attendance-${currentUser.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'session_attendance_records', filter: `student_id=eq.${currentUser.id}` }, () => {
        toast({ title: 'Attendance Marked', description: 'Your attendance has been recorded.', duration: 3000 });
        window.dispatchEvent(new CustomEvent('notify', { detail: { title: 'Attendance Marked', message: 'You were marked present', ts: Date.now() } }));
        fetchAttendanceChips();
      })
      .subscribe();

    // Optional: assignments realtime if table exists
    const assignmentsChannel = supabase
      .channel('rt-assignments')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'assignments' }, (payload) => {
        const newAssignment = payload.new as any;
        fetchAssignments();
        toast({ 
          title: 'New Assignment!', 
          description: `${newAssignment.title} has been published`, 
          duration: 5000 
        });
        window.dispatchEvent(new CustomEvent('notify', { 
          detail: { 
            title: 'New Assignment', 
            message: newAssignment.title, 
            ts: Date.now() 
          } 
        }));
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'assignments' }, () => {
        fetchAssignments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subjectsChannel);
      supabase.removeChannel(sessionsChannel);
      supabase.removeChannel(myAttendanceChannel);
      supabase.removeChannel(assignmentsChannel);
    };
  }, [currentUser?.id, toast]);

  // Real attendance data from API
  const attendanceData = attendanceStats?.recentSessions || [];
  
  const attendanceStatsCalculated = {
    present: attendanceStats?.totalSessions || 0,
    late: 0, // We don't track late status yet
    absent: 0, // We don't track absent status yet
    total: attendanceStats?.totalSessions || 0,
  };

  const attendancePercentage = attendanceStatsCalculated.total > 0 ? 100 : 0; // 100% since we only track present

  // Upcoming classes derived from subjects (fallback to sample if API empty)
  const upcomingClasses = (subjects && subjects.length > 0)
    ? subjects.slice(0, 4).map((s: any) => ({
        subject: s.name || 'Class',
        time: s.time || '09:00 AM',
        room: s.room || 'Room 101',
        teacher: s.teacher || 'Teacher'
      }))
    : [
        { subject: 'Mathematics', time: '09:00 AM', room: 'Room 101', teacher: 'Ms. Johnson' },
        { subject: 'English Literature', time: '10:30 AM', room: 'Room 205', teacher: 'Mr. Smith' },
        { subject: 'Physics', time: '01:00 PM', room: 'Lab 301', teacher: 'Dr. Brown' },
        { subject: 'History', time: '02:30 PM', room: 'Room 150', teacher: 'Mrs. Davis' },
      ];

  // Assignments now from state (fallback populated in fetchAssignments if API missing)

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
          <div className="mt-3 flex flex-wrap gap-2">
            {lastMarked && (
              <span className="neumorphic-sm px-3 py-1 rounded-full text-xs text-green-700">
                Attendance recorded for {lastMarked.course_name} at {new Date(lastMarked.marked_at).toLocaleTimeString()}
              </span>
            )}
            {liveActive && (
              <div className="neumorphic-sm px-3 py-1 rounded-full text-xs text-blue-700 relative overflow-hidden">
                <div 
                  className="absolute inset-0 bg-blue-200/30 transition-all duration-1000 ease-linear" 
                  style={{ width: `${liveProgress}%` }}
                />
                <span className="relative z-10">
                  Live present count: {liveActive.attendee_count}{liveCountdown ? ` • ${liveCountdown}` : ''}
                </span>
              </div>
            )}
          </div>
          {liveNote && (
            <div className="mt-3 text-xs text-gray-600">
              Live: {liveNote}
            </div>
          )}
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
                value="ai-tools" 
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:neumorphic-sm data-[state=active]:text-gray-700 transition-all duration-300"
              >
                AI Tools
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
                  {attendanceData.slice(0, 5).map((record: any, index: number) => (
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
                <button
                  className="neumorphic-button h-20 flex-col rounded-xl hover:scale-105 transition-transform duration-300"
                  onClick={() => setIsPinModalOpen(true)}
                >
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
            {/* Attendance Graph */}
            <div className="neumorphic-card p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Attendance Trend (Last 30 Days)</h3>
                <p className="text-sm text-gray-600">Your daily attendance pattern</p>
              </div>
              <div className="h-48 flex items-end justify-between gap-1 px-2">
                {(attendanceStats?.last30Days || []).map((day: any, index: number) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className={`w-full rounded-t transition-all duration-300 ${
                        day.count > 0 ? 'bg-green-400' : 'bg-gray-200'
                      }`}
                      style={{ 
                        height: `${Math.max(8, (day.count / Math.max(1, Math.max(...(attendanceStats?.last30Days || []).map((d: any) => d.count)))) * 120)}px` 
                      }}
                      title={`${day.label}: ${day.count} session${day.count !== 1 ? 's' : ''}`}
                    />
                    <span className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-left">
                      {day.label.split(' ')[1]}
                    </span>
                  </div>
                ))}
              </div>
              {attendanceStats?.totalSessions === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No attendance data yet. Mark your first attendance to see the graph!</p>
                </div>
              )}
            </div>

            <div className="neumorphic-card p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Attendance History</h3>
                <p className="text-sm text-gray-600">Complete record of your attendance</p>
              </div>
              <div className="space-y-3">
                {attendanceData.map((record: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 neumorphic-sm-inset rounded-lg">
                    <div>
                      <p className="font-medium text-gray-700">{record.course || 'Class'}</p>
                      <p className="text-sm text-gray-600">{record.date} • {record.time}</p>
                    </div>
                    <div className="neumorphic-sm px-3 py-1 rounded-full text-xs font-medium text-green-700">
                      Present
                    </div>
                  </div>
                ))}
                {attendanceData.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No attendance records yet. Mark your first attendance!</p>
                  </div>
                )}
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
                {assignments.map((assignment: any, index: number) => (
                  <div key={assignment.id || index} className="flex items-center justify-between p-3 neumorphic-sm-inset rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-700">{assignment.title}</p>
                      <p className="text-sm text-gray-600">{assignment.subject_name || assignment.subject || 'General'}</p>
                      {assignment.description && (
                        <p className="text-xs text-gray-500 mt-1">{assignment.description}</p>
                      )}
                      {assignment.file_url && (
                        <a href={assignment.file_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline mt-1 inline-block">
                          📎 View attachment
                        </a>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">
                        Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : assignment.dueDate || 'No due date'}
                      </p>
                      <div className={`neumorphic-sm px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                        assignment.status === 'submitted' ? 'text-green-700' : 'text-orange-700'
                      }`}>
                        {assignment.status || 'Assigned'}
                      </div>
                    </div>
                  </div>
                ))}
                {assignments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No assignments yet</p>
                    <p className="text-xs">New assignments will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai-tools" className="space-y-4">
            <div className="grid gap-6">
              <AILectureSummarizer />
              <AIResourceRecommender />
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
        {/* Enter PIN Modal */}
        <Dialog open={isPinModalOpen} onOpenChange={setIsPinModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Enter Attendance PIN</DialogTitle>
            </DialogHeader>
            <RealPinAttendanceStudent />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}