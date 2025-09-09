'use server';

import {
  generateAttendanceSummary,
  type AttendanceSummaryInput,
} from '@/ai/flows/attendance-summary-generation';
import { auth } from '@/lib/firebase-admin';

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

export async function signUpWithEmailAndPassword(email: string, password: string): Promise<{
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
    return { success: true, uid: userRecord.uid };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateProfileAction(data: { uid: string, displayName: string }): Promise<{
    success: boolean;
    error?: string;
}> {
    if (!auth) {
        return { success: false, error: 'Firebase Admin not initialized. Check server logs.' };
    }
    try {
        await auth.updateUser(data.uid, {
            displayName: data.displayName,
        });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
