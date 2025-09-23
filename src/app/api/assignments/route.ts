import { NextRequest, NextResponse } from "next/server";
import { getSupabase, supabaseAdmin } from "@/lib/supabase";

// GET /api/assignments -> list latest assignments (optionally filter by subject_id)
export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabase() as any;
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subject_id");
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes?.user;
    const role = (user?.user_metadata as any)?.role || 'student';

    let baseQuery = supabase.from("assignments").select("*").order("created_at", { ascending: false }).limit(50);
    if (subjectId) baseQuery = baseQuery.eq("subject_id", subjectId);

    // For now, show all assignments to students (can be filtered later)
    // TODO: Implement proper enrollment filtering when subject_enrollments table is ready

    const { data, error } = await baseQuery;
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    // Join subjects to include subject_name
    const subjectIds = Array.from(new Set((data || []).map((a: any) => a.subject_id).filter(Boolean)));
    let subjectsById: Record<string, any> = {};
    if (subjectIds.length > 0) {
      const { data: subs } = await supabase.from('subjects').select('id,name').in('id', subjectIds);
      (subs || []).forEach((s: any) => { subjectsById[s.id] = s; });
    }

    // Try to sign URLs if we have file_path
    const withSigned = await Promise.all((data || []).map(async (a: any) => {
      let file_url = a.file_url;
      if (a.file_path) {
        try {
          const { data: signed } = await (supabase as any).storage.from('assignments').createSignedUrl(a.file_path, 60 * 60);
          file_url = signed?.signedUrl || file_url;
        } catch {}
      }
      return {
        ...a,
        file_url,
        dueDate: a.due_date,
        subject_name: subjectsById[a.subject_id]?.name || null,
      };
    }));
    const normalized = withSigned;
    return NextResponse.json(normalized);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to fetch assignments" }, { status: 500 });
  }
}

// POST /api/assignments -> create assignment (multipart form-data)
// Fields: title (string), description (string?), due_date (ISO string?), subject_id (string?), file (blob?)
export async function POST(req: NextRequest) {
  try {
    const supabase = supabaseAdmin || getSupabase();
    
    // For now, allow assignment creation without strict role checking
    // TODO: Implement proper role-based access control
    console.log('📝 Creating assignment...');
    const form = await req.formData();

    const title = (form.get("title") as string) || "";
    const description = (form.get("description") as string) || "";
    const dueDate = (form.get("due_date") as string) || null;
    const subjectId = (form.get("subject_id") as string) || null;
    const file = form.get("file") as File | null;

    if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 });
    
    // Generate a user ID for now (can be enhanced with proper auth later)
    const userId = crypto.randomUUID();

    // Optional file upload to Supabase Storage
    let fileUrl: string | null = null;
    let fileType: string | null = null;
    let filePath: string | null = null;

    if (file && file.size > 0) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        const path = `${userId || "anon"}/${Date.now()}_${file.name}`;
        
        // Try to upload to storage, but don't fail if bucket doesn't exist
        const { data: up, error: upErr } = await supabase.storage.from("assignments").upload(path, bytes, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });
        
        if (!upErr && up) {
          filePath = up.path;
          const { data: signed } = await supabase.storage.from('assignments').createSignedUrl(up.path, 60 * 60);
          fileUrl = signed?.signedUrl || null;
          fileType = file.type || null;
        } else {
          // If storage fails, just store file info without actual file
          console.warn('Storage upload failed, proceeding without file:', upErr?.message);
          fileType = file.type || null;
        }
      } catch (storageError) {
        console.warn('Storage error, proceeding without file upload:', storageError);
      }
    }

    const assignmentId = crypto.randomUUID();
    const { data, error } = await (supabase as any).from("assignments").insert({
      id: assignmentId,
      title,
      description,
      due_date: dueDate,
      subject_id: subjectId,
      created_by: userId,
      file_url: fileUrl,
      file_type: fileType,
      file_path: filePath,
      created_at: new Date().toISOString()
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to create assignment" }, { status: 500 });
  }
}
