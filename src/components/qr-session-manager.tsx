'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
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
import { Loader2, QrCode, Timer, Users } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { createAttendanceSessionAction, getSessionAttendanceAction } from '@/app/actions';
import type { AttendanceSession, Student } from '@/lib/types';

interface QrSessionManagerProps {
    students: Student[];
}

export default function QrSessionManager({ students }: QrSessionManagerProps) {
  const { user } = useAuth();
  const [duration, setDuration] = useState(10); // Default duration in minutes
  const [session, setSession] = useState<AttendanceSession | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [attendanceRecords, setAttendanceRecords] = useState<{ studentName: string; timestamp: string }[]>([]);

  // Check if user is a teacher
  const isTeacher = user?.role === 'teacher' || user?.user_metadata?.role === 'teacher';

  const handleCreateSession = () => {
    setError(null);
    if (!user) {
      setError('You must be logged in to create a session.');
      return;
    }

    if (!isTeacher) {
      setError('Only teachers can create QR code attendance sessions.');
      return;
    }

    startTransition(async () => {
      const teacherName = user.user_metadata?.displayName || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown Teacher';
      const result = await createAttendanceSessionAction('CMPT-101', user.id!, duration, teacherName);
      if (result.success && result.session && result.qrCodeDataUrl) {
        setSession(result.session);
        setQrCode(result.qrCodeDataUrl);
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
            const sessionToEnd = session || { endTime: new Date(0).toISOString() };
            if (new Date() > new Date(sessionToEnd.endTime)) {
                clearInterval(interval);
            }
        }, 5000); // Poll every 5 seconds
    };

  const isSessionActive = session && new Date() < new Date(session.endTime);

  // Show access restriction for non-teachers
  if (!isTeacher) {
    return (
      <div className="grid gap-6 lg:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>QR Code Attendance</CardTitle>
            <CardDescription>
              Generate QR codes for student attendance tracking.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="default" className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
              <QrCode className="h-4 w-4" />
              <AlertTitle>Teacher Access Only</AlertTitle>
              <AlertDescription>
                QR code attendance sessions can only be created by teachers. If you are a teacher, please ensure your account role is set correctly.
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
          <CardTitle>QR Code Attendance</CardTitle>
          <CardDescription>
            Create a timed attendance session and generate a QR code for students to scan.
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
                {qrCode && (
                    <div className="p-4 border rounded-lg inline-block bg-white">
                        <Image src={qrCode} alt="Attendance QR Code" width={256} height={256} />
                    </div>
                )}
                <p className="text-sm text-muted-foreground">
                    Session ends at {new Date(session.endTime).toLocaleTimeString()}
                </p>
                <Button variant="outline" onClick={() => setSession(null)}>End Session and Start New</Button>
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
                <QrCode className="h-4 w-4" />
                <AlertTitle>How it works</AlertTitle>
                <AlertDescription>
                    Students scan this code in their app to be marked as present. The code is valid only for the duration you set.
                </AlertDescription>
            </Alert>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
            <CardTitle>Live Attendance</CardTitle>
            <CardDescription>Students who have successfully scanned the code will appear here in real-time.</CardDescription>
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
                           <span>Session Ends: {new Date(session.endTime).toLocaleTimeString()}</span>
                        </div>
                    </div>
                    <div className="border rounded-b-lg max-h-80 overflow-y-auto">
                        {attendanceRecords.length > 0 ? (
                             <ul className="divide-y divide-border">
                                {attendanceRecords.map((record, index) => (
                                    <li key={index} className="px-4 py-3 flex justify-between items-center">
                                        <span className="font-medium">{record.studentName}</span>
                                        <span className="text-sm text-muted-foreground">{new Date(record.timestamp).toLocaleTimeString()}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="p-8 text-center text-muted-foreground">
                                Waiting for students to scan...
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
