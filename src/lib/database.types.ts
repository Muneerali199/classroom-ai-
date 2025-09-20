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
      teachers: {
        Row: {
          id: string
          name: string
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
          photo_url?: string
          auth_user_id?: string
          created_at?: string
          updated_at?: string
          created_by?: string
        }
        Insert: {
          id: string
          name: string
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
          photo_url?: string
          auth_user_id?: string
          created_at?: string
          updated_at?: string
          created_by?: string
        }
        Update: {
          id?: string
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
          photo_url?: string
          auth_user_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      teacher_attendance: {
        Row: {
          id: number
          teacher_id: string
          date: string
          status: 'Present' | 'Absent' | 'Late' | 'Excused' | 'Sick Leave' | 'Personal Leave'
          notes?: string
          recorded_by?: string
          recorded_at?: string
        }
        Insert: {
          id?: number
          teacher_id: string
          date: string
          status: 'Present' | 'Absent' | 'Late' | 'Excused' | 'Sick Leave' | 'Personal Leave'
          notes?: string
          recorded_by?: string
          recorded_at?: string
        }
        Update: {
          id?: number
          teacher_id?: string
          date?: string
          status?: 'Present' | 'Absent' | 'Late' | 'Excused' | 'Sick Leave' | 'Personal Leave'
          notes?: string
          recorded_by?: string
          recorded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_attendance_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          }
        ]
      }
      students: {
        Row: {
          id: string
          name: string
          email?: string
          student_id?: string
          grade?: string
          date_of_birth?: string
          phone_number?: string
          address?: string
          emergency_contact_name?: string
          emergency_contact_phone?: string
          blood_type?: string
          medical_notes?: string
          photo_url?: string
          created_at?: string
          updated_at?: string
          created_by?: string
          auth_user_id?: string
        }
        Insert: {
          id: string
          name: string
          email?: string
          student_id?: string
          grade?: string
          date_of_birth?: string
          phone_number?: string
          address?: string
          emergency_contact_name?: string
          emergency_contact_phone?: string
          blood_type?: string
          medical_notes?: string
          photo_url?: string
          created_at?: string
          updated_at?: string
          created_by?: string
          auth_user_id?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          student_id?: string
          grade?: string
          date_of_birth?: string
          phone_number?: string
          address?: string
          emergency_contact_name?: string
          emergency_contact_phone?: string
          blood_type?: string
          medical_notes?: string
          photo_url?: string
          updated_at?: string
          auth_user_id?: string
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
      ,
      pin_attendance_sessions: {
        Row: {
          id: string
          course_name: string
          teacher_id: string
          teacher_name: string
          pin: string
          location?: string
          start_time: string
          end_time?: string
          is_active: boolean
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id: string
          course_name: string
          teacher_id: string
          teacher_name: string
          pin: string
          location?: string
          start_time?: string
          end_time?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_name?: string
          teacher_id?: string
          teacher_name?: string
          pin?: string
          location?: string
          start_time?: string
          end_time?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      ,
      pin_attendance_records: {
        Row: {
          id: string
          session_id: string
          student_id: string
          student_name: string
          student_email?: string
          marked_at: string
        }
        Insert: {
          id: string
          session_id: string
          student_id: string
          student_name: string
          student_email?: string
          marked_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          student_id?: string
          student_name?: string
          student_email?: string
          marked_at?: string
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
      subjects: {
        Row: {
          id: number
          name: string
          code?: string
          description?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          code?: string
          description?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          code?: string
          description?: string
          updated_at?: string
        }
        Relationships: []
      }
      rooms: {
        Row: {
          id: number
          room_number: string
          capacity?: number
          building?: string
          floor?: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          room_number: string
          capacity?: number
          building?: string
          floor?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          room_number?: string
          capacity?: number
          building?: string
          floor?: number
          updated_at?: string
        }
        Relationships: []
      }
      subject_students: {
        Row: {
          id: number
          subject_id: number
          student_id: string
          created_at: string
        }
        Insert: {
          id?: number
          subject_id: number
          student_id: string
          created_at?: string
        }
        Update: {
          id?: number
          subject_id?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subject_students_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subject_students_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          }
        ]
      }
      room_students: {
        Row: {
          id: number
          room_id: number
          student_id: string
          created_at: string
        }
        Insert: {
          id?: number
          room_id: number
          student_id: string
          created_at?: string
        }
        Update: {
          id?: number
          room_id?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_students_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_students_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          }
        ]
      }
      teacher_subjects: {
        Row: {
          id: number
          teacher_id: string
          subject_id: number
          created_at: string
        }
        Insert: {
          id?: number
          teacher_id: string
          subject_id: number
          created_at?: string
        }
        Update: {
          id?: number
          teacher_id?: string
          subject_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "teacher_subjects_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_subjects_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          }
        ]
      }
      teacher_rooms: {
        Row: {
          id: number
          teacher_id: string
          room_id: number
          created_at: string
        }
        Insert: {
          id?: number
          teacher_id: string
          room_id: number
          created_at?: string
        }
        Update: {
          id?: number
          teacher_id?: string
          room_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "teacher_rooms_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_rooms_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_user_account: {
        Args: {
          user_email: string
          user_password: string
          user_display_name: string
          user_role: string
          creator_id: string
        }
        Returns: Json
      }
      ,
      delete_student_account: {
        Args: {
          student_id: string
          deleter_teacher_id: string
        }
        Returns: Json
      }
      reset_student_password: {
        Args: {
          student_auth_id: string
          new_password: string
        }
        Returns: Json
      }
      reset_teacher_password: {
        Args: {
          teacher_auth_id: string
          new_password: string
        }
        Returns: Json
      }
      ,
      create_student_account: {
        Args: {
          student_email: string
          student_password: string
          student_name: string
          student_id_code: string
          grade_level: string
          creator_teacher_id: string
          additional_data?: Json
        }
        Returns: Json
      }
      ,
      update_student_account: {
        Args: {
          student_id: string
          updater_teacher_id: string
          student_data: Json
        }
        Returns: Json
      }
      ,
      block_student_account: {
        Args: {
          student_id: string
          teacher_id: string
          is_blocked: boolean
        }
        Returns: Json
      }
      ,
      assign_student_to_subject: {
        Args: {
          student_id: string
          subject_id: number
          teacher_id: string
        }
        Returns: Json
      }
      ,
      assign_room_to_subject: {
        Args: {
          room_id: number
          subject_id: number
          teacher_id: string
        }
        Returns: Json
      }
      ,
      start_pin_session: {
        Args: {
          course_name: string
          teacher_id: string
          teacher_name: string
          location?: string
        }
        Returns: Json
      }
      ,
      mark_attendance_with_pin: {
        Args: {
          pin_code: string
          student_id: string
          student_name: string
          student_email?: string
        }
        Returns: Json
      }
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
export type Subject = Database['public']['Tables']['subjects']['Row']
export type Room = Database['public']['Tables']['rooms']['Row']
export type SubjectStudent = Database['public']['Tables']['subject_students']['Row']
export type RoomStudent = Database['public']['Tables']['room_students']['Row']
export type TeacherSubject = Database['public']['Tables']['teacher_subjects']['Row']
export type TeacherRoom = Database['public']['Tables']['teacher_rooms']['Row']

export type StudentInsert = Database['public']['Tables']['students']['Insert']
export type AttendanceInsert = Database['public']['Tables']['attendance']['Insert']
export type AttendanceSessionInsert = Database['public']['Tables']['attendance_sessions']['Insert']
export type SessionAttendanceInsert = Database['public']['Tables']['session_attendance_records']['Insert']
export type SubjectInsert = Database['public']['Tables']['subjects']['Insert']
export type RoomInsert = Database['public']['Tables']['rooms']['Insert']
export type SubjectStudentInsert = Database['public']['Tables']['subject_students']['Insert']
export type RoomStudentInsert = Database['public']['Tables']['room_students']['Insert']
export type TeacherSubjectInsert = Database['public']['Tables']['teacher_subjects']['Insert']
export type TeacherRoomInsert = Database['public']['Tables']['teacher_rooms']['Insert']