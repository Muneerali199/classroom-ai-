'use server';

/**
 * @fileOverview Generates personalized summaries of student attendance using an LLM.
 *
 * - generateAttendanceSummary - A function that generates the attendance summary.
 * - AttendanceSummaryInput - The input type for the generateAttendanceSummary function.
 * - AttendanceSummaryOutput - The return type for the generateAttendanceSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AttendanceSummaryInputSchema = z.object({
  studentName: z.string().describe('The name of the student.'),
  attendanceRecords: z.array(
    z.object({
      date: z.string().describe('The date of the attendance record.'),
      status: z
        .enum(['Present', 'Absent', 'Late', 'Excused'])
        .describe('The attendance status for the date.'),
    })
  ).describe('The list of attendance records for the student.'),
});
export type AttendanceSummaryInput = z.infer<typeof AttendanceSummaryInputSchema>;

const AttendanceSummaryOutputSchema = z.object({
  summary: z.string().describe('A personalized summary of the student\'s attendance.'),
});
export type AttendanceSummaryOutput = z.infer<typeof AttendanceSummaryOutputSchema>;

export async function generateAttendanceSummary(input: AttendanceSummaryInput): Promise<AttendanceSummaryOutput> {
  return attendanceSummaryFlow(input);
}

const attendanceSummaryPrompt = ai.definePrompt({
  name: 'attendanceSummaryPrompt',
  input: {schema: AttendanceSummaryInputSchema},
  output: {schema: AttendanceSummaryOutputSchema},
  prompt: `You are a helpful assistant that summarizes student attendance records.

  Summarize the attendance records for {{studentName}}. Be concise and identify any patterns or concerns.

  Attendance Records:
  {{#each attendanceRecords}}
  - {{date}}: {{status}}
  {{/each}}`,
});

const attendanceSummaryFlow = ai.defineFlow(
  {
    name: 'attendanceSummaryFlow',
    inputSchema: AttendanceSummaryInputSchema,
    outputSchema: AttendanceSummaryOutputSchema,
  },
  async input => {
    const {output} = await attendanceSummaryPrompt(input);
    return output!;
  }
);
