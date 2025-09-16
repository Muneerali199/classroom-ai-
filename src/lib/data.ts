import type { Student, AttendanceSession, SessionAttendanceRecord, Teacher, AttendanceStatus } from '@/lib/types';
import { supabaseAdmin, getSupabase } from '@/lib/supabase';

// Commented out static data as backup
/*
export const students: Student[] = [
  {
    id: 's1',
    name: 'Michael Johnson',
    attendance: [
      { date: '2025-05-01', status: 'Present' },
      { date: '2025-05-02', status: 'Present' },
      { date: '2025-05-03', status: 'Absent' },
      { date: '2025-05-06', status: 'Present' },
      { date: '2025-05-07', status: 'Late' },
    ],
  },
  {
    id: 's2',
    name: 'Emily Davis',
    attendance: [
      { date: '2025-05-01', status: 'Present' },
      { date: '2025-05-02', status: 'Present' },
      { date: '2025-05-03', status: 'Present' },
      { date: '2025-05-06', status: 'Present' },
      { date: '2025-05-07', status: 'Present' },
    ],
  },
  {
    id: 's3',
    name: 'Christopher Miller',
    attendance: [
      { date: '2025-05-01', status: 'Late' },
      { date: '2025-05-02', status: 'Absent' },
      { date: '2025-05-03', status: 'Absent' },
      { date: '2025-05-06', status: 'Present' },
      { date: '2025-05-07', status: 'Excused' },
    ],
  },
  {
    id: 's4',
    name: 'Jessica Wilson',
    attendance: [
      { date: '2025-05-01', status: 'Present' },
      { date: '2025-05-02', status: 'Present' },
      { date: '2025-05-03', status: 'Late' },
      { date: '2025-05-06', status: 'Late' },
      { date: '2025-05-07', status: 'Late' },
    ],
  },
  {
    id: 's5',
    name: 'David Martinez',
    attendance: [
      { date: '2025-05-01', status: 'Excused' },
      { date: '2025-05-02', status: 'Present' },
      { date: '2025-05-03', status: 'Present' },
      { date: '2025-05-06', status: 'Present' },
      { date: '2025-05-07', status: 'Present' },
    ],
  },
  {
    id: 's6',
    name: 'Muneer',
    attendance: [
      { date: '2025-05-01', status: 'Present' },
      { date: '2025-05-02', status: 'Present' },
      { date: '2025-05-03', status: 'Present' },
      { date: '2025-05-06', status: 'Present' },
      { date: '2025-05-07', status: 'Present' },
    ],
  },
];

// In-memory "database" for attendance sessions
export let attendanceSessions: AttendanceSession[] = [];
export let sessionAttendanceRecords: SessionAttendanceRecord[] = [];
*/

// Fetch students with their attendance records from Supabase
export async function getStudents(): Promise<Student[]> {
  try {
    // Use admin client to bypass RLS restrictions for server-side operations
    const supabase = supabaseAdmin || getSupabase();

    const { data: studentsData, error: studentsError } = await supabase
      .from('students')
      .select('*');

    if (studentsError) {
      throw new Error(`Failed to fetch students: ${studentsError.message}`);
    }

    const { data: attendanceData, error: attendanceError } = await supabase
      .from('attendance')
      .select('*');

    if (attendanceError) {
      throw new Error(`Failed to fetch attendance: ${attendanceError.message}`);
    }

    // Group attendance by student_id
    const attendanceMap = new Map<string, { date: string; status: AttendanceStatus }[]>();
    attendanceData?.forEach((record: { student_id: string; date: string; status: string }) => {
      if (!attendanceMap.has(record.student_id)) {
        attendanceMap.set(record.student_id, []);
      }
      attendanceMap.get(record.student_id)!.push({
        date: record.date,
        status: record.status as AttendanceStatus,
      });
    });

    return studentsData?.map((student: any) => ({
      id: student.id,
      name: student.name,
      email: student.email,
      student_id: student.student_id,
      grade: student.grade,
      date_of_birth: student.date_of_birth,
      phone_number: student.phone_number,
      address: student.address,
      emergency_contact_name: student.emergency_contact_name,
      emergency_contact_phone: student.emergency_contact_phone,
      blood_type: student.blood_type,
      medical_notes: student.medical_notes,
      photo_url: student.photo_url,
      created_at: student.created_at,
      updated_at: student.updated_at,
      created_by: student.created_by,
      auth_user_id: student.auth_user_id,
      attendance: attendanceMap.get(student.id) || [],
    })) || [];
    
  } catch {
    return [];
  }
}

// Fetch attendance sessions from Supabase
export async function getAttendanceSessions(): Promise<AttendanceSession[]> {
  try {
    const supabase = supabaseAdmin || getSupabase();

    const { data, error } = await supabase
      .from('attendance_sessions')
      .select('*');

    if (error) {
      throw new Error(`Failed to fetch attendance sessions: ${error.message}`);
    }

    return data?.map((session: { id: string; course_id: string; teacher_id: string; teacher_name?: string; start_time: string; end_time: string; created_at: string }) => ({
      id: session.id,
      courseId: session.course_id,
      teacherId: session.teacher_id,
      teacherName: session.teacher_name,
      startTime: session.start_time,
      endTime: session.end_time,
      createdAt: session.created_at,
    })) || [];
  } catch (error: unknown) {
    return [];
  }
}

// Fetch session attendance records from Supabase
export async function getSessionAttendanceRecords(): Promise<SessionAttendanceRecord[]> {
  try {
    const supabase = supabaseAdmin || getSupabase();

    const { data, error } = await supabase
      .from('session_attendance_records')
      .select('*');

    if (error) {
      throw new Error(`Failed to fetch session attendance records: ${error.message}`);
    }

    return data?.map((record: { id: string; session_id: string; student_id: string; timestamp: string }) => ({
      id: record.id,
      sessionId: record.session_id,
      studentId: record.student_id,
      timestamp: record.timestamp,
    })) || [];
  } catch (error: unknown) {
    return [];
  }
}

// Fetch teachers from the teachers table
export async function getTeachers(): Promise<Teacher[]> {
  try {
    const supabase = supabaseAdmin || getSupabase();

    const { data: teachersData, error: teachersError } = await supabase
      .from('teachers')
      .select('*');

    if (teachersError) {
      throw new Error(`Failed to fetch teachers: ${teachersError.message}`);
    }

    const { data: attendanceData, error: attendanceError } = await supabase
      .from('teacher_attendance')
      .select('*');

    if (attendanceError) {
      // We can still return teachers without attendance data
    }

    const attendanceMap = new Map<string, { date: string; status: AttendanceStatus }[]>();
    attendanceData?.forEach((record: { teacher_id: string; date: string; status: string }) => {
      if (!attendanceMap.has(record.teacher_id)) {
        attendanceMap.set(record.teacher_id, []);
      }
      attendanceMap.get(record.teacher_id)!.push({
        date: record.date,
        status: record.status as AttendanceStatus,
      });
    });

    return teachersData?.map((teacher: any) => ({
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
      employment_status: teacher.employment_status,
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
    })) || [];
    
  } catch {
    return [];
  }
}
