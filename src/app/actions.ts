'use server';

import {
  generateAttendanceSummary,
  recognizeStudentsForAttendance,
  generateWeeklyReport,
} from '@/ai/ai-wrapper';
import { supabase, getSupabase, supabaseAdmin } from '@/lib/supabase';
import { getStudents, getAttendanceSessions, getSessionAttendanceRecords } from '@/lib/data';
import { AttendanceSession, AttendanceSessionInsert, SessionAttendanceRecord, Student } from '@/lib/database.types';
import { randomUUID } from 'crypto';

async function convertImageUrlToDataUri(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = response.headers.get('content-type') || 'image/jpeg';
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
  } catch {
    // Return a placeholder or handle the error as appropriate
    return '';
  }
}


export async function getAttendanceSummaryAction(
  input: { studentName: string; attendanceRecords: Array<{ date: string; status: 'Present' | 'Absent' | 'Late' | 'Excused' }> }
) {
  try {
    const { summary } = await generateAttendanceSummary(input);
    return { success: true, summary };
  } catch {
    return { success: false, error: 'Failed to generate summary.' };
  }
}

export async function recognizeStudentsAction(classroomPhotoUri: string) {
    try {
        const students = await getStudents();
        const studentReferencePhotos = await Promise.all(
          students.map(async (student: Student) => {
            // Use student's actual photo_url from database if available
            const photoUri = student.photo_url
              ? await convertImageUrlToDataUri(student.photo_url)
              : '';
            return {
              name: student.name,
              photoUri: photoUri,
            };
          })
        );

        const input = {
            classroomPhotoUri,
            students: studentReferencePhotos.filter((s: { photoUri: string }) => s.photoUri), // Filter out students with no image
        };
        
        if (input.students.length === 0) {
            return { success: false, error: 'No student photos available for recognition. Please add student photos to enable this feature.' };
        }
        
        const { presentStudents } = await recognizeStudentsForAttendance(input);
        return { success: true, presentStudents };
    } catch (error) {
        console.error('Face recognition error:', error);
        return { success: false, error: 'Failed to recognize students from the photo.' };
    }
}

export async function generateWeeklyReportAction(input: { attendanceRecords: Array<{ studentName: string; date: string; status: 'Present' | 'Absent' | 'Late' | 'Excused' }> }) {
    try {
        const { report } = await generateWeeklyReport(input);
        return { success: true, report };
    } catch {
        return { success: false, error: 'Failed to generate weekly report.' };
    }
}



export async function signUpWithEmailAndPassword(
  email: string,
  password: string,
  role: 'teacher' | 'student' | 'dean'
): Promise<{
  success: boolean;
  error?: string;
  uid?: string;
}> {
  if (!supabase) {
    return { success: false, error: 'Supabase not initialized. Check server logs.' };
  }
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, uid: data.user?.id };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}

export async function updateProfileAction(data: { uid: string, firstName: string, lastName: string, title: string }): Promise<{
    success: boolean;
    error?: string;
}> {
    if (!supabase) {
        return { success: false, error: 'Supabase not initialized. Check server logs.' };
    }
    try {
        const { error } = await supabase.auth.updateUser({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                title: data.title,
            },
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error: unknown) {
        return { success: false, error: (error as Error).message };
    }
}



export async function getSessionAttendanceAction(sessionId: string): Promise<{
    success: boolean,
    records?: { studentName: string, timestamp: string }[],
    error?: string
}> {
    try {
        const records = await getSessionAttendanceRecords();
        const sessionRecords = records.filter((r) => r.sessionId === sessionId);
        const students = await getStudents();

        const studentRecords = sessionRecords.map((record) => {
            const studentId = record.studentId;
            const student = students.find((s: Student) => s.id === studentId);
            return {
                studentName: student?.name || 'Unknown Student',
                timestamp: record.timestamp,
            }
        });

        return { success: true, records: studentRecords };
    } catch {
        return { success: false, error: 'Failed to get session attendance records.' };
    }
}

// PIN-based Attendance Actions
export async function createPinAttendanceSessionAction(
    courseId: string,
    teacherId: string,
    durationInMinutes: number,
    teacherName: string
): Promise<{ success: boolean; session?: AttendanceSession; pin?: string, error?: string }> {
    try {
        const now = new Date();
        const endTime = new Date(now.getTime() + durationInMinutes * 60000);

        // Generate a 6-digit PIN
        const pin = Math.floor(100000 + Math.random() * 900000).toString();

        const sessionId = randomUUID();
        
        const newSession: AttendanceSessionInsert = {
            id: sessionId,
            course_id: courseId,
            teacher_id: teacherId,
            teacher_name: teacherName,
            start_time: now.toISOString(),
            end_time: endTime.toISOString(),
            created_at: now.toISOString(),
            pin: pin, // Store PIN in session
        };

        // Save to Supabase using admin client for server-side operations
        try {
            const supabaseClient = supabaseAdmin || getSupabase();
            
            // Use the newSession data directly since it's already properly formatted
            const insertData = newSession;

            // Try to insert with teacher_name and pin
            const { error } = await supabaseClient
                .from('attendance_sessions')
                .insert({
                    ...insertData,
                    teacher_name: teacherName,
                });

            // If error is due to missing column, try without teacher_name
            if (error && error.code === '42703') {
                const { error: fallbackError } = await supabaseClient
                    .from('attendance_sessions')
                    .insert(insertData);
                
                if (fallbackError) {
                    throw new Error(`Failed to save session to database: ${fallbackError.message}`);
                }
            } else if (error) {
                throw new Error(`Failed to save session to database: ${error.message}`);
            }
        } catch (supabaseError: unknown) {
            throw new Error(`Failed to save session to database: ${(supabaseError as Error).message}`);
        }

        // Create the response session object matching AttendanceSession type
        const responseSession: AttendanceSession = {
            id: newSession.id,
            course_id: newSession.course_id,
            teacher_id: newSession.teacher_id,
            teacher_name: newSession.teacher_name,
            start_time: newSession.start_time,
            end_time: newSession.end_time,
            created_at: newSession.created_at || now.toISOString(),
            pin: newSession.pin,
        };
        
        return { success: true, session: responseSession, pin };

    } catch (error: unknown) {
        return { success: false, error: (error as Error).message || "Failed to create a new session." };
    }
}

export async function markStudentAttendanceWithPinAction(
    pin: string
): Promise<{ success: boolean; message: string }> {
    try {
        // Get current user from Supabase
        const supabaseClient = getSupabase();
        const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
        
        if (userError || !user) {
            return { success: false, message: "You must be logged in to mark attendance." };
        }

        // Find active session with matching PIN
        const sessions = await getAttendanceSessions();
        const now = new Date();
        
        const activeSession = sessions.find((session) => {
            const startTime = new Date(session.startTime);
            const endTime = new Date(session.endTime);
            return session.pin === pin && now >= startTime && now <= endTime;
        });

        if (!activeSession) {
            return { success: false, message: "Invalid PIN or session has expired." };
        }

        // Get student information
        const students = await getStudents();
        const userName = user.user_metadata?.firstName || user.user_metadata?.full_name?.split(' ')[0] || user.email;
        const student = students.find((s: { name: string }) => s.name === userName);

        if (!student) {
            return { success: false, message: "Could not identify the student. Please ensure your profile name is correct." };
        }

        // Check for existing attendance
        const records = await getSessionAttendanceRecords();
        const existingRecord = records.find((record) => {
            const sessionId = record.sessionId;
            const studentId = record.studentId;
            return sessionId === activeSession.id && studentId === student.id;
        });

        if (existingRecord) {
            return {
                success: false,
                message: "You've already marked your attendance for this session."
            };
        }

        // Record the attendance
        const newRecord: SessionAttendanceRecord = {
            id: randomUUID(),
            session_id: activeSession.id,
            student_id: student.id,
            timestamp: now.toISOString(),
        };

        // Save to Supabase
        try {
            const supabaseClient = supabaseAdmin || getSupabase();
            const { error } = await supabaseClient
                .from('session_attendance_records')
                .insert({
                    id: newRecord.id,
                    session_id: activeSession.id,
                    student_id: student.id,
                    timestamp: now.toISOString(),
                });

            if (error) {
                throw new Error(`Failed to save attendance record: ${error.message}`);
            }
        } catch (supabaseError: unknown) {
            throw new Error(`Failed to save attendance record: ${(supabaseError as Error).message}`);
        }

        return {
            success: true,
            message: `Attendance marked successfully for ${student?.name || 'Unknown Student'}!`
        };

    } catch {
        return {
            success: false,
            message: "Failed to mark attendance. Please try again."
        };
    }
}