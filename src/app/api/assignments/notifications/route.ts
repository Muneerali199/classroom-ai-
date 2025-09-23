import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const assignment_id: string | undefined = body?.assignment_id?.toString();
    const title: string | undefined = body?.title?.toString();
    const subject_name: string | undefined = body?.subject_name?.toString();
    
    if (!assignment_id || !title) {
      return NextResponse.json({ error: 'Assignment ID and title required' }, { status: 400 });
    }

    const supabase = supabaseAdmin || getSupabase();
    
    // Get all students to notify them
    const { data: students, error: studentsError } = await (supabase as any)
      .from('students')
      .select('id, auth_user_id, name, email');

    if (studentsError) {
      console.error('Error fetching students:', studentsError);
      return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
    }

    // Create notifications for all students
    const notifications = (students || []).map((student: any) => ({
      id: crypto.randomUUID(),
      student_id: student.id,
      assignment_id,
      title: `New Assignment: ${title}`,
      message: subject_name ? `${title} has been published for ${subject_name}` : `${title} has been published`,
      type: 'assignment',
      read: false,
      created_at: new Date().toISOString()
    }));

    if (notifications.length > 0) {
      const { error: notifError } = await (supabase as any)
        .from('notifications')
        .insert(notifications);

      if (notifError) {
        console.error('Error creating notifications:', notifError);
        // Don't fail the request if notifications fail
      }
    }

    return NextResponse.json({ success: true, notified: notifications.length });
  } catch (e: any) {
    console.error('Unexpected error in notifications API:', e);
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
