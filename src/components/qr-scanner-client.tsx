'use client';

import { useState, useEffect } from 'react';
import { Html5QrcodeScanner, Html5QrcodeError, Html5QrcodeResult } from 'html5-qrcode';
import { useAuth } from '@/hooks/use-auth';
import { markStudentAttendanceAction } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from './ui/button';
import { CheckCircle, XCircle, QrCode, HardHat, CameraOff } from 'lucide-react';
import { students } from '@/lib/data';

const QR_SCANNER_ELEMENT_ID = "qr-scanner";

export default function QrScannerClient() {
    const { user } = useAuth();
    const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        if (status !== 'scanning' || scanner) return;

        const qrScanner = new Html5QrcodeScanner(
            QR_SCANNER_ELEMENT_ID,
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                supportedScanTypes: [], // Use all supported scan types.
            },
            false // verbose
        );

        const onScanSuccess = async (decodedText: string, decodedResult: Html5QrcodeResult) => {
            qrScanner.clear();
            setScanner(null);
            
            try {
                const { sessionId } = JSON.parse(decodedText);
                if (!sessionId) {
                    throw new Error("Invalid QR code format.");
                }

                // Find student ID based on logged-in user's email or name
                // This is a simulation. In a real app, you'd get the student's DB record.
                const student = students.find(s => s.name === user?.displayName);
                
                if (!student) {
                    setStatus('error');
                    setMessage("Could not identify the student. Please ensure your profile name is correct.");
                    return;
                }

                const result = await markStudentAttendanceAction(sessionId, student.id);
                if (result.success) {
                    setStatus('success');
                    setMessage(result.message);
                } else {
                    setStatus('error');
                    setMessage(result.message);
                }

            } catch (error) {
                setStatus('error');
                setMessage('Invalid QR code. Please scan the code provided by your teacher.');
            }
        };

        const onScanFailure = (error: Html5QrcodeError) => {
           // This is called frequently, so we don't want to spam the console or state.
           // You could add logic here for specific error handling if needed.
        };

        qrScanner.render(onScanSuccess, onScanFailure);
        setScanner(qrScanner);
        
        return () => {
            if (scanner) {
                scanner.clear().catch(error => {
                    console.error("Failed to clear html5-qrcode-scanner.", error);
                });
            }
        }
    }, [status, user, scanner]);

    const handleStartScan = () => {
        setStatus('scanning');
        setMessage('');
    }
    
    const handleReset = () => {
        setStatus('idle');
        setMessage('');
    }

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
                
                {status === 'scanning' && <div id={QR_SCANNER_ELEMENT_ID} />}

                {status === 'success' && (
                    <Alert variant="default" className="bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-300">
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>Success!</AlertTitle>
                        <AlertDescription>{message}</AlertDescription>
                        <Button variant="link" onClick={handleReset} className="p-0 h-auto mt-2">Scan another code</Button>
                    </Alert>
                )}

                {status === 'error' && (
                    <Alert variant="destructive">
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
