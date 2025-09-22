"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Bot, 
  User, 
  Send, 
  Loader2, 
  Maximize2, 
  Minimize2,
  Settings,
  BarChart3,
  Calendar,
  BookOpen,
  Users,
  MessageSquare
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { VoiceInterface } from "./voice-interface";
import PerformanceTracker from "./performance-tracker";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'performance' | 'chart';
  metadata?: any;
}

interface AIChatbotProps {
  userId: string;
  userRole: 'student' | 'teacher' | 'dean';
  className?: string;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export default function AIChatbot({ 
  userId, 
  userRole, 
  className = "",
  isMinimized = false,
  onToggleMinimize
}: AIChatbotProps) {
  const t = useTranslations('chatbot');
  const locale = useLocale();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      content: getWelcomeMessage(),
      role: 'assistant',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages([welcomeMessage]);
  }, [userRole, t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getWelcomeMessage = () => {
    switch (userRole) {
      case 'student':
        return t('welcomeStudent');
      case 'teacher':
        return t('welcomeTeacher');
      case 'dean':
        return t('welcomeDean');
      default:
        return t('welcomeDefault');
    }
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage,
          userRole,
          userId,
          locale
        })
      });
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      return (data.text as string) || t('defaultResponse');
    } catch (e) {
      return t('defaultResponse');
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Check if user is asking for performance data
      if (content.toLowerCase().includes('show performance') || 
          content.toLowerCase().includes('my grades') ||
          content.toLowerCase().includes('my attendance')) {
        setShowPerformance(true);
        
        const performanceMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: t('showingPerformance'),
          role: 'assistant',
          timestamp: new Date(),
          type: 'performance'
        };
        
        setMessages(prev => [...prev, performanceMessage]);
        setIsLoading(false);
        return;
      }

      const aiResponse = await generateAIResponse(content);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: t('defaultResponse'),
        role: 'assistant',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { label: t('showPerformance'), icon: BarChart3, action: () => handleSendMessage(t('showPerformance')) },
    { label: t('checkAttendance'), icon: Calendar, action: () => handleSendMessage(t('checkAttendance')) },
    { label: t('viewAssignments'), icon: BookOpen, action: () => handleSendMessage(t('viewAssignments')) },
    { label: t('getHelp'), icon: MessageSquare, action: () => handleSendMessage(t('getHelp')) },
  ];

  if (isMinimized) {
    return (
      <Card className={`fixed bottom-4 right-4 w-16 h-16 cursor-pointer ${className}`}>
        <CardContent 
          className="p-0 flex items-center justify-center h-full"
          onClick={onToggleMinimize}
        >
          <Bot className="w-8 h-8 text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`flex flex-col h-full ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            {t('aiAssistant')}
            <Badge variant="secondary" className="ml-2">
              {userRole}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPerformance(!showPerformance)}
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
            {onToggleMinimize && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleMinimize}
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {showPerformance && (
          <div className="p-4 border-b">
            <PerformanceTracker userId={userId} userRole={userRole} />
          </div>
        )}

        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.role === 'assistant' && (
                        <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      )}
                      {message.role === 'user' && (
                        <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="text-sm">{message.content}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
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

          <div className="p-4 space-y-3">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={action.action}
                  className="flex items-center gap-2 text-xs"
                >
                  <action.icon className="w-3 h-3" />
                  {action.label}
                </Button>
              ))}
            </div>

            <Separator />

            {/* Voice Input (Speech-to-Text + Text-to-Speech) */}
            <VoiceInterface
              onTranscriptAction={(text) => handleSendMessage(text)}
              disabled={isLoading}
              className="justify-start"
              mode="compact"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
