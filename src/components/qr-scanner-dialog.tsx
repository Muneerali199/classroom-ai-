'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';
import { Loader2, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface QrScannerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
  id: string;
}

export function QrScannerDialog({
  isOpen,
  onClose,
  onScanSuccess,
  id,
}: QrScannerDialogProps) {
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const html5QrCode = useRef<Html5Qrcode | null>(null);
  useEffect(() => {
    const startScanner = async () => {
      if (!isOpen) return;
      
      setIsInitializing(true);
      setCameraError(null);

      try {
        // Clean up any existing instance
        if (html5QrCode.current) {
          await html5QrCode.current.stop();
          html5QrCode.current = null;
        }

        // Create new instance
        html5QrCode.current = new Html5Qrcode(id);

        // Get available cameras
        const devices = await Html5Qrcode.getCameras();
        if (!devices || devices.length === 0) {
          throw new Error('No camera devices found');
        }

        // Start scanning with the first available camera
        await html5QrCode.current.start(
          devices[0].id,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          async (decodedText) => {
            if (html5QrCode.current) {
              try {
                await html5QrCode.current.stop();
                html5QrCode.current = null;
                onScanSuccess(decodedText);
                onClose();
              } catch (error) {
                console.error('Error stopping scanner:', error);
              }
            }
          },
          (errorMessage) => {
            // Ignore normal scanning errors
            if (!errorMessage.includes('No MultiFormat Readers')) {
              console.debug('QR Error:', errorMessage);
            }
          }
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to start camera';
        setCameraError(message);
        console.error('Scanner initialization error:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    startScanner();

    // Cleanup function
    return () => {
      if (html5QrCode.current) {
        html5QrCode.current.stop()
          .catch(error => console.warn('Error stopping scanner:', error));
        html5QrCode.current = null;
      }
    };
  }, [isOpen, onScanSuccess, onClose, id]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle className="text-lg font-semibold">Scan QR Code</DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          Point your camera at the QR code shown by your teacher to mark your attendance.
        </DialogDescription>
        <div className="mt-6 bg-muted/50 rounded-lg p-4">
          {isInitializing ? (
            <div className="min-h-[300px] flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Initializing camera...</p>
            </div>
          ) : cameraError ? (
            <div className="min-h-[300px]">
              <Alert variant="destructive">
                <Camera className="h-4 w-4" />
                <AlertTitle>Camera Error</AlertTitle>
                <AlertDescription>{cameraError}</AlertDescription>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => {
                    setCameraError(null);
                    setIsInitializing(true);
                  }}
                >
                  Try Again
                </Button>
              </Alert>
            </div>
          ) : (
            <div className="min-h-[300px] relative">
              <div id={id} className="qr-scanner-container overflow-hidden" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}