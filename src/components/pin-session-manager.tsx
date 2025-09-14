'use client';

import { useState, useTransition, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Hash, Timer, Users, Copy, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { createPinAttendanceSessionAction, getSessionAttendanceAction } from '@/app/actions';
import type { AttendanceSession } from '@/lib/database.types';
import type { Student } from '@/lib/types';

interface PinSessionManagerProps {
    students: Student[];
}

export default function PinSessionManager({ students }: PinSessionManagerProps) {
  const { user } = useAuth();
  const [duration, setDuration] = useState(10); // Default duration in minutes
  const [session, setSession] = useState<AttendanceSession | null>(null);
  const [sessionPin, setSessionPin] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [attendanceRecords, setAttendanceRecords] = useState<{ studentName: string; timestamp: string }[]>([]);
  const [copied, setCopied] = useState(false);

  // Check if user is a teacher
  const isTeacher = user?.role === 'teacher' || user?.user_metadata?.role === 'teacher';

  const handleCreateSession = () => {
    setError(null);
    if (!user) {
      setError('You must be logged in to create a session.');
      return;
    }

    if (!isTeacher) {
      setError('Only teachers can create PIN attendance sessions.');
      return;
    }

    startTransition(async () => {
      const teacherName = user.user_metadata?.displayName || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown Teacher';
      const result = await createPinAttendanceSessionAction('CMPT-101', user.id!, duration, teacherName);
      if (result.success && result.session && result.pin) {
        setSession(result.session);
        setSessionPin(result.pin);
        // Start polling for attendance
        pollAttendance(result.session.id);
      } else {
        setError(result.error || 'An unknown error occurred.');
      }
    });
  };

  const pollAttendance = (sessionId: string) => {
    const interval = setInterval(async () => {
      const result = await getSessionAttendanceAction(sessionId);
      if (result.success && result.records) {
        setAttendanceRecords(result.records);
      }

      // Stop polling if session has ended
      const sessionToEnd = session || { end_time: new Date(0).toISOString() };
      if (new Date() > new Date(sessionToEnd.end_time)) {
        clearInterval(interval);
      }
    }, 5000); // Poll every 5 seconds
  };

  const copyPin = async () => {
    if (sessionPin) {
      await navigator.clipboard.writeText(sessionPin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isSessionActive = session && new Date() < new Date(session.end_time);

  // Show access restriction for non-teachers
  if (!isTeacher) {
    return (
      <div className="grid gap-6 lg:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>PIN Attendance</CardTitle>
            <CardDescription>
              Generate secure PINs for student attendance tracking.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="default" className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
              <Hash className="h-4 w-4" />
              <AlertTitle>Teacher Access Only</AlertTitle>
              <AlertDescription>
                PIN attendance sessions can only be created by teachers. If you are a teacher, please ensure your account role is set correctly.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>PIN Attendance</CardTitle>
          <CardDescription>
            Create a timed attendance session with a secure PIN for students to enter.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!session || !isSessionActive ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Session Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min="1"
                  max="120"
                  disabled={!isTeacher}
                />
              </div>
              <Button onClick={handleCreateSession} disabled={isPending || !isTeacher} className="w-full">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? 'Creating Session...' : 'Create New Session'}
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Session is Active</h3>
              {sessionPin && (
                <div className="p-6 border-2 border-primary/20 rounded-lg bg-primary/5 space-y-3">
                  <div className="text-sm font-medium text-muted-foreground">Attendance PIN</div>
                  <div className="text-4xl font-mono font-bold tracking-wider text-primary">
                    {sessionPin}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyPin}
                    className="w-full"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy PIN
                      </>
                    )}
                  </Button>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                Session ends at {new Date(session.end_time).toLocaleTimeString()}
              </p>
              <Button variant="outline" onClick={() => setSession(null)}>
                End Session and Start New
              </Button>
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Alert className="bg-transparent border-border/50 dark:border-white/10">
            <Hash className="h-4 w-4" />
            <AlertTitle>How it works</AlertTitle>
            <AlertDescription>
              Students enter this PIN in their app to be marked as present. The PIN is valid only for the duration you set and expires automatically.
            </AlertDescription>
          </Alert>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Live Attendance</CardTitle>
          <CardDescription>
            Students who have successfully entered the PIN will appear here in real-time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {session ? (
            <div>
              <div className="flex justify-between items-center bg-muted/50 dark:bg-white/5 px-4 py-2 rounded-t-lg">
                <div className="flex items-center gap-2 text-primary">
                  <Users className="h-5 w-5" />
                  <span className="font-semibold">{attendanceRecords.length} / {students.length} Students Present</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Timer className="h-5 w-5" />
                  <span>Session Ends: {new Date(session.end_time).toLocaleTimeString()}</span>
                </div>
              </div>
              <div className="border rounded-b-lg max-h-80 overflow-y-auto">
                {attendanceRecords.length > 0 ? (
                  <ul className="divide-y divide-border">
                    {attendanceRecords.map((record, index) => (
                      <li key={index} className="px-4 py-3 flex justify-between items-center">
                        <span className="font-medium">{record.studentName}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(record.timestamp).toLocaleTimeString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="p-8 text-center text-muted-foreground">
                    Waiting for students to enter PIN...
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              <p>Create a session to see live attendance data.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}