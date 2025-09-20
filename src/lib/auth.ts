import { getSupabase, getSupabaseAdmin } from './supabase'
import { User } from '@supabase/supabase-js'
import type { Student } from './types'
import { logger } from './logger'

export interface CreateUserData {
  email: string
  password: string
  displayName: string
  role: 'teacher' | 'dean' | 'student'
}

export interface SignInData {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  error?: string
  user?: User
}

export class AuthService {
  static async checkEmailExists(): Promise<boolean> {
    // Note: We can't directly query auth.users table from client
    // Let the RPC function handle duplicate checking
    return false
  }
  static async createUser(data: CreateUserData): Promise<AuthResponse> {
    try {
      const supabase = getSupabase()
      
      // Get current user to pass as creator_id
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !currentUser) {
        return { success: false, error: 'Must be logged in to create users' }
      }

      // The create_user_account RPC function will handle duplicate checking

      // Call the database function to create the user
      const { data: result, error } = await supabase.rpc('create_user_account', {
        user_email: data.email.toLowerCase().trim(),
        user_password: data.password,
        user_display_name: data.displayName,
        user_role: data.role,
        creator_id: currentUser.id
      })

      if (error) {
        // Handle specific database errors
        if (error.message.includes('duplicate key value violates unique constraint')) {
          if (error.message.includes('users_email')) {
            return {
              success: false,
              error: `A user with email "${data.email}" already exists. Please use a different email address.`
            }
          }
          return {
            success: false,
            error: 'This email address is already registered. Please use a different email address.'
          }
        }
        
        if (error.message.includes('invalid email')) {
          return { success: false, error: 'Please enter a valid email address.' }
        }
        
        return { success: false, error: error.message }
      }

      if (!result) {
        return { success: false, error: 'Failed to create user account - no response from server' }
      }

      // Type cast the result since we know the RPC function returns an object with success/error properties
      const response = result as { success: boolean; error?: string }

      if (!response.success) {
        // Handle specific application errors
        if (response.error && response.error.includes('duplicate')) {
          return {
            success: false,
            error: `A user with email "${data.email}" already exists. Please use a different email address.`
          }
        }
        return { success: false, error: response.error || 'Failed to create user account' }
      }

      return { success: true }
    } catch (error: unknown) {
      // Handle unexpected errors
      if (error instanceof Error && error.message && error.message.includes('duplicate key value violates unique constraint')) {
        return {
          success: false,
          error: `A user with email "${data.email}" already exists. Please use a different email address.`
        }
      }
      
      return { success: false, error: (error as Error).message || 'An unexpected error occurred' }
    }
  }

  static async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      const supabase = getSupabase()
      
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (!authData.user) {
        return { success: false, error: 'Failed to sign in' }
      }

      return { success: true, user: authData.user }
    } catch (error: unknown) {
      return { success: false, error: (error as Error).message || 'An unexpected error occurred' }
    }
  }


  static async signOut(): Promise<AuthResponse> {
    try {
      const supabase = getSupabase()
      
      const { error } = await supabase.auth.signOut()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error: unknown) {
      return { success: false, error: (error as Error).message || 'An unexpected error occurred' }
    }
  }

  static async getCurrentUser() {
    try {
      const supabase = getSupabase()
      
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error) {
        throw error
      }

      return user
    } catch (error: unknown) {
      logger.error('Error getting current user:', error);
      return null
    }
  }

  static async updateProfile(updates: {
    displayName?: string
    role?: string
    [key: string]: unknown
  }): Promise<AuthResponse> {
    try {
      const supabase = getSupabase()
      
      const { data, error } = await supabase.auth.updateUser({
        data: {
          ...updates,
          full_name: updates.displayName || updates.full_name,
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, user: data.user }
    } catch (error: unknown) {
      return { success: false, error: (error as Error).message || 'An unexpected error occurred' }
    }
  }

  static async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const supabase = getSupabase()
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error: unknown) {
      return { success: false, error: (error as Error).message || 'An unexpected error occurred' }
    }
  }

  static async changePassword(newPassword: string): Promise<AuthResponse> {
    try {
      const supabase = getSupabase()
      
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, user: data.user }
    } catch (error: unknown) {
      return { success: false, error: (error as Error).message || 'An unexpected error occurred' }
    }
  }

  static async deleteStudent(studentId: string): Promise<AuthResponse> {
    try {
      const supabase = getSupabase()
      
      // Get current user to verify permissions
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !currentUser) {
        return { success: false, error: 'Must be logged in to delete students' }
      }

      // Verify current user has teacher or dean role
      const userRole = currentUser.user_metadata?.role
      if (userRole !== 'teacher' && userRole !== 'dean') {
        return { success: false, error: 'Only teachers and deans can delete students' }
      }

      // Try using the database function first
      try {
        const { data: result, error } = await supabase.rpc('delete_student_account', {
          student_id: studentId,
          deleter_teacher_id: currentUser.id
        })

        if (!error && result) {
          const response = result as { success: boolean; error?: string }
          if (response.success) {
            return { success: true }
          }
        }
      } catch (funcError: unknown) {
        logger.warn('Database function not available, using fallback method:', funcError);
      }

      // Fallback: Use admin client directly
      const supabaseAdmin = getSupabaseAdmin()
      
      // Get the student's auth_user_id before deletion
      const { data: studentData, error: studentFetchError } = await supabaseAdmin
        .from('students')
        .select('auth_user_id')
        .eq('id', studentId)
        .single()

      if (studentFetchError) {
        return { success: false, error: `Student not found: ${studentFetchError.message}` }
      }

      // Delete the student record using admin client (this will cascade to attendance records)
      const { error: studentError } = await supabaseAdmin
        .from('students')
        .delete()
        .eq('id', studentId)

      if (studentError) {
        return { success: false, error: `Failed to delete student: ${studentError.message}` }
      }

      // Also delete the auth user if linked
      if (studentData.auth_user_id) {
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
          studentData.auth_user_id
        )
        
        if (authError) {
          // console.warn('Failed to delete auth user:', authError.message)
          // Don't fail the operation if auth deletion fails
        }
      }

      return { success: true }
    } catch (error: unknown) {
      return { success: false, error: (error as Error).message || 'An unexpected error occurred' }
    }
  }

  static async updateStudent(studentId: string, updates: Partial<Student>): Promise<AuthResponse> {
    try {
      const supabase = getSupabase()
      
      // Get current user to verify permissions
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !currentUser) {
        return { success: false, error: 'Must be logged in to update students' }
      }

      // Remove attendance from updates as it's handled separately
      const { ...studentUpdates } = updates

      // Update the student record
      const { error: updateError } = await supabase
        .from('students')
        .update({
          ...studentUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('id', studentId)

      if (updateError) {
        return { success: false, error: `Failed to update student: ${updateError.message}` }
      }

      return { success: true }
    } catch (error: unknown) {
      return { success: false, error: (error as Error).message || 'An unexpected error occurred' }
    }
  }

  static async resetStudentPassword(studentId: string, newPassword: string): Promise<AuthResponse> {
    try {
      const supabase = getSupabase()
      
      // Get current user to verify permissions
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !currentUser) {
        return { success: false, error: 'Must be logged in to reset student passwords' }
      }

      // Verify current user has teacher or dean role
      const userRole = currentUser.user_metadata?.role
      if (userRole !== 'teacher' && userRole !== 'dean') {
        return { success: false, error: 'Only teachers and deans can reset student passwords' }
      }

      // Get the student's auth_user_id from the students table
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('auth_user_id, email, name')
        .eq('id', studentId)
        .single()

      if (studentError || !studentData) {
        return { success: false, error: 'Student not found' }
      }

      if (!studentData.auth_user_id) {
        return { success: false, error: 'Student account not properly linked. Please contact administrator.' }
      }

      // For now, we'll use a database function approach since we need admin privileges
      // This will require the function to be created in the database
      const { data: result, error } = await supabase.rpc('reset_student_password', {
        student_auth_id: studentData.auth_user_id,
        new_password: newPassword
      })

      if (error) {
        return { success: false, error: `Failed to reset password: ${error.message}` }
      }

      if (!result) {
        return { success: false, error: 'Failed to reset password - no response from server' }
      }

      // Type cast the result since we know the RPC function returns an object with success/error properties
      const response = result as { success: boolean; error?: string }

      if (!response.success) {
        return { success: false, error: response.error || 'Failed to reset password' }
      }

      return { success: true }
    } catch (error: unknown) {
      return { success: false, error: (error as Error).message || 'An unexpected error occurred' }
    }
  }

  static async getStudentAuthId(): Promise<{ success: boolean; userId?: string; error?: string }> {
    try {
      const supabase = getSupabase()
      
      // Get current user to verify permissions
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !currentUser) {
        return { success: false, error: 'Must be logged in to access student information' }
      }

      // For now, we'll use a simpler approach - require the student's auth ID to be stored
      // This would need to be enhanced to properly link students table with auth.users
      return { success: false, error: 'Student auth ID lookup not yet implemented' }
    } catch (error: unknown) {
      return { success: false, error: (error as Error).message || 'An unexpected error occurred' }
    }
  }
}