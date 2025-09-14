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
    
  } catch (error: any) {
    console.error('Error fetching students:', error);
    // Return empty array if database is not accessible to avoid mock data
    console.warn('Database not accessible, returning empty student list');
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
  } catch (error: any) {
    console.error('Error fetching attendance sessions:', error);
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
  } catch (error: any) {
    console.error('Error fetching session attendance records:', error);
    return [];
  }
}

// Fetch teachers from user metadata (since we use Supabase auth for user management)
export async function getTeachers(): Promise<Teacher[]> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not initialized');
  }

  try {
    // Get all users with teacher role from auth.users
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    // Filter users with teacher role and map to Teacher interface
    const teachers: Teacher[] = users.users
      .filter(user => user.user_metadata?.role === 'teacher')
      .map(user => ({
        id: user.id,
        name: user.user_metadata?.displayName || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown Teacher',
        email: user.email,
        subject: user.user_metadata?.course || 'General',
        attendance: [], // Initialize empty attendance array
      }));

    return teachers;
  } catch (error) {
    console.error('Error fetching teachers:', error);
    // Return fallback teachers if database fetch fails
    return [
      { id: 'teacher1', name: 'Dr. Smith', email: 'smith@school.edu', subject: 'Mathematics', attendance: [] },
      { id: 'teacher2', name: 'Prof. Johnson', email: 'johnson@school.edu', subject: 'Science', attendance: [] },
      { id: 'teacher3', name: 'Ms. Davis', email: 'davis@school.edu', subject: 'English', attendance: [] },
    ];
  }
}
