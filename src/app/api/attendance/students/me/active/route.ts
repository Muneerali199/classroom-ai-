import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getSupabase } from '@/lib/supabase';
import { AuthService } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await AuthService.getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = supabaseAdmin || getSupabase();
    const nowIso = new Date().toISOString();

    // Find the most recent active session
    const { data: active, error } = await (supabase as any)
      .from('attendance_sessions')
      .select('id, course_id, start_time, end_time, attendee_count:session_attendance_records(count)')
      .lte('start_time', nowIso)
      .gte('end_time', nowIso)
      .order('start_time', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error && error.code !== 'PGRST116') return NextResponse.json({ error: error.message }, { status: 500 });

    if (!active) return NextResponse.json(null);

    // Optional: ensure this student is part of this session (has marked or belongs). Here we show count only if student already marked.
    const { data: mine } = await (supabase as any)
      .from('session_attendance_records')
      .select('id')
      .eq('session_id', active.id)
      .eq('student_id', user.id)
      .maybeSingle();

    if (!mine) return NextResponse.json(null);

    const count = active.attendee_count?.[0]?.count || 0;
    return NextResponse.json({ session_id: active.id, course_name: active.course_id, attendee_count: count, start_time: active.start_time, end_time: active.end_time });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
