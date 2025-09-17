'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Play, 
  Square, 
  RotateCcw, 
  Users, 
  Clock, 
  Eye, 
  EyeOff,
  Copy,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { RealPinAttendanceService, type PinSession, type AttendanceRecord } from '@/lib/real-pin-attendance';
import { AuthService } from '@/lib/auth';

export default function RealPinSessionManager() {
  const [currentSession, setCurrentSession] = useState<PinSession | null>(null);
  const [sessionHistory, setSessionHistory] = useState<PinSession[]>([]);
  const [attendees, setAttendees] = useState<AttendanceRecord[]>([]);
  const [courseName, setCourseName] = useState('');
  const [location, setLocation] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    loadUserAndSession();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentSession?.is_active) {
      // Refresh attendees every 5 seconds for active sessions
      interval = setInterval(() => {
        loadAttendees(currentSession.id);
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentSession]);

  const loadUserAndSession = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      setCurrentUser(user);
      
      if (user) {
        await loadActiveSession(user.id);
        await loadSessionHistory(user.id);
      }
    } catch (error) {
      setError('Failed to load user session');
    }
  };

  const loadActiveSession = async (teacherId: string) => {
    const result = await RealPinAttendanceService.getActiveSession(teacherId);
    if (result.success && result.session) {
      setCurrentSession(result.session);
      await loadAttendees(result.session.id);
    }
  };

  const loadSessionHistory = async (teacherId: string) => {
    const result = await RealPinAttendanceService.getSessionHistory(teacherId);
    if (result.success && result.sessions) {
      setSessionHistory(result.sessions);
    }
  };

  const loadAttendees = async (sessionId: string) => {
    const result = await RealPinAttendanceService.getSessionAttendees(sessionId);
    if (result.success && result.attendees) {
      setAttendees(result.attendees);
    }
  };

  const startSession = async () => {
    if (!courseName.trim()) {
      setError('Please enter a course name');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await RealPinAttendanceService.startSession(courseName.trim(), location.trim() || undefined);
    
    if (result.success && result.session) {
      setCurrentSession(result.session);
      setAttendees([]);
      setCourseName('');
      setLocation('');
      if (currentUser) {
        await loadSessionHistory(currentUser.id);
      }
    } else {
      setError(result.error || 'Failed to start session');
    }
    
    setLoading(false);
  };

  const endSession = async () => {
    if (!currentSession) return;

    setLoading(true);
    const result = await RealPinAttendanceService.endSession(currentSession.id);
    
    if (result.success) {
      setCurrentSession(null);
      setAttendees([]);
      if (currentUser) {
        await loadSessionHistory(currentUser.id);
      }
    } else {
      setError(result.error || 'Failed to end session');
    }
    
    setLoading(false);
  };

  const regeneratePin = async () => {
    if (!currentSession) return;

    setLoading(true);
    const result = await RealPinAttendanceService.regeneratePin(currentSession.id);
    
    if (result.success && result.pin) {
      setCurrentSession({ ...currentSession, pin: result.pin });
    } else {
      setError(result.error || 'Failed to regenerate PIN');
    }
    
    setLoading(false);
  };

  const copyPin = async () => {
    if (!currentSession) return;

    try {
      await navigator.clipboard.writeText(currentSession.pin);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      setError('Failed to copy PIN');
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDuration = (start: string, end?: string) => {
    const startTime = new Date(start);
    const endTime = end ? new Date(end) : new Date();
    const durationMs = endTime.getTime() - startTime.getTime();
    const minutes = Math.floor(durationMs / 60000);
    return `${minutes} min`;
  };

  if (!currentUser) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Loading...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Current Session Status */}
      {currentSession ? (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-green-800 dark:text-green-200">
                  Active Session
                </CardTitle>
                <CardDescription className="text-green-600 dark:text-green-400">
                  {currentSession.course_name}
                  {currentSession.location && ` • ${currentSession.location}`}
                </CardDescription>
              </div>
              <Badge variant="default" className="bg-green-600">
                <Clock className="w-3 h-3 mr-1" />
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* PIN Display */}
            <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg border">
              <div className="flex-1">
                <Label className="text-sm font-medium">Session PIN</Label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-3xl font-mono font-bold tracking-widest">
                    {showPin ? currentSession.pin : '••••'}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowPin(!showPin)}
                    disabled={loading}
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={copyPin}
                    disabled={loading}
                    className={copySuccess ? 'text-green-600' : ''}
                  >
                    {copySuccess ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Started</p>
                <p className="font-medium">{formatTime(currentSession.start_time)}</p>
              </div>
            </div>

            {/* Session Actions */}
            <div className="flex gap-2">
              <Button onClick={regeneratePin} variant="outline" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RotateCcw className="w-4 h-4 mr-2" />}
                New PIN
              </Button>
              <Button onClick={endSession} variant="destructive" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Square className="w-4 h-4 mr-2" />}
                End Session
              </Button>
            </div>

            {/* Attendees */}
            <div>
              <Label className="text-sm font-medium">
                Attendees ({attendees.length})
              </Label>
              <div className="mt-2 p-3 bg-muted rounded-lg max-h-40 overflow-y-auto">
                {attendees.length > 0 ? (
                  <div className="space-y-2">
                    {attendees.map((attendee) => (
                      <div key={attendee.id} className="flex items-center justify-between text-sm">
                        <span className="font-medium">{attendee.student_name}</span>
                        <span className="text-muted-foreground">
                          {formatTime(attendee.marked_at)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No students have marked attendance yet
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Start New Session */
        <Card>
          <CardHeader>
            <CardTitle>Start Attendance Session</CardTitle>
            <CardDescription>
              Create a new session for students to mark their attendance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="courseName">Course/Subject Name *</Label>
              <Input
                id="courseName"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="e.g., Mathematics, English Literature"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Room 101, Science Lab"
                disabled={loading}
              />
            </div>
            <Button onClick={startSession} className="w-full" disabled={loading || !courseName.trim()}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
              Start Session
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Session History */}
      {sessionHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Session History</CardTitle>
            <CardDescription>
              Previous attendance sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sessionHistory.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{session.course_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(session.start_time)} - {session.end_time ? formatTime(session.end_time) : 'Ongoing'}
                      {session.location && ` • ${session.location}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">
                      <Users className="w-3 h-3 mr-1" />
                      {session.attendee_count || 0}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDuration(session.start_time, session.end_time)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}