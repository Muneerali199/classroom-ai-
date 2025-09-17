import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseAdmin();
    const enrollmentId = parseInt(params.id);

    if (isNaN(enrollmentId)) {
      return NextResponse.json(
        { error: 'Invalid enrollment ID' },
        { status: 400 }
      );
    }

    // Get the enrollment details first
    const { data: enrollment, error: fetchError } = await supabase
      .from('subject_students')
      .select('student_id')
      .eq('id', enrollmentId)
      .single();

    if (fetchError) {
      console.error('Error fetching enrollment:', fetchError);
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      );
    }

    // Delete room assignment first (if exists)
    const { error: roomDeleteError } = await supabase
      .from('room_students')
      .delete()
      .eq('student_id', enrollment.student_id);

    if (roomDeleteError) {
      console.error('Error deleting room assignment:', roomDeleteError);
      // Continue with subject enrollment deletion even if room deletion fails
    }

    // Delete subject enrollment
    const { error: subjectDeleteError } = await supabase
      .from('subject_students')
      .delete()
      .eq('id', enrollmentId);

    if (subjectDeleteError) {
      console.error('Error deleting subject enrollment:', subjectDeleteError);
      return NextResponse.json(
        { error: 'Failed to delete enrollment' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Enrollment deleted successfully'
    });
  } catch (error) {
    console.error('Error in enrollment DELETE:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}