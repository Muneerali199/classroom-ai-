import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getSupabase } from '@/lib/supabase';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: studentId } = await params;
    if (!studentId) return NextResponse.json({ error: 'Student ID required' }, { status: 400 });

    const supabase = supabaseAdmin || getSupabase();
    
    // Get student's attendance records with session details
    const { data: records, error } = await (supabase as any)
      .from('session_attendance_records')
      .select(`
        id,
        timestamp,
        attendance_sessions!inner(
          id,
          course_id,
          start_time,
          end_time
        )
      `)
      .eq('student_id', studentId)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching attendance stats:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Process data for graph
    const attendanceByDate: Record<string, number> = {};
    const attendanceByCourse: Record<string, number> = {};
    
    (records || []).forEach((record: any) => {
      const date = new Date(record.timestamp).toISOString().split('T')[0];
      const course = record.attendance_sessions.course_id;
      
      attendanceByDate[date] = (attendanceByDate[date] || 0) + 1;
      attendanceByCourse[course] = (attendanceByCourse[course] || 0) + 1;
    });

    // Get last 30 days for graph
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      last30Days.push({
        date: dateStr,
        count: attendanceByDate[dateStr] || 0,
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }

    const stats = {
      totalSessions: records?.length || 0,
      last30Days,
      byCourse: Object.entries(attendanceByCourse).map(([course, count]) => ({
        course,
        count
      })),
      recentSessions: (records || []).slice(0, 10).map((record: any) => ({
        id: record.id,
        course: record.attendance_sessions.course_id,
        date: new Date(record.timestamp).toLocaleDateString(),
        time: new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }))
    };

    return NextResponse.json(stats);
  } catch (e: any) {
    console.error('Unexpected error in attendance stats API:', e);
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
