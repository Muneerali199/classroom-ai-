import { getSupabase } from './supabase'
import type { Teacher, AttendanceStatus } from './types'

export interface TeacherResponse {
  success: boolean
  error?: string
  teacher?: Teacher
}

export class TeacherService {
  static async getTeachers(): Promise<Teacher[]> {
    try {
      const supabase = getSupabase()

      // Get teachers from database
      const { data: teachersData, error: teachersError } = await supabase
        .from('teachers')
        .select('*')

      if (teachersError) {
        throw new Error(`Failed to fetch teachers: ${teachersError.message}`)
      }

      // Get teacher attendance records
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('teacher_attendance')
        .select('*')

      if (attendanceError) {
      }

      // Group attendance by teacher_id
      const attendanceMap = new Map<string, { date: string; status: AttendanceStatus }[]>()
      attendanceData?.forEach((record: { teacher_id: string; date: string; status: string }) => {
        if (!attendanceMap.has(record.teacher_id)) {
          attendanceMap.set(record.teacher_id, [])
        }
        attendanceMap.get(record.teacher_id)!.push({
          date: record.date,
          status: record.status as AttendanceStatus,
        })
      })

      return teachersData?.map((teacher: { id: string; name: string; email?: string; teacher_id?: string; subject?: string; department?: string; phone_number?: string; address?: string; date_of_birth?: string; hire_date?: string; employment_status?: string; emergency_contact_name?: string; emergency_contact_phone?: string; qualifications?: string; notes?: string; photo_url?: string; created_at?: string; updated_at?: string; created_by?: string; auth_user_id?: string }) => ({
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        teacher_id: teacher.teacher_id,
        department: teacher.department,
        subject: teacher.subject,
        phone_number: teacher.phone_number,
        address: teacher.address,
        date_of_birth: teacher.date_of_birth,
        hire_date: teacher.hire_date,
        employment_status: teacher.employment_status as 'Full-time' | 'Part-time' | 'Contract' | 'Substitute' | undefined,
        emergency_contact_name: teacher.emergency_contact_name,
        emergency_contact_phone: teacher.emergency_contact_phone,
        qualifications: teacher.qualifications,
        notes: teacher.notes,
        photo_url: teacher.photo_url,
        created_at: teacher.created_at,
        updated_at: teacher.updated_at,
        created_by: teacher.created_by,
        auth_user_id: teacher.auth_user_id,
        attendance: attendanceMap.get(teacher.id) || [],
      })) || []
      
    } catch {
      return [];
    }
  }

  static async updateTeacher(teacherId: string, updates: Partial<Teacher>): Promise<TeacherResponse> {
    try {
      const supabase = getSupabase()
      
      // Get current user to verify permissions
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !currentUser) {
        return { success: false, error: 'Must be logged in to update teachers' }
      }

      // Verify current user has dean role
      const userRole = currentUser.user_metadata?.role
      if (userRole !== 'dean') {
        return { success: false, error: 'Only deans can update teacher profiles' }
      }

      // Remove attendance from updates as it's handled separately
      const { ...teacherUpdates } = updates

      // Update the teacher record
      const { error: updateError } = await supabase
        .from('teachers')
        .update({
          ...teacherUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('id', teacherId)

      if (updateError) {
        return { success: false, error: `Failed to update teacher: ${updateError.message}` }
      }

      return { success: true }
    } catch (error: unknown) {
      return { success: false, error: (error as Error).message || 'An unexpected error occurred' }
    }
  }

  static async deleteTeacher(teacherId: string): Promise<TeacherResponse> {
    try {
      const supabase = getSupabase()
      
      // Get current user to verify permissions
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !currentUser) {
        return { success: false, error: 'Must be logged in to delete teachers' }
      }

      // Verify current user has dean role
      const userRole = currentUser.user_metadata?.role
      if (userRole !== 'dean') {
        return { success: false, error: 'Only deans can delete teachers' }
      }

      // Delete the teacher from the teachers table
      const { error: teacherError } = await supabase
        .from('teachers')
        .delete()
        .eq('id', teacherId)

      if (teacherError) {
        return { success: false, error: `Failed to delete teacher: ${teacherError.message}` }
      }

      return { success: true }
    } catch (error: unknown) {
      return { success: false, error: (error as Error).message || 'An unexpected error occurred' }
    }
  }

  static async resetTeacherPassword(teacherId: string, newPassword: string): Promise<TeacherResponse> {
    try {
      const supabase = getSupabase()
      
      // Get current user to verify permissions
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !currentUser) {
        return { success: false, error: 'Must be logged in to reset teacher passwords' }
      }

      // Verify current user has dean role
      const userRole = currentUser.user_metadata?.role
      if (userRole !== 'dean') {
        return { success: false, error: 'Only deans can reset teacher passwords' }
      }

      // Get the teacher's auth_user_id from the teachers table
      const { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .select('auth_user_id, email, name')
        .eq('id', teacherId)
        .single()

      if (teacherError || !teacherData) {
        return { success: false, error: 'Teacher not found' }
      }

      if (!teacherData.auth_user_id) {
        return { success: false, error: 'Teacher account not properly linked. Please contact administrator.' }
      }

      // Use database function to reset password
      const { data: result, error } = await supabase.rpc('reset_teacher_password', {
        teacher_auth_id: teacherData.auth_user_id,
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

  static async markTeacherAttendance(teacherId: string, date: string, status: string, notes?: string): Promise<TeacherResponse> {
    try {
      const supabase = getSupabase()
      
      // Get current user to verify permissions
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !currentUser) {
        return { success: false, error: 'Must be logged in to mark teacher attendance' }
      }

      // Verify current user has dean role
      const userRole = currentUser.user_metadata?.role
      if (userRole !== 'dean') {
        return { success: false, error: 'Only deans can mark teacher attendance' }
      }

      // Insert or update teacher attendance
      const { error: attendanceError } = await supabase
        .from('teacher_attendance')
        .upsert({
          teacher_id: teacherId,
          date: date,
          status: status as 'Present' | 'Absent' | 'Late' | 'Excused' | 'Sick Leave' | 'Personal Leave',
          notes: notes,
          recorded_by: currentUser.id,
          recorded_at: new Date().toISOString()
        })

      if (attendanceError) {
        return { success: false, error: `Failed to mark attendance: ${attendanceError.message}` }
      }

      return { success: true }
    } catch (error: unknown) {
      return { success: false, error: (error as Error).message || 'An unexpected error occurred' }
    }
  }
}