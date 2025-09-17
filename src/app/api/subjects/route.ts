import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching subjects:', error);
      return NextResponse.json(
        { error: 'Failed to fetch subjects' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/subjects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const body = await request.json();
    const { name, code, description } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Subject name is required and must be a string' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('subjects')
      .insert({
        name: name.trim(),
        code: code?.trim() || null,
        description: description?.trim() || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating subject:', error);
      return NextResponse.json(
        { error: 'Failed to create subject' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/subjects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}