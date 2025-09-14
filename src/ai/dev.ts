// import { config } from 'dotenv';
// config();

// Only import AI flows in development mode or when explicitly needed
if (process.env.NODE_ENV === 'development' || process.env.GENKIT_ENV === 'dev') {
  import('@/ai/flows/attendance-summary-generation');
  import('@/ai/flows/face-recognition-attendance');
  import('@/ai/flows/weekly-attendance-report');
}
