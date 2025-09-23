import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const meeting_id: string | undefined = body?.meeting_id?.toString();
    const title: string | undefined = body?.title?.toString();
    const start_time: string | undefined = body?.start_time?.toString();
    const subject_id: string | undefined = body?.subject_id?.toString();
    
    if (!meeting_id || !title) {
      return NextResponse.json({ error: 'Meeting ID and title required' }, { status: 400 });
    }

    const supabase = supabaseAdmin || getSupabase();

    // Get all students for notification
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
      meeting_id,
      title: `New Meeting: ${title}`,
      message: `Meeting "${title}" scheduled for ${new Date(start_time || '').toLocaleString()}`,
      type: 'meeting',
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

    return NextResponse.json({ 
      success: true, 
      notified_students: notifications.length,
      message: `Meeting notifications sent to ${notifications.length} students`
    });

  } catch (e: any) {
    console.error('Unexpected error in meeting notifications API:', e);
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
