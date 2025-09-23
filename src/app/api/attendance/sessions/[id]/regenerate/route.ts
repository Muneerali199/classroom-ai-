import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: sessionId } = await params;
    if (!sessionId) return NextResponse.json({ error: 'Session ID required' }, { status: 400 });

    const supabase = supabaseAdmin || getSupabase();
    
    // Generate a new 5-digit PIN (10000-99999)
    const newPin = Math.floor(10000 + Math.random() * 90000).toString();
    
    const { error } = await (supabase as any)
      .from('attendance_sessions')
      .update({ pin: newPin })
      .eq('id', sessionId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ pin: newPin });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
