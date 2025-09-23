'use client';

import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    loadUserAndSession();
  }, []);

  // Realtime: subscribe to attendee changes and session updates for the current session
  useEffect(() => {
    if (!currentSession?.id) return;
    const supabase = getSupabase();

    const attendeesChannel = supabase
      .channel(`session-attendees-${currentSession.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'session_attendance_records', filter: `session_id=eq.${currentSession.id}` }, (payload) => {
        console.log('🔔 Real-time: Attendance record changed', payload);
        loadAttendees(currentSession.id);
      })
      .subscribe();

    const sessionChannel = supabase
      .channel(`session-${currentSession.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'attendance_sessions', filter: `id=eq.${currentSession.id}` }, (payload) => {
        const updated = payload.new as any;
        setCurrentSession(prev => prev ? { ...prev, pin: updated.pin ?? prev.pin, end_time: updated.end_time ?? prev.end_time, is_active: !updated.end_time } : prev);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(attendeesChannel);
      supabase.removeChannel(sessionChannel);
    };
  }, [currentSession?.id]);

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
    try {
      const res = await fetch(`/api/attendance/sessions/active?teacherId=${encodeURIComponent(teacherId)}`);
      if (!res.ok) { setCurrentSession(null); return; }
      const session = await res.json();
      if (session) {
        setCurrentSession(session);
        await loadAttendees(session.id);
      } else {
        setCurrentSession(null);
      }
    } catch { setCurrentSession(null); }
  };

  const loadSessionHistory = async (teacherId: string) => {
    try {
      const params = new URLSearchParams({ teacherId });
      if (startDate) params.set('start', new Date(startDate).toISOString());
      if (endDate) params.set('end', new Date(endDate).toISOString());
      const res = await fetch(`/api/attendance/sessions/history?${params.toString()}`);
      if (!res.ok) return;
      const list = await res.json();
      setSessionHistory(Array.isArray(list) ? list : []);
    } catch {}
  };

  const loadAttendees = async (sessionId: string) => {
    try {
      console.log('📋 Loading attendees for session:', sessionId);
      const res = await fetch(`/api/attendance/sessions/${sessionId}/attendees`);
      if (!res.ok) {
        console.error('❌ Failed to load attendees:', res.status);
        return;
      }
      const list = await res.json();
      console.log('✅ Loaded attendees:', list);
      setAttendees(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('❌ Error loading attendees:', error);
    }
  };

  const startSession = async () => {
    if (!courseName.trim()) {
      setError('Please enter a course name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/attendance/sessions/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          course_name: courseName.trim(), 
          location: location.trim() || undefined,
          teacher_id: currentUser?.id 
        })
      });

      if (res.ok) {
        const session = await res.json();
        setCurrentSession(session);
        setAttendees([]);
        setCourseName('');
        setLocation('');
        setShowSuccessModal(true);
        // Load attendees for the new session (should be empty initially)
        await loadAttendees(session.id);
        if (currentUser) {
          await loadSessionHistory(currentUser.id);
        }
      } else {
        const error = await res.json().catch(() => ({ error: 'Failed to start session' }));
        setError(error.error || 'Failed to start session');
      }
    } catch (error) {
      setError('Failed to start session');
    }
    
    setLoading(false);
  };

  const endSession = async () => {
    if (!currentSession) return;

    setLoading(true);
    
    try {
      const res = await fetch(`/api/attendance/sessions/${currentSession.id}/end`, {
        method: 'POST'
      });

      if (res.ok) {
        setCurrentSession(null);
        setAttendees([]);
        if (currentUser) {
          await loadSessionHistory(currentUser.id);
        }
      } else {
        const error = await res.json().catch(() => ({ error: 'Failed to end session' }));
        setError(error.error || 'Failed to end session');
      }
    } catch (error) {
      setError('Failed to end session');
    }
    
    setLoading(false);
  };

  const regeneratePin = async () => {
    if (!currentSession) return;

    setLoading(true);
    
    try {
      const res = await fetch(`/api/attendance/sessions/${currentSession.id}/regenerate`, {
        method: 'POST'
      });

      if (res.ok) {
        const { pin } = await res.json();
        setCurrentSession({ ...currentSession, pin });
      } else {
        const error = await res.json().catch(() => ({ error: 'Failed to regenerate PIN' }));
        setError(error.error || 'Failed to regenerate PIN');
      }
    } catch (error) {
      setError('Failed to regenerate PIN');
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
                    {showPin ? currentSession.pin : '•'.repeat(currentSession.pin?.length || 5)}
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
                    title="Copy PIN"
                  >
                    {copySuccess ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={copyPin}
                    disabled={loading}
                    className={copySuccess ? 'text-green-600 border-green-600' : ''}
                  >
                    {copySuccess ? 'Copied!' : 'Copy PIN'}
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
              <div className="flex justify-end my-2">
                <Button size="sm" variant="outline" onClick={() => {
                  const header = 'Name,Email,Marked At\n';
                  const rows = attendees.map(a => {
                    const name = (a as any).student_name || '';
                    const email = (a as any).student_email || '';
                    const ts = new Date((a as any).marked_at).toISOString();
                    return [name, email, ts].map(v => `"${String(v).replace(/"/g,'""')}"`).join(',');
                  }).join('\n');
                  const csv = header + rows;
                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `attendees-${currentSession?.id || 'session'}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}>Export CSV</Button>
              </div>
              <div className="mt-2 p-3 bg-muted rounded-lg max-h-40 overflow-y-auto">
                {attendees.length > 0 ? (
                  <div className="space-y-2">
                    {attendees.map((attendee) => (
                      <div key={attendee.id} className="flex items-center justify-between text-sm">
                        <div>
                          <span className="font-medium">{(attendee as any).student_name || 'Student'}</span>
                          <span className="ml-2 text-xs text-muted-foreground">{(attendee as any).student_email || ''}</span>
                        </div>
                        <span className="text-muted-foreground">{formatTime((attendee as any).marked_at)}</span>
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
            <div className="flex flex-wrap items-end gap-3 mb-4">
              <div>
                <Label className="text-sm">From</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div>
                <Label className="text-sm">To</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <Button variant="outline" onClick={() => { if (currentUser) loadSessionHistory(currentUser.id); }}>Apply</Button>
            </div>
            <div className="space-y-3">
              {sessionHistory.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{session.course_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(session.start_time).toLocaleDateString()} • {formatTime(session.start_time)} - {session.end_time ? formatTime(session.end_time) : 'Ongoing'}
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
                    <div className="mt-2">
                      <Button size="sm" variant="outline" onClick={async () => {
                        try {
                          const res = await fetch(`/api/attendance/sessions/${session.id}/attendees`);
                          if (!res.ok) return;
                          const attendees = await res.json();
                          const header = 'Name,Email,Marked At\n';
                          const rows = (attendees || []).map((a: any) => {
                            const name = a.student_name || '';
                            const email = a.student_email || '';
                            const ts = new Date(a.marked_at).toISOString();
                            return [name, email, ts].map(v => `"${String(v).replace(/"/g,'""')}"`).join(',');
                          }).join('\n');
                          const csv = header + rows;
                          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `attendees-${session.id}.csv`;
                          a.click();
                          URL.revokeObjectURL(url);
                        } catch {}
                      }}>Export CSV</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Modal with Confetti */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-green-700 flex items-center justify-center gap-2">
              <CheckCircle className="w-6 h-6" />
              Session Started!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-lg font-medium text-gray-800 mb-2">Success!</p>
            <p className="text-sm text-gray-600 mb-2">Your attendance session has been created.</p>
            {currentSession && (
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-gray-600">Session PIN:</p>
                <p className="text-2xl font-mono font-bold text-blue-600">{currentSession.pin}</p>
              </div>
            )}
            <Button onClick={() => setShowSuccessModal(false)} className="w-full">
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}