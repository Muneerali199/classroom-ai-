
'use server';

import {
  generateAttendanceSummary,
  type AttendanceSummaryInput,
} from '@/ai/flows/attendance-summary-generation';
import {
  recognizeStudentsForAttendance,
  type RecognizeStudentsInput,
} from '@/ai/flows/face-recognition-attendance';
import { auth } from '@/lib/firebase-admin';
import { students as studentData } from '@/lib/data';
import { placeholderImages } from '@/lib/placeholder-images.json';

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
