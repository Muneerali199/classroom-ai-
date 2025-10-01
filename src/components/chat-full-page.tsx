"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, Loader2, Send, BarChart3, Globe } from "lucide-react";
import { VoiceInterface } from "@/components/voice-interface";
import PerformanceTracker from "@/components/performance-tracker";
import { useTranslations, useLocale } from "next-intl";
import { useAuth } from "@/hooks/use-auth";
import { useDashboardData } from "@/contexts/dashboard-data-context";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function ChatFullPage() {
  const t = useTranslations('chatbot');
  const locale = useLocale();
  const { user } = useAuth();
  const { data: dashboardData, loading: dataLoading } = useDashboardData();
  const userRole = (user?.user_metadata?.role || 'student') as 'student' | 'teacher' | 'dean';

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [showPerformance, setShowPerformance] = useState(false);
  // Live interim transcript (subtitle-style)
  const [liveTranscript, setLiveTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  // Language selection for SpeechRecognition/TTS
  const [voiceLang, setVoiceLang] = useState<string>('en-US');

  const languageOptions = [
    { code: 'en-US', label: 'English (US)' },
    { code: 'en-GB', label: 'English (UK)' },
    { code: 'es-ES', label: 'Español (ES)' },
    { code: 'es-MX', label: 'Español (MX)' },
    { code: 'hi-IN', label: 'हिन्दी (भारत)' },
    { code: 'fr-FR', label: 'Français (FR)' },
    { code: 'de-DE', label: 'Deutsch (DE)' },
    { code: 'ar-SA', label: 'العربية (SA)' },
    { code: 'pt-BR', label: 'Português (BR)' },
    { code: 'zh-CN', label: '中文 (简体)' },
    { code: 'ja-JP', label: '日本語 (JP)' },
    { code: 'ko-KR', label: '한국어 (KR)' }
  ];

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const welcome = {
      id: 'welcome',
      content: t('welcomeDefault'),
      role: 'assistant' as const,
      timestamp: new Date(),
    };
    setMessages([welcome]);
  }, [t]);

  // Initialize and persist language selection
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('ai-voice-lang') : null;
    if (saved) {
      setVoiceLang(saved);
      return;
    }
    // Derive from browser locale if possible
    try {
      const navLang = typeof navigator !== 'undefined' ? (navigator as any).language : null;
      if (navLang && typeof navLang === 'string') {
        // If we have a close match, use it, else default en-US
        const found = languageOptions.find(l => l.code.toLowerCase() === navLang.toLowerCase());
        setVoiceLang(found ? found.code : 'en-US');
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ai-voice-lang', voiceLang);
    }
  }, [voiceLang]);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages]);

  const sendToAI = async (content: string) => {
    setIsLoading(true);
    try {
      // Performance toggle intents
      const lower = content.toLowerCase();
      if (lower.includes('performance') || lower.includes('my grade') || lower.includes('attendance')) {
        setShowPerformance(true);
      }

      // Prepare dashboard context for AI
      const dashboardContext = dashboardData ? {
        attendanceData: dashboardData.attendanceRecords,
        assignmentData: dashboardData.assignments,
        gradeData: dashboardData.grades,
        studentData: dashboardData.students,
        attendanceStats: dashboardData.attendanceStats,
        assignmentStats: dashboardData.assignmentStats,
        gradeStats: dashboardData.gradeStats,
        classStats: dashboardData.classStats,
        currentDate: dashboardData.currentDate,
        academicYear: dashboardData.academicYear,
        semester: dashboardData.currentSemester
      } : null;

      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: content, 
          userId: user?.id,
          userRole,
          dashboardContext
        })
      });
      
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      const text: string = data?.response || t('defaultResponse');

      setMessages(prev => [...prev, {
        id: `${Date.now()}-assistant`,
        content: text,
        role: 'assistant',
        timestamp: new Date()
      }]);
    } catch (e) {
      console.error('AI Chat Error:', e);
      setMessages(prev => [...prev, {
        id: `${Date.now()}-assistant`,
        content: t('defaultResponse'),
        role: 'assistant',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (content: string) => {
    const text = content.trim();
    if (!text) return;
    setMessages(prev => [...prev, { id: `${Date.now()}-user`, content: text, role: 'user', timestamp: new Date() }]);
    setInputMessage("");
    await sendToAI(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputMessage);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <Card className="huly-card flex flex-col min-h-[85vh] shadow-xl border-border/50">
          <CardHeader className="pb-4 border-b bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <CardTitle className="flex items-center gap-3 text-xl font-bold">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    {t('aiAssistant')}
                    <Badge variant="secondary" className="ml-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">{userRole}</Badge>
                  </div>
                  <p className="text-xs font-normal text-muted-foreground mt-0.5">Your intelligent teaching companion</p>
                </div>
              </CardTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <Button 
                  variant={showPerformance ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setShowPerformance(!showPerformance)}
                  className={showPerformance ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600' : ''}
                >
                  <BarChart3 className="h-4 w-4 mr-1" />
                  {t('showPerformance')}
                </Button>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border bg-background/50">
                  <Globe className="h-4 w-4 text-blue-500" />
                  <select
                    value={voiceLang}
                    onChange={(e) => setVoiceLang(e.target.value)}
                    className="text-xs bg-transparent border-0 outline-none cursor-pointer"
                  >
                    {languageOptions.map(opt => (
                      <option key={opt.code} value={opt.code}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </CardHeader>

          {showPerformance && (
            <div className="border-b p-4">
              <PerformanceTracker userId={user?.id || ''} userRole={userRole} />
            </div>
          )}

          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4 md:p-6">
              <div className="space-y-4">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-sm ${
                      m.role === 'user'
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
                        : 'bg-card border border-border/50'
                    }`}>
                      <div className="flex items-start gap-3">
                        {m.role === 'assistant' && (
                          <div className="flex-shrink-0 p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                        )}
                        {m.role === 'user' && (
                          <div className="flex-shrink-0 p-1.5 rounded-lg bg-white/20">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">{m.content}</div>
                          <div className={`text-xs mt-2 ${m.role === 'user' ? 'text-white/70' : 'text-muted-foreground'}`}>
                            {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 animate-pulse">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                          <span className="text-sm text-muted-foreground">{t('thinking')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <Separator />

            {/* Input and Voice controls */}
            <div className="p-4 md:p-6 space-y-3 bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress as any}
                    placeholder={t('typeOrSpeak')}
                    disabled={isLoading}
                    className="h-11 rounded-xl border-border/50 focus-visible:ring-2 focus-visible:ring-blue-500/50"
                  />
                </div>
                <Button 
                  onClick={() => handleSend(inputMessage)} 
                  disabled={isLoading || !inputMessage.trim()} 
                  size="lg"
                  className="h-11 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
              </div>

              <VoiceInterface
                onTranscriptAction={(text) => handleSend(text)}
                onTranscriptUpdateAction={(txt) => setLiveTranscript(txt)}
                onListeningChangeAction={(listening) => setIsListening(listening)}
                disabled={isLoading}
                className="justify-start"
                lang={voiceLang}
                mode="expanded"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subtitle-like live transcript overlay */}
      {isListening && liveTranscript && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-6 sm:bottom-10 z-50 bg-black/70 text-white px-4 py-2 rounded-full shadow-lg max-w-[90vw] text-center">
          <span className="text-sm">{liveTranscript}</span>
        </div>
      )}
    </div>
  );
}
