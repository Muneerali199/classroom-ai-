import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    // Get enrollments with joined data
    const { data: enrollments, error } = await supabase
      .from('subject_students')
      .select(`
        id,
        subject_id,
        student_id,
        created_at,
        subjects (
          id,
          name,
          code,
          description
        ),
        students (
          id,
          name,
          student_id,
          grade,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching enrollments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch enrollments' },
        { status: 500 }
      );
    }

    // Get room assignments separately
    const { data: roomAssignments, error: roomError } = await supabase
      .from('room_students')
      .select(`
        student_id,
        room_id,
        rooms (
          id,
          room_number,
          building,
          floor,
          capacity
        )
      `);

    if (roomError) {
      console.error('Error fetching room assignments:', roomError);
    }

    // Create a map of student_id to room assignment
    const roomMap = new Map();
    roomAssignments?.forEach(assignment => {
      roomMap.set(assignment.student_id, {
        room_id: assignment.room_id,
        room: assignment.rooms
      });
    });

    // Transform the data to match our interface
    const transformedEnrollments = enrollments?.map(enrollment => {
      const roomAssignment = roomMap.get(enrollment.student_id);
      return {
        id: enrollment.id,
        subject_id: enrollment.subject_id,
        student_id: enrollment.student_id,
        created_at: enrollment.created_at,
        subject: enrollment.subjects,
        student: enrollment.students,
        room: roomAssignment?.room || null,
        room_id: roomAssignment?.room_id || null
      };
    }) || [];

    return NextResponse.json(transformedEnrollments);
  } catch (error) {
    console.error('Error in enrollments GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const { subject_id, student_id, room_id } = await request.json();

    // Validate required fields
    if (!subject_id || !student_id) {
      return NextResponse.json(
        { error: 'Subject ID and Student ID are required' },
        { status: 400 }
      );
    }

    // Check if student is already enrolled in this subject
    const { data: existingEnrollment, error: checkError } = await supabase
      .from('subject_students')
      .select('id')
      .eq('subject_id', subject_id)
      .eq('student_id', student_id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing enrollment:', checkError);
      return NextResponse.json(
        { error: 'Failed to validate enrollment' },
        { status: 500 }
      );
    }

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Student is already enrolled in this subject' },
        { status: 400 }
      );
    }

    // Check room capacity if room is specified
    if (room_id) {
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .select('capacity')
        .eq('id', room_id)
        .single();

      if (roomError) {
        console.error('Error fetching room:', roomError);
        return NextResponse.json(
          { error: 'Failed to validate room capacity' },
          { status: 500 }
        );
      }

      if (room?.capacity) {
        const { count: roomEnrollmentCount, error: countError } = await supabase
          .from('room_students')
          .select('*', { count: 'exact', head: true })
          .eq('room_id', room_id);

        if (countError) {
          console.error('Error counting room enrollments:', countError);
          return NextResponse.json(
            { error: 'Failed to validate room capacity' },
            { status: 500 }
          );
        }

        if (roomEnrollmentCount && roomEnrollmentCount >= room.capacity) {
          return NextResponse.json(
            { error: 'Room capacity exceeded' },
            { status: 400 }
          );
        }
      }
    }

    // Start transaction
    const { data: subjectEnrollment, error: subjectError } = await supabase
      .from('subject_students')
      .insert({
        subject_id,
        student_id
      })
      .select()
      .single();

    if (subjectError) {
      console.error('Error creating subject enrollment:', subjectError);
      return NextResponse.json(
        { error: 'Failed to create subject enrollment' },
        { status: 500 }
      );
    }

    // Create room enrollment if room is specified
    if (room_id) {
      const { error: roomError } = await supabase
        .from('room_students')
        .insert({
          room_id,
          student_id
        });

      if (roomError) {
        console.error('Error creating room enrollment:', roomError);
        // Rollback subject enrollment
        await supabase
          .from('subject_students')
          .delete()
          .eq('id', subjectEnrollment.id);

        return NextResponse.json(
          { error: 'Failed to create room enrollment' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      message: 'Student enrolled successfully',
      enrollment: subjectEnrollment
    });
  } catch (error) {
    console.error('Error in enrollments POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}