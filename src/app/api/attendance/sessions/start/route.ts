import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getSupabase } from '@/lib/supabase';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const course_name: string | undefined = body?.course_name?.toString();
    const location: string | undefined = body?.location?.toString();
    const teacher_id: string | undefined = body?.teacher_id?.toString();
    
    if (!course_name) return NextResponse.json({ error: 'Course name required' }, { status: 400 });
    if (!teacher_id) return NextResponse.json({ error: 'Teacher ID required' }, { status: 400 });

    const supabase = supabaseAdmin || getSupabase();
    
    // Generate a 5-digit PIN (10000-99999)
    const pin = Math.floor(10000 + Math.random() * 90000).toString();
    const sessionId = randomUUID();
    
    // Insert session
    const { data, error } = await (supabase as any)
      .from('attendance_sessions')
      .insert({
        id: sessionId,
        course_id: course_name,
        teacher_id: teacher_id,
        teacher_name: 'Teacher', // You can enhance this with actual teacher name lookup
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        pin: pin
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const session = {
      id: data.id,
      course_name: data.course_id,
      teacher_id: data.teacher_id,
      teacher_name: data.teacher_name,
      pin: data.pin,
      location: location,
      start_time: data.start_time,
      end_time: data.end_time,
      is_active: true,
      attendee_count: 0,
    };

    return NextResponse.json(session);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
