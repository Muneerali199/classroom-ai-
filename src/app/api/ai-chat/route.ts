import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface DashboardContext {
  userRole: string;
  attendanceData: any[];
  assignmentData: any[];
  gradeData: any[];
  studentData?: any[];
  timetableData: any[];
  notificationsData: any[];
  submissionsData: any[];
  upcomingClasses: any[];
  currentDate: string;
  academicYear: string;
  semester: string;
}

export async function POST(request: NextRequest) {
  try {
    const { message, userId, userRole, dashboardContext } = await request.json();

    if (!message || !userId) {
      return NextResponse.json(
        { error: 'Message and userId are required' },
        { status: 400 }
      );
    }

    // Fetch real-time dashboard data for context
    const context = await fetchDashboardContext(userId, userRole);
    
    // Combine with any provided dashboard context
    const fullContext = { ...context, ...dashboardContext };

    // Generate AI response with full context
    const aiResponse = await generateContextualResponse(message, fullContext, userRole);

    // Store the conversation in database
    await storeConversation(userId, message, aiResponse);

    return NextResponse.json({
      response: aiResponse,
      context: fullContext,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}

async function fetchDashboardContext(userId: string, userRole: string): Promise<DashboardContext> {
  const currentDate = new Date().toISOString().split('T')[0];
  const academicYear = getCurrentAcademicYear();
  const semester = getCurrentSemester();

  try {
    // Fetch attendance data
    const { data: attendanceData } = await supabase
      .from('attendance')
      .select('*')
      .eq(userRole === 'student' ? 'student_id' : 'teacher_id', userId)
      .order('date', { ascending: false })
      .limit(100);

    // Fetch assignment data
    const { data: assignmentData } = await supabase
      .from('assignments')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    // Fetch grade data
    const { data: gradeData } = await supabase
      .from('grades')
      .select('*')
      .eq(userRole === 'student' ? 'student_id' : 'teacher_id', userId)
      .order('date', { ascending: false })
      .limit(100);

    // Fetch student data (for teachers)
    let studentData = null;
    if (userRole === 'teacher' || userRole === 'dean') {
      const { data } = await supabase
        .from('students')
        .select('*');
      studentData = data;
    }

    // NEW: Fetch timetable data
    let timetableData: any[] = [];
    let upcomingClasses: any[] = [];
    
    if (userRole === 'student') {
      // Get student's timetable
      const { data: studentRecord } = await supabase
        .from('students')
        .select('id')
        .eq('auth_user_id', userId)
        .single();
      
      if (studentRecord) {
        const { data: timetable } = await supabase
          .from('student_timetable_view')
          .select('*')
          .eq('student_id', studentRecord.id);
        timetableData = timetable || [];
        
        // Get today's and upcoming classes
        const today = new Date().getDay();
        upcomingClasses = (timetable || []).filter((c: any) => 
          c.day_of_week === today || c.day_of_week === (today + 1) % 7
        );
      }
    } else {
      // Get teacher's timetable
      const { data: timetable } = await supabase
        .from('teacher_timetable_view')
        .select('*')
        .eq('teacher_id', userId);
      timetableData = timetable || [];
    }

    // NEW: Fetch notifications
    let notificationsData: any[] = [];
    if (userRole === 'student') {
      const { data: studentRecord } = await supabase
        .from('students')
        .select('id')
        .eq('auth_user_id', userId)
        .single();
      
      if (studentRecord) {
        const { data: notifications } = await supabase
          .from('student_notifications')
          .select('*')
          .eq('student_id', studentRecord.id)
          .order('created_at', { ascending: false })
          .limit(20);
        notificationsData = notifications || [];
      }
    }

    // NEW: Fetch assignment submissions (for students)
    let submissionsData: any[] = [];
    if (userRole === 'student') {
      const { data: studentRecord } = await supabase
        .from('students')
        .select('id')
        .eq('auth_user_id', userId)
        .single();
      
      if (studentRecord) {
        const { data: submissions } = await supabase
          .from('assignment_submissions')
          .select('*')
          .eq('student_id', studentRecord.id)
          .order('submitted_at', { ascending: false });
        submissionsData = submissions || [];
      }
    }

    return {
      userRole,
      attendanceData: attendanceData || [],
      assignmentData: assignmentData || [],
      gradeData: gradeData || [],
      studentData: studentData || undefined,
      timetableData: timetableData || [],
      notificationsData: notificationsData || [],
      submissionsData: submissionsData || [],
      upcomingClasses: upcomingClasses || [],
      currentDate,
      academicYear,
      semester
    };

  } catch (error) {
    console.error('Error fetching dashboard context:', error);
    return {
      userRole,
      attendanceData: [],
      assignmentData: [],
      gradeData: [],
      timetableData: [],
      notificationsData: [],
      submissionsData: [],
      upcomingClasses: [],
      currentDate,
      academicYear,
      semester
    };
  }
}

async function generateContextualResponse(
  message: string, 
  context: DashboardContext, 
  userRole: string
): Promise<string> {
  
  // Analyze the message to understand what data the user is asking about
  const messageType = analyzeMessageIntent(message);
  
  // Generate response based on real data
  switch (messageType) {
    case 'attendance':
      return generateAttendanceResponse(message, context);
    
    case 'assignments':
      return generateAssignmentResponse(message, context);
    
    case 'grades':
      return generateGradeResponse(message, context);
    
    case 'performance':
      return generatePerformanceResponse(message, context);
    
    case 'students':
      return generateStudentResponse(message, context);
    
    case 'timetable':
      return generateTimetableResponse(message, context);
    
    case 'notifications':
      return generateNotificationsResponse(message, context);
    
    case 'schedule':
      return generateScheduleResponse(message, context);
    
    default:
      return generateGeneralResponse(message, context);
  }
}

function analyzeMessageIntent(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('attendance') || lowerMessage.includes('present') || lowerMessage.includes('absent')) {
    return 'attendance';
  }
  if (lowerMessage.includes('assignment') || lowerMessage.includes('homework') || lowerMessage.includes('task') || lowerMessage.includes('submit')) {
    return 'assignments';
  }
  if (lowerMessage.includes('grade') || lowerMessage.includes('score') || lowerMessage.includes('mark')) {
    return 'grades';
  }
  if (lowerMessage.includes('performance') || lowerMessage.includes('progress') || lowerMessage.includes('analytics')) {
    return 'performance';
  }
  if (lowerMessage.includes('student') || lowerMessage.includes('class')) {
    return 'students';
  }
  if (lowerMessage.includes('timetable') || lowerMessage.includes('time table') || lowerMessage.includes('classes today')) {
    return 'timetable';
  }
  if (lowerMessage.includes('notification') || lowerMessage.includes('alert') || lowerMessage.includes('reminder')) {
    return 'notifications';
  }
  if (lowerMessage.includes('schedule') || lowerMessage.includes('when') || lowerMessage.includes('next class') || lowerMessage.includes('upcoming')) {
    return 'schedule';
  }
  
  return 'general';
}

function generateAttendanceResponse(message: string, context: DashboardContext): string {
  const { attendanceData, currentDate, userRole } = context;
  
  if (attendanceData.length === 0) {
    return "I don't see any attendance records in your dashboard yet. Once you start marking attendance, I'll be able to provide detailed analysis and insights.";
  }

  const totalDays = attendanceData.length;
  const presentDays = attendanceData.filter(record => record.status === 'present').length;
  const absentDays = attendanceData.filter(record => record.status === 'absent').length;
  const lateCount = attendanceData.filter(record => record.status === 'late').length;
  const attendanceRate = ((presentDays / totalDays) * 100).toFixed(1);

  const recentAttendance = attendanceData.slice(0, 7);
  const recentPattern = recentAttendance.map(record => record.status).join(', ');

  let response = `📊 **Attendance Analysis (Based on Real Dashboard Data)**\n\n`;
  
  if (userRole === 'student') {
    response += `**Your Current Attendance:**\n`;
    response += `• Total Days: ${totalDays}\n`;
    response += `• Present: ${presentDays} days\n`;
    response += `• Absent: ${absentDays} days\n`;
    response += `• Late: ${lateCount} days\n`;
    response += `• Attendance Rate: ${attendanceRate}%\n\n`;
    
    if (parseFloat(attendanceRate) >= 90) {
      response += `🎉 Excellent attendance! You're maintaining a ${attendanceRate}% attendance rate.`;
    } else if (parseFloat(attendanceRate) >= 75) {
      response += `👍 Good attendance at ${attendanceRate}%. Try to maintain consistency.`;
    } else {
      response += `⚠️ Your attendance is ${attendanceRate}%. Consider improving to avoid academic issues.`;
    }
  } else {
    response += `**Class Attendance Overview:**\n`;
    response += `• Total Records: ${totalDays}\n`;
    response += `• Average Attendance Rate: ${attendanceRate}%\n`;
  }

  response += `\n\n**Recent Pattern:** ${recentPattern}`;
  response += `\n\n*Data updated as of ${currentDate}*`;

  return response;
}

function generateAssignmentResponse(message: string, context: DashboardContext): string {
  const { assignmentData, currentDate, userRole } = context;
  
  if (assignmentData.length === 0) {
    return "No assignments found in your dashboard. Once assignments are created or submitted, I'll provide detailed analysis.";
  }

  const totalAssignments = assignmentData.length;
  const completedAssignments = assignmentData.filter(a => a.status === 'submitted' || a.status === 'graded').length;
  const pendingAssignments = assignmentData.filter(a => a.status === 'pending').length;
  const overdueAssignments = assignmentData.filter(a => 
    a.status === 'pending' && new Date(a.due_date) < new Date()
  ).length;

  let response = `📝 **Assignment Analysis (Real Dashboard Data)**\n\n`;
  
  response += `**Current Status:**\n`;
  response += `• Total Assignments: ${totalAssignments}\n`;
  response += `• Completed: ${completedAssignments}\n`;
  response += `• Pending: ${pendingAssignments}\n`;
  response += `• Overdue: ${overdueAssignments}\n\n`;

  if (overdueAssignments > 0) {
    response += `⚠️ You have ${overdueAssignments} overdue assignments that need immediate attention.\n\n`;
  }

  // Recent assignments
  const recentAssignments = assignmentData.slice(0, 3);
  response += `**Recent Assignments:**\n`;
  recentAssignments.forEach(assignment => {
    response += `• ${assignment.title} - ${assignment.status} (Due: ${assignment.due_date})\n`;
  });

  response += `\n*Data updated as of ${currentDate}*`;

  return response;
}

function generateGradeResponse(message: string, context: DashboardContext): string {
  const { gradeData, currentDate } = context;
  
  if (gradeData.length === 0) {
    return "No grades available in your dashboard yet. Once grades are entered, I'll provide comprehensive performance analysis.";
  }

  const totalGrades = gradeData.length;
  const averageScore = (gradeData.reduce((sum, grade) => sum + (grade.score / grade.max_score * 100), 0) / totalGrades).toFixed(1);
  
  // Subject-wise analysis
  const subjectGrades = gradeData.reduce((acc, grade) => {
    if (!acc[grade.subject]) acc[grade.subject] = [];
    acc[grade.subject].push(grade);
    return acc;
  }, {} as { [subject: string]: any[] });

  let response = `📈 **Grade Analysis (Real Dashboard Data)**\n\n`;
  
  response += `**Overall Performance:**\n`;
  response += `• Total Grades: ${totalGrades}\n`;
  response += `• Average Score: ${averageScore}%\n\n`;

  response += `**Subject-wise Performance:**\n`;
  Object.keys(subjectGrades).forEach(subject => {
    const subjectAvg = (subjectGrades[subject].reduce((sum: number, g: any) => sum + (g.score / g.max_score * 100), 0) / subjectGrades[subject].length).toFixed(1);
    response += `• ${subject}: ${subjectAvg}% (${subjectGrades[subject].length} grades)\n`;
  });

  // Recent grades
  const recentGrades = gradeData.slice(0, 3);
  response += `\n**Recent Grades:**\n`;
  recentGrades.forEach(grade => {
    const percentage = ((grade.score / grade.max_score) * 100).toFixed(1);
    response += `• ${grade.assignment_title}: ${grade.score}/${grade.max_score} (${percentage}%)\n`;
  });

  response += `\n*Data updated as of ${currentDate}*`;

  return response;
}

function generatePerformanceResponse(message: string, context: DashboardContext): string {
  const { attendanceData, assignmentData, gradeData, currentDate } = context;
  
  let response = `📊 **Comprehensive Performance Analysis**\n\n`;
  
  // Attendance performance
  if (attendanceData.length > 0) {
    const attendanceRate = ((attendanceData.filter(r => r.status === 'present').length / attendanceData.length) * 100).toFixed(1);
    response += `**Attendance:** ${attendanceRate}% (${attendanceData.length} total days)\n`;
  }
  
  // Assignment performance
  if (assignmentData.length > 0) {
    const completionRate = ((assignmentData.filter(a => a.status !== 'pending').length / assignmentData.length) * 100).toFixed(1);
    response += `**Assignment Completion:** ${completionRate}% (${assignmentData.length} total)\n`;
  }
  
  // Grade performance
  if (gradeData.length > 0) {
    const averageGrade = (gradeData.reduce((sum, g) => sum + (g.score / g.max_score * 100), 0) / gradeData.length).toFixed(1);
    response += `**Academic Average:** ${averageGrade}% (${gradeData.length} grades)\n`;
  }

  response += `\n**Insights:**\n`;
  
  // Generate insights based on data
  if (attendanceData.length > 0 && gradeData.length > 0) {
    const attendanceRate = (attendanceData.filter(r => r.status === 'present').length / attendanceData.length) * 100;
    const averageGrade = gradeData.reduce((sum, g) => sum + (g.score / g.max_score * 100), 0) / gradeData.length;
    
    if (attendanceRate > 90 && averageGrade > 85) {
      response += `🌟 Excellent performance! High attendance correlates with strong academic results.\n`;
    } else if (attendanceRate < 75) {
      response += `⚠️ Consider improving attendance - it may be affecting your academic performance.\n`;
    }
  }

  response += `\n*Analysis based on real dashboard data as of ${currentDate}*`;

  return response;
}

function generateStudentResponse(message: string, context: DashboardContext): string {
  const { studentData, attendanceData, gradeData, userRole } = context;
  
  if (userRole !== 'teacher') {
    return "Student overview is available for teachers only.";
  }
  
  if (!studentData || studentData.length === 0) {
    return "No student data available in your dashboard.";
  }

  let response = `👥 **Class Overview (Real Data)**\n\n`;
  response += `**Total Students:** ${studentData.length}\n\n`;
  
  if (attendanceData.length > 0) {
    const classAttendanceRate = ((attendanceData.filter(r => r.status === 'present').length / attendanceData.length) * 100).toFixed(1);
    response += `**Class Attendance Rate:** ${classAttendanceRate}%\n`;
  }
  
  if (gradeData.length > 0) {
    const classAverage = (gradeData.reduce((sum, g) => sum + (g.score / g.max_score * 100), 0) / gradeData.length).toFixed(1);
    response += `**Class Academic Average:** ${classAverage}%\n`;
  }

  return response;
}

function generateTimetableResponse(message: string, context: DashboardContext): string {
  const { timetableData, upcomingClasses, currentDate, userRole } = context;
  
  if (timetableData.length === 0) {
    return "No timetable data available yet. Once your schedule is created, I'll be able to help you with class timings and schedules.";
  }

  const today = new Date().getDay();
  const todayClasses = timetableData.filter((c: any) => c.day_of_week === today);
  
  let response = `📅 **Your Timetable (Real Dashboard Data)**\n\n`;
  
  response += `**Total Classes This Week:** ${timetableData.length}\n`;
  response += `**Classes Today:** ${todayClasses.length}\n\n`;

  if (todayClasses.length > 0) {
    response += `**Today's Schedule:**\n`;
    todayClasses.forEach((cls: any) => {
      response += `• ${cls.start_time} - ${cls.end_time}: ${cls.title}`;
      if (cls.room_number) response += ` (Room ${cls.room_number})`;
      if (cls.subject_name) response += ` - ${cls.subject_name}`;
      response += `\n`;
    });
  }

  if (upcomingClasses.length > 0) {
    response += `\n**Upcoming Classes:**\n`;
    upcomingClasses.slice(0, 3).forEach((cls: any) => {
      response += `• ${cls.day_name}: ${cls.start_time} - ${cls.title}\n`;
    });
  }

  response += `\n*Timetable updated as of ${currentDate}*`;
  return response;
}

function generateNotificationsResponse(message: string, context: DashboardContext): string {
  const { notificationsData, currentDate } = context;
  
  if (notificationsData.length === 0) {
    return "You have no notifications at the moment. I'll let you know when you receive any updates!";
  }

  const unreadCount = notificationsData.filter((n: any) => !n.is_read).length;
  const types = notificationsData.reduce((acc: any, n: any) => {
    acc[n.type] = (acc[n.type] || 0) + 1;
    return acc;
  }, {});

  let response = `🔔 **Notifications Summary (Real Data)**\n\n`;
  
  response += `**Total Notifications:** ${notificationsData.length}\n`;
  response += `**Unread:** ${unreadCount}\n\n`;

  response += `**By Type:**\n`;
  Object.keys(types).forEach(type => {
    const emoji = type === 'assignment' ? '📝' : type === 'timetable' ? '📅' : type === 'grade' ? '⭐' : '📢';
    response += `${emoji} ${type.charAt(0).toUpperCase() + type.slice(1)}: ${types[type]}\n`;
  });

  response += `\n**Recent Notifications:**\n`;
  notificationsData.slice(0, 5).forEach((notif: any) => {
    const status = notif.is_read ? '✓' : '🔵';
    response += `${status} ${notif.title}\n`;
  });

  response += `\n*Updated as of ${currentDate}*`;
  return response;
}

function generateScheduleResponse(message: string, context: DashboardContext): string {
  const { timetableData, upcomingClasses, currentDate } = context;
  
  if (timetableData.length === 0) {
    return "No schedule information available. Once your timetable is set up, I can tell you about upcoming classes!";
  }

  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  // Find current and next class
  const todayClasses = timetableData.filter((c: any) => c.day_of_week === currentDay);
  let currentClass = null;
  let nextClass = null;

  todayClasses.forEach((cls: any) => {
    const [startHour, startMin] = cls.start_time.split(':').map(Number);
    const [endHour, endMin] = cls.end_time.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (currentTime >= startMinutes && currentTime < endMinutes) {
      currentClass = cls;
    } else if (currentTime < startMinutes && !nextClass) {
      nextClass = cls;
    }
  });

  let response = `⏰ **Your Schedule Status**\n\n`;

  if (currentClass) {
    response += `🟢 **Currently in Class:**\n`;
    response += `• ${currentClass.title}\n`;
    response += `• ${currentClass.start_time} - ${currentClass.end_time}\n`;
    if (currentClass.room_number) response += `• Room: ${currentClass.room_number}\n`;
    response += `\n`;
  }

  if (nextClass) {
    response += `🔵 **Next Class:**\n`;
    response += `• ${nextClass.title}\n`;
    response += `• Starts at: ${nextClass.start_time}\n`;
    if (nextClass.room_number) response += `• Room: ${nextClass.room_number}\n`;
  } else if (!currentClass) {
    response += `✅ **No more classes today!**\n`;
  }

  if (upcomingClasses.length > 0) {
    response += `\n**Tomorrow's Schedule:**\n`;
    const tomorrowClasses = timetableData.filter((c: any) => c.day_of_week === (currentDay + 1) % 7);
    tomorrowClasses.forEach((cls: any) => {
      response += `• ${cls.start_time}: ${cls.title}\n`;
    });
  }

  response += `\n*Schedule as of ${currentDate} ${now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}*`;
  return response;
}

function generateGeneralResponse(message: string, context: DashboardContext): string {
  const { userRole, currentDate, academicYear, semester, timetableData, notificationsData, submissionsData } = context;
  
  const unreadNotifications = notificationsData.filter((n: any) => !n.is_read).length;
  const todayClasses = timetableData.filter((c: any) => c.day_of_week === new Date().getDay()).length;
  
  return `Hello! I'm your intelligent AI assistant with **complete access** to your dashboard data. I can help you with:

📊 **Real-time Data Analysis:**
• Attendance patterns and trends
• Assignment progress and deadlines  
• Grade performance and insights
• Academic progress tracking
• **Timetable and class schedules** 🆕
• **Notifications and alerts** 🆕
• **Assignment submissions** 🆕

🎯 **What I can do:**
• Answer questions about your attendance records
• Analyze your assignment completion rates
• Provide grade breakdowns by subject
• **Tell you about today's classes and schedule**
• **Show upcoming classes and notifications**
• **Track your submission history**
• Give performance insights and recommendations
• Help you stay organized with reminders

📅 **Your Current Status:**
• Date: ${currentDate}
• Academic Year: ${academicYear}
• Semester: ${semester}
• Role: ${userRole}
${unreadNotifications > 0 ? `• 🔔 ${unreadNotifications} unread notifications` : ''}
${todayClasses > 0 ? `• 📅 ${todayClasses} classes today` : ''}
${submissionsData.length > 0 ? `• 📝 ${submissionsData.length} total submissions` : ''}

💡 **Try asking me:**
• "What's my attendance rate?"
• "Do I have any pending assignments?"
• "What are my classes today?"
• "Show my notifications"
• "When is my next class?"
• "What's my average grade?"

I have access to **all your real dashboard data** and provide detailed, accurate responses based on your actual information!`;
}

async function storeConversation(userId: string, userMessage: string, aiResponse: string) {
  try {
    await supabase
      .from('ai_conversations')
      .insert({
        user_id: userId,
        user_message: userMessage,
        ai_response: aiResponse,
        created_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Error storing conversation:', error);
  }
}

function getCurrentAcademicYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  if (month >= 7) {
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
}

function getCurrentSemester(): string {
  const now = new Date();
  const month = now.getMonth();
  
  if (month >= 7 && month <= 11) {
    return 'Fall';
  } else if (month >= 0 && month <= 4) {
    return 'Spring';
  } else {
    return 'Summer';
  }
}
