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
  prompt: `You are an advanced AI attendance system. Your task is to identify which students are present in a classroom photograph.

You will be given a primary photograph of the classroom and a list of students with their individual reference photos.

Compare the faces in the classroom photograph with the reference photos provided for each student.

Return a list containing the names of only the students you can confidently identify in the classroom photograph. If you don't see any students, return an empty list.

Classroom Photo:
{{media url=classroomPhotoUri}}

Student Reference Photos:
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
