import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseAdmin();
    const body = await request.json();
    const { name, code, description } = body;
    const subjectId = parseInt(params.id);

    if (isNaN(subjectId)) {
      return NextResponse.json(
        { error: 'Invalid subject ID' },
        { status: 400 }
      );
    }

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Subject name is required and must be a string' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('subjects')
      .update({
        name: name.trim(),
        code: code?.trim() || null,
        description: description?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', subjectId)
      .select()
      .single();

    if (error) {
      console.error('Error updating subject:', error);
      return NextResponse.json(
        { error: 'Failed to update subject' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Subject not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in PUT /api/subjects/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseAdmin();
    const subjectId = parseInt(params.id);

    if (isNaN(subjectId)) {
      return NextResponse.json(
        { error: 'Invalid subject ID' },
        { status: 400 }
      );
    }

    // Check if subject is being used in enrollments
    const { data: enrollments, error: checkError } = await supabase
      .from('subject_students')
      .select('id')
      .eq('subject_id', subjectId)
      .limit(1);

    if (checkError) {
      console.error('Error checking subject usage:', checkError);
      return NextResponse.json(
        { error: 'Failed to check subject usage' },
        { status: 500 }
      );
    }

    if (enrollments && enrollments.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete subject that has enrolled students' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', subjectId);

    if (error) {
      console.error('Error deleting subject:', error);
      return NextResponse.json(
        { error: 'Failed to delete subject' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/subjects/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}