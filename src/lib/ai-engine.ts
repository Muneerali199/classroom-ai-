import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserPerformanceData } from './ai-data-service';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export interface AIResponse {
  message: string;
  type?: 'chat' | 'analysis' | 'study-plan' | 'motivation';
  suggestions?: string[];
  insights?: string[];
  actionItems?: string[];
}

/**
 * Generate AI response using Gemini 2.0 Flash with complete user context
 */
export async function generateIntelligentResponse(
  userMessage: string,
  userData: UserPerformanceData
): Promise<AIResponse> {
  try {
    // Initialize Gemini 2.0 Flash model with optimized settings for speed
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 800,
      },
    });

    // Build concise context for faster processing
    const contextPrompt = buildConciseContext(userData);
    
    // Build system instructions
    const systemInstructions = getSystemInstructions(userData.userRole);
    
    // Create the full prompt
    const fullPrompt = `${systemInstructions}\n\n${contextPrompt}\n\nUser: ${userMessage}\n\nAssistant: Provide a brief, helpful response (2-3 paragraphs max).`;

    // Generate response
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    // Parse response and extract insights
    const aiResponse = parseAIResponse(text, userData);

    return aiResponse;
  } catch (error) {
    console.error('Gemini AI Error:', error);
    throw new Error('Failed to generate AI response');
  }
}

/**
 * Build concise context prompt from user data (optimized for speed)
 */
function buildConciseContext(userData: UserPerformanceData): string {
  const { userRole, userInfo } = userData;
  
  let context = `User: ${userInfo.name || 'User'} (${userRole})\n`;
  
  if (userRole === 'student') {
    context += `GPA: ${userData.overallGPA?.toFixed(2) || 'N/A'}, Score: ${userData.averageScore?.toFixed(0) || 'N/A'}%, Attendance: ${userData.attendanceRate?.toFixed(0) || 0}%\n`;
    context += `Trend: ${userData.performanceTrend || 'stable'}, Risk: ${userData.riskLevel || 'low'}\n`;
    if (userData.pendingAssignments?.length) {
      context += `Pending: ${userData.pendingAssignments.length} assignments\n`;
    }
    if (userData.currentClass) {
      context += `Now: ${userData.currentClass.title}\n`;
    }
  } else if (userRole === 'teacher') {
    context += `Students: ${userData.classmates?.length || 0}, Assignments: ${userData.totalAssignments || 0}\n`;
  }
  
  return context;
}

/**
 * Build comprehensive context prompt from user data (for detailed analysis)
 */
function buildContextPrompt(userData: UserPerformanceData): string {
  const { userRole, userInfo } = userData;
  
  let context = `=== USER PROFILE ===\n`;
  context += `Name: ${userInfo.name || 'User'}\n`;
  context += `Role: ${userRole.charAt(0).toUpperCase() + userRole.slice(1)}\n`;
  context += `Email: ${userInfo.email || 'Not provided'}\n`;
  
  if (userRole === 'student') {
    context += buildStudentContext(userData);
  } else if (userRole === 'teacher') {
    context += buildTeacherContext(userData);
  } else {
    context += buildDeanContext(userData);
  }
  
  context += `\nAcademic Year: ${userData.academicYear}\n`;
  context += `Semester: ${userData.semester}\n`;
  context += `Last Updated: ${new Date(userData.lastUpdated).toLocaleString()}\n`;
  
  return context;
}

/**
 * Build student-specific context
 */
function buildStudentContext(userData: UserPerformanceData): string {
  let context = `\n=== ACADEMIC PERFORMANCE ===\n`;
  context += `Overall GPA: ${userData.overallGPA?.toFixed(2) || 'N/A'}/4.0\n`;
  context += `Average Score: ${userData.averageScore?.toFixed(1) || 'N/A'}%\n`;
  context += `Performance Trend: ${userData.performanceTrend || 'N/A'}\n`;
  context += `Risk Level: ${userData.riskLevel || 'N/A'}\n`;
  
  if (userData.strongSubjects && userData.strongSubjects.length > 0) {
    context += `Strong Subjects: ${userData.strongSubjects.join(', ')}\n`;
  }
  
  if (userData.weakSubjects && userData.weakSubjects.length > 0) {
    context += `Areas for Improvement: ${userData.weakSubjects.join(', ')}\n`;
  }
  
  context += `\n=== ATTENDANCE ===\n`;
  context += `Attendance Rate: ${userData.attendanceRate?.toFixed(1) || 0}%\n`;
  context += `Total Present: ${userData.totalPresent || 0}\n`;
  context += `Total Absent: ${userData.totalAbsent || 0}\n`;
  context += `Total Late: ${userData.totalLate || 0}\n`;
  
  context += `\n=== ASSIGNMENTS ===\n`;
  context += `Total Assignments: ${userData.totalAssignments || 0}\n`;
  context += `Submitted: ${userData.submittedAssignments || 0}\n`;
  context += `Graded: ${userData.gradedAssignments || 0}\n`;
  context += `Average Assignment Score: ${userData.averageAssignmentScore?.toFixed(1) || 'N/A'}%\n`;
  context += `Late Submissions: ${userData.lateSubmissions || 0}\n`;
  context += `Pending Assignments: ${userData.pendingAssignments?.length || 0}\n`;
  
  if (userData.pendingAssignments && userData.pendingAssignments.length > 0) {
    context += `\nUpcoming Assignments:\n`;
    userData.pendingAssignments.slice(0, 5).forEach((a: any, i: number) => {
      context += `${i + 1}. ${a.title} - Due: ${a.due_date ? new Date(a.due_date).toLocaleDateString() : 'No due date'}\n`;
    });
  }
  
  context += `\n=== TODAY'S SCHEDULE ===\n`;
  if (userData.currentClass) {
    context += `Current Class: ${userData.currentClass.title} (${userData.currentClass.start_time} - ${userData.currentClass.end_time})\n`;
  }
  
  if (userData.nextClass) {
    context += `Next Class: ${userData.nextClass.title} at ${userData.nextClass.start_time}\n`;
  }
  
  if (userData.todayClasses && userData.todayClasses.length > 0) {
    context += `Total Classes Today: ${userData.todayClasses.length}\n`;
  } else {
    context += `No classes scheduled today\n`;
  }
  
  context += `\n=== NOTIFICATIONS ===\n`;
  context += `Unread Notifications: ${userData.unreadNotifications || 0}\n`;
  
  if (userData.recentNotifications && userData.recentNotifications.length > 0) {
    context += `\nRecent Notifications:\n`;
    userData.recentNotifications.slice(0, 3).forEach((n: any, i: number) => {
      context += `${i + 1}. [${n.type}] ${n.title}\n`;
    });
  }
  
  context += `\n=== INSIGHTS & RECOMMENDATIONS ===\n`;
  if (userData.strengths && userData.strengths.length > 0) {
    context += `Strengths:\n`;
    userData.strengths.forEach((s: string) => context += `- ${s}\n`);
  }
  
  if (userData.areasForImprovement && userData.areasForImprovement.length > 0) {
    context += `\nAreas for Improvement:\n`;
    userData.areasForImprovement.forEach((a: string) => context += `- ${a}\n`);
  }
  
  if (userData.recommendations && userData.recommendations.length > 0) {
    context += `\nRecommendations:\n`;
    userData.recommendations.forEach((r: string) => context += `- ${r}\n`);
  }
  
  return context;
}

/**
 * Build teacher-specific context
 */
function buildTeacherContext(userData: UserPerformanceData): string {
  let context = `\n=== TEACHING OVERVIEW ===\n`;
  context += `Total Students: ${userData.classmates?.length || 0}\n`;
  context += `Total Assignments Created: ${userData.totalAssignments || 0}\n`;
  
  if (userData.recentAssignments && userData.recentAssignments.length > 0) {
    context += `\nRecent Assignments:\n`;
    userData.recentAssignments.slice(0, 5).forEach((a: any, i: number) => {
      context += `${i + 1}. ${a.title} - Created: ${new Date(a.created_at).toLocaleDateString()}\n`;
    });
  }
  
  context += `\n=== TODAY'S SCHEDULE ===\n`;
  if (userData.currentClass) {
    context += `Current Class: ${userData.currentClass.title} (${userData.currentClass.start_time} - ${userData.currentClass.end_time})\n`;
  }
  
  if (userData.nextClass) {
    context += `Next Class: ${userData.nextClass.title} at ${userData.nextClass.start_time}\n`;
  }
  
  if (userData.todayClasses && userData.todayClasses.length > 0) {
    context += `Total Classes Today: ${userData.todayClasses.length}\n`;
  }
  
  return context;
}

/**
 * Build dean-specific context
 */
function buildDeanContext(userData: UserPerformanceData): string {
  let context = `\n=== INSTITUTIONAL OVERVIEW ===\n`;
  context += `Total Students: ${userData.classmates?.length || 0}\n`;
  context += `Total Teachers: ${userData.teachers?.length || 0}\n`;
  context += `Total Assignments: ${userData.totalAssignments || 0}\n`;
  
  return context;
}

/**
 * Get system instructions based on user role
 */
function getSystemInstructions(userRole: string): string {
  const baseInstructions = `You are an intelligent AI assistant for ClassroomAI, a comprehensive educational management platform. You have access to user data including academic performance, attendance, assignments, grades, schedule, and more.

Your role is to:
1. Provide personalized, data-driven insights and recommendations
2. Answer questions about the user's academic performance and progress
3. Offer actionable advice to improve learning outcomes
4. Be supportive, encouraging, and professional
5. Use specific data points from the user's profile to make your responses relevant
6. Highlight both strengths and areas for improvement
7. Suggest concrete action items when appropriate

Response Guidelines:
- Be conversational, friendly, and brief (2-3 short paragraphs)
- Use specific data from user profile when relevant
- Be encouraging and actionable
- Prioritize clarity over length`;

  if (userRole === 'student') {
    return `${baseInstructions}

As a STUDENT AI ASSISTANT, focus on:
- Academic performance and progress tracking
- Study strategies and time management
- Assignment completion and deadlines
- Attendance improvement
- Class schedule management
- Identifying subjects that need more attention
- Celebrating achievements and progress`;
  } else if (userRole === 'teacher') {
    return `${baseInstructions}

As a TEACHER AI ASSISTANT, focus on:
- Class management insights
- Student performance overview
- Assignment creation and grading support
- Attendance tracking
- Teaching schedule optimization
- Identifying students who may need extra support`;
  } else {
    return `${baseInstructions}

As a DEAN AI ASSISTANT, focus on:
- Institutional oversight
- Overall academic performance trends
- Resource allocation insights
- Teacher and student statistics
- Strategic recommendations for improvement`;
  }
}

/**
 * Parse AI response and extract structured information
 */
function parseAIResponse(text: string, userData: UserPerformanceData): AIResponse {
  // Extract suggestions if mentioned
  const suggestions: string[] = [];
  const insights: string[] = [];
  const actionItems: string[] = [];
  
  // Look for bullet points or numbered lists
  const bulletRegex = /[•\-\*]\s*(.+)/g;
  const numberedRegex = /\d+\.\s*(.+)/g;
  
  let match;
  while ((match = bulletRegex.exec(text)) !== null) {
    suggestions.push(match[1].trim());
  }
  
  while ((match = numberedRegex.exec(text)) !== null) {
    actionItems.push(match[1].trim());
  }
  
  // Add insights from user data
  if (userData.performanceTrend === 'improving') {
    insights.push('Your performance is on an upward trend! Keep up the great work.');
  } else if (userData.performanceTrend === 'declining') {
    insights.push('Your performance has been declining. Let\'s work together to get back on track.');
  }
  
  if (userData.attendanceRate && userData.attendanceRate >= 95) {
    insights.push('Your attendance is excellent!');
  } else if (userData.attendanceRate && userData.attendanceRate < 80) {
    insights.push('Consider improving your attendance to stay current with coursework.');
  }
  
  return {
    message: text,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
    insights: insights.length > 0 ? insights : undefined,
    actionItems: actionItems.length > 0 ? actionItems : undefined,
  };
}

/**
 * Generate personalized study plan
 */
export async function generateStudyPlan(userData: UserPerformanceData): Promise<string> {
  if (userData.userRole !== 'student') {
    throw new Error('Study plans are only available for students');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  
  const prompt = `Based on the following student data, create a personalized weekly study plan:

${buildStudentContext(userData)}

Generate a detailed weekly study plan that:
1. Addresses weak subjects
2. Maintains strong subjects
3. Accounts for current class schedule
4. Includes time for pending assignments
5. Recommends study techniques
6. Sets realistic goals

Format the response as a structured weekly plan with specific daily activities.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * Analyze performance trends (FAST VERSION with minimal data)
 */
export async function analyzePerformanceTrends(userData: UserPerformanceData): Promise<string> {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 512, // Limit output for faster response
    }
  });
  
  // Build MINIMAL context - only essential metrics
  const prompt = `You are an academic performance analyst. Analyze this student's performance:

📊 KEY METRICS:
- Attendance Rate: ${userData.attendanceRate || 0}%
- Average Score: ${userData.averageScore || 0}%
- GPA: ${userData.overallGPA?.toFixed(2) || 'N/A'}
- Pending Assignments: ${userData.pendingAssignments?.length || 0}
- Performance Trend: ${userData.performanceTrend || 'stable'}
- Risk Level: ${userData.riskLevel || 'low'}

Provide a concise analysis (3-4 paragraphs) covering:
1. Overall performance assessment
2. Key strengths and concerns
3. Top 3 actionable recommendations

Be specific, encouraging, and practical.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * Generate personalized motivational message
 */
export async function generateMotivationalMessage(userData: UserPerformanceData): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  
  const prompt = `Based on this student's recent performance:
- GPA: ${userData.overallGPA || 'N/A'}
- Attendance: ${userData.attendanceRate || 0}%
- Average Score: ${userData.averageScore || 0}%
- Trend: ${userData.performanceTrend || 'stable'}
- Strengths: ${userData.strengths?.join(', ') || 'Various areas'}

Generate a short, personalized, encouraging message (2-3 sentences) that:
1. Acknowledges their current efforts
2. Provides specific encouragement
3. Motivates them to keep improving

Be genuine, supportive, and specific to their situation.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
