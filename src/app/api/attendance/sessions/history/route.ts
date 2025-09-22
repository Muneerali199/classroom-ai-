import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getSupabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get('teacherId');
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    if (!teacherId) return NextResponse.json({ error: 'teacherId required' }, { status: 400 });

    const supabase = supabaseAdmin || getSupabase();

    let query = (supabase as any)
      .from('attendance_sessions')
      .select('id, course_id, teacher_id, teacher_name, start_time, end_time, attendee_count:session_attendance_records(count)')
      .eq('teacher_id', teacherId)
      .order('start_time', { ascending: false });

    if (start) query = query.gte('start_time', start);
    if (end) query = query.lte('start_time', end);

    const { data, error } = await query.limit(start || end ? 50 : 10);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const sessions = (data || []).map((s: any) => ({
      id: s.id,
      course_name: s.course_id,
      teacher_id: s.teacher_id,
      teacher_name: s.teacher_name,
      start_time: s.start_time,
      end_time: s.end_time,
      is_active: false,
      attendee_count: s.attendee_count?.[0]?.count || 0,
    }));

    return NextResponse.json(sessions);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
