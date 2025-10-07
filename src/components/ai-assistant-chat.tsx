'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Send, 
  TrendingUp, 
  BookOpen, 
  Heart, 
  Loader2,
  User,
  Bot,
  X,
  Maximize2,
  Minimize2,
  MessageSquare,
  Plus,
  History,
  Trash2
} from 'lucide-react';
import { VoiceInterface } from '@/components/voice-interface';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'chat' | 'analysis' | 'study-plan' | 'motivation';
  suggestions?: string[];
  insights?: string[];
  actionItems?: string[];
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

interface UserDataSummary {
  role: string;
  attendanceRate: number;
  averageScore: number;
  overallGPA: number;
  totalAssignments: number;
  pendingAssignments: number;
  performanceTrend: 'improving' | 'stable' | 'declining';
  riskLevel: 'low' | 'medium' | 'high';
  todayClasses: number;
  currentClass?: string;
  nextClass?: string;
}

interface AIAssistantChatProps {
  userRole: 'student' | 'teacher' | 'dean';
  className?: string;
}

export default function AIAssistantChat({ userRole, className = '' }: AIAssistantChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userDataSummary, setUserDataSummary] = useState<UserDataSummary | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load chat sessions and conversation history
    loadChatSessions();
    loadConversationHistory();
  }, []);

  const loadConversationHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const response = await fetch(`/api/ai-chat?userId=${user.id}&limit=20`);
      const data = await response.json();

      if (data.success && data.conversations && Array.isArray(data.conversations)) {
        const loadedMessages: Message[] = data.conversations
          .reverse()
          .flatMap((conv: any, index: number) => {
            // Validate conversation has required data
            if (!conv || !conv.user_message || !conv.ai_response) {
              return [];
            }

            // Generate unique IDs using both conversation ID and timestamp
            const baseId = conv.id || `conv-${Date.now()}-${index}`;
            const timestamp = conv.created_at || new Date().toISOString();
            const randomSuffix = Math.random().toString(36).substr(2, 9);
            const uniqueUserKey = `${baseId}-user-${timestamp}-${index}-${randomSuffix}`;
            const uniqueAiKey = `${baseId}-ai-${timestamp}-${index}-${randomSuffix}`;
            
            return [
              {
                id: uniqueUserKey,
                text: conv.user_message,
                sender: 'user' as const,
                timestamp: new Date(timestamp),
              },
              {
                id: uniqueAiKey,
                text: conv.ai_response,
                sender: 'ai' as const,
                timestamp: new Date(timestamp),
              },
            ];
          })
          .filter((msg: Message) => msg.id && msg.id.trim() !== '' && msg.text && msg.text.trim() !== ''); // Validate both ID and text

        setMessages(loadedMessages);
        
        // If this is the first load and we have messages, create/set current session
        if (loadedMessages.length > 0 && !currentSessionId) {
          const sessionId = `session-${Date.now()}`;
          setCurrentSessionId(sessionId);
        }
      }
    } catch (error) {
      console.error('Failed to load conversation history:', error);
    }
  };

  const loadChatSessions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get all conversations grouped by date/session
      const response = await fetch(`/api/ai-chat?userId=${user.id}&limit=100`);
      const data = await response.json();

      if (data.success && data.conversations && Array.isArray(data.conversations)) {
        // Group conversations into sessions (by day or every 10 messages)
        const sessions: ChatSession[] = [];
        const conversationsByDay: { [key: string]: any[] } = {};

        data.conversations.forEach((conv: any) => {
          const date = new Date(conv.created_at).toLocaleDateString();
          if (!conversationsByDay[date]) {
            conversationsByDay[date] = [];
          }
          conversationsByDay[date].push(conv);
        });

        // Create sessions from grouped conversations
        Object.keys(conversationsByDay).sort().reverse().forEach((date, index) => {
          const convs = conversationsByDay[date];
          const firstMessage = convs[0]?.user_message || 'New conversation';
          const title = firstMessage.length > 50 ? firstMessage.substring(0, 50) + '...' : firstMessage;
          
          sessions.push({
            id: `session-${date}-${index}`,
            title: title || `Chat on ${date}`,
            lastMessage: convs[convs.length - 1]?.ai_response?.substring(0, 100) || '',
            timestamp: new Date(convs[convs.length - 1]?.created_at),
            messageCount: convs.length * 2 // user + ai messages
          });
        });

        setChatSessions(sessions);
      }
    } catch (error) {
      console.error('Failed to load chat sessions:', error);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentSessionId(`session-${Date.now()}`);
    setShowHistory(false);
    setInputMessage('');
  };

  const loadChatSession = async (sessionId: string) => {
    // For now, just start a new chat
    // In a full implementation, you would load specific session messages
    setCurrentSessionId(sessionId);
    setShowHistory(false);
    await loadConversationHistory();
  };

  const deleteSession = async (sessionId: string) => {
    // TODO: Implement session deletion
    setChatSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  const sendMessage = async (message: string, requestType: 'chat' | 'analyze' | 'study-plan' | 'motivation' = 'chat') => {
    if (!message.trim() && requestType === 'chat') return;

    setLoading(true);

    // Generate unique IDs using timestamp + random string
    const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Add user message to UI (except for special requests)
    if (requestType === 'chat') {
      const userMessage: Message = {
        id: generateUniqueId(),
        text: message,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Validate required fields
      const requestBody = {
        message: message || '',
        userId: user.id,
        userRole: userRole || 'teacher', // Default to teacher if not provided
        requestType: requestType,
      };

      console.log('[AI Chat] Sending request:', {
        messageLength: requestBody.message.length,
        userId: requestBody.userId,
        userRole: requestBody.userRole,
        requestType: requestBody.requestType
      });

      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      
      console.log('[AI Chat] Response received:', {
        success: data.success,
        hasResponse: !!data.response,
        error: data.error
      });

      if (!data.success) {
        throw new Error(data.error || 'Failed to get AI response');
      }

      // Add AI response to UI
      const aiMessage: Message = {
        id: generateUniqueId(),
        text: data.response.message,
        sender: 'ai',
        timestamp: new Date(),
        type: data.response.type,
        suggestions: data.response.suggestions,
        insights: data.response.insights,
        actionItems: data.response.actionItems,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setUserDataSummary(data.userDataSummary);
      setInputMessage('');
      
      // Refresh chat sessions after sending message
      loadChatSessions();
    } catch (error: any) {
      console.error('AI Chat Error:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      sendMessage(inputMessage, 'chat');
    }
  };

  const getRiskLevelColor = (level?: string) => {
    switch (level) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-orange-500';
      case 'low': return 'text-emerald-500';
      default: return 'text-gray-500';
    }
  };

  const getTrendIcon = (trend?: string) => {
    if (trend === 'improving') return '📈';
    if (trend === 'declining') return '📉';
    return '➡️';
  };

  return (
    <div className={`flex ${isExpanded ? 'h-screen' : 'h-[600px]'} ${className}`}>
      {/* Chat History Sidebar */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="w-80 border-r border-white/10 bg-gray-900/50 backdrop-blur-lg flex flex-col"
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-bold text-white/90 flex items-center gap-2">
                <History className="w-5 h-5 text-cyan-500" />
                Chat History
              </h3>
              <button
                onClick={() => setShowHistory(false)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>
            </div>

            {/* New Chat Button */}
            <div className="p-3 border-b border-white/10">
              <button
                onClick={startNewChat}
                className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                New Chat
              </button>
            </div>

            {/* Sessions List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {chatSessions.length === 0 ? (
                <div className="text-center text-white/50 text-sm py-8">
                  No chat history yet
                </div>
              ) : (
                chatSessions.map((session) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                      currentSessionId === session.id
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/50'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10'
                    }`}
                    onClick={() => loadChatSession(session.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                          <h4 className="text-sm font-semibold text-white/90 truncate">
                            {session.title}
                          </h4>
                        </div>
                        <p className="text-xs text-white/60 line-clamp-2 mb-1">
                          {session.lastMessage}
                        </p>
                        <div className="flex items-center justify-between text-xs text-white/40">
                          <span>{session.messageCount} messages</span>
                          <span>{new Date(session.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(session.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-b border-white/10 rounded-t-xl">
          <div className="flex items-center gap-3">
            {/* History Toggle Button */}
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Chat History"
            >
              <History className="w-5 h-5 text-white/70" />
            </button>
            
            <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                AI Assistant
              </h2>
              <p className="text-xs text-white/50">Powered by Gemini 2.0 Flash</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={startNewChat}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 text-sm text-white/70"
              title="Start New Chat"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">New</span>
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isExpanded ? (
                <Minimize2 className="w-5 h-5 text-white/70" />
              ) : (
                <Maximize2 className="w-5 h-5 text-white/70" />
              )}
            </button>
          </div>
        </div>

      {/* User Data Summary */}
      {userDataSummary && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-white/5 border-b border-white/10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {userRole === 'student' && (
              <>
                <div className="p-2 bg-white/5 rounded-lg">
                  <div className="text-xs text-white/50">Attendance</div>
                  <div className="text-sm font-bold text-cyan-500">
                    {userDataSummary.attendanceRate?.toFixed(1)}%
                  </div>
                </div>
                <div className="p-2 bg-white/5 rounded-lg">
                  <div className="text-xs text-white/50">Avg Score</div>
                  <div className="text-sm font-bold text-blue-500">
                    {userDataSummary.averageScore?.toFixed(1)}
                  </div>
                </div>
                <div className="p-2 bg-white/5 rounded-lg">
                  <div className="text-xs text-white/50">GPA</div>
                  <div className="text-sm font-bold text-emerald-500">
                    {userDataSummary.overallGPA?.toFixed(2)}
                  </div>
                </div>
                <div className="p-2 bg-white/5 rounded-lg">
                  <div className="text-xs text-white/50">Pending</div>
                  <div className="text-sm font-bold text-orange-500">
                    {userDataSummary.pendingAssignments}
                  </div>
                </div>
              </>
            )}
            <div className="p-2 bg-white/5 rounded-lg">
              <div className="text-xs text-white/50">Trend</div>
              <div className="text-sm font-bold text-white/90">
                {getTrendIcon(userDataSummary.performanceTrend)} {userDataSummary.performanceTrend}
              </div>
            </div>
            <div className="p-2 bg-white/5 rounded-lg">
              <div className="text-xs text-white/50">Risk Level</div>
              <div className={`text-sm font-bold ${getRiskLevelColor(userDataSummary.riskLevel)}`}>
                {userDataSummary.riskLevel}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="p-3 bg-white/5 border-b border-white/10">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => sendMessage('', 'analyze')}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 text-xs bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 text-white rounded-lg transition-all disabled:opacity-50 border border-cyan-500/30"
          >
            <TrendingUp className="w-3 h-3" />
            Analyze Performance
          </button>
          {userRole === 'student' && (
            <>
              <button
                onClick={() => sendMessage('', 'study-plan')}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-1.5 text-xs bg-gradient-to-r from-emerald-500/20 to-green-600/20 hover:from-emerald-500/30 hover:to-green-600/30 text-white rounded-lg transition-all disabled:opacity-50 border border-emerald-500/30"
              >
                <BookOpen className="w-3 h-3" />
                Study Plan
              </button>
              <button
                onClick={() => sendMessage('', 'motivation')}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-1.5 text-xs bg-gradient-to-r from-pink-500/20 to-rose-600/20 hover:from-pink-500/30 hover:to-rose-600/30 text-white rounded-lg transition-all disabled:opacity-50 border border-pink-500/30"
              >
                <Heart className="w-3 h-3" />
                Motivate Me
              </button>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-900/50 to-black/50">
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div
              key="welcome-message"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full text-center p-6"
            >
              <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full mb-4">
                <Sparkles className="w-12 h-12 text-cyan-500" />
              </div>
              <h3 className="text-xl font-bold text-white/90 mb-2">
                Welcome to AI Assistant!
              </h3>
              <p className="text-white/60 mb-4 max-w-md">
                I have complete access to your data and can help you with:
              </p>
              <ul className="text-sm text-white/70 space-y-2 text-left">
                {userRole === 'student' && (
                  <>
                    <li>✨ Performance analysis and insights</li>
                    <li>📚 Personalized study plans</li>
                    <li>📊 Assignment and grade tracking</li>
                    <li>📅 Schedule management</li>
                    <li>💪 Motivational support</li>
                  </>
                )}
                {userRole === 'teacher' && (
                  <>
                    <li>✨ Class performance overview</li>
                    <li>👥 Student insights and recommendations</li>
                    <li>📊 Assignment analytics</li>
                    <li>⚠️ At-risk student identification</li>
                    <li>📈 Teaching effectiveness analysis</li>
                  </>
                )}
                {userRole === 'dean' && (
                  <>
                    <li>✨ School-wide analytics</li>
                    <li>👥 Department performance comparison</li>
                    <li>📊 Resource allocation insights</li>
                    <li>⚠️ Intervention recommendations</li>
                    <li>📈 Administrative decision support</li>
                  </>
                )}
              </ul>
            </motion.div>
          )}

          {messages.filter(msg => msg.id && msg.id.trim() !== '').map((message, index) => (
            <motion.div
              key={message.id || `message-${index}-${Date.now()}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'ai' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div className={`flex flex-col max-w-[80%] ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                      : 'bg-white/5 backdrop-blur-lg border border-white/10 text-white/90'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                </div>

                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-cyan-500 font-semibold">💡 Suggestions:</p>
                    {message.suggestions.map((suggestion, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-white/70 pl-3 border-l-2 border-cyan-500/50 py-1"
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}

                {/* Insights */}
                {message.insights && message.insights.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-blue-500 font-semibold">🔍 Insights:</p>
                    {message.insights.map((insight, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-white/70 pl-3 border-l-2 border-blue-500/50 py-1"
                      >
                        {insight}
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Items */}
                {message.actionItems && message.actionItems.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-emerald-500 font-semibold">✅ Action Items:</p>
                    {message.actionItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-white/70 pl-3 border-l-2 border-emerald-500/50 py-1"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xs text-white/40 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {message.sender === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-white/70" />
                </div>
              )}
            </motion.div>
          ))}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
                  <span className="text-sm text-white/70">Thinking...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white/5 border-t border-white/10 rounded-b-xl space-y-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything about your performance..."
            disabled={loading}
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder:text-white/40 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
        
        {/* Voice Interface */}
        <VoiceInterface
          onTranscriptAction={(text) => {
            setInputMessage(text);
            sendMessage(text, 'chat');
          }}
          onTranscriptUpdateAction={(txt) => setLiveTranscript(txt)}
          onListeningChangeAction={(listening) => setIsListening(listening)}
          disabled={loading}
          mode="compact"
          className="justify-start"
        />
        
        <p className="text-xs text-white/40">
          Powered by Google Gemini 2.0 Flash • Context-aware responses based on your data
        </p>
      </div>
      
      {/* Live transcript overlay */}
      {isListening && liveTranscript && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-6 z-50 bg-black/70 text-white px-4 py-2 rounded-full shadow-lg max-w-[90vw] text-center">
          <span className="text-sm">{liveTranscript}</span>
        </div>
      )}
      </div>
    </div>
  );
}
