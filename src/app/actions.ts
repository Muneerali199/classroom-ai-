'use server';

import {
  generateAttendanceSummary,
  type AttendanceSummaryInput,
} from '@/ai/flows/attendance-summary-generation';
import {
  recognizeStudentsForAttendance,
  type RecognizeStudentsInput,
} from '@/ai/flows/face-recognition-attendance';
import { 
    generateWeeklyReport, 
    type WeeklyReportInput 
} from '@/ai/flows/weekly-attendance-report';
import { supabase, getSupabase, supabaseAdmin } from '@/lib/supabase';
import { getStudents, getAttendanceSessions, getSessionAttendanceRecords } from '@/lib/data';
import placeholderImagesData from '@/lib/placeholder-images.json';
import { AttendanceSession, SessionAttendanceRecord, Student } from '@/lib/types';
import { randomUUID } from 'crypto';

// Extract placeholderImages from the imported data
const placeholderImages = placeholderImagesData.placeholderImages || placeholderImagesData || [];

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
  } catch (error) {
    console.error(`Error converting image URL to data URI for ${url}:`, error);
    // Return a placeholder or handle the error as appropriate
    return '';
  }
}


export async function getAttendanceSummaryAction(
  input: AttendanceSummaryInput
) {
  try {
    const { summary } = await generateAttendanceSummary(input);
    return { success: true, summary };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate summary.' };
  }
}

export async function recognizeStudentsAction(classroomPhotoUri: string) {
    try {
        const students = await getStudents();
        const studentReferencePhotos = await Promise.all(
          students.map(async (student: Student) => {
            const studentImage = placeholderImages.find((img) => img.id === student.id);
            const photoUri = studentImage
              ? await convertImageUrlToDataUri(studentImage.url)
              : '';
            return {
              name: student.name,
              photoUri: photoUri,
            };
          })
        );

        const input: RecognizeStudentsInput = {
            classroomPhotoUri,
            students: studentReferencePhotos.filter((s: { photoUri: string }) => s.photoUri), // Filter out students with no image
        };
        const { presentStudents } = await recognizeStudentsForAttendance(input);
        return { success: true, presentStudents };
    } catch (error) {
        console.error('Error in recognizeStudentsAction:', error);
        return { success: false, error: 'Failed to recognize students from the photo.' };
    }
}

export { type WeeklyReportInput };
export async function generateWeeklyReportAction(input: WeeklyReportInput) {
    try {
        const { report } = await generateWeeklyReport(input);
        return { success: true, report };
    } catch (error) {
        console.error('Error in generateWeeklyReportAction:', error);
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
  } catch (error: any) {
    return { success: false, error: error.message };
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
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}



export async function getSessionAttendanceAction(sessionId: string): Promise<{
    success: boolean,
    records?: { studentName: string, timestamp: string }[],
    error?: string
}> {
    try {
        const records = await getSessionAttendanceRecords();
        const sessionRecords = records.filter((r: SessionAttendanceRecord) => r.sessionId === sessionId);
        const students = await getStudents();

        const studentRecords = sessionRecords.map((record: SessionAttendanceRecord) => {
            const student = students.find((s: Student) => s.id === record.studentId);
            return {
                studentName: student?.name || 'Unknown Student',
                timestamp: record.timestamp,
            }
        });

        return { success: true, records: studentRecords };
    } catch (error) {
        console.error('Error getting session attendance:', error);
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

        const newSession: AttendanceSession = {
            id: randomUUID(),
            courseId,
            teacherId,
            teacherName,
            startTime: now.toISOString(),
            endTime: endTime.toISOString(),
            createdAt: now.toISOString(),
            pin: pin, // Store PIN in session
        };

        // Save to Supabase using admin client for server-side operations
        try {
            const supabaseClient = supabaseAdmin || getSupabase();
            
            let insertData = {
                id: newSession.id,
                course_id: courseId,
                teacher_id: teacherId,
                start_time: now.toISOString(),
                end_time: endTime.toISOString(),
                created_at: now.toISOString(),
                pin: pin, // Add PIN to database
            };

            // Try to insert with teacher_name and pin
            let { error } = await supabaseClient
                .from('attendance_sessions')
                .insert({
                    ...insertData,
                    teacher_name: teacherName,
                });

            // If error is due to missing column, try without teacher_name
            if (error && error.code === '42703') {
                console.warn('teacher_name column not found, inserting without it. Please run migration 003.');
                const { error: fallbackError } = await supabaseClient
                    .from('attendance_sessions')
                    .insert(insertData);
                
                if (fallbackError) {
                    throw new Error(`Failed to save session to database: ${fallbackError.message}`);
                }
            } else if (error) {
                throw new Error(`Failed to save session to database: ${error.message}`);
            }
        } catch (supabaseError: any) {
            throw new Error(`Failed to save session to database: ${supabaseError.message}`);
        }

        return { success: true, session: newSession, pin };

    } catch (error: any) {
        console.error("Error creating PIN attendance session:", error);
        return { success: false, error: error.message || "Failed to create a new session." };
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
        
        const activeSession = sessions.find((s: any) => {
            const session = s as AttendanceSession & { pin?: string };
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
        const existingRecord = records.find((r: SessionAttendanceRecord) =>
            r.sessionId === activeSession.id && r.studentId === student.id
        );

        if (existingRecord) {
            return {
                success: false,
                message: "You've already marked your attendance for this session."
            };
        }

        // Record the attendance
        const newRecord: SessionAttendanceRecord = {
            id: randomUUID(),
            sessionId: activeSession.id,
            studentId: student.id,
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
        } catch (supabaseError: any) {
            throw new Error(`Failed to save attendance record: ${supabaseError.message}`);
        }

        return {
            success: true,
            message: `Attendance marked successfully for ${student?.name || 'Unknown Student'}!`
        };

    } catch (error) {
        console.error('Error marking attendance with PIN:', error);
        return {
            success: false,
            message: "Failed to mark attendance. Please try again."
        };
    }
}