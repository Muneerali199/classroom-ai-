'use server';

/**
 * @fileOverview Generates a weekly summary report of class attendance.
 *
 * - generateWeeklyReport - A function that generates the attendance report.
 * - WeeklyReportInput - The input type for the generateWeeklyReport function.
 * - WeeklyReportOutput - The return type for the generateWeeklyReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WeeklyReportInputSchema = z.object({
  attendanceRecords: z.array(
    z.object({
      studentName: z.string().describe("The student's name."),
      date: z.string().describe('The date of the attendance record.'),
      status: z
        .enum(['Present', 'Absent', 'Late', 'Excused'])
        .describe('The attendance status for the date.'),
    })
  ).describe('A flat list of all attendance records for all students for the week.'),
});
export type WeeklyReportInput = z.infer<typeof WeeklyReportInputSchema>;

const WeeklyReportOutputSchema = z.object({
  report: z.string().describe('A comprehensive summary of the weekly attendance, highlighting trends, students of concern, and overall class statistics.'),
});
export type WeeklyReportOutput = z.infer<typeof WeeklyReportOutputSchema>;

export async function generateWeeklyReport(input: WeeklyReportInput): Promise<WeeklyReportOutput> {
  return weeklyReportFlow(input);
}

const weeklyReportPrompt = ai.definePrompt({
  name: 'weeklyReportPrompt',
  input: {schema: WeeklyReportInputSchema},
  output: {schema: WeeklyReportOutputSchema},
  prompt: `You are an expert teaching assistant tasked with analyzing weekly attendance data and providing a clear, actionable report.

Analyze the following attendance records for the entire class. Your report should be structured and insightful.

**Instructions:**
1.  **Overall Statistics:** Start with a summary of the overall attendance rate. Calculate the percentage of 'Present' statuses out of all non-excused entries.
2.  **Identify Trends:** Look for patterns. Is there a particular day with more absences or tardies? Mention it.
3.  **Students of Concern:** Identify any students with multiple 'Absent' or 'Late' marks. List them and briefly summarize their record for the week.
4.  **Positive Callouts:** Mention any students with perfect attendance to encourage positive reinforcement.
5.  **Concise Summary:** Conclude with a brief, high-level summary of the week's attendance health.

**Format your output clearly with headings.**

**Raw Attendance Data:**
{{#each attendanceRecords}}
- {{studentName}} on {{date}}: {{status}}
{{/each}}
`,
});

const weeklyReportFlow = ai.defineFlow(
  {
    name: 'weeklyReportFlow',
    inputSchema: WeeklyReportInputSchema,
    outputSchema: WeeklyReportOutputSchema,
  },
  async input => {
    const {output} = await weeklyReportPrompt(input);
    return output!;
  }
);
