'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { markStudentAttendanceAction } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from './ui/button';
import { CheckCircle, XCircle, QrCode } from 'lucide-react';
import { students } from '@/lib/data';
import dynamic from 'next/dynamic';

// Dynamically import QR scanner to avoid SSR issues with camera access
const QrScannerDialog = dynamic(() => import('./qr-scanner-dialog').then(mod => mod.QrScannerDialog), {
    ssr: false
});

const QR_SCANNER_ELEMENT_ID = "qr-scanner-element";

export default function QrScannerClient() {
    const { user } = useAuth();
    const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [scannerKey, setScannerKey] = useState(0); // Add key to force re-mount of scanner

    const handleScanSuccess = async (decodedText: string) => {
        try {
            let data;
            try {
                data = JSON.parse(decodedText);
            } catch {
                throw new Error("Invalid QR code format");
            }
            
            if (!data.sessionId) {
                throw new Error("Invalid QR code format - no session ID found");
            }

            const student = students.find(s => s.name === user?.displayName);
            if (!student) {
                throw new Error("Could not identify the student. Please ensure your profile name is correct.");
            }

            const result = await markStudentAttendanceAction(data.sessionId, student.id);
            if (result.success) {
                setStatus('success');
                setMessage(result.message || 'Successfully marked attendance');
            } else {
                throw new Error(result.message || 'Failed to mark attendance');
            }
        } catch (error) {
            setStatus('error');
            setMessage(error instanceof Error ? error.message : 'Failed to scan QR code');
        }
    };

    const handleStartScan = () => {
        setStatus('scanning');
        setMessage('');
        setScannerKey(prev => prev + 1); // Force scanner remount
    };
    
    const handleReset = () => {
        setStatus('idle');
        setMessage('');
        setScannerKey(prev => prev + 1); // Reset scanner when starting over
    };

    return (
        <Card className="max-w-xl mx-auto">
            <CardHeader>
                <CardTitle>QR Code Scanner</CardTitle>
                <CardDescription>Point your camera at the QR code to mark your attendance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {status === 'idle' && (
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg text-center">
                        <QrCode className="w-16 h-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">Ready to Scan</h3>
                        <p className="text-muted-foreground mb-4">Click the button below to start the camera.</p>
                        <Button onClick={handleStartScan}>Start Scanning</Button>
                    </div>
                )}
                
                {status === 'scanning' && (
                    <QrScannerDialog 
                        key={scannerKey} // Force remount when key changes
                        isOpen={true}
                        onClose={() => setStatus('idle')}
                        onScanSuccess={handleScanSuccess}
                        id={QR_SCANNER_ELEMENT_ID}
                    />
                )}

                {status === 'success' && (
                    <Alert variant="default" className="bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-300" role="status">
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>Success!</AlertTitle>
                        <AlertDescription>{message}</AlertDescription>
                        <Button variant="link" onClick={handleReset} className="p-0 h-auto mt-2">Scan another code</Button>
                    </Alert>
                )}

                {status === 'error' && (
                    <Alert variant="destructive" role="alert">
                        <XCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{message}</AlertDescription>
                        <Button variant="link" onClick={handleReset} className="p-0 h-auto mt-2 text-destructive">Try again</Button>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}
