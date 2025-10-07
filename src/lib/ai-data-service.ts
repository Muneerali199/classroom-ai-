import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Simple in-memory cache for user data (30 seconds TTL)
const userDataCache = new Map<string, { data: UserPerformanceData; timestamp: number }>();
const CACHE_TTL = 30000; // 30 seconds

export interface UserPerformanceData {
  // User Identity
  userId: string;
  userRole: 'student' | 'teacher' | 'dean';
  userInfo: any;
  
  // Academic Performance
  overallGPA?: number;
  gradeDistribution?: any;
  averageScore?: number;
  strongSubjects?: string[];
  weakSubjects?: string[];
  
  // Attendance Data
  attendanceRate?: number;
  totalPresent?: number;
  totalAbsent?: number;
  totalLate?: number;
  attendanceHistory?: any[];
  recentAttendance?: any[];
  
  // Assignment Performance
  totalAssignments?: number;
  submittedAssignments?: number;
  gradedAssignments?: number;
  averageAssignmentScore?: number;
  lateSubmissions?: number;
  pendingAssignments?: any[];
  recentAssignments?: any[];
  assignmentTrends?: any;
  
  // Class Schedule
  todayClasses?: any[];
  upcomingClasses?: any[];
  weeklySchedule?: any[];
  currentClass?: any;
  nextClass?: any;
  
  // Notifications & Updates
  recentNotifications?: any[];
  unreadNotifications?: number;
  
  // Social & Engagement
  classmates?: any[];
  teachers?: any[];
  recentSubmissions?: any[];
  
  // Analytics & Insights
  performanceTrend?: 'improving' | 'declining' | 'stable';
  riskLevel?: 'high' | 'medium' | 'low';
  recommendations?: string[];
  strengths?: string[];
  areasForImprovement?: string[];
  
  // Metadata
  academicYear: string;
  semester: string;
  lastUpdated: string;
}

/**
 * Fetch comprehensive user data and performance metrics (with caching)
 */
export async function fetchCompleteUserData(
  userId: string,
  userRole: 'student' | 'teacher' | 'dean'
): Promise<UserPerformanceData> {
  // Check cache first
  const cacheKey = `${userId}-${userRole}`;
  const cached = userDataCache.get(cacheKey);
  const now = Date.now();
  
  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    console.log('[AI Data] Using cached data for', userId);
    return cached.data;
  }

  const currentDate = new Date();
  const academicYear = getCurrentAcademicYear();
  const semester = getCurrentSemester();

  try {
    // Fetch user info
    const userInfo = await fetchUserInfo(userId, userRole);
    
    let userData: UserPerformanceData;
    
    if (userRole === 'student') {
      userData = await fetchStudentData(userId, academicYear, semester, currentDate, userInfo);
    } else if (userRole === 'teacher') {
      userData = await fetchTeacherData(userId, academicYear, semester, currentDate, userInfo);
    } else {
      userData = await fetchDeanData(userId, academicYear, semester, currentDate, userInfo);
    }
    
    // Cache the result
    userDataCache.set(cacheKey, { data: userData, timestamp: now });
    
    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    
    // Return minimal data structure if fetch fails
    return {
      userId,
      userRole,
      userInfo: { id: userId, name: 'User', role: userRole },
      academicYear,
      semester,
      lastUpdated: new Date().toISOString(),
      performanceTrend: 'stable',
      riskLevel: 'low'
    };
  }
}

/**
 * Fetch ONLY essential metrics for quick performance analysis (no heavy queries)
 */
export async function fetchEssentialMetrics(
  userId: string,
  userRole: 'student' | 'teacher' | 'dean'
): Promise<any> {
  if (userRole !== 'student') {
    return {
      userId,
      userRole,
      message: 'Performance analysis is primarily for students'
    };
  }

  try {
    const userInfo = await fetchUserInfo(userId, userRole);
    const studentId = userInfo.id;

    // Fetch ONLY essential data in parallel - no heavy processing
    const [attendanceData, submissionsData, gradesData] = await Promise.all([
      supabase.from('attendance').select('status').eq('student_id', studentId).limit(30),
      supabase.from('assignment_submissions').select('score, submitted_at').eq('student_id', studentId).limit(20),
      supabase.from('grades').select('score, grade').eq('student_id', studentId).limit(20)
    ]);

    // Quick calculations
    const attendance = attendanceData.data || [];
    const attendanceRate = attendance.length > 0 
      ? (attendance.filter(r => r.status === 'present').length / attendance.length * 100).toFixed(1)
      : '0';

    const submissions = submissionsData.data || [];
    const avgScore = submissions.length > 0
      ? (submissions.reduce((sum, s) => sum + (s.score || 0), 0) / submissions.length).toFixed(1)
      : '0';

    const grades = gradesData.data || [];
    const recentGrades = grades.slice(0, 5).map(g => g.score || g.grade).filter(Boolean);

    return {
      userId,
      userRole,
      name: userInfo.name || 'Student',
      attendanceRate,
      totalRecords: attendance.length,
      averageScore: avgScore,
      submissionCount: submissions.length,
      recentGrades: recentGrades.join(', ') || 'N/A',
      gradeCount: grades.length
    };
  } catch (error) {
    console.error('Error fetching essential metrics:', error);
    return {
      userId,
      userRole,
      error: 'Unable to fetch metrics'
    };
  }
}

/**
 * Fetch user profile information
 */
async function fetchUserInfo(userId: string, userRole: string) {
  const tableName = userRole === 'student' ? 'students' : 'teachers';
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('auth_user_id', userId)
    .single();

  // If no user record found, return minimal data with userId
  if (error || !data) {
    console.log(`No ${userRole} record found for auth_user_id: ${userId}, using minimal profile`);
    return {
      id: userId,
      auth_user_id: userId,
      name: 'User',
      email: '',
      role: userRole
    };
  }
  return data;
}

/**
 * Fetch comprehensive student data
 */
async function fetchStudentData(
  userId: string,
  academicYear: string,
  semester: string,
  currentDate: Date,
  userInfo: any
): Promise<UserPerformanceData> {
  const studentId = userInfo.id;

  // Parallel fetch all data
  const [
    attendanceData,
    assignmentData,
    submissionsData,
    timetableData,
    notificationsData,
    gradesData,
  ] = await Promise.all([
    fetchStudentAttendance(studentId),
    fetchStudentAssignments(studentId),
    fetchStudentSubmissions(studentId),
    fetchStudentTimetable(studentId),
    fetchStudentNotifications(studentId),
    fetchStudentGrades(studentId),
  ]);

  // Calculate attendance metrics
  const attendanceMetrics = calculateAttendanceMetrics(attendanceData);
  
  // Calculate assignment metrics
  const assignmentMetrics = calculateAssignmentMetrics(submissionsData, assignmentData);
  
  // Calculate grade metrics
  const gradeMetrics = calculateGradeMetrics(gradesData);
  
  // Get schedule info
  const scheduleInfo = getScheduleInfo(timetableData, currentDate);
  
  // Calculate performance analytics
  const analytics = calculatePerformanceAnalytics(
    attendanceMetrics,
    assignmentMetrics,
    gradeMetrics
  );

  return {
    userId,
    userRole: 'student',
    userInfo,
    
    // Attendance
    ...attendanceMetrics,
    attendanceHistory: attendanceData,
    recentAttendance: attendanceData.slice(0, 10),
    
    // Assignments
    ...assignmentMetrics,
    recentAssignments: assignmentData.slice(0, 10),
    recentSubmissions: submissionsData.slice(0, 10),
    
    // Grades
    ...gradeMetrics,
    
    // Schedule
    ...scheduleInfo,
    weeklySchedule: timetableData,
    
    // Notifications
    recentNotifications: notificationsData.slice(0, 20),
    unreadNotifications: notificationsData.filter((n: any) => !n.is_read).length,
    
    // Analytics
    ...analytics,
    
    // Metadata
    academicYear,
    semester,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Fetch comprehensive teacher data
 */
async function fetchTeacherData(
  userId: string,
  academicYear: string,
  semester: string,
  currentDate: Date,
  userInfo: any
): Promise<UserPerformanceData> {
  const teacherId = userInfo.id;

  const [
    studentsData,
    assignmentsCreated,
    timetableData,
    attendanceSessions,
  ] = await Promise.all([
    fetchTeacherStudents(teacherId),
    fetchTeacherAssignments(teacherId),
    fetchTeacherTimetable(teacherId),
    fetchTeacherAttendanceSessions(teacherId),
  ]);

  const scheduleInfo = getScheduleInfo(timetableData, currentDate);

  return {
    userId,
    userRole: 'teacher',
    userInfo,
    
    // Students
    classmates: studentsData,
    
    // Assignments
    totalAssignments: assignmentsCreated.length,
    recentAssignments: assignmentsCreated.slice(0, 10),
    
    // Schedule
    ...scheduleInfo,
    weeklySchedule: timetableData,
    
    // Metadata
    academicYear,
    semester,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Fetch comprehensive dean data
 */
async function fetchDeanData(
  userId: string,
  academicYear: string,
  semester: string,
  currentDate: Date,
  userInfo: any
): Promise<UserPerformanceData> {
  // Dean gets overview of all students and teachers
  const [allStudents, allTeachers, allAssignments] = await Promise.all([
    fetchAllStudents(),
    fetchAllTeachers(),
    fetchAllAssignments(),
  ]);

  return {
    userId,
    userRole: 'dean',
    userInfo,
    classmates: allStudents,
    teachers: allTeachers,
    totalAssignments: allAssignments.length,
    recentAssignments: allAssignments.slice(0, 20),
    academicYear,
    semester,
    lastUpdated: new Date().toISOString(),
  };
}

// ==================== Data Fetching Functions ====================

async function fetchStudentAttendance(studentId: string) {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('student_id', studentId)
    .order('date', { ascending: false })
    .limit(100);
  
  return data || [];
}

async function fetchStudentAssignments(studentId: string) {
  const { data, error } = await supabase
    .from('assignments')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
  
  return data || [];
}

async function fetchStudentSubmissions(studentId: string) {
  const { data, error } = await supabase
    .from('assignment_submissions')
    .select(`
      *,
      assignments:assignment_id (
        title,
        due_date,
        max_score,
        subject_name
      )
    `)
    .eq('student_id', studentId)
    .order('submitted_at', { ascending: false })
    .limit(100);
  
  return data || [];
}

async function fetchStudentTimetable(studentId: string) {
  const { data, error } = await supabase
    .from('student_timetable_view')
    .select('*')
    .eq('student_id', studentId)
    .order('day_of_week')
    .order('start_time');
  
  return data || [];
}

async function fetchStudentNotifications(studentId: string) {
  const { data, error } = await supabase
    .from('student_notifications')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
    .limit(50);
  
  return data || [];
}

async function fetchStudentGrades(studentId: string) {
  const { data, error } = await supabase
    .from('assignment_submissions')
    .select('score, assignments:assignment_id(max_score, subject_name, title)')
    .eq('student_id', studentId)
    .not('score', 'is', null)
    .order('submitted_at', { ascending: false });
  
  return data || [];
}

async function fetchTeacherStudents(teacherId: string) {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('created_by', teacherId)
    .limit(100);
  
  return data || [];
}

async function fetchTeacherAssignments(teacherId: string) {
  const { data, error } = await supabase
    .from('assignments')
    .select('*')
    .eq('created_by', teacherId)
    .order('created_at', { ascending: false })
    .limit(100);
  
  return data || [];
}

async function fetchTeacherTimetable(teacherId: string) {
  const { data, error } = await supabase
    .from('timetables')
    .select('*')
    .order('day_of_week')
    .order('start_time')
    .limit(100);
  
  return data || [];
}

async function fetchTeacherAttendanceSessions(teacherId: string) {
  const { data, error } = await supabase
    .from('attendance_sessions')
    .select('*')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false })
    .limit(50);
  
  return data || [];
}

async function fetchAllStudents() {
  const { data, error } = await supabase
    .from('students')
    .select('id, name, email, grade')
    .limit(200);
  
  return data || [];
}

async function fetchAllTeachers() {
  const { data, error } = await supabase
    .from('teachers')
    .select('id, name, email, department')
    .limit(100);
  
  return data || [];
}

async function fetchAllAssignments() {
  const { data, error } = await supabase
    .from('assignments')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
  
  return data || [];
}

// ==================== Calculation Functions ====================

function calculateAttendanceMetrics(attendanceData: any[]) {
  if (!attendanceData || attendanceData.length === 0) {
    return {
      attendanceRate: 0,
      totalPresent: 0,
      totalAbsent: 0,
      totalLate: 0,
    };
  }

  const totalPresent = attendanceData.filter(a => a.status === 'Present').length;
  const totalAbsent = attendanceData.filter(a => a.status === 'Absent').length;
  const totalLate = attendanceData.filter(a => a.status === 'Late').length;
  const total = attendanceData.length;
  
  const attendanceRate = total > 0 ? ((totalPresent + totalLate) / total) * 100 : 0;

  return {
    attendanceRate: Math.round(attendanceRate * 10) / 10,
    totalPresent,
    totalAbsent,
    totalLate,
  };
}

function calculateAssignmentMetrics(submissionsData: any[], assignmentsData: any[]) {
  const totalAssignments = assignmentsData.length;
  const submittedAssignments = submissionsData.length;
  const gradedAssignments = submissionsData.filter(s => s.score !== null).length;
  
  const scores = submissionsData
    .filter(s => s.score !== null)
    .map(s => (s.score / (s.assignments?.max_score || 100)) * 100);
  
  const averageAssignmentScore = scores.length > 0
    ? scores.reduce((sum, score) => sum + score, 0) / scores.length
    : 0;
  
  const lateSubmissions = submissionsData.filter(s => s.status === 'late').length;
  
  const now = new Date();
  const pendingAssignments = assignmentsData.filter(a => {
    const hasSubmission = submissionsData.some(s => s.assignment_id === a.id);
    return !hasSubmission && (!a.due_date || new Date(a.due_date) > now);
  });

  return {
    totalAssignments,
    submittedAssignments,
    gradedAssignments,
    averageAssignmentScore: Math.round(averageAssignmentScore * 10) / 10,
    lateSubmissions,
    pendingAssignments,
  };
}

function calculateGradeMetrics(gradesData: any[]) {
  if (!gradesData || gradesData.length === 0) {
    return {
      overallGPA: 0,
      averageScore: 0,
      gradeDistribution: {},
      strongSubjects: [],
      weakSubjects: [],
    };
  }

  const scores = gradesData
    .filter(g => g.score !== null)
    .map(g => (g.score / (g.assignments?.max_score || 100)) * 100);
  
  const averageScore = scores.length > 0
    ? scores.reduce((sum, score) => sum + score, 0) / scores.length
    : 0;
  
  // Calculate GPA (4.0 scale)
  const overallGPA = (averageScore / 100) * 4.0;
  
  // Subject performance
  const subjectScores: { [key: string]: number[] } = {};
  gradesData.forEach(g => {
    const subject = g.assignments?.subject_name || 'Unknown';
    if (!subjectScores[subject]) subjectScores[subject] = [];
    if (g.score !== null) {
      const percentage = (g.score / (g.assignments?.max_score || 100)) * 100;
      subjectScores[subject].push(percentage);
    }
  });
  
  const subjectAverages = Object.entries(subjectScores).map(([subject, scores]) => ({
    subject,
    average: scores.reduce((sum, s) => sum + s, 0) / scores.length,
  }));
  
  subjectAverages.sort((a, b) => b.average - a.average);
  
  const strongSubjects = subjectAverages.slice(0, 3).map(s => s.subject);
  const weakSubjects = subjectAverages.slice(-3).reverse().map(s => s.subject);

  return {
    overallGPA: Math.round(overallGPA * 100) / 100,
    averageScore: Math.round(averageScore * 10) / 10,
    gradeDistribution: subjectScores,
    strongSubjects,
    weakSubjects,
  };
}

function getScheduleInfo(timetableData: any[], currentDate: Date) {
  const currentDay = currentDate.getDay();
  const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes();
  
  const todayClasses = timetableData.filter(t => t.day_of_week === currentDay);
  
  let currentClass: any = null;
  let nextClass: any = null;
  const upcomingClasses: any[] = [];
  
  todayClasses.forEach(cls => {
    const [startHour, startMin] = cls.start_time.split(':').map(Number);
    const [endHour, endMin] = cls.end_time.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    if (currentTime >= startMinutes && currentTime < endMinutes) {
      currentClass = cls;
    } else if (currentTime < startMinutes) {
      upcomingClasses.push(cls);
      if (!nextClass) nextClass = cls;
    }
  });

  return {
    todayClasses,
    currentClass,
    nextClass,
    upcomingClasses: upcomingClasses.slice(0, 5),
  };
}

function calculatePerformanceAnalytics(
  attendanceMetrics: any,
  assignmentMetrics: any,
  gradeMetrics: any
) {
  const { attendanceRate } = attendanceMetrics;
  const { averageAssignmentScore, lateSubmissions, submittedAssignments, totalAssignments } = assignmentMetrics;
  const { averageScore, overallGPA } = gradeMetrics;
  
  // Determine risk level
  let riskLevel: 'high' | 'medium' | 'low' = 'low';
  if (attendanceRate < 75 || averageScore < 60 || lateSubmissions > 3) {
    riskLevel = 'high';
  } else if (attendanceRate < 85 || averageScore < 75 || lateSubmissions > 1) {
    riskLevel = 'medium';
  }
  
  // Determine performance trend
  let performanceTrend: 'improving' | 'declining' | 'stable' = 'stable';
  // This would require historical data comparison - simplified here
  if (averageScore >= 80) {
    performanceTrend = 'improving';
  } else if (averageScore < 70) {
    performanceTrend = 'declining';
  }
  
  // Generate recommendations
  const recommendations: string[] = [];
  if (attendanceRate < 90) {
    recommendations.push('Improve attendance to stay on track with coursework');
  }
  if (lateSubmissions > 2) {
    recommendations.push('Focus on submitting assignments on time to avoid grade penalties');
  }
  if (averageScore < 75) {
    recommendations.push('Consider seeking additional help or tutoring in challenging subjects');
  }
  if (overallGPA >= 3.5) {
    recommendations.push('Excellent work! Keep maintaining your high standards');
  }
  
  // Identify strengths
  const strengths: string[] = [];
  if (attendanceRate >= 95) strengths.push('Excellent attendance record');
  if (averageScore >= 85) strengths.push('Strong academic performance');
  if (lateSubmissions === 0) strengths.push('Consistent on-time submissions');
  
  // Areas for improvement
  const areasForImprovement: string[] = [];
  if (attendanceRate < 90) areasForImprovement.push('Attendance');
  if (averageScore < 75) areasForImprovement.push('Academic performance');
  if (lateSubmissions > 1) areasForImprovement.push('Time management');

  return {
    riskLevel,
    performanceTrend,
    recommendations,
    strengths,
    areasForImprovement,
  };
}

// ==================== Helper Functions ====================

function getCurrentAcademicYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  // Academic year typically starts in August/September
  if (month >= 7) {
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
}

function getCurrentSemester(): string {
  const month = new Date().getMonth();
  
  // Fall: Aug-Dec (months 7-11)
  // Spring: Jan-May (months 0-4)
  // Summer: Jun-Jul (months 5-6)
  if (month >= 7) {
    return 'Fall';
  } else if (month <= 4) {
    return 'Spring';
  } else {
    return 'Summer';
  }
}
