import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getSupabase } from '@/lib/supabase';
import { AuthService } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await AuthService.getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = supabaseAdmin || getSupabase();
    const { data: rec, error } = await (supabase as any)
      .from('session_attendance_records')
      .select('session_id,timestamp, attendance_sessions:attendance_sessions!inner(id,course_id,start_time,end_time)')
      .eq('student_id', user.id)
      .order('timestamp', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') return NextResponse.json({ error: error.message }, { status: 500 });
    if (!rec) return NextResponse.json(null);

    const session = rec.attendance_sessions as any;
    return NextResponse.json({
      session_id: rec.session_id,
      marked_at: rec.timestamp,
      course_name: session?.course_id || 'Class',
      start_time: session?.start_time,
      end_time: session?.end_time,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
