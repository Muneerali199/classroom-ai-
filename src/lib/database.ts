import { getSupabase, getSupabaseAdmin, supabaseAdmin } from './supabase'
import { 
  Student, 
  AttendanceRecord, 
  AttendanceSession, 
  SessionAttendanceRecord,
  StudentInsert,
  AttendanceInsert,
  AttendanceSessionInsert,
  SessionAttendanceInsert
} from './database.types'

// Student operations
export class StudentService {
  static async getAll(): Promise<Student[]> {
    const supabase = supabaseAdmin || getSupabase()
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data || []
  }

  static async getById(id: string): Promise<Student | null> {
    const supabase = supabaseAdmin || getSupabase()
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data || null
  }

  static async create(student: StudentInsert): Promise<Student> {
    const supabase = supabaseAdmin || getSupabase()
    const { data, error } = await supabase
      .from('students')
      .insert(student)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async update(id: string, updates: Partial<StudentInsert>): Promise<Student> {
    const supabase = supabaseAdmin || getSupabase()
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async delete(id: string): Promise<void> {
    const supabase = supabaseAdmin || getSupabase()
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Attendance operations
export class AttendanceService {
  static async getByStudentId(studentId: string): Promise<AttendanceRecord[]> {
    const supabase = supabaseAdmin || getSupabase()
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async getByDate(date: string): Promise<AttendanceRecord[]> {
    const supabase = supabaseAdmin || getSupabase()
    const { data, error } = await supabase
      .from('attendance')
      .select('*, students(name)')
      .eq('date', date)
    
    if (error) throw error
    return data || []
  }

  static async markAttendance(attendance: AttendanceInsert): Promise<AttendanceRecord> {
    const supabase = supabaseAdmin || getSupabase()
    const { data, error } = await supabase
      .from('attendance')
      .upsert(attendance, { 
        onConflict: 'student_id,date',
        ignoreDuplicates: false 
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getAttendanceStats(studentId: string, startDate?: string, endDate?: string) {
    const supabase = supabaseAdmin || getSupabase()
    let query = supabase
      .from('attendance')
      .select('status')
      .eq('student_id', studentId)

    if (startDate) query = query.gte('date', startDate)
    if (endDate) query = query.lte('date', endDate)

    const { data, error } = await query
    
    if (error) throw error
    
    const stats = {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      total: data?.length || 0
    }

    data?.forEach(record => {
      switch (record.status) {
        case 'Present':
          stats.present++
          break
        case 'Absent':
          stats.absent++
          break
        case 'Late':
          stats.late++
          break
        case 'Excused':
          stats.excused++
          break
      }
    })

    return stats
  }
}

// Attendance Session operations
export class AttendanceSessionService {
  static async create(session: AttendanceSessionInsert): Promise<AttendanceSession> {
    const supabase = supabaseAdmin || getSupabase()
    const { data, error } = await supabase
      .from('attendance_sessions')
      .insert(session)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getById(id: string): Promise<AttendanceSession | null> {
    const supabase = supabaseAdmin || getSupabase()
    const { data, error } = await supabase
      .from('attendance_sessions')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data || null
  }

  static async getByTeacher(teacherId: string): Promise<AttendanceSession[]> {
    const supabase = supabaseAdmin || getSupabase()
    const { data, error } = await supabase
      .from('attendance_sessions')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async getActiveSessions(): Promise<AttendanceSession[]> {
    const supabase = supabaseAdmin || getSupabase()
    const now = new Date().toISOString()
    
    const { data, error } = await supabase
      .from('attendance_sessions')
      .select('*')
      .lte('start_time', now)
      .gte('end_time', now)
    
    if (error) throw error
    return data || []
  }

  static async recordAttendance(record: SessionAttendanceInsert): Promise<SessionAttendanceRecord> {
    const supabase = supabaseAdmin || getSupabase()
    const { data, error } = await supabase
      .from('session_attendance_records')
      .insert(record)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getSessionAttendance(sessionId: string): Promise<SessionAttendanceRecord[]> {
    const supabase = supabaseAdmin || getSupabase()
    const { data, error } = await supabase
      .from('session_attendance_records')
      .select('*, students(name)')
      .eq('session_id', sessionId)
      .order('timestamp')
    
    if (error) throw error
    return data || []
  }
}

// Utility functions
export class DatabaseUtils {
  static async testConnection(): Promise<boolean> {
    try {
      const supabase = getSupabase()
      const { error } = await supabase.from('students').select('count').limit(1)
      return !error
    } catch {
      return false
    }
  }

  static async runMigrations(): Promise<void> {
    // This would typically be handled by Supabase migrations
    // But we can check if tables exist and create them if needed
    const supabase = getSupabaseAdmin()
    
    // Check if students table exists
    const { error } = await supabase.from('students').select('count').limit(1)
    
    if (error && error.code === '42P01') {
      throw new Error('Database tables do not exist. Please run migrations in your Supabase dashboard.')
    }
  }
}