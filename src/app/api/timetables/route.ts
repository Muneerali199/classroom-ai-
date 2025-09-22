import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

// GET: list latest timetables. Students see all; teachers can filter by subject_id if provided
export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabase() as any;
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subject_id");
    let q = supabase.from('timetables').select('*').order('created_at', { ascending: false }).limit(20);
    if (subjectId) q = q.eq('subject_id', subjectId);
    const { data, error } = await q;
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const signed = await Promise.all((data || []).map(async (t: any) => {
      let file_url = t.file_url;
      if (t.file_path) {
        try {
          const { data: s } = await (supabase as any).storage.from('timetables').createSignedUrl(t.file_path, 60 * 60);
          file_url = s?.signedUrl || file_url;
        } catch {}
      }
      return { ...t, file_url };
    }));
    return NextResponse.json(signed);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to fetch timetables' }, { status: 500 });
  }
}

// POST: create timetable with optional file upload (image/PDF). Teachers/Deans only
export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase() as any;
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes?.user;
    const role = (user?.user_metadata as any)?.role || 'student';
    if (!user || (role !== 'teacher' && role !== 'dean')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const form = await req.formData();
    const subjectId = (form.get('subject_id') as string) || null;
    const notes = (form.get('notes') as string) || '';
    const file = form.get('file') as File | null;

    let file_url: string | null = null;
    let file_type: string | null = null;
    let file_path: string | null = null;

    if (file && file.size > 0) {
      const buf = new Uint8Array(await file.arrayBuffer());
      const path = `${user.id}/${Date.now()}_${file.name}`;
      const { data: up, error: upErr } = await supabase.storage.from('timetables').upload(path, buf, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      });
      if (upErr) return NextResponse.json({ error: upErr.message }, { status: 400 });
      file_path = up.path;
      const { data: s } = await supabase.storage.from('timetables').createSignedUrl(up.path, 60 * 60);
      file_url = s?.signedUrl || null;
      file_type = file.type || null;
    }

    const { data, error } = await supabase.from('timetables').insert({
      id: crypto.randomUUID(),
      subject_id: subjectId,
      notes,
      file_url,
      file_type,
      file_path,
      created_by: user.id,
    } as any).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to create timetable' }, { status: 500 });
  }
}
