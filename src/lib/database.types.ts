export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      attendance: {
        Row: {
          id: number
          student_id: string
          date: string
          status: 'Present' | 'Absent' | 'Late' | 'Excused'
        }
        Insert: {
          id?: number
          student_id: string
          date: string
          status: 'Present' | 'Absent' | 'Late' | 'Excused'
        }
        Update: {
          id?: number
          student_id?: string
          date?: string
          status?: 'Present' | 'Absent' | 'Late' | 'Excused'
        }
        Relationships: [
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          }
        ]
      }
      attendance_sessions: {
        Row: {
          id: string
          course_id: string
          teacher_id: string
          teacher_name: string
          start_time: string
          end_time: string
          created_at: string
          pin?: string
        }
        Insert: {
          id: string
          course_id: string
          teacher_id: string
          teacher_name: string
          start_time: string
          end_time: string
          created_at?: string
          pin?: string
        }
        Update: {
          id?: string
          course_id?: string
          teacher_id?: string
          teacher_name?: string
          start_time?: string
          end_time?: string
          created_at?: string
          pin?: string
        }
        Relationships: []
      }
      session_attendance_records: {
        Row: {
          id: string
          session_id: string
          student_id: string
          timestamp: string
        }
        Insert: {
          id: string
          session_id: string
          student_id: string
          timestamp?: string
        }
        Update: {
          id?: string
          session_id?: string
          student_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_attendance_records_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "attendance_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_attendance_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience type exports
export type Student = Database['public']['Tables']['students']['Row']
export type AttendanceRecord = Database['public']['Tables']['attendance']['Row']
export type AttendanceSession = Database['public']['Tables']['attendance_sessions']['Row']
export type SessionAttendanceRecord = Database['public']['Tables']['session_attendance_records']['Row']

export type StudentInsert = Database['public']['Tables']['students']['Insert']
export type AttendanceInsert = Database['public']['Tables']['attendance']['Insert']
export type AttendanceSessionInsert = Database['public']['Tables']['attendance_sessions']['Insert']
export type SessionAttendanceInsert = Database['public']['Tables']['session_attendance_records']['Insert']