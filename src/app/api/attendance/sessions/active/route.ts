import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getSupabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get('teacherId');
    if (!teacherId) return NextResponse.json({ error: 'teacherId required' }, { status: 400 });

    const supabase = supabaseAdmin || getSupabase();
    const nowIso = new Date().toISOString();

    const { data, error } = await (supabase as any)
      .from('attendance_sessions')
      .select('id, course_id, teacher_id, teacher_name, start_time, end_time, pin, attendee_count:session_attendance_records(count)')
      .eq('teacher_id', teacherId)
      .lte('start_time', nowIso)
      .gte('end_time', nowIso)
      .order('start_time', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') return NextResponse.json({ error: error.message }, { status: 500 });

    if (!data) return NextResponse.json(null);

    const session = {
      id: data.id,
      course_name: data.course_id,
      teacher_id: data.teacher_id,
      teacher_name: data.teacher_name,
      pin: data.pin || '',
      start_time: data.start_time,
      end_time: data.end_time,
      is_active: true,
      attendee_count: data.attendee_count?.[0]?.count || 0,
    };

    return NextResponse.json(session);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
