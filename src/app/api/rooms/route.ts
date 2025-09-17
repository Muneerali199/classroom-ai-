import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('room_number');

    if (error) {
      console.error('Error fetching rooms:', error);
      return NextResponse.json(
        { error: 'Failed to fetch rooms' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/rooms:', error);
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
    const { room_number, capacity, building, floor } = body;

    if (!room_number || typeof room_number !== 'string') {
      return NextResponse.json(
        { error: 'Room number is required and must be a string' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('rooms')
      .insert({
        room_number: room_number.trim(),
        capacity: capacity || null,
        building: building?.trim() || null,
        floor: floor || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating room:', error);
      return NextResponse.json(
        { error: 'Failed to create room' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/rooms:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}