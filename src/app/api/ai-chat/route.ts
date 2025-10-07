import { NextRequest, NextResponse } from 'next/server';
import { fetchCompleteUserData } from '@/lib/ai-data-service';
import { generateIntelligentResponse, analyzePerformanceTrends, generateStudyPlan, generateMotivationalMessage } from '@/lib/ai-engine';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ChatRequest {
  message: string;
  userId: string;
  userRole: 'student' | 'teacher' | 'dean';
  requestType?: 'chat' | 'analyze' | 'study-plan' | 'motivation';
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, userId, userRole, requestType = 'chat' } = body;

    // Validate input - message can be empty for special requests like 'analyze'
    if (!userId || !userRole) {
      return NextResponse.json(
        { 
          success: false,
          error: 'userId and userRole are required' 
        },
        { status: 400 }
      );
    }

    // For chat requests, message is required
    if (requestType === 'chat' && !message) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Message is required for chat requests' 
        },
        { status: 400 }
      );
    }

    // Validate API key
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Google Gemini API key not configured. Please add GOOGLE_GEMINI_API_KEY to your .env file' 
        },
        { status: 500 }
      );
    }

    console.log(`[AI Chat] Processing ${requestType} request for user ${userId} (${userRole})`);

    // Fetch comprehensive user data
    const userData = await fetchCompleteUserData(userId, userRole);
    
    console.log('[AI Chat] User data fetched successfully');

    let aiResponse;

    // Handle different request types
    switch (requestType) {
      case 'analyze':
        const analysis = await analyzePerformanceTrends(userData);
        aiResponse = {
          message: analysis,
          type: 'analysis',
        };
        break;

      case 'study-plan':
        if (userRole !== 'student') {
          return NextResponse.json(
            { error: 'Study plans are only available for students' },
            { status: 400 }
          );
        }
        const studyPlan = await generateStudyPlan(userData);
        aiResponse = {
          message: studyPlan,
          type: 'study-plan',
        };
        break;

      case 'motivation':
        const motivationalMessage = await generateMotivationalMessage(userData);
        aiResponse = {
          message: motivationalMessage,
          type: 'motivation',
        };
        break;

      case 'chat':
      default:
        aiResponse = await generateIntelligentResponse(message, userData);
        aiResponse.type = 'chat';
        break;
    }

    // Store conversation in database
    await storeConversation(userId, userRole, message, aiResponse.message);

    console.log('[AI Chat] Response generated successfully');

    // Return response with user data summary
    return NextResponse.json({
      success: true,
      response: aiResponse,
      userDataSummary: {
        role: userRole,
        attendanceRate: userData.attendanceRate,
        averageScore: userData.averageScore,
        overallGPA: userData.overallGPA,
        totalAssignments: userData.totalAssignments,
        pendingAssignments: userData.pendingAssignments?.length || 0,
        performanceTrend: userData.performanceTrend,
        riskLevel: userData.riskLevel,
        todayClasses: userData.todayClasses?.length || 0,
        currentClass: userData.currentClass?.title,
        nextClass: userData.nextClass?.title,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('[AI Chat] Error:', error);
    
    // Return user-friendly error message
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process AI request',
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * Store conversation in database for history
 */
async function storeConversation(
  userId: string,
  userRole: string,
  userMessage: string,
  aiResponse: string
) {
  try {
    const { error } = await supabase
      .from('ai_conversations')
      .insert({
        user_id: userId,
        user_role: userRole,
        user_message: userMessage,
        ai_response: aiResponse,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('[AI Chat] Failed to store conversation:', error);
      // Don't throw error - conversation storage is not critical
    }
  } catch (error) {
    console.error('[AI Chat] Error storing conversation:', error);
  }
}

/**
 * GET endpoint to fetch conversation history
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('ai_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      conversations: data || [],
      count: data?.length || 0,
    });

  } catch (error: any) {
    console.error('[AI Chat] Error fetching history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversation history' },
      { status: 500 }
    );
  }
}

// New AI engine implementation complete
