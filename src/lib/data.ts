import type { Student, AttendanceSession, SessionAttendanceRecord, Subject, Room, SubjectStudent, RoomStudent, TeacherSubject, TeacherRoom } from '@/lib/database.types';
import type { Teacher, AttendanceStatus } from '@/lib/types';
import { supabaseAdmin, getSupabase } from '@/lib/supabase';
import { logger } from './logger';

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

    return studentsData?.map((student) => ({
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
    
  } catch (error: unknown) {
    logger.error('Error fetching students:', error);
    return [];
  }
}

// Fetch attendance sessions from Supabase
export async function getAttendanceSessions(): Promise<any[]> {
  try {
    const supabase = supabaseAdmin || getSupabase();

    const { data, error } = await supabase
      .from('attendance_sessions')
      .select('*');

    if (error) {
      throw new Error(`Failed to fetch attendance sessions: ${error.message}`);
    }

    return data?.map((session) => ({
        id: session.id,
        courseId: session.course_id,
        teacherId: session.teacher_id,
        teacherName: session.teacher_name,
        startTime: session.start_time,
        endTime: session.end_time,
        createdAt: session.created_at,
        pin: session.pin,
    })) || [];
  } catch (error: unknown) {
    logger.error('Error fetching attendance sessions:', error);
    return [];
  }
}

// Fetch session attendance records from Supabase
export async function getSessionAttendanceRecords(): Promise<any[]> {
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
    logger.error('Error fetching session attendance records:', error);
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

    return teachersData?.map((teacher) => ({
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
    
  } catch (error: unknown) {
    logger.error('Error fetching teachers:', error);
    return [];
  }
}

// Fetch subjects from the subjects table
export async function getSubjects(): Promise<Subject[]> {
  try {
    const supabase = supabaseAdmin || getSupabase();

    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('name');

    if (error) {
      throw new Error(`Failed to fetch subjects: ${error.message}`);
    }

    return data?.map((subject) => ({
      id: subject.id,
      name: subject.name,
      code: subject.code,
      description: subject.description,
      created_at: subject.created_at,
      updated_at: subject.updated_at,
    })) || [];

  } catch (error: unknown) {
    logger.error('Error fetching subjects:', error);
    return [];
  }
}

// Fetch rooms from the rooms table
export async function getRooms(): Promise<Room[]> {
  try {
    const supabase = supabaseAdmin || getSupabase();

    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('room_number');

    if (error) {
      throw new Error(`Failed to fetch rooms: ${error.message}`);
    }

    return data?.map((room) => ({
      id: room.id,
      room_number: room.room_number,
      capacity: room.capacity,
      building: room.building,
      floor: room.floor,
      created_at: room.created_at,
      updated_at: room.updated_at,
    })) || [];

  } catch (error: unknown) {
    logger.error('Error fetching rooms:', error);
    return [];
  }
}

// Fetch subject enrollments with student and subject details
export async function getSubjectEnrollments(): Promise<(SubjectStudent & { subject: Subject; student: Student })[]> {
  try {
    const supabase = supabaseAdmin || getSupabase();

    const { data, error } = await supabase
      .from('subject_students')
      .select(`
        id,
        subject_id,
        student_id,
        created_at,
        subjects (
          id,
          name,
          code,
          description
        ),
        students (
          id,
          name,
          email,
          student_id
        )
      `);

    if (error) {
      throw new Error(`Failed to fetch subject enrollments: ${error.message}`);
    }

    return data?.map((enrollment) => ({
      id: enrollment.id,
      subject_id: enrollment.subject_id,
      student_id: enrollment.student_id,
      created_at: enrollment.created_at,
      subject: enrollment.subjects as Subject,
      student: enrollment.students as Student,
    })) || [];

  } catch (error: unknown) {
    logger.error('Error fetching subject enrollments:', error);
    return [];
  }
}

// Fetch room enrollments with student and room details
export async function getRoomEnrollments(): Promise<(RoomStudent & { room: Room; student: Student })[]> {
  try {
    const supabase = supabaseAdmin || getSupabase();

    const { data, error } = await supabase
      .from('room_students')
      .select(`
        id,
        room_id,
        student_id,
        created_at,
        rooms (
          id,
          room_number,
          capacity,
          building,
          floor
        ),
        students (
          id,
          name,
          email,
          student_id
        )
      `);

    if (error) {
      throw new Error(`Failed to fetch room enrollments: ${error.message}`);
    }

    return data?.map((enrollment) => ({
      id: enrollment.id,
      room_id: enrollment.room_id,
      student_id: enrollment.student_id,
      created_at: enrollment.created_at,
      room: enrollment.rooms as Room,
      student: enrollment.students as Student,
    })) || [];

  } catch (error: unknown) {
    logger.error('Error fetching room enrollments:', error);
    return [];
  }
}

// Fetch teacher subjects
export async function getTeacherSubjects(teacherId: string): Promise<(TeacherSubject & { subject: Subject })[]> {
  try {
    const supabase = supabaseAdmin || getSupabase();

    const { data, error } = await supabase
      .from('teacher_subjects')
      .select(`
        id,
        teacher_id,
        subject_id,
        created_at,
        subjects (
          id,
          name,
          code,
          description
        )
      `)
      .eq('teacher_id', teacherId);

    if (error) {
      throw new Error(`Failed to fetch teacher subjects: ${error.message}`);
    }

    return data?.map((ts) => ({
      id: ts.id,
      teacher_id: ts.teacher_id,
      subject_id: ts.subject_id,
      created_at: ts.created_at,
      subject: ts.subjects as Subject,
    })) || [];

  } catch (error: unknown) {
    logger.error('Error fetching teacher subjects:', error);
    return [];
  }
}

// Fetch teacher rooms
export async function getTeacherRooms(teacherId: string): Promise<(TeacherRoom & { room: Room })[]> {
  try {
    const supabase = supabaseAdmin || getSupabase();

    const { data, error } = await supabase
      .from('teacher_rooms')
      .select(`
        id,
        teacher_id,
        room_id,
        created_at,
        rooms (
          id,
          room_number,
          capacity,
          building,
          floor
        )
      `)
      .eq('teacher_id', teacherId);

    if (error) {
      throw new Error(`Failed to fetch teacher rooms: ${error.message}`);
    }

    return data?.map((tr) => ({
      id: tr.id,
      teacher_id: tr.teacher_id,
      room_id: tr.room_id,
      created_at: tr.created_at,
      room: tr.rooms as Room,
    })) || [];

  } catch (error: unknown) {
    logger.error('Error fetching teacher rooms:', error);
    return [];
  }
}
