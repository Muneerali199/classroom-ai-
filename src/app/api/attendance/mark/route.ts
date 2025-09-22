import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const pin: string | undefined = body?.pin?.toString();
    let student_id: string | undefined = body?.student_id?.toString();
    const student_email: string | undefined = body?.student_email?.toString();
    if (!pin) return NextResponse.json({ error: 'PIN required' }, { status: 400 });
    const supabase = supabaseAdmin || getSupabase();
    if (!student_id && student_email) {
      // Try to resolve auth_user_id by students.email
      const { data: stu } = await (supabase as any)
        .from('students')
        .select('auth_user_id')
        .eq('email', student_email)
        .maybeSingle();
      if (stu?.auth_user_id) student_id = stu.auth_user_id;
    }
    if (!student_id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    
    const nowIso = new Date().toISOString();

    // Validate active session by PIN and time window
    const { data: session, error: sesErr } = await (supabase as any)
      .from('attendance_sessions')
      .select('id, start_time, end_time, pin')
      .eq('pin', pin)
      .lte('start_time', nowIso)
      .gte('end_time', nowIso)
      .single();

    if (sesErr || !session) {
      return NextResponse.json({ error: 'Invalid or inactive PIN' }, { status: 400 });
    }

    // Prevent duplicate
    const { data: existing, error: exErr } = await (supabase as any)
      .from('session_attendance_records')
      .select('id')
      .eq('session_id', session.id)
      .eq('student_id', student_id)
      .maybeSingle();

    if (exErr && exErr.code !== 'PGRST116') {
      return NextResponse.json({ error: 'Check failed' }, { status: 500 });
    }
    if (existing) {
      return NextResponse.json({ error: 'Already marked' }, { status: 409 });
    }

    const record = {
      id: crypto.randomUUID(),
      session_id: session.id,
      student_id,
      timestamp: new Date().toISOString(),
    };
    const { error: insErr } = await (supabase as any)
      .from('session_attendance_records')
      .insert(record);
    if (insErr) return NextResponse.json({ error: 'Insert failed' }, { status: 500 });

    return NextResponse.json({ ok: true, session_id: session.id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
