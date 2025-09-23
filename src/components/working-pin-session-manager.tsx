'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
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
  XCircle
} from 'lucide-react';

interface AttendanceSession {
  id: string;
  courseId: string;
  courseName: string;
  teacherId: string;
  teacherName: string;
  pin: string;
  startTime: string;
  endTime?: string;
  isActive: boolean;
  attendees: string[];
  location?: string;
}

export default function WorkingPinSessionManager() {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [currentSession, setCurrentSession] = useState<AttendanceSession | null>(null);
  const [courseName, setCourseName] = useState('');
  const [location, setLocation] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const generatePin = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };

  const startSession = () => {
    if (!courseName.trim()) {
      alert('Please enter a course name');
      return;
    }

    const newSession: AttendanceSession = {
      id: Date.now().toString(),
      courseId: `course-${Date.now()}`,
      courseName: courseName.trim(),
      teacherId: 'teacher-1',
      teacherName: 'Current Teacher',
      pin: generatePin(),
      startTime: new Date().toISOString(),
      isActive: true,
      attendees: [],
      location: location.trim() || undefined
    };

    setSessions(prev => [...prev, newSession]);
    setCurrentSession(newSession);
    setCourseName('');
    setLocation('');
  };

  const endSession = () => {
    if (!currentSession) return;

    const updatedSession = {
      ...currentSession,
      endTime: new Date().toISOString(),
      isActive: false
    };

    setSessions(prev => 
      prev.map(session => 
        session.id === currentSession.id ? updatedSession : session
      )
    );
    setCurrentSession(null);
  };

  const regeneratePin = () => {
    if (!currentSession) return;

    const newPin = generatePin();
    const updatedSession = {
      ...currentSession,
      pin: newPin
    };

    setSessions(prev => 
      prev.map(session => 
        session.id === currentSession.id ? updatedSession : session
      )
    );
    setCurrentSession(updatedSession);
  };

  const copyPin = async () => {
    if (!currentSession) return;

    try {
      await navigator.clipboard.writeText(currentSession.pin);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy PIN:', error);
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

  return (
    <div className="space-y-6">
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
                  {currentSession.courseName}
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
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={copyPin}
                    className={copySuccess ? 'text-green-600' : ''}
                  >
                    {copySuccess ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Started</p>
                <p className="font-medium">{formatTime(currentSession.startTime)}</p>
              </div>
            </div>

            {/* Session Actions */}
            <div className="flex gap-2">
              <Button onClick={regeneratePin} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                New PIN
              </Button>
              <Button onClick={endSession} variant="destructive">
                <Square className="w-4 h-4 mr-2" />
                End Session
              </Button>
            </div>

            {/* Attendees */}
            <div>
              <Label className="text-sm font-medium">
                Attendees ({currentSession.attendees.length})
              </Label>
              <div className="mt-2 p-3 bg-muted rounded-lg">
                {currentSession.attendees.length > 0 ? (
                  <div className="space-y-1">
                    {currentSession.attendees.map((attendee, index) => (
                      <div key={index} className="text-sm">
                        {attendee}
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Room 101, Science Lab"
              />
            </div>
            <Button onClick={startSession} className="w-full">
              <Play className="w-4 h-4 mr-2" />
              Start Session
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Session History */}
      {sessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Session History</CardTitle>
            <CardDescription>
              Previous attendance sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sessions
                .filter(session => !session.isActive)
                .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                .map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{session.courseName}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(session.startTime)} - {session.endTime ? formatTime(session.endTime) : 'Ongoing'}
                        {session.location && ` • ${session.location}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">
                        <Users className="w-3 h-3 mr-1" />
                        {session.attendees.length}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDuration(session.startTime, session.endTime)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Demo Instructions */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">
            How to Use
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-blue-700 dark:text-blue-300">
          <ol className="list-decimal list-inside space-y-2">
            <li>Start a new attendance session by entering course details</li>
            <li>Share the generated PIN with your students</li>
            <li>Students can enter the PIN on their devices to mark attendance</li>
            <li>Monitor attendance in real-time</li>
            <li>Generate a new PIN if needed for security</li>
            <li>End the session when class is finished</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}