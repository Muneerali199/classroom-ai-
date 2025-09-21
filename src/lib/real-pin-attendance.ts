import { getSupabase } from './supabase';
import { AuthService } from './auth';

export interface PinSession {
  id: string;
  course_name: string;
  teacher_id: string;
  teacher_name: string;
  pin: string;
  location?: string;
  start_time: string;
  end_time?: string;
  is_active: boolean;
  attendee_count?: number;
}

export interface AttendanceRecord {
  id: string;
  session_id: string;
  student_id: string;
  student_name: string;
  student_email?: string;
  marked_at: string;
}

export class RealPinAttendanceService {
  static async startSession(courseName: string, location?: string): Promise<{ success: boolean; session?: PinSession; pin?: string; error?: string }> {
    try {
      const supabase = getSupabase();
      const user = await AuthService.getCurrentUser();
      
      if (!user) {
        return { success: false, error: 'Must be logged in to start sessions' };
      }

      const teacherName = user.user_metadata?.displayName || user.email?.split('@')[0] || 'Teacher';
      
      // Generate a 6-digit PIN and unique ID
      const pin = Math.floor(100000 + Math.random() * 900000).toString();
      const sessionId = crypto.randomUUID();
      
      // Insert session directly into attendance_sessions table
      const { data, error } = await supabase
        .from('attendance_sessions')
        .insert({
          id: sessionId,
          course_id: courseName, // Using courseName as course_id for now
          teacher_id: user.id,
          teacher_name: teacherName,
          start_time: new Date().toISOString(),
          end_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
          pin: pin
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      if (data) {
        return { 
          success: true, 
          pin: pin,
          session: {
            id: data.id,
            course_name: courseName,
            teacher_id: user.id,
            teacher_name: teacherName,
            pin: pin,
            location: location,
            start_time: data.start_time,
            is_active: true
          }
        };
      }

      return { success: false, error: 'Failed to start session' };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  static async endSession(sessionId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = getSupabase();
      
      const { error } = await supabase
        .from('attendance_sessions')
        .update({ 
          end_time: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  static async regeneratePin(sessionId: string): Promise<{ success: boolean; pin?: string; error?: string }> {
    try {
      const supabase = getSupabase();
      const newPin = Math.floor(1000 + Math.random() * 9000).toString();
      
      const { error } = await supabase
        .from('attendance_sessions')
        .update({ 
          pin: newPin
        })
        .eq('id', sessionId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, pin: newPin };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  static async markAttendance(pin: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const supabase = getSupabase();
      const user = await AuthService.getCurrentUser();
      
      if (!user) {
        return { success: false, error: 'Must be logged in to mark attendance' };
      }

      const studentName = user.user_metadata?.displayName || user.email?.split('@')[0] || 'Student';
      
      // Find the active session with the given PIN
      const { data: session, error: sessionError } = await supabase
        .from('attendance_sessions')
        .select('*')
        .eq('pin', pin)
        .single();

      if (sessionError || !session) {
        return { success: false, error: 'Invalid PIN or session not found' };
      }

      // Check if student is already marked for this session
      const { data: existingRecord, error: checkError } = await supabase
        .from('session_attendance_records')
        .select('*')
        .eq('session_id', session.id)
        .eq('student_id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        return { success: false, error: 'Failed to check existing attendance' };
      }

      if (existingRecord) {
        return { success: false, error: 'You have already marked attendance for this session' };
      }

      // Mark attendance
      const { error: insertError } = await supabase
        .from('session_attendance_records')
        .insert({
          id: crypto.randomUUID(),
          session_id: session.id,
          student_id: user.id,
          timestamp: new Date().toISOString()
        });

      if (insertError) {
        return { success: false, error: 'Failed to mark attendance' };
      }

      return { success: true, message: 'Attendance marked successfully' };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  static async getActiveSession(teacherId: string): Promise<{ success: boolean; session?: PinSession; error?: string }> {
    try {
      const supabase = getSupabase();
      
      const { data, error } = await supabase
        .from('attendance_sessions')
        .select(`
          *,
          attendee_count:session_attendance_records(count)
        `)
        .eq('teacher_id', teacherId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        return { success: false, error: error.message };
      }

      if (!data) {
        return { success: true, session: undefined };
      }

      return { 
        success: true, 
        session: {
          id: data.id,
          course_name: data.course_id, // Using course_id as course_name
          teacher_id: data.teacher_id,
          teacher_name: data.teacher_name,
          pin: data.pin || '',
          start_time: data.start_time,
          end_time: data.end_time,
          is_active: true, // Assuming active if we found it
          attendee_count: data.attendee_count?.[0]?.count || 0
        }
      };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  static async getSessionHistory(teacherId: string): Promise<{ success: boolean; sessions?: PinSession[]; error?: string }> {
    try {
      const supabase = getSupabase();
      
      const { data, error } = await supabase
        .from('attendance_sessions')
        .select(`
          *,
          attendee_count:session_attendance_records(count)
        `)
        .eq('teacher_id', teacherId)
        .order('start_time', { ascending: false })
        .limit(10);

      if (error) {
        return { success: false, error: error.message };
      }

      const sessions = data?.map(session => ({
        id: session.id,
        course_name: session.course_id, // Using course_id as course_name
        teacher_id: session.teacher_id,
        teacher_name: session.teacher_name,
        pin: session.pin || '',
        start_time: session.start_time,
        end_time: session.end_time,
        is_active: false, // History sessions are inactive
        attendee_count: session.attendee_count?.[0]?.count || 0
      })) || [];

      return { success: true, sessions };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  static async getSessionAttendees(sessionId: string): Promise<{ success: boolean; attendees?: AttendanceRecord[]; error?: string }> {
    try {
      const supabase = getSupabase();
      
      const { data, error } = await supabase
        .from('session_attendance_records')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      const attendees = data?.map(record => ({
        id: record.id,
        session_id: record.session_id,
        student_id: record.student_id,
        student_name: 'Student', // Default name since we don't have it in the record
        student_email: '', // Default email since we don't have it in the record
        marked_at: record.timestamp
      })) || [];

      return { success: true, attendees };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }
}