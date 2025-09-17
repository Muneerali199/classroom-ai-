'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { CheckCircle, XCircle, Hash, Loader2 } from 'lucide-react';
import { AuthService } from '@/lib/auth';

export default function SimplePinAttendance() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [pin, setPin] = useState('');

    // Mock active sessions for demo
    const mockSessions = [
        { id: '1', pin: '1234', course: 'Mathematics', teacher: 'Ms. Johnson' },
        { id: '2', pin: '5678', course: 'English', teacher: 'Mr. Smith' },
        { id: '3', pin: '9999', course: 'Science', teacher: 'Dr. Brown' },
    ];

    const handleSubmitPin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!pin.trim()) {
            setStatus('error');
            setMessage('Please enter a PIN');
            return;
        }

        if (pin.length < 4 || pin.length > 8) {
            setStatus('error');
            setMessage('PIN must be 4-8 digits');
            return;
        }

        setStatus('submitting');
        setMessage('');

        try {
            // Get current user
            const user = await AuthService.getCurrentUser();
            
            if (!user) {
                setStatus('error');
                setMessage('You must be logged in to mark attendance');
                return;
            }

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Check if PIN matches any active session
            const matchingSession = mockSessions.find(session => session.pin === pin.trim());
            
            if (matchingSession) {
                setStatus('success');
                setMessage(`Attendance marked for ${matchingSession.course} with ${matchingSession.teacher}`);
                setPin(''); // Clear the PIN
            } else {
                setStatus('error');
                setMessage('Invalid PIN. Please check with your teacher and try again.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Failed to mark attendance. Please try again.');
        }
    };

    const handleReset = () => {
        setStatus('idle');
        setMessage('');
        setPin('');
    };

    const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Only allow digits
        if (value.length <= 8) {
            setPin(value);
            if (status === 'error') {
                setStatus('idle');
                setMessage('');
            }
        }
    };

    return (
        <div className="space-y-6">
            <Card className="max-w-xl mx-auto">
                <CardHeader>
                    <CardTitle>PIN Attendance</CardTitle>
                    <CardDescription>
                        Enter the PIN provided by your teacher to mark your attendance.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {status === 'idle' || status === 'submitting' ? (
                        <form onSubmit={handleSubmitPin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="pin">Attendance PIN</Label>
                                <Input
                                    id="pin"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={pin}
                                    onChange={handlePinChange}
                                    placeholder="Enter 4-8 digit PIN"
                                    className="text-center text-2xl font-mono tracking-wider"
                                    maxLength={8}
                                    disabled={status === 'submitting'}
                                    autoComplete="off"
                                />
                                <p className="text-sm text-muted-foreground text-center">
                                    Ask your teacher for the current session PIN
                                </p>
                            </div>
                            
                            <Button 
                                type="submit" 
                                className="w-full" 
                                disabled={status === 'submitting' || pin.length < 4}
                            >
                                {status === 'submitting' ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Marking Attendance...
                                    </>
                                ) : (
                                    <>
                                        <Hash className="mr-2 h-4 w-4" />
                                        Mark Attendance
                                    </>
                                )}
                            </Button>
                        </form>
                    ) : null}

                    {status === 'success' && (
                        <Alert variant="default" className="bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-300" role="status">
                            <CheckCircle className="h-4 w-4" />
                            <AlertTitle>Success!</AlertTitle>
                            <AlertDescription>{message}</AlertDescription>
                            <Button variant="link" onClick={handleReset} className="p-0 h-auto mt-2">
                                Enter another PIN
                            </Button>
                        </Alert>
                    )}

                    {status === 'error' && (
                        <Alert variant="destructive" role="alert">
                            <XCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{message}</AlertDescription>
                            <Button variant="link" onClick={handleReset} className="p-0 h-auto mt-2 text-destructive">
                                Try again
                            </Button>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Demo Information */}
            <Card className="max-w-xl mx-auto">
                <CardHeader>
                    <CardTitle>Demo Information</CardTitle>
                    <CardDescription>
                        For testing purposes, try these PINs:
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {mockSessions.map((session) => (
                            <div key={session.id} className="flex justify-between items-center p-2 bg-muted rounded">
                                <span className="text-sm">{session.course} - {session.teacher}</span>
                                <code className="bg-background px-2 py-1 rounded text-sm font-mono">
                                    {session.pin}
                                </code>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}