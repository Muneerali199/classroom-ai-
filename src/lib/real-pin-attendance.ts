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
      
      // Call the database function to start a session
      const { data, error } = await supabase.rpc('start_pin_session', {
        course_name: courseName,
        teacher_id: user.id,
        teacher_name: teacherName,
        location: location
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if ((data as any)?.success) {
        return { 
          success: true, 
          pin: (data as any).pin,
          session: {
            id: (data as any).session_id,
            course_name: courseName,
            teacher_id: user.id,
            teacher_name: teacherName,
            pin: (data as any).pin,
            location,
            start_time: new Date().toISOString(),
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
        .from('pin_attendance_sessions')
        .update({ 
          is_active: false, 
          end_time: new Date().toISOString(),
          updated_at: new Date().toISOString()
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
        .from('pin_attendance_sessions')
        .update({ 
          pin: newPin,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .eq('is_active', true);

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
      
      // Call the database function to mark attendance
      const { data, error } = await supabase.rpc('mark_attendance_with_pin', {
        pin_code: pin,
        student_id: user.id,
        student_name: studentName,
        student_email: user.email
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if ((data as any)?.success) {
        return { success: true, message: (data as any).message };
      }

      return { success: false, error: (data as any)?.error || 'Failed to mark attendance' };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  static async getActiveSession(teacherId: string): Promise<{ success: boolean; session?: PinSession; error?: string }> {
    try {
      const supabase = getSupabase();
      
      const { data, error } = await supabase
        .from('pin_attendance_sessions')
        .select(`
          *,
          attendee_count:pin_attendance_records(count)
        `)
        .eq('teacher_id', teacherId)
        .eq('is_active', true)
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
          ...(data as any),
          attendee_count: (data as any).attendee_count?.[0]?.count || 0
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
        .from('pin_attendance_sessions')
        .select(`
          *,
          attendee_count:pin_attendance_records(count)
        `)
        .eq('teacher_id', teacherId)
        .eq('is_active', false)
        .order('start_time', { ascending: false })
        .limit(10);

      if (error) {
        return { success: false, error: error.message };
      }

      const sessions = data?.map(session => ({
        ...(session as any),
        attendee_count: (session as any).attendee_count?.[0]?.count || 0
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
        .from('pin_attendance_records')
        .select('*')
        .eq('session_id', sessionId)
        .order('marked_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, attendees: data || [] };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }
}