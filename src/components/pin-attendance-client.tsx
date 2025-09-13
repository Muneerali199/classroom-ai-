'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { markStudentAttendanceWithPinAction } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { CheckCircle, XCircle, Hash, Loader2 } from 'lucide-react';

export default function PinAttendanceClient() {
    const { user } = useAuth();
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [pin, setPin] = useState('');

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
            const result = await markStudentAttendanceWithPinAction(pin.trim());
            if (result.success) {
                setStatus('success');
                setMessage(result.message || 'Successfully marked attendance');
                setPin(''); // Clear the PIN
            } else {
                setStatus('error');
                setMessage(result.message || 'Failed to mark attendance');
            }
        } catch (error) {
            setStatus('error');
            setMessage(error instanceof Error ? error.message : 'Failed to mark attendance');
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

                {message && status === 'submitting' && (
                    <Alert variant="default" className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <AlertTitle>Processing</AlertTitle>
                        <AlertDescription>Verifying your PIN and marking attendance...</AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}