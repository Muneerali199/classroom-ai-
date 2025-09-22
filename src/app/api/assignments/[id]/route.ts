import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabase() as any;
    const id = params.id;
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes?.user;
    const role = (user?.user_metadata as any)?.role || 'student';
    if (!user || (role !== 'teacher' && role !== 'dean')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const contentType = req.headers.get("content-type") || "";

    // Support multipart updates (can replace file and fields) or JSON body for simple updates
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const updates: any = {};
      const title = form.get("title") as string | null;
      const description = form.get("description") as string | null;
      const dueDate = form.get("due_date") as string | null;
      const subjectId = form.get("subject_id") as string | null;
      const file = form.get("file") as File | null;

      if (title !== null) updates.title = title;
      if (description !== null) updates.description = description;
      if (dueDate !== null) updates.due_date = dueDate;
      if (subjectId !== null) updates.subject_id = subjectId;

      if (file && file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        const userId = user?.id || "anon";
        const path = `${userId}/${Date.now()}_${file.name}`;
        const { data: up, error: upErr } = await supabase.storage.from("assignments").upload(path, bytes, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });
        if (upErr) return NextResponse.json({ error: upErr.message }, { status: 400 });
        const { data: signed } = await supabase.storage.from('assignments').createSignedUrl(up.path, 60 * 60);
        updates.file_url = signed?.signedUrl || null;
        updates.file_path = up.path;
        updates.file_type = file.type || null;
      }

      const { data, error } = await supabase.from("assignments").update(updates).eq("id", id).select().single();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    } else {
      const body = await req.json();
      const { data, error } = await supabase.from("assignments").update(body).eq("id", id).select().single();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to update assignment" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabase() as any;
    const id = params.id;
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes?.user;
    const role = (user?.user_metadata as any)?.role || 'student';
    if (!user || (role !== 'teacher' && role !== 'dean')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const { error } = await supabase.from("assignments").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to delete assignment" }, { status: 500 });
  }
}
