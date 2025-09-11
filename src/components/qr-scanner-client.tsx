'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { markStudentAttendanceAction } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from './ui/button';
import { CheckCircle, XCircle, QrCode, HardHat } from 'lucide-react';

export default function QrScannerClient() {
    const { user } = useAuth();
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    // The QR scanner functionality is temporarily disabled due to an incompatible library.
    // The UI below reflects this status.

    return (
        <Card className="max-w-xl mx-auto">
            <CardHeader>
                <CardTitle>QR Code Scanner</CardTitle>
                <CardDescription>Point your camera at the QR code to mark your attendance.</CardDescription>
            </CardHeader>
            <CardContent>
                {status === 'idle' && (
                     <Alert variant="default" className="bg-yellow-500/10 border-yellow-500/50 text-yellow-700 dark:text-yellow-300">
                        <HardHat className="h-4 w-4" />
                        <AlertTitle>Feature Under Maintenance</AlertTitle>
                        <AlertDescription>
                            The QR code scanning feature is temporarily unavailable. We are working on an update. Please check back later.
                        </AlertDescription>
                    </Alert>
                )}

                {status === 'success' && (
                    <Alert variant="default" className="bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-300">
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>Success!</AlertTitle>
                        <AlertDescription>{message}</AlertDescription>
                    </Alert>
                )}

                {status === 'error' && (
                    <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{message}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}
