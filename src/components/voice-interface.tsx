"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Mic, MicOff, Volume2, VolumeX, Loader2, Square, Play, Pause, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceInterfaceProps {
  onTranscriptAction: (text: string) => void;
  onSpeakTextAction?: (speakFunction: (text: string) => void) => void;
  onListeningChangeAction?: (isListening: boolean, transcript?: string) => void;
  onTranscriptUpdateAction?: (transcript: string) => void;
  disabled?: boolean;
  className?: string;
  mode?: 'compact' | 'expanded' | 'center';
  lang?: string; // BCP-47 code e.g., 'en-US', 'es-ES', 'hi-IN'
}

export function VoiceInterface({ 
  onTranscriptAction, 
  onSpeakTextAction,
  onListeningChangeAction,
  onTranscriptUpdateAction,
  disabled = false,
  className = "",
  mode = 'compact',
  lang = 'en-US'
}: VoiceInterfaceProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const [autoSend, setAutoSend] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check browser support and load voices
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const speechRecognitionSupported = 
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    const speechSynthesisSupported = 'speechSynthesis' in window;
    setIsSupported(speechRecognitionSupported && speechSynthesisSupported);

    if (speechSynthesisSupported) {
      synthRef.current = window.speechSynthesis;
      const loadVoices = () => {
        const vs = window.speechSynthesis.getVoices();
        setVoices(vs);
        if (!selectedVoice && vs.length) {
          const preferred = vs.find(v => v.lang.startsWith('en')) || vs[0];
          setSelectedVoice(preferred || null);
        }
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedVoice]);

  // Initialize SpeechRecognition
  useEffect(() => {
    if (!isSupported || typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang || 'en-US';
    (recognition as any).maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      setTranscript("");
      setFinalTranscript("");
      onListeningChangeAction?.(true);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscriptLocal = '';
      let maxConfidence = 0;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const seg = event.results[i][0];
        const segText = seg.transcript;
        const conf = seg.confidence ?? 0;

        if (event.results[i].isFinal) {
          finalTranscriptLocal += segText;
          maxConfidence = Math.max(maxConfidence, conf);
        } else {
          interimTranscript += segText;
        }
      }
      setTranscript(interimTranscript);
      setConfidence(maxConfidence);
      if (interimTranscript) onTranscriptUpdateAction?.(interimTranscript);

      if (finalTranscriptLocal) {
        setFinalTranscript(finalTranscriptLocal);
        onTranscriptAction(finalTranscriptLocal);
        // Clear interim transcript shortly after final
        setTimeout(() => setTranscript(""), 600);
        if (autoSend) {
          // Consumers can decide to auto-send in their handler
        }
      }
    };

    recognition.onerror = (event: any) => {
      const err = event?.error as string;
      switch (err) {
        case 'no-speech':
          setError('No speech detected. Try speaking clearly.');
          break;
        case 'audio-capture':
          setError('Microphone not accessible. Please check permissions.');
          break;
        case 'not-allowed':
          setError('Microphone permission denied. Please enable microphone access.');
          break;
        case 'network':
          setError('Network error. Please check your connection and try again.');
          break;
        default:
          setError(`Recognition error: ${err || 'unknown'}`);
      }
      setIsListening(false);
      onListeningChangeAction?.(false);
    };

    recognition.onend = () => {
      if (!isPaused && isListening) {
        // Attempt to restart if supposed to keep listening
        try {
          recognition.start();
        } catch {
          setIsListening(false);
        }
      } else {
        setIsListening(false);
        setTranscript("");
        onListeningChangeAction?.(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try { recognition.stop(); } catch {}
      recognitionRef.current = null;
    };
  }, [isSupported, isPaused, isListening, autoSend, onTranscriptAction, onListeningChangeAction, onTranscriptUpdateAction, lang]);

  const ensureMicAccess = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Microphone API not supported in this browser.');
    }
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
    });
    // Stop immediately; SpeechRecognition uses its own capture
    stream.getTracks().forEach(t => t.stop());
  };

  const startListening = async () => {
    if (disabled || isListening) return;
    try {
      await ensureMicAccess();
      setIsPaused(false);
      setError(null);
      recognitionRef.current?.start();
    } catch (err: any) {
      if (err?.name === 'NotAllowedError') {
        setError("Microphone access denied. Please allow access in your browser's address bar.");
      } else if (err?.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone.');
      } else if (err?.name === 'NotReadableError') {
        setError('Microphone is in use by another app. Close it and try again.');
      } else {
        setError(`Microphone error: ${err?.message || 'unknown'}`);
      }
    }
  };

  const stopListening = () => {
    setIsPaused(true);
    if (recognitionRef.current && isListening) {
      try { recognitionRef.current.stop(); } catch {}
    }
  };

  const pauseListening = () => {
    setIsPaused(true);
    try { recognitionRef.current?.stop(); } catch {}
  };

  const resumeListening = () => {
    setIsPaused(false);
    if (recognitionRef.current && !isListening) {
      try { recognitionRef.current.start(); } catch {}
    }
  };

  const speakText = (text: string) => {
    if (!synthRef.current || !text?.trim()) return;
    stopSpeaking();
    try {
      const utt = new SpeechSynthesisUtterance(text);
      utt.rate = speechRate;
      utt.pitch = speechPitch;
      utt.volume = 0.9;
      utt.lang = selectedVoice?.lang || lang || 'en-US';
      if (selectedVoice) utt.voice = selectedVoice;

      utt.onstart = () => setIsSpeaking(true);
      utt.onend = () => { setIsSpeaking(false); currentUtteranceRef.current = null; };
      utt.onerror = () => { setIsSpeaking(false); currentUtteranceRef.current = null; };

      currentUtteranceRef.current = utt;
      synthRef.current.speak(utt);

      // Fallback timeout for some browsers
      const est = Math.min(15000, Math.max(3000, text.length * 60));
      speechTimeoutRef.current = setTimeout(() => {
        if (currentUtteranceRef.current === utt && isSpeaking) {
          stopSpeaking();
        }
      }, est);
    } catch (e) {
      setError('Text-to-speech failed.');
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (!synthRef.current) return;
    try { synthRef.current.cancel(); } catch {}
    setIsSpeaking(false);
    currentUtteranceRef.current = null;
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
      speechTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    if (onSpeakTextAction) onSpeakTextAction(speakText);
  }, [onSpeakTextAction, speakText]);

  const clearError = () => setError(null);

  if (!isSupported) {
    return (
      <Card className={cn("p-4 text-center", className)}>
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <MicOff className="h-4 w-4" />
          <span className="text-sm">Voice features not supported in this browser</span>
        </div>
      </Card>
    );
  }

  const renderCompact = () => (
    <div className={cn("flex items-center gap-2", className)} role="group" aria-label="Voice controls">
      <Button
        variant={isListening ? "default" : "outline"}
        size="sm"
        onClick={isListening ? stopListening : startListening}
        disabled={disabled}
        className={cn(
          "relative transition-all duration-200",
          isListening && "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25 animate-pulse"
        )}
        aria-label={isListening ? "Stop voice recognition" : "Start voice recognition"}
        aria-pressed={isListening}
      >
        {isListening ? (
          <><MicOff className="h-4 w-4" /><span className="ml-1 text-xs">Stop</span></>
        ) : (
          <><Mic className="h-4 w-4" /><span className="ml-1 text-xs">Speak</span></>
        )}
      </Button>

      {isListening && (
        <Button
          variant="outline"
          size="sm"
          onClick={isPaused ? resumeListening : pauseListening}
          disabled={disabled}
          aria-label={isPaused ? "Resume" : "Pause"}
        >
          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={isSpeaking ? stopSpeaking : () => speakText(finalTranscript || transcript)}
        disabled={disabled || (!isSpeaking && !(finalTranscript || transcript))}
        aria-label={isSpeaking ? "Stop TTS" : "Play TTS"}
      >
        {isSpeaking ? (
          <><Square className="h-4 w-4" /><span className="ml-1 text-xs">Stop</span></>
        ) : (
          <><Volume2 className="h-4 w-4" /><span className="ml-1 text-xs">Listen</span></>
        )}
      </Button>

      {isListening && !isPaused && (
        <Badge variant="destructive" className="text-xs animate-pulse">Listening...</Badge>
      )}
      {isPaused && (
        <Badge variant="secondary" className="text-xs">Paused</Badge>
      )}
      {isSpeaking && (
        <Badge variant="default" className="text-xs">Speaking...</Badge>
      )}

      {transcript && (
        <div className="flex-1 min-w-0" role="status" aria-live="assertive">
          <div className="text-xs text-muted-foreground italic truncate">&quot;{transcript}&quot;</div>
        </div>
      )}

      {error && (
        <div className="text-xs text-destructive flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" />{error}</div>
      )}
    </div>
  );

  const renderExpanded = () => (
    <Card className={cn("p-6", className)} role="region" aria-labelledby="voice-expanded-title">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 id="voice-expanded-title" className="text-lg font-semibold flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Voice Assistant
          </h3>
          <div className="flex items-center gap-2">
            <Switch checked={autoSend} onCheckedChange={setAutoSend} id="auto-send" />
            <Label htmlFor="auto-send" className="text-sm">Auto-send</Label>
          </div>
        </div>

        <div className="flex justify-center gap-3" role="group" aria-label="Voice control buttons">
          <Button
            variant={isListening ? "default" : "outline"}
            size="lg"
            onClick={isListening ? stopListening : startListening}
            disabled={disabled}
            className={cn(
              "relative transition-all duration-200",
              isListening && "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25"
            )}
            aria-label={isListening ? "Stop" : "Start"}
            aria-pressed={isListening}
          >
            {isListening ? (<><MicOff className="h-5 w-5 mr-2" />Stop Listening</>) : (<><Mic className="h-5 w-5 mr-2" />Start Listening</>)}
          </Button>

          {isListening && (
            <Button
              variant="outline"
              size="lg"
              onClick={isPaused ? resumeListening : pauseListening}
              disabled={disabled}
              aria-label={isPaused ? "Resume" : "Pause"}
            >
              {isPaused ? (<><Play className="h-5 w-5 mr-2" />Resume</>) : (<><Pause className="h-5 w-5 mr-2" />Pause</>)}
            </Button>
          )}

          <Button
            variant="outline"
            size="lg"
            onClick={isSpeaking ? stopSpeaking : () => speakText(finalTranscript || transcript)}
            disabled={disabled || (!isSpeaking && !(finalTranscript || transcript))}
            aria-label={isSpeaking ? "Stop TTS" : "Play TTS"}
          >
            {isSpeaking ? (<><Square className="h-5 w-5 mr-2" />Stop Speaking</>) : (<><Volume2 className="h-5 w-5 mr-2" />Text-to-Speech</>)}
          </Button>
        </div>

        <div className="text-center space-y-2" role="status" aria-live="polite">
          {isListening && !isPaused && (
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <Badge variant="destructive" className="animate-pulse">Listening... Speak now</Badge>
            </div>
          )}
          {isPaused && (<Badge variant="secondary">Voice Recognition Paused</Badge>)}
          {isSpeaking && (
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <Badge variant="default" className="animate-pulse">Speaking...</Badge>
            </div>
          )}
        </div>

        {(transcript || finalTranscript) && (
          <div className="bg-muted/50 rounded-lg p-4 min-h-[60px]" role="log" aria-live="assertive">
            <div className="text-sm">
              {transcript && (<div className="text-muted-foreground italic">{transcript}</div>)}
              {finalTranscript && (<div className="text-foreground font-medium mt-1">&quot;{finalTranscript}&quot;</div>)}
            </div>
            {confidence > 0 && (<div className="mt-2 text-xs text-muted-foreground">Confidence: {Math.round(confidence * 100)}%</div>)}
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3" role="alert">
            <div className="flex items-center gap-2 text-destructive text-sm">
              <Loader2 className="h-4 w-4" />
              {error}
            </div>
            <Button variant="ghost" size="sm" onClick={clearError} className="mt-2 text-destructive hover:text-destructive">
              Dismiss
            </Button>
          </div>
        )}
      </div>
    </Card>
  );

  const renderCenter = () => (
    <div className={cn("text-center", className)} role="region" aria-labelledby="voice-center-title">
      <h2 id="voice-center-title" className="sr-only">Voice Input Center</h2>
      <div className="inline-flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-primary/5 via-blue-50/50 to-purple-50/30 dark:from-primary/10 dark:via-blue-950/20 dark:to-purple-950/10 rounded-2xl border-2 border-dashed border-primary/20">
        <Button
          variant={isListening ? "default" : "outline"}
          size="lg"
          onClick={isListening ? stopListening : startListening}
          disabled={disabled}
          className={cn(
            "w-20 h-20 rounded-full transition-all duration-300 shadow-lg",
            isListening ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/25 animate-pulse scale-110" : "hover:scale-105"
          )}
          aria-label={isListening ? "Stop voice recognition" : "Start voice recognition"}
          aria-pressed={isListening}
        >
          {isListening ? (<MicOff className="h-8 w-8" />) : (<Mic className="h-8 w-8" />)}
        </Button>

        <div className="space-y-1" role="status" aria-live="polite">
          <div className="text-lg font-semibold">{isListening ? "Listening..." : "Tap to Speak"}</div>
          <div className="text-sm text-muted-foreground">{isListening ? "Speak clearly and naturally" : "Click the microphone to start voice input"}</div>
        </div>

        {(transcript || finalTranscript) && (
          <div className="max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border rounded-lg p-4 shadow-sm" role="log" aria-live="assertive">
            {transcript && (<div className="text-muted-foreground italic text-sm">{transcript}</div>)}
            {finalTranscript && (<div className="text-foreground font-medium text-sm mt-1">&quot;{finalTranscript}&quot;</div>)}
          </div>
        )}
      </div>
    </div>
  );

  switch (mode) {
    case 'expanded':
      return renderExpanded();
    case 'center':
      return renderCenter();
    default:
      return renderCompact();
  }
}

// Minimal typings for SpeechRecognition on window
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
