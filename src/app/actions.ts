
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
import { auth } from '@/lib/firebase-admin';
import { students as studentData, attendanceSessions, sessionAttendanceRecords } from '@/lib/data';
import { placeholderImages } from '@/lib/placeholder-images.json';
import { AttendanceSession, SessionAttendanceRecord, Student } from '@/lib/types';
import { randomUUID } from 'crypto';
import QRCode from 'qrcode';


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
        const studentReferencePhotos = await Promise.all(
          studentData.map(async (student) => {
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
            students: studentReferencePhotos.filter(s => s.photoUri), // Filter out students with no image
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
  role: 'teacher' | 'student' | 'admin'
): Promise<{
  success: boolean;
  error?: string;
  uid?: string;
}> {
  if (!auth) {
    return { success: false, error: 'Firebase Admin not initialized. Check server logs.' };
  }
  try {
    const userRecord = await auth.createUser({
      email,
      password,
    });

    // Set custom claim for the user's role
    await auth.setCustomUserClaims(userRecord.uid, { role });

    return { success: true, uid: userRecord.uid };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateProfileAction(data: { uid: string, firstName: string, lastName: string, title: string }): Promise<{
    success: boolean;
    error?: string;
}> {
    if (!auth) {
        return { success: false, error: 'Firebase Admin not initialized. Check server logs.' };
    }
    try {
        await auth.updateUser(data.uid, {
            displayName: `${data.firstName} ${data.lastName}`,
        });
        // Note: 'title' is not a default Firebase Auth field.
        // To save it, you would typically use a database like Firestore.
        // For now, we are just updating the displayName.
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// QR Code Actions
export async function createAttendanceSessionAction(
    courseId: string,
    teacherId: string,
    durationInMinutes: number
): Promise<{ success: boolean; session?: AttendanceSession; qrCodeDataUrl?: string, error?: string }> {
    try {
        const now = new Date();
        const endTime = new Date(now.getTime() + durationInMinutes * 60000);

        const newSession: AttendanceSession = {
            id: randomUUID(),
            courseId,
            teacherId,
            startTime: now.toISOString(),
            endTime: endTime.toISOString(),
            createdAt: now.toISOString(),
        };

        attendanceSessions.push(newSession);

        // Generate QR Code
        const qrCodeData = JSON.stringify({ sessionId: newSession.id });
        const qrCodeDataUrl = await QRCode.toDataURL(qrCodeData);
        
        return { success: true, session: newSession, qrCodeDataUrl };

    } catch (error: any) {
        console.error("Error creating attendance session:", error);
        return { success: false, error: "Failed to create a new session." };
    }
}

export async function markStudentAttendanceAction(
    sessionId: string,
    studentId: string
): Promise<{ success: boolean; message: string }> {
    const session = attendanceSessions.find(s => s.id === sessionId);

    if (!session) {
        return { success: false, message: "Invalid or expired session." };
    }

    const now = new Date();
    const startTime = new Date(session.startTime);
    const endTime = new Date(session.endTime);

    if (now < startTime || now > endTime) {
        return { success: false, message: "Attendance can only be marked within the session window." };
    }
    
    const existingRecord = sessionAttendanceRecords.find(r => r.sessionId === sessionId && r.studentId === studentId);
    if (existingRecord) {
        return { success: false, message: "You have already marked your attendance for this session." };
    }

    const newRecord: SessionAttendanceRecord = {
        id: randomUUID(),
        sessionId,
        studentId,
        timestamp: now.toISOString(),
    };
    
    sessionAttendanceRecords.push(newRecord);

    return { success: true, message: "Attendance marked successfully!" };
}

export async function getSessionAttendanceAction(sessionId: string): Promise<{
    success: boolean,
    records?: { studentName: string, timestamp: string }[],
    error?: string
}> {
    const records = sessionAttendanceRecords.filter(r => r.sessionId === sessionId);
    const studentRecords = records.map(record => {
        const student = studentData.find(s => s.id === record.studentId);
        return {
            studentName: student?.name || 'Unknown Student',
            timestamp: record.timestamp,
        }
    });

    return { success: true, records: studentRecords };
}
