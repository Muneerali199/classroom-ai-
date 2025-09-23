import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getSupabase } from '@/lib/supabase';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    console.log('🔍 Mark attendance API called');
    
    const body = await req.json().catch(() => ({}));
    console.log('📝 Request body:', { pin: body?.pin ? '***' : 'missing', student_id: body?.student_id ? 'present' : 'missing', student_email: body?.student_email ? 'present' : 'missing' });
    
    const pin: string | undefined = body?.pin?.toString();
    let student_id: string | undefined = body?.student_id?.toString();
    const student_email: string | undefined = body?.student_email?.toString();
    
    if (!pin) return NextResponse.json({ error: 'PIN required' }, { status: 400 });
    
    // Initialize Supabase client
    let supabase;
    try {
      supabase = supabaseAdmin || getSupabase();
      console.log('✅ Supabase client initialized:', supabaseAdmin ? 'admin' : 'anon');
    } catch (error) {
      console.error('❌ Supabase initialization failed:', error);
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
    
    // Get the actual student record ID (not auth_user_id)
    console.log('🔍 Looking up student record');
    let actual_student_id;
    try {
      const { data: student, error: stuErr } = await (supabase as any)
        .from('students')
        .select('id, auth_user_id, email, name')
        .eq('auth_user_id', student_id)
        .maybeSingle();
      
      if (stuErr) {
        console.error('❌ Student lookup error:', stuErr);
        return NextResponse.json({ error: 'Student lookup failed' }, { status: 500 });
      }
      
      if (!student) {
        // Try by email if auth_user_id lookup failed
        if (student_email) {
          console.log('🔍 Trying lookup by email');
          const { data: studentByEmail, error: emailErr } = await (supabase as any)
            .from('students')
            .select('id, auth_user_id, email, name')
            .eq('email', student_email)
            .maybeSingle();
          
          if (emailErr) {
            console.error('❌ Student lookup by email failed:', emailErr);
            return NextResponse.json({ error: 'Student lookup failed' }, { status: 500 });
          }
          
          if (!studentByEmail) {
            console.log('🔧 Student not found, creating new student record');
            // Create a new student record
            const newStudentId = randomUUID();
            const { data: newStudent, error: createErr } = await (supabase as any)
              .from('students')
              .insert({
                id: newStudentId,
                auth_user_id: student_id,
                email: student_email,
                name: student_email.split('@')[0], // Use email prefix as default name
                created_at: new Date().toISOString()
              })
              .select()
              .single();
            
            if (createErr) {
              console.error('❌ Failed to create student record:', createErr);
              return NextResponse.json({ error: 'Failed to create student record' }, { status: 500 });
            }
            
            actual_student_id = newStudent.id;
            console.log('✅ New student record created, ID:', actual_student_id);
          } else {
            actual_student_id = studentByEmail.id;
            console.log('✅ Student found by email, ID:', actual_student_id);
          }
        } else {
          console.log('❌ No student_email provided, cannot create student record');
          return NextResponse.json({ error: 'Student not found and cannot create without email' }, { status: 404 });
        }
      } else {
        actual_student_id = student.id;
        console.log('✅ Student found by auth_user_id, ID:', actual_student_id);
      }
    } catch (error) {
      console.error('❌ Student lookup failed:', error);
      return NextResponse.json({ error: 'Student lookup failed' }, { status: 500 });
    }
    
    if (!actual_student_id) {
      console.log('❌ No actual_student_id available');
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    console.log('🔍 Looking for active session with PIN');
    const nowIso = new Date().toISOString();

    // Validate active session by PIN and time window
    const { data: session, error: sesErr } = await (supabase as any)
      .from('attendance_sessions')
      .select('id, start_time, end_time, pin')
      .eq('pin', pin)
      .lte('start_time', nowIso)
      .gte('end_time', nowIso)
      .single();

    if (sesErr) {
      console.error('❌ Session lookup error:', sesErr);
      return NextResponse.json({ error: 'Invalid or inactive PIN' }, { status: 400 });
    }
    
    if (!session) {
      console.log('❌ No active session found for PIN');
      return NextResponse.json({ error: 'Invalid or inactive PIN' }, { status: 400 });
    }
    
    console.log('✅ Found active session:', session.id);

    // Prevent duplicate
    console.log('🔍 Checking for existing attendance record');
    const { data: existing, error: exErr } = await (supabase as any)
      .from('session_attendance_records')
      .select('id')
      .eq('session_id', session.id)
      .eq('student_id', actual_student_id)
      .maybeSingle();

    if (exErr && exErr.code !== 'PGRST116') {
      console.error('❌ Duplicate check error:', exErr);
      return NextResponse.json({ error: 'Check failed' }, { status: 500 });
    }
    
    if (existing) {
      console.log('❌ Student already marked attendance');
      return NextResponse.json({ error: 'Already marked' }, { status: 409 });
    }

    console.log('✅ Creating attendance record');
    const record = {
      id: randomUUID(),
      session_id: session.id,
      student_id: actual_student_id,
      timestamp: new Date().toISOString(),
    };
    
    const { error: insErr } = await (supabase as any)
      .from('session_attendance_records')
      .insert(record);
      
    if (insErr) {
      console.error('❌ Insert error:', insErr);
      return NextResponse.json({ error: 'Insert failed' }, { status: 500 });
    }

    console.log('✅ Attendance marked successfully');
    return NextResponse.json({ ok: true, session_id: session.id });
  } catch (e: any) {
    console.error('❌ Unexpected error in mark attendance API:', e);
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
