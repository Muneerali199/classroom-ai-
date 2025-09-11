'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Camera, UserCheck, UserX, Scan, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { recognizeStudentsAction } from '@/app/actions';
import type { Student } from '@/lib/types';
import { Badge } from './ui/badge';

interface ScanAttendanceClientProps {
  students: Student[];
  onAttendanceUpdate: (presentStudentIds: string[]) => void;
}

export default function ScanAttendanceClient({ students, onAttendanceUpdate }: ScanAttendanceClientProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, startProcessing] = useTransition();
  const [scanResult, setScanResult] = useState<{ present: string[], absent: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        console.error('Camera not supported by this browser.');
        setHasCameraPermission(false);
        setError('Camera not supported by your browser.');
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
      } catch (err) {
        console.error('Error accessing camera:', err);
        setHasCameraPermission(false);
        setError('Camera access was denied. Please enable camera permissions in your browser settings.');
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleScan = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsScanning(true);
    setScanResult(null);
    setError(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUri = canvas.toDataURL('image/jpeg');
        
        startProcessing(async () => {
            const result = await recognizeStudentsAction(dataUri);
            if (result.success && result.presentStudents) {
                const presentNames = result.presentStudents;
                const absentNames = students.filter(s => !presentNames.includes(s.name)).map(s => s.name);
                setScanResult({ present: presentNames, absent: absentNames });
            } else {
                setError(result.error || 'An unexpected error occurred during processing.');
            }
            setIsScanning(false);
        });
    } else {
        setError("Could not get canvas context to capture image.");
        setIsScanning(false);
    }
  };
  
  const handleConfirmAttendance = () => {
    if (!scanResult) return;
    const presentStudentIds = students.filter(s => scanResult.present.includes(s.name)).map(s => s.id);
    onAttendanceUpdate(presentStudentIds);
    toast({
        title: "Attendance Updated",
        description: `${presentStudentIds.length} students marked as present based on the scan.`,
    });
    setScanResult(null);
  }

  const isLoading = isScanning || isProcessing;

  return (
    <Card className="w-full bg-card/50 dark:bg-white/5 border dark:border-white/10 backdrop-blur-lg">
      <CardHeader>
        <CardTitle>AI-Powered Attendance Scan</CardTitle>
        <CardDescription>
          Use your device's camera to scan the classroom and automatically mark attendance.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasCameraPermission === false && (
          <Alert variant="destructive">
             <Camera className="h-4 w-4" />
            <AlertTitle>Camera Access Required</AlertTitle>
            <AlertDescription>
              {error || "Please enable camera permissions to use this feature."}
            </AlertDescription>
          </Alert>
        )}
        <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
            <video ref={videoRef} className="h-full w-full object-cover" autoPlay playsInline muted />
            <canvas ref={canvasRef} className="hidden" />
            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white">
                    <Loader2 className="h-12 w-12 animate-spin" />
                    <p className="mt-4 text-lg font-semibold">{isScanning && !isProcessing ? 'Capturing...' : 'Analyzing Image...'}</p>
                    <p className="text-sm">Please hold steady.</p>
                </div>
            )}
        </div>
        
        {error && !isLoading && (
            <Alert variant="destructive">
                <AlertTitle>Scan Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {scanResult ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Scan Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-500">
                        <UserCheck className="h-5 w-5" />
                        <h4 className="font-medium">Present ({scanResult.present.length})</h4>
                    </div>
                    <div className="p-3 border rounded-md bg-background/50 dark:bg-black/20 max-h-40 overflow-y-auto">
                        {scanResult.present.length > 0 ? (
                            scanResult.present.map(name => <div key={name} className="py-1">{name}</div>)
                        ) : (
                            <p className="text-muted-foreground text-sm">No students were identified.</p>
                        )}
                    </div>
                </div>
                <div className="space-y-2">
                     <div className="flex items-center gap-2 text-red-500">
                        <UserX className="h-5 w-5" />
                        <h4 className="font-medium">Absent ({scanResult.absent.length})</h4>
                    </div>
                    <div className="p-3 border rounded-md bg-background/50 dark:bg-black/20 max-h-40 overflow-y-auto">
                        {scanResult.absent.map(name => <div key={name} className="py-1">{name}</div>)}
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setScanResult(null)}>Scan Again</Button>
                <Button onClick={handleConfirmAttendance}>Confirm Attendance</Button>
            </div>
          </div>  
        ) : (
            <Button
              onClick={handleScan}
              disabled={isLoading || hasCameraPermission !== true}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Scan className="mr-2 h-5 w-5" />
              )}
              {isProcessing ? 'Processing...' : 'Scan Classroom'}
            </Button>
        )}

      </CardContent>
      <CardFooter>
          <Alert className="bg-transparent border-border/50 dark:border-white/10">
              <Users className="h-4 w-4" />
              <AlertTitle>How to get the best results</AlertTitle>
              <AlertDescription>
                Ensure good lighting and that students' faces are clearly visible. The AI is powerful but not perfect.
              </AlertDescription>
          </Alert>
      </CardFooter>
    </Card>
  );
}
