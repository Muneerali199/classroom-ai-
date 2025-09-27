import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getSupabase } from '@/lib/supabase';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: sessionId } = await params;
    if (!sessionId) return NextResponse.json({ error: 'session id required' }, { status: 400 });

    const supabase = supabaseAdmin || getSupabase();
    const { data: recs, error } = await (supabase as any)
      .from('session_attendance_records')
      .select('id, session_id, student_id, timestamp')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const ids: string[] = Array.from(new Set((recs || []).map((r: any) => r.student_id))).filter(Boolean) as string[];
    const studentsById: Record<string, { name?: string; email?: string }> = {};
    if (ids.length > 0) {
      const { data: studentsList } = await (supabase as any)
        .from('students')
        .select('id,name,email')
        .in('id', ids);
      (studentsList || []).forEach((s: any) => {
        studentsById[s.id] = { name: s.name, email: s.email };
      });
    }

    const attendees = (recs || []).map((record: any) => ({
      id: record.id,
      session_id: record.session_id,
      student_id: record.student_id,
      student_name: studentsById[record.student_id]?.name || 'Student',
      student_email: studentsById[record.student_id]?.email || '',
      marked_at: record.timestamp,
    }));

    return NextResponse.json(attendees);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
