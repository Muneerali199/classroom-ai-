// AI wrapper to handle conditional loading and prevent build issues

export async function generateAttendanceSummary(input: any) {
  if (process.env.NODE_ENV === 'production' && process.env.SKIP_AI_IMPORTS === 'true') {
    // Return a fallback response for production builds
    return {
      summary: `Attendance summary for ${input.studentName}: ${input.attendanceRecords.length} records processed.`
    };
  }
  
  try {
    const { generateAttendanceSummary } = await import('@/ai/flows/attendance-summary-generation');
    return await generateAttendanceSummary(input);
  } catch (error) {
    console.warn('AI service unavailable, using fallback:', error);
    return {
      summary: `Attendance summary for ${input.studentName}: ${input.attendanceRecords.length} records processed.`
    };
  }
}

export async function recognizeStudentsForAttendance(input: any) {
  if (process.env.NODE_ENV === 'production' && process.env.SKIP_AI_IMPORTS === 'true') {
    return { presentStudents: [] };
  }
  
  try {
    const { recognizeStudentsForAttendance } = await import('@/ai/flows/face-recognition-attendance');
    return await recognizeStudentsForAttendance(input);
  } catch (error) {
    console.warn('AI service unavailable, using fallback:', error);
    return { presentStudents: [] };
  }
}

export async function generateWeeklyReport(input: any) {
  if (process.env.NODE_ENV === 'production' && process.env.SKIP_AI_IMPORTS === 'true') {
    return {
      report: `Weekly attendance report: ${input.attendanceRecords.length} total records analyzed.`
    };
  }
  
  try {
    const { generateWeeklyReport } = await import('@/ai/flows/weekly-attendance-report');
    return await generateWeeklyReport(input);
  } catch (error) {
    console.warn('AI service unavailable, using fallback:', error);
    return {
      report: `Weekly attendance report: ${input.attendanceRecords.length} total records analyzed.`
    };
  }
}