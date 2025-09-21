import { getSupabase } from './supabase';
import { AuthService } from './auth';

export interface CreateUserData {
  email: string;
  password: string;
  displayName: string;
  role: 'teacher' | 'dean' | 'student';
  additionalData?: {
    phone_number?: string;
    address?: string;
    date_of_birth?: string;
    grade_level?: string;
    department?: string;
    subject?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    medical_info?: string;
    notes?: string;
  };
}

export interface UserResponse {
  success: boolean;
  error?: string;
  user?: any;
}

export class RealUserService {
  static async createUser(data: CreateUserData): Promise<UserResponse> {
    try {
      const supabase = getSupabase();
      
      // Get current user to pass as creator_id
      const currentUser = await AuthService.getCurrentUser();
      
      if (!currentUser) {
        return { success: false, error: 'Must be logged in to create users' };
      }

      // Call the database function to create the user
      const { data: result, error } = await supabase.rpc('create_user_account', {
        user_email: data.email.toLowerCase().trim(),
        user_password: data.password,
        user_display_name: data.displayName,
        user_role: data.role,
        creator_id: currentUser.id
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!result || typeof result !== 'object' || !('success' in result) || !result.success) {
        return { success: false, error: (result as any)?.error || 'Failed to create user account' };
      }

      // If successful and we have additional data, update the record
      if (data.additionalData && (result as any).user_id) {
        await RealUserService.updateUserProfile((result as any).user_id, data.role, data.additionalData);
      }

      return { success: true, user: { id: (result as any).user_id } };
    } catch (error: unknown) {
      return { success: false, error: (error as Error).message || 'An unexpected error occurred' };
    }
  }

  static async updateUserProfile(userId: string, role: string, additionalData: any): Promise<UserResponse> {
    try {
      const supabase = getSupabase();
      
      if (role === 'student') {
        const { error } = await supabase
          .from('students')
          .update({
            ...additionalData,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (error) {
          console.warn('Failed to update student profile:', error.message);
        }
      } else if (role === 'teacher') {
        const { error } = await supabase
          .from('teachers')
          .update({
            ...additionalData,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (error) {
          console.warn('Failed to update teacher profile:', error.message);
        }
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  static async getStudents(): Promise<{ success: boolean; students?: any[]; error?: string }> {
    try {
      const supabase = getSupabase();
      
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          attendance(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, students: data || [] };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  static async getTeachers(): Promise<{ success: boolean; teachers?: any[]; error?: string }> {
    try {
      const supabase = getSupabase();
      
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, teachers: data || [] };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  static async deleteStudent(studentId: string): Promise<UserResponse> {
    try {
      const supabase = getSupabase();
      
      // Get current user to verify permissions
      const currentUser = await AuthService.getCurrentUser();
      
      if (!currentUser) {
        return { success: false, error: 'Must be logged in to delete students' };
      }

      // Verify current user has teacher or dean role
      const userRole = currentUser.user_metadata?.role;
      if (userRole !== 'teacher' && userRole !== 'dean') {
        return { success: false, error: 'Only teachers and deans can delete students' };
      }

      // Get the student's auth_user_id before deletion
      const { data: studentData, error: studentFetchError } = await supabase
        .from('students')
        .select('auth_user_id')
        .eq('id', studentId)
        .single();

      if (studentFetchError) {
        return { success: false, error: `Student not found: ${studentFetchError.message}` };
      }

      // Delete the student record (this will cascade to attendance records)
      const { error: studentError } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId);

      if (studentError) {
        return { success: false, error: `Failed to delete student: ${studentError.message}` };
      }

      // Also delete the auth user if linked
      if (studentData.auth_user_id) {
        const { error: authError } = await supabase.auth.admin.deleteUser(studentData.auth_user_id);
        
        if (authError) {
          console.warn('Failed to delete auth user:', authError.message);
          // Don't fail the operation if auth deletion fails
        }
      }

      return { success: true };
    } catch (error: unknown) {
      return { success: false, error: (error as Error).message || 'An unexpected error occurred' };
    }
  }

  static async updateStudent(studentId: string, updates: any): Promise<UserResponse> {
    try {
      const supabase = getSupabase();
      
      // Get current user to verify permissions
      const currentUser = await AuthService.getCurrentUser();
      
      if (!currentUser) {
        return { success: false, error: 'Must be logged in to update students' };
      }

      // Update the student record
      const { error: updateError } = await supabase
        .from('students')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', studentId);

      if (updateError) {
        return { success: false, error: `Failed to update student: ${updateError.message}` };
      }

      return { success: true };
    } catch (error: unknown) {
      return { success: false, error: (error as Error).message || 'An unexpected error occurred' };
    }
  }

  static async resetPassword(userId: string, newPassword: string, userType: 'student' | 'teacher'): Promise<UserResponse> {
    try {
      const supabase = getSupabase();
      
      // Get current user to verify permissions
      const currentUser = await AuthService.getCurrentUser();
      
      if (!currentUser) {
        return { success: false, error: 'Must be logged in to reset passwords' };
      }

      // Verify current user has teacher or dean role
      const userRole = currentUser.user_metadata?.role;
      if (userRole !== 'teacher' && userRole !== 'dean') {
        return { success: false, error: 'Only teachers and deans can reset passwords' };
      }

      // Get the user's auth_user_id from the appropriate table
      const tableName = userType === 'student' ? 'students' : 'teachers';
      const { data: userData, error: userError } = await supabase
        .from(tableName)
        .select('auth_user_id')
        .eq('id', userId)
        .single();

      if (userError || !userData) {
        return { success: false, error: `${userType} not found` };
      }

      if (!userData.auth_user_id) {
        return { success: false, error: `${userType} account not properly linked. Please contact administrator.` };
      }

      // Use admin client to reset password
      const { error } = await supabase.auth.admin.updateUserById(userData.auth_user_id, {
        password: newPassword
      });

      if (error) {
        return { success: false, error: `Failed to reset password: ${error.message}` };
      }

      return { success: true };
    } catch (error: unknown) {
      return { success: false, error: (error as Error).message || 'An unexpected error occurred' };
    }
  }
}