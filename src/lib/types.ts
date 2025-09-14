export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

export interface AttendanceRecord {
  date: string;
  status: AttendanceStatus;
}

export interface Student {
  id: string;
  name: string;
  email?: string;
  student_id?: string;
  grade?: string;
  date_of_birth?: string;
  phone_number?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  blood_type?: string;
  medical_notes?: string;
  photo_url?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  auth_user_id?: string;
  attendance: AttendanceRecord[];
}

export interface Teacher {
  id: string;
  name: string;
  email?: string;
  teacher_id?: string;
  department?: string;
  subject?: string;
  phone_number?: string;
  address?: string;
  date_of_birth?: string;
  hire_date?: string;
  employment_status?: 'Full-time' | 'Part-time' | 'Contract' | 'Substitute';
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  qualifications?: string;
  notes?: string;
  photo_url?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  auth_user_id?: string;
  attendance: AttendanceRecord[];
}

export interface AttendanceSession {
  id: string;
  courseId: string;
  teacherId: string;
  teacherName?: string;
  startTime: string; // ISO 8601 string
  endTime: string;   // ISO 8601 string
  createdAt: string; // ISO 8601 string
}

export interface SessionAttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  timestamp: string; // ISO 8601 string
}
