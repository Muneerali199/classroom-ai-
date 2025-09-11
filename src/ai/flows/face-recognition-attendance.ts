'use server';
/**
 * @fileOverview An AI flow for recognizing students in a classroom photo for attendance.
 *
 * - recognizeStudentsForAttendance - A function that handles the student recognition process.
 * - RecognizeStudentsInput - The input type for the recognizeStudentsForAttendance function.
 * - RecognizeStudentsOutput - The return type for the recognizeStudentsForAttendance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const RecognizeStudentsInputSchema = z.object({
  classroomPhotoUri: z
    .string()
    .describe(
      "A photo of the classroom, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  students: z.array(z.object({
    name: z.string().describe("The student's full name."),
    photoUri: z.string().describe("A reference photo of the student, as a data URI.")
  })).describe("A list of students in the class with their reference photos.")
});
export type RecognizeStudentsInput = z.infer<typeof RecognizeStudentsInputSchema>;

const RecognizeStudentsOutputSchema = z.object({
  presentStudents: z.array(z.string()).describe('A list of names of the students identified as present in the classroom photo.'),
});
export type RecognizeStudentsOutput = z.infer<typeof RecognizeStudentsOutputSchema>;

export async function recognizeStudentsForAttendance(input: RecognizeStudentsInput): Promise<RecognizeStudentsOutput> {
  return recognizeStudentsFlow(input);
}

const recognizeStudentsPrompt = ai.definePrompt({
  name: 'recognizeStudentsPrompt',
  input: {schema: RecognizeStudentsInputSchema},
  output: {schema: RecognizeStudentsOutputSchema},
  model: googleAI.model('gemini-1.5-pro'),
  prompt: `You are an advanced AI attendance system. Your task is to meticulously identify which students are present in a classroom photograph using a two-step process.

**Step 1: Analyze the Classroom Photo**
First, carefully examine the main classroom photo. For each person you can clearly see, provide a brief, objective description of their key facial features. Do not try to identify them yet.

**Step 2: Compare and Conclude**
Now, review the list of students and their individual reference photos. For each student, perform a detailed comparison between their reference photo and the descriptions you created in Step 1.

- Be highly critical in your analysis.
- Only list a student as present if you are very confident they match one of the individuals in the classroom photo.
- If a student's face is obscured or unclear in the classroom photo, do not mark them as present.

After your analysis, return a list containing the names of only the students you can confidently identify as present. If you don't see any matching students, return an empty list.

**Classroom Photo:**
{{media url=classroomPhotoUri}}

**Student Reference Photos:**
{{#each students}}
- {{name}}: {{media url=photoUri}}
{{/each}}
`,
});

const recognizeStudentsFlow = ai.defineFlow(
  {
    name: 'recognizeStudentsFlow',
    inputSchema: RecognizeStudentsInputSchema,
    outputSchema: RecognizeStudentsOutputSchema,
  },
  async input => {
    const {output} = await recognizeStudentsPrompt(input);
    return output!;
  }
);
