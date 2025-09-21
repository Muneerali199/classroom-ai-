import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseAdmin();
    const body = await request.json();
    const { room_number, capacity, building, floor } = body;
    const { id } = await context.params;
    const roomId = parseInt(id);

    if (isNaN(roomId)) {
      return NextResponse.json(
        { error: 'Invalid room ID' },
        { status: 400 }
      );
    }

    if (!room_number || typeof room_number !== 'string') {
      return NextResponse.json(
        { error: 'Room number is required and must be a string' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('rooms')
      .update({
        room_number: room_number.trim(),
        capacity: capacity || null,
        building: building?.trim() || null,
        floor: floor || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', roomId)
      .select()
      .single();

    if (error) {
      console.error('Error updating room:', error);
      return NextResponse.json(
        { error: 'Failed to update room' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in PUT /api/rooms/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseAdmin();
    const { id } = await context.params;
    const roomId = parseInt(id);

    if (isNaN(roomId)) {
      return NextResponse.json(
        { error: 'Invalid room ID' },
        { status: 400 }
      );
    }

    // Check if room is being used in enrollments
    const { data: enrollments, error: checkError } = await supabase
      .from('room_students')
      .select('id')
      .eq('room_id', roomId)
      .limit(1);

    if (checkError) {
      console.error('Error checking room usage:', checkError);
      return NextResponse.json(
        { error: 'Failed to check room usage' },
        { status: 500 }
      );
    }

    if (enrollments && enrollments.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete room that has enrolled students' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', roomId);

    if (error) {
      console.error('Error deleting room:', error);
      return NextResponse.json(
        { error: 'Failed to delete room' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/rooms/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}