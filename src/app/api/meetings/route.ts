import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

// GET /api/meetings -> list upcoming meetings (optionally filter by subject_id)
export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabase() as any;
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get('subject_id');
    let q = supabase.from('meetings').select('*').order('start_time', { ascending: true }).limit(50);
    if (subjectId) q = q.eq('subject_id', subjectId);
    const { data, error } = await q;
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data || []);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to fetch meetings' }, { status: 500 });
  }
}

// POST /api/meetings -> create a meeting
export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase() as any;
    
    // For now, allow meeting creation without strict role checking
    console.log('📅 Creating meeting...');

    const body = await req.json();
    const title = body.title as string;
    const description = (body.description as string) || '';
    const start_time = (body.start_time as string) || new Date().toISOString();
    const subject_id = (body.subject_id as string) || null;
    let room_url = (body.room_url as string) || '';

    if (!title) return NextResponse.json({ error: 'title is required' }, { status: 400 });
    if (!room_url) {
      // Generate a Jitsi room url using a random UUID
      const room = `https://meet.jit.si/${crypto.randomUUID()}`;
      room_url = room;
    }

    const meetingId = crypto.randomUUID();
    const { data, error } = await supabase.from('meetings').insert({
      id: meetingId,
      title,
      description,
      start_time,
      subject_id,
      room_url,
      created_by: crypto.randomUUID(), // Generate temp user ID
      created_at: new Date().toISOString()
    } as any).select().single();

    if (!error && data) {
      // Notify students about the new meeting
      try {
        await fetch('/api/meetings/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            meeting_id: meetingId,
            title,
            start_time,
            subject_id
          })
        });
      } catch (notifError) {
        console.warn('Failed to send meeting notifications:', notifError);
      }
    }

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to create meeting' }, { status: 500 });
  }
}
