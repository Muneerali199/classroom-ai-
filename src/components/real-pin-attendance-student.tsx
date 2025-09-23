'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { CheckCircle, XCircle, Hash, Loader2, Copy } from 'lucide-react';
import { AuthService } from '@/lib/auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// Server route will handle validation and RLS via admin client

export default function RealPinAttendanceStudent() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [pin, setPin] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSubmitPin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!pin.trim()) {
            setStatus('error');
            setMessage('Please enter a PIN');
            return;
        }

        if (pin.length < 5 || pin.length > 5) {
            setStatus('error');
            setMessage('PIN must be exactly 5 digits');
            return;
        }

        setStatus('submitting');
        setMessage('');

        try {
            const user = await AuthService.getCurrentUser();
            const student_id = user?.id;
            const student_email = user?.email;
            if (!student_id) {
                setStatus('error');
                setMessage('Please sign in');
                return;
            }
            const res = await fetch('/api/attendance/mark', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pin: pin.trim(), student_id, student_email })
            });
            if (res.ok) {
                setStatus('success');
                setMessage('Attendance marked successfully!');
                setPin('');
                setShowSuccessModal(true);
                // Notify header bell
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('notify', { detail: { title: 'Attendance', message: 'Marked successfully', ts: Date.now() } }));
                }
            } else if (res.status === 409) {
                setStatus('error');
                setMessage('You have already marked attendance for this session');
            } else if (res.status === 400) {
                const j = await res.json().catch(() => ({}));
                setStatus('error');
                setMessage(j.error || 'Invalid or inactive PIN');
            } else if (res.status === 401) {
                setStatus('error');
                setMessage('Please sign in');
            } else {
                setStatus('error');
                setMessage('Failed to mark attendance');
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
        setShowSuccessModal(false);
    };

    const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Only allow digits
        if (value.length <= 5) {
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
                        Enter the 5-digit PIN provided by your teacher to mark your attendance.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {status === 'idle' || status === 'submitting' ? (
                        <form onSubmit={handleSubmitPin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="pin">Attendance PIN</Label>
                                <div className="flex items-center gap-2">
                                  <Input
                                      id="pin"
                                      type="text"
                                      inputMode="numeric"
                                      pattern="[0-9]*"
                                      value={pin}
                                      onChange={handlePinChange}
                                      placeholder="Enter 5-digit PIN"
                                      className="text-center text-2xl font-mono tracking-wider"
                                      maxLength={5}
                                      disabled={status === 'submitting'}
                                      autoComplete="off"
                                  />
                                  <Button type="button" variant="outline" size="icon" disabled={!pin} onClick={async () => {
                                    try { await navigator.clipboard.writeText(pin); } catch {}
                                  }} title="Copy PIN">
                                    <Copy className="w-4 h-4"/>
                                  </Button>
                                </div>
                                <p className="text-sm text-muted-foreground text-center">
                                    Ask your teacher for the current session PIN
                                </p>
                            </div>
                            
                            <Button 
                                type="submit" 
                                className="w-full" 
                                disabled={status === 'submitting' || pin.length !== 5}
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

            {/* Instructions */}
            <Card className="max-w-xl mx-auto">
                <CardHeader>
                    <CardTitle>How it works</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-medium">
                                1
                            </div>
                            <p>Your teacher will start an attendance session for your class</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-medium">
                                2
                            </div>
                            <p>They will share a 5-digit PIN with the class</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-medium">
                                3
                            </div>
                            <p>Enter the PIN above to mark your attendance instantly</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-medium">
                                4
                            </div>
                            <p>You&apos;ll get confirmation that your attendance was recorded</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Success Modal with Confetti */}
            <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center text-green-700 flex items-center justify-center gap-2">
                            <CheckCircle className="w-6 h-6" />
                            Attendance Marked!
                        </DialogTitle>
                    </DialogHeader>
                    <div className="text-center py-6">
                        <div className="text-6xl mb-4">🎉</div>
                        <p className="text-lg font-medium text-gray-800 mb-2">Success!</p>
                        <p className="text-sm text-gray-600 mb-4">Your attendance has been recorded successfully.</p>
                        <Button onClick={() => setShowSuccessModal(false)} className="w-full">
                            Continue
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}