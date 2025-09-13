import { getSupabase } from './supabase'
import { AuthError, User } from '@supabase/supabase-js'

export interface SignUpData {
  email: string
  password: string
  displayName: string
  role: 'teacher' | 'admin' | 'student'
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
  static async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      const supabase = getSupabase()
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            displayName: data.displayName,
            full_name: data.displayName,
            role: data.role,
          },
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (!authData.user) {
        return { success: false, error: 'Failed to create user account' }
      }

      return { success: true, user: authData.user }
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

  static async signInWithGoogle(): Promise<AuthResponse> {
    try {
      const supabase = getSupabase()
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
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