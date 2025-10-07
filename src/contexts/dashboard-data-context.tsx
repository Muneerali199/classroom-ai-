'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface AttendanceRecord {
  id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  student_id?: string;
  class_id?: string;
  subject?: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  due_date: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
  subject: string;
  created_at: string;
}

interface Grade {
  id: string;
  subject: string;
  assignment_title: string;
  score: number;
  max_score: number;
  date: string;
  feedback?: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  class_id: string;
  enrollment_date: string;
}

interface DashboardData {
  // User info
  user: any;
  userRole: 'teacher' | 'student' | 'dean';
  
  // Attendance data
  attendanceRecords: AttendanceRecord[];
  attendanceStats: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateCount: number;
    attendanceRate: number;
  };
  
  // Assignment data
  assignments: Assignment[];
  assignmentStats: {
    totalAssignments: number;
    completedAssignments: number;
    pendingAssignments: number;
    averageGrade: number;
  };
  
  // Grade data
  grades: Grade[];
  gradeStats: {
    overallGPA: number;
    subjectAverages: { [subject: string]: number };
    recentGrades: Grade[];
  };
  
  // Class/Student data (for teachers)
  students?: Student[];
  classStats?: {
    totalStudents: number;
    averageAttendance: number;
    averageGrade: number;
  };
  
  // Current date and academic info
  currentDate: string;
  academicYear: string;
  currentSemester: string;
}

interface DashboardDataContextType {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  updateAttendance: (records: AttendanceRecord[]) => void;
  updateAssignments: (assignments: Assignment[]) => void;
}

const DashboardDataContext = createContext<DashboardDataContextType | undefined>(undefined);

export function DashboardDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all dashboard data in parallel with error handling for each
      const fetchWithFallback = async (url: string) => {
        try {
          const res = await fetch(url);
          if (res.ok) {
            return await res.json();
          }
          return [];
        } catch (err) {
          console.warn(`Failed to fetch ${url}:`, err);
          return [];
        }
      };

      const [attendanceData, assignmentsData, gradesData, studentsData] = await Promise.all([
        fetchWithFallback('/api/attendance'),
        fetchWithFallback('/api/assignments'),
        fetchWithFallback('/api/grades'),
        user.user_metadata?.role === 'teacher' ? fetchWithFallback('/api/students') : Promise.resolve([])
      ]);

      // Calculate attendance stats
      const attendanceStats = calculateAttendanceStats(attendanceData);
      
      // Calculate assignment stats
      const assignmentStats = calculateAssignmentStats(assignmentsData);
      
      // Calculate grade stats
      const gradeStats = calculateGradeStats(gradesData);
      
      // Calculate class stats (for teachers)
      const classStats = user.user_metadata?.role === 'teacher' 
        ? calculateClassStats(studentsData, attendanceData, gradesData)
        : undefined;

      const dashboardData: DashboardData = {
        user,
        userRole: (user.user_metadata?.role as 'teacher' | 'student' | 'dean') || 'student',
        attendanceRecords: attendanceData,
        attendanceStats,
        assignments: assignmentsData,
        assignmentStats,
        grades: gradesData,
        gradeStats,
        students: studentsData,
        classStats,
        currentDate: new Date().toISOString().split('T')[0],
        academicYear: getCurrentAcademicYear(),
        currentSemester: getCurrentSemester()
      };

      setData(dashboardData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const updateAttendance = (records: AttendanceRecord[]) => {
    if (!data) return;
    
    const updatedData = {
      ...data,
      attendanceRecords: records,
      attendanceStats: calculateAttendanceStats(records)
    };
    setData(updatedData);
  };

  const updateAssignments = (assignments: Assignment[]) => {
    if (!data) return;
    
    const updatedData = {
      ...data,
      assignments,
      assignmentStats: calculateAssignmentStats(assignments)
    };
    setData(updatedData);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  return (
    <DashboardDataContext.Provider value={{
      data,
      loading,
      error,
      refreshData: fetchDashboardData,
      updateAttendance,
      updateAssignments
    }}>
      {children}
    </DashboardDataContext.Provider>
  );
}

export function useDashboardData() {
  const context = useContext(DashboardDataContext);
  if (context === undefined) {
    throw new Error('useDashboardData must be used within a DashboardDataProvider');
  }
  return context;
}

// Helper functions
function calculateAttendanceStats(records: AttendanceRecord[]) {
  const totalDays = records.length;
  const presentDays = records.filter(r => r.status === 'present').length;
  const absentDays = records.filter(r => r.status === 'absent').length;
  const lateCount = records.filter(r => r.status === 'late').length;
  const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

  return {
    totalDays,
    presentDays,
    absentDays,
    lateCount,
    attendanceRate: Math.round(attendanceRate * 100) / 100
  };
}

function calculateAssignmentStats(assignments: Assignment[]) {
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.status === 'submitted' || a.status === 'graded').length;
  const pendingAssignments = assignments.filter(a => a.status === 'pending').length;
  
  const gradedAssignments = assignments.filter(a => a.status === 'graded' && a.grade !== undefined);
  const averageGrade = gradedAssignments.length > 0 
    ? gradedAssignments.reduce((sum, a) => sum + (a.grade || 0), 0) / gradedAssignments.length
    : 0;

  return {
    totalAssignments,
    completedAssignments,
    pendingAssignments,
    averageGrade: Math.round(averageGrade * 100) / 100
  };
}

function calculateGradeStats(grades: Grade[]) {
  const overallGPA = grades.length > 0 
    ? grades.reduce((sum, g) => sum + (g.score / g.max_score * 4), 0) / grades.length
    : 0;

  const subjectAverages: { [subject: string]: number } = {};
  const subjectGroups = grades.reduce((acc, grade) => {
    if (!acc[grade.subject]) acc[grade.subject] = [];
    acc[grade.subject].push(grade);
    return acc;
  }, {} as { [subject: string]: Grade[] });

  Object.keys(subjectGroups).forEach(subject => {
    const subjectGrades = subjectGroups[subject];
    const average = subjectGrades.reduce((sum, g) => sum + (g.score / g.max_score * 100), 0) / subjectGrades.length;
    subjectAverages[subject] = Math.round(average * 100) / 100;
  });

  const recentGrades = grades
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return {
    overallGPA: Math.round(overallGPA * 100) / 100,
    subjectAverages,
    recentGrades
  };
}

function calculateClassStats(students: Student[], attendance: AttendanceRecord[], grades: Grade[]) {
  const totalStudents = students.length;
  
  const averageAttendance = attendance.length > 0 
    ? (attendance.filter(a => a.status === 'present').length / attendance.length) * 100
    : 0;
  
  const averageGrade = grades.length > 0 
    ? grades.reduce((sum, g) => sum + (g.score / g.max_score * 100), 0) / grades.length
    : 0;

  return {
    totalStudents,
    averageAttendance: Math.round(averageAttendance * 100) / 100,
    averageGrade: Math.round(averageGrade * 100) / 100
  };
}

function getCurrentAcademicYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  // Academic year typically starts in August/September
  if (month >= 7) { // August onwards
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
}

function getCurrentSemester(): string {
  const now = new Date();
  const month = now.getMonth();
  
  // Rough semester calculation
  if (month >= 7 && month <= 11) { // Aug-Dec
    return 'Fall';
  } else if (month >= 0 && month <= 4) { // Jan-May
    return 'Spring';
  } else { // May-July
    return 'Summer';
  }
}
