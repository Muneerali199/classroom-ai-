export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

export interface AttendanceRecord {
  date: string;
  status: AttendanceStatus;
}

export interface Student {
  id: string;
  name: string;
  attendance: AttendanceRecord[];
}

export interface Teacher {
  id: string;
  name: string;
  email?: string;
  course?: string;
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
