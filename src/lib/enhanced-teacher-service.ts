import { getSupabase, getSupabaseAdmin } from './supabase'
import { Teacher } from './types'
import { logger } from './logger'

export interface CreateTeacherData {
  name: string
  email: string
  password: string
  teacher_id?: string
  department?: string
  subject?: string
  phone_number?: string
  address?: string
  date_of_birth?: string
  hire_date?: string
  employment_status?: 'Full-time' | 'Part-time' | 'Contract' | 'Substitute'
  emergency_contact_name?: string
  emergency_contact_phone?: string
  qualifications?: string
  notes?: string
}

export interface UpdateTeacherData {
  name?: string
  email?: string
  teacher_id?: string
  department?: string
  subject?: string
  phone_number?: string
  address?: string
  date_of_birth?: string
  hire_date?: string
  employment_status?: 'Full-time' | 'Part-time' | 'Contract' | 'Substitute'
  emergency_contact_name?: string
  emergency_contact_phone?: string
  qualifications?: string
  notes?: string
}

export interface TeacherStats {
  total: number
  fullTime: number
  partTime: number
  contract: number
  substitute: number
  departments: { [key: string]: number }
}

export class EnhancedTeacherService {
  static async getTeachers(): Promise<Teacher[]> {
    try {
      const supabase = getSupabase()
      
      // Get current user session for auth token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) {
        // Fallback to direct query if no session (for compatibility)
        const { data: teachers, error } = await supabase
          .from('teachers')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          logger.error('Error fetching teachers:', error)
          throw new Error(`Failed to fetch teachers: ${error.message}`)
        }

        return teachers?.map(teacher => ({
          ...teacher,
          attendance: [] // Add empty attendance array for compatibility
        })) || []
      }

      // Try to use API endpoint first
      try {
        const response = await fetch('/api/teachers', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        })

        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            return result.teachers
          }
        }
      } catch (apiError) {
        logger.error('API fetch failed, falling back to direct query:', apiError)
      }

      // Fallback to direct query
      const { data: teachers, error } = await supabase
        .from('teachers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        logger.error('Error fetching teachers:', error)
        throw new Error(`Failed to fetch teachers: ${error.message}`)
      }

      return teachers?.map(teacher => ({
        ...teacher,
        attendance: [] // Add empty attendance array for compatibility
      })) || []
    } catch (error) {
      logger.error('EnhancedTeacherService.getTeachers failed:', error)
      throw error
    }
  }

  static async getTeacher(id: string): Promise<Teacher | null> {
    try {
      const supabase = getSupabase()
      const { data: teacher, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Teacher not found
        }
        logger.error('Error fetching teacher:', error)
        throw new Error(`Failed to fetch teacher: ${error.message}`)
      }

      return {
        ...teacher,
        attendance: [] // Add empty attendance array for compatibility
      }
    } catch (error) {
      logger.error('EnhancedTeacherService.getTeacher failed:', error)
      throw error
    }
  }

  static async createTeacher(teacherData: CreateTeacherData): Promise<{ success: boolean; teacher?: Teacher; error?: string }> {
    try {
      const supabase = getSupabase()
      
      // Get current user session for auth token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) {
        return { success: false, error: 'Must be authenticated to create teacher' }
      }

      // Call the API endpoint for teacher creation
      const response = await fetch('/api/teachers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ teacherData })
      })

      const result = await response.json()
      
      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to create teacher' }
      }

      return result

    } catch (error) {
      logger.error('EnhancedTeacherService.createTeacher failed:', error)
      return { success: false, error: (error as Error).message }
    }
  }

  static async updateTeacher(id: string, updates: UpdateTeacherData): Promise<{ success: boolean; teacher?: Teacher; error?: string }> {
    try {
      const supabase = getSupabase()
      
      // Get current user session for auth token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) {
        return { success: false, error: 'Must be authenticated to update teacher' }
      }

      // Call the API endpoint for teacher update
      const response = await fetch('/api/teachers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ teacherId: id, updates })
      })

      const result = await response.json()
      
      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to update teacher' }
      }

      return result

    } catch (error) {
      logger.error('EnhancedTeacherService.updateTeacher failed:', error)
      return { success: false, error: (error as Error).message }
    }
  }

  static async deleteTeacher(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = getSupabase()
      
      // Get current user session for auth token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) {
        return { success: false, error: 'Must be authenticated to delete teacher' }
      }

      // Call the API endpoint for teacher deletion
      const response = await fetch(`/api/teachers?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      const result = await response.json()
      
      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to delete teacher' }
      }

      return result

    } catch (error) {
      logger.error('EnhancedTeacherService.deleteTeacher failed:', error)
      return { success: false, error: (error as Error).message }
    }
  }

  static async resetTeacherPassword(teacherId: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = getSupabase()
      
      // Get current user session for auth token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) {
        return { success: false, error: 'Must be authenticated to reset password' }
      }

      // Call the API endpoint for password reset
      const response = await fetch(`/api/teachers/${teacherId}/password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ newPassword })
      })

      const result = await response.json()
      
      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to reset password' }
      }

      return result

    } catch (error) {
      logger.error('EnhancedTeacherService.resetTeacherPassword failed:', error)
      return { success: false, error: (error as Error).message }
    }
  }

  static async getTeacherStats(): Promise<TeacherStats> {
    try {
      const teachers = await this.getTeachers()
      
      const stats: TeacherStats = {
        total: teachers.length,
        fullTime: teachers.filter(t => t.employment_status === 'Full-time').length,
        partTime: teachers.filter(t => t.employment_status === 'Part-time').length,
        contract: teachers.filter(t => t.employment_status === 'Contract').length,
        substitute: teachers.filter(t => t.employment_status === 'Substitute').length,
        departments: {}
      }

      // Count by department
      teachers.forEach(teacher => {
        if (teacher.department) {
          stats.departments[teacher.department] = (stats.departments[teacher.department] || 0) + 1
        }
      })

      return stats
    } catch (error) {
      logger.error('EnhancedTeacherService.getTeacherStats failed:', error)
      throw error
    }
  }

  static async searchTeachers(query: string): Promise<Teacher[]> {
    try {
      const supabase = getSupabase()
      const { data: teachers, error } = await supabase
        .from('teachers')
        .select('*')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%,teacher_id.ilike.%${query}%,department.ilike.%${query}%,subject.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) {
        logger.error('Error searching teachers:', error)
        throw new Error(`Failed to search teachers: ${error.message}`)
      }

      return teachers?.map(teacher => ({
        ...teacher,
        attendance: [] // Add empty attendance array for compatibility
      })) || []
    } catch (error) {
      logger.error('EnhancedTeacherService.searchTeachers failed:', error)
      throw error
    }
  }
}