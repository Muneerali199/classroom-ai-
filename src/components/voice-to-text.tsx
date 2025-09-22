"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Edit3, Save, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface VoiceToTextProps {
  onTextChange?: (text: string) => void;
  onSend?: (text: string) => void;
  placeholder?: string;
  className?: string;
}

export default function VoiceToText({ 
  onTextChange, 
  onSend, 
  placeholder = "Start speaking or type your message...",
  className = ""
}: VoiceToTextProps) {
  const t = useTranslations('chatbot');
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const [language, setLanguage] = useState("en-US");
  
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Language options for speech recognition
  const languageOptions = [
    { code: "en-US", name: "English" },
    { code: "es-ES", name: "Español" },
    { code: "hi-IN", name: "हिन्दी" },
    { code: "fr-FR", name: "Français" },
    { code: "de-DE", name: "Deutsch" },
    { code: "ja-JP", name: "日本語" },
    { code: "ko-KR", name: "한국어" },
    { code: "zh-CN", name: "中文" },
    { code: "ar-SA", name: "العربية" },
    { code: "pt-BR", name: "Português" },
  ];

  useEffect(() => {
    // Check if speech recognition is supported
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        recognitionRef.current = new SpeechRecognition();
        
        const recognition = recognitionRef.current;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language;

        recognition.onresult = (event: any) => {
          let transcript = "";
          let isFinal = false;
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              isFinal = true;
            }
          }
          
          setText(transcript);
          if (onTextChange) {
            onTextChange(transcript);
          }
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setListening(false);
        };

        recognition.onend = () => {
          setListening(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, onTextChange]);

  const startListening = () => {
    if (recognitionRef.current && isSupported) {
      recognitionRef.current.lang = language;
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  const handleEdit = () => {
    setEditableText(text);
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const handleSaveEdit = () => {
    setText(editableText);
    setIsEditing(false);
    if (onTextChange) {
      onTextChange(editableText);
    }
  };

  const handleCancelEdit = () => {
    setEditableText("");
    setIsEditing(false);
  };

  const handleSend = () => {
    const finalText = isEditing ? editableText : text;
    if (finalText.trim() && onSend) {
      onSend(finalText.trim());
      setText("");
      setEditableText("");
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isEditing) {
        handleSaveEdit();
      } else {
        handleSend();
      }
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{t('voiceInput')}</CardTitle>
          <div className="flex items-center gap-2">
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="text-sm border rounded px-2 py-1"
              disabled={listening}
            >
              {languageOptions.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
            {listening && (
              <Badge variant="secondary" className="animate-pulse">
                {t('listening')}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isSupported && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              {t('speechNotSupported')}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={listening ? stopListening : startListening}
            disabled={!isSupported}
            variant={listening ? "destructive" : "default"}
            size="sm"
            className="flex items-center gap-2"
          >
            {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {listening ? t('stopListening') : t('startListening')}
          </Button>

          {text && !isEditing && (
            <Button
              onClick={handleEdit}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              {t('edit')}
            </Button>
          )}

          {isEditing && (
            <>
              <Button
                onClick={handleSaveEdit}
                variant="default"
                size="sm"
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {t('save')}
              </Button>
              <Button
                onClick={handleCancelEdit}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                {t('cancel')}
              </Button>
            </>
          )}
        </div>

        <div className="space-y-2">
          {isEditing ? (
            <Textarea
              ref={textareaRef}
              value={editableText}
              onChange={(e) => setEditableText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="min-h-[100px] resize-none"
              rows={4}
            />
          ) : (
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="min-h-[100px] resize-none"
              rows={4}
            />
          )}
          
          {(text || editableText) && (
            <div className="flex justify-end">
              <Button onClick={handleSend} className="px-6">
                {t('send')}
              </Button>
            </div>
          )}
        </div>

        {text && (
          <div className="text-xs text-muted-foreground">
            {t('characterCount')}: {text.length}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
