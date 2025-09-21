import { getSupabase } from './supabase';
import { AuthService } from './auth';

export interface CreateStudentData {
  email: string;
  password: string;
  name: string;
  studentId: string;
  gradeLevel: string;
  phoneNumber?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  medicalNotes?: string;
}

export interface UpdateStudentData {
  name?: string;
  email?: string;
  student_id?: string;
  grade?: string;
  phone_number?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_notes?: string;
}

export interface ServiceResponse {
  success: boolean;
  error?: string;
  data?: any;
}

export class TeacherStudentService {
  // Verify current user is a teacher
  private static async verifyTeacherAccess(): Promise<{ success: boolean; teacherId?: string; error?: string }> {
    try {
      const currentUser = await AuthService.getCurrentUser();
      
      if (!currentUser) {
        return { success: false, error: 'Must be logged in' };
      }

      const userRole = currentUser.user_metadata?.role;
      if (userRole !== 'teacher') {
        return { success: false, error: 'Only teachers can perform this action' };
      }

      // Get teacher ID from database
      const supabase = getSupabase();
      const { data: teacherData, error } = await supabase
        .from('teachers')
        .select('id')
        .eq('auth_user_id', currentUser.id)
        .single();

      if (error || !teacherData) {
        return { success: false, error: 'Teacher profile not found' };
      }

      return { success: true, teacherId: teacherData.id };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  // Create student account with email/password
  static async createStudent(data: CreateStudentData): Promise<ServiceResponse> {
    try {
      const verification = await this.verifyTeacherAccess();
      if (!verification.success) {
        return { success: false, error: verification.error };
      }

      const supabase = getSupabase();
      
      const additionalData = {
        phone_number: data.phoneNumber || '',
        address: data.address || '',
        emergency_contact_name: data.emergencyContactName || '',
        emergency_contact_phone: data.emergencyContactPhone || '',
        medical_notes: data.medicalNotes || ''
      };

      const { data: result, error } = await supabase.rpc('create_user_account', {
        user_email: data.email.toLowerCase().trim(),
        user_password: data.password,
        user_display_name: data.name,
        user_role: 'student',
        creator_id: verification.teacherId!
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!result || typeof result !== 'object' || !('success' in result) || !result.success) {
        return { success: false, error: (result as any)?.error || 'Failed to create student account' };
      }

      return { success: true, data: { studentId: (result as any).student_id } };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  // Delete student account
  static async deleteStudent(studentId: string): Promise<ServiceResponse> {
    try {
      const verification = await this.verifyTeacherAccess();
      if (!verification.success) {
        return { success: false, error: verification.error };
      }

      const supabase = getSupabase();
      
      const { data: result, error } = await supabase.rpc('delete_student_account', {
        student_id: studentId,
        deleter_id: verification.teacherId!
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!result || typeof result !== 'object' || !('success' in result) || !result.success) {
        return { success: false, error: (result as any)?.error || 'Failed to delete student account' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  // Update student account
  static async updateStudent(studentId: string, updates: UpdateStudentData): Promise<ServiceResponse> {
    try {
      const verification = await this.verifyTeacherAccess();
      if (!verification.success) {
        return { success: false, error: verification.error };
      }

      const supabase = getSupabase();
      
      // Update student record directly
      const { data: result, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', studentId)
        .select();

      if (error) {
        return { success: false, error: error.message };
      }

      if (!result || result.length === 0) {
        return { success: false, error: 'Student not found or update failed' };
      }

      return { success: true, data: result[0] };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  // Block/unblock student account - Not implemented in current database schema
  static async blockStudent(studentId: string, isBlocked: boolean): Promise<ServiceResponse> {
    return { success: false, error: 'Block/unblock functionality not implemented in current database schema' };
  }

  // Assign student to subject
  static async assignStudentToSubject(studentId: string, subjectId: number): Promise<ServiceResponse> {
    try {
      const verification = await this.verifyTeacherAccess();
      if (!verification.success) {
        return { success: false, error: verification.error };
      }

      const supabase = getSupabase();
      
      // Insert into subject_students table directly
      const { data: result, error } = await supabase
        .from('subject_students')
        .insert({
          student_id: studentId,
          subject_id: subjectId
        })
        .select();

      if (error) {
        return { success: false, error: error.message };
      }

      if (!result || result.length === 0) {
        return { success: false, error: 'Failed to assign student to subject' };
      }

      return { success: true, data: result[0] };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  // Assign room to subject
  static async assignRoomToSubject(roomId: number, subjectId: number): Promise<ServiceResponse> {
    try {
      const verification = await this.verifyTeacherAccess();
      if (!verification.success) {
        return { success: false, error: verification.error };
      }

      const supabase = getSupabase();
      
      // Insert into teacher_rooms table directly
      const { data: result, error } = await supabase
        .from('teacher_rooms')
        .insert({
          room_id: roomId,
          teacher_id: verification.teacherId!
        })
        .select();

      if (error) {
        return { success: false, error: error.message };
      }

      if (!result || result.length === 0) {
        return { success: false, error: 'Failed to assign room to teacher' };
      }

      return { success: true, data: result[0] };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  // Get all students (teacher view)
  static async getStudents(): Promise<ServiceResponse> {
    try {
      const verification = await this.verifyTeacherAccess();
      if (!verification.success) {
        return { success: false, error: verification.error };
      }

      const supabase = getSupabase();
      
      const { data: students, error } = await supabase
        .from('students')
        .select(`
          *,
          subject_students(
            subject_id,
            subjects(name, code)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: students || [] };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  // Get all subjects
  static async getSubjects(): Promise<ServiceResponse> {
    try {
      const verification = await this.verifyTeacherAccess();
      if (!verification.success) {
        return { success: false, error: verification.error };
      }

      const supabase = getSupabase();
      
      const { data: subjects, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: subjects || [] };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  // Get all rooms
  static async getRooms(): Promise<ServiceResponse> {
    try {
      const verification = await this.verifyTeacherAccess();
      if (!verification.success) {
        return { success: false, error: verification.error };
      }

      const supabase = getSupabase();
      
      const { data: rooms, error } = await supabase
        .from('rooms')
        .select('*')
        .order('room_number');

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: rooms || [] };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }
}