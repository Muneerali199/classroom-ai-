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
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <Card className="huly-card flex flex-col min-h-[80vh]">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bot className="h-5 w-5" />
                {t('aiAssistant')}
                <Badge variant="secondary" className="ml-2">{userRole}</Badge>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant={showPerformance ? 'default' : 'outline'} size="sm" onClick={() => setShowPerformance(!showPerformance)}>
                  <BarChart3 className="h-4 w-4 mr-1" />
                  {t('showPerformance')}
                </Button>
                <div className="hidden sm:flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={voiceLang}
                    onChange={(e) => setVoiceLang(e.target.value)}
                    className="text-xs rounded-md border border-border px-2 py-1 bg-background text-foreground"
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
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <div className="flex items-start gap-2">
                        {m.role === 'assistant' ? <Bot className="w-4 h-4 mt-0.5" /> : <User className="w-4 h-4 mt-0.5" />}
                        <div>
                          <div className="text-sm whitespace-pre-wrap">{m.content}</div>
                          <div className="text-xs opacity-70 mt-1">{m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4" />
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">{t('thinking')}</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <Separator />

            {/* Input and Voice controls */}
            <div className="p-4 space-y-3">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress as any}
                    placeholder={t('typeOrSpeak')}
                    disabled={isLoading}
                    className=""
                  />
                </div>
                <Button onClick={() => handleSend(inputMessage)} disabled={isLoading || !inputMessage.trim()} size="sm">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
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
