import { NextRequest, NextResponse } from 'next/server';
import { createPinAttendanceSessionAction, getSessionAttendanceAction } from '@/app/actions';

export async function POST(request: NextRequest) {
  try {
    const { courseId, teacherId, duration, teacherName } = await request.json();
    
    const result = await createPinAttendanceSessionAction(courseId, teacherId, duration, teacherName);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('PIN session creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }
    
    const result = await getSessionAttendanceAction(sessionId);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Get session attendance error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get session attendance' },
      { status: 500 }
    );
  }
}
