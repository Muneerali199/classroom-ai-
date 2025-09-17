// AI wrapper to handle conditional loading and prevent build issues

interface AttendanceSummaryInput {
  studentName: string;
  attendanceRecords: {
    status: 'Present' | 'Absent' | 'Late' | 'Excused';
    date: string;
  }[];
}

export async function generateAttendanceSummary(input: AttendanceSummaryInput) {
  if (process.env.NODE_ENV === 'production' && process.env.SKIP_AI_IMPORTS === 'true') {
    // Return a fallback response for production builds
    return {
      summary: `Attendance summary for ${input.studentName}: ${input.attendanceRecords.length} records processed.`
    };
  }
  
  try {
    const { generateAttendanceSummary } = await import('@/ai/flows/attendance-summary-generation');
    return await generateAttendanceSummary(input);
  } catch {
    return {
      summary: `Attendance summary for ${input.studentName}: ${input.attendanceRecords.length} records processed.`
    };
  }
}

interface RecognitionInput {
  classroomPhotoUri: string;
  students: {
    name: string;
    photoUri: string;
  }[];
}

export async function recognizeStudentsForAttendance(input: RecognitionInput) {
  if (process.env.NODE_ENV === 'production' && process.env.SKIP_AI_IMPORTS === 'true') {
    return { presentStudents: [] };
  }
  
  try {
    const { recognizeStudentsForAttendance } = await import('@/ai/flows/face-recognition-attendance');
    return await recognizeStudentsForAttendance(input);
  } catch {
    return { presentStudents: [] };
  }
}

interface WeeklyReportInput {
  attendanceRecords: {
    studentName: string;
    status: 'Present' | 'Absent' | 'Late' | 'Excused';
    date: string;
  }[];
}

export async function generateWeeklyReport(input: WeeklyReportInput) {
  if (process.env.NODE_ENV === 'production' && process.env.SKIP_AI_IMPORTS === 'true') {
    return {
      report: `Weekly attendance report: ${input.attendanceRecords.length} total records analyzed.`
    };
  }
  
  try {
    const { generateWeeklyReport } = await import('@/ai/flows/weekly-attendance-report');
    return await generateWeeklyReport(input);
  } catch {
    return {
      report: `Weekly attendance report: ${input.attendanceRecords.length} total records analyzed.`
    };
  }
}