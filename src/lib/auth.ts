import { getSupabase } from './supabase'
import { AuthError, User } from '@supabase/supabase-js'

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
  static async createUser(data: CreateUserData): Promise<AuthResponse> {
    try {
      const supabase = getSupabase()
      
      // Get current user to pass as creator_id
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !currentUser) {
        return { success: false, error: 'Must be logged in to create users' }
      }

      // Call the database function to create the user
      const { data: result, error } = await supabase.rpc('create_user_account', {
        user_email: data.email,
        user_password: data.password,
        user_display_name: data.displayName,
        user_role: data.role,
        creator_id: currentUser.id
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (!result.success) {
        return { success: false, error: result.error || 'Failed to create user account' }
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message || 'An unexpected error occurred' }
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
    } catch (error: any) {
      return { success: false, error: error.message || 'An unexpected error occurred' }
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
    } catch (error: any) {
      return { success: false, error: error.message || 'An unexpected error occurred' }
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
    } catch (error: any) {
      console.error('Error getting current user:', error.message)
      return null
    }
  }

  static async updateProfile(updates: {
    displayName?: string
    role?: string
    [key: string]: any
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
    } catch (error: any) {
      return { success: false, error: error.message || 'An unexpected error occurred' }
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
    } catch (error: any) {
      return { success: false, error: error.message || 'An unexpected error occurred' }
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
    } catch (error: any) {
      return { success: false, error: error.message || 'An unexpected error occurred' }
    }
  }
}