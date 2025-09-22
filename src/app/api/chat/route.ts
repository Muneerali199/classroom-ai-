import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, userRole, userId, locale } = body as {
      message: string;
      userRole?: 'student' | 'teacher' | 'dean';
      userId?: string;
      locale?: string;
    };

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    // Try to use Genkit AI if available
    let aiText: string | null = null;

    try {
      // Dynamic import to avoid build issues when AI isn't configured
      const mod = await import('@/ai/genkit');
      const ai = (mod as any).ai;

      if (ai && typeof ai.generate === 'function') {
        // Genkit v1 generate API
        const result = await ai.generate({
          input: `You are a helpful educational assistant for a ${userRole || 'user'}. Locale: ${locale || 'en'}.\nUser (${userId || 'anonymous'}): ${message}`,
        });
        // Try common fields for text output
        aiText = (result?.text || result?.outputText || result?.candidates?.[0]?.text || '').toString();
      } else if (ai) {
        // Fallback: try common method name
        const result = await (ai as any).text?.({ prompt: message });
        aiText = (result?.text || '').toString();
      }
    } catch (e) {
      // Swallow AI errors and fallback to a rule-based response below
      aiText = null;
    }

    // Rule-based fallback if AI is not available or failed
    if (!aiText || aiText.trim().length === 0) {
      const lower = message.toLowerCase();
      if (lower.includes('performance') || lower.includes('grade') || lower.includes('score')) {
        aiText = 'Here is a summary of your recent academic performance (AI fallback).';
      } else if (lower.includes('attendance') || lower.includes('absent') || lower.includes('present')) {
        aiText = 'Here is your attendance summary and recent streak (AI fallback).';
      } else if (lower.includes('assignment') || lower.includes('homework') || lower.includes('task')) {
        aiText = 'Here are your assignments and progress (AI fallback).';
      } else if (lower.includes('schedule') || lower.includes('timetable') || lower.includes('class')) {
        aiText = 'Here is your schedule and upcoming classes (AI fallback).';
      } else if (lower.includes('help') || lower.includes('support') || lower.includes('how')) {
        aiText = 'You can ask me about performance, attendance, assignments, or schedules (AI fallback).';
      } else {
        aiText = "I've received your message. How else can I help? (AI fallback)";
      }
    }

    return NextResponse.json({ text: aiText });
  } catch (error) {
    console.error('Chat API error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
