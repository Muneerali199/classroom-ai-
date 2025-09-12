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

// Ensure element id is unique
const SCANNER_CONTAINER_ID = 'qr-reader';

interface QrScannerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

export function QrScannerDialog({
  isOpen,
  onClose,
  onScanSuccess,
}: QrScannerDialogProps) {
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const html5QrCode = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let mounted = true;
    let initializationTimeout: NodeJS.Timeout;
    
    const startScanner = async () => {
      if (!isOpen || !mounted) return;
      
      setIsInitializing(true);
      setCameraError(null);

      try {
        // Clean up existing scanner immediately
        if (html5QrCode.current) {
          try {
            await html5QrCode.current.stop();
          } catch (error) {
            console.warn('Error stopping previous scanner:', error);
          }
          html5QrCode.current = null;
        }

        const container = document.getElementById(SCANNER_CONTAINER_ID);
        if (!container) {
          throw new Error('Scanner container not found');
        }

        // Initialize scanner with proper config
        html5QrCode.current = new Html5Qrcode(SCANNER_CONTAINER_ID, {
          verbose: false,
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true
          }
        });

        // Try to start with environment facing mode (back camera) first
        try {
          await html5QrCode.current.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              aspectRatio: 1,
              disableFlip: false,
            },
            async (decodedText) => {
              if (html5QrCode.current && mounted) {
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
              // Suppress common non-error messages
              if (!errorMessage.includes('No MultiFormat Readers') && 
                  !errorMessage.includes('No barcode found') &&
                  !errorMessage.includes('QR code parse error') &&
                  !errorMessage.includes('source width is 0')) {
                console.debug('QR Error:', errorMessage);
              }
            }
          );
        } catch (environmentError) {
          console.log('Environment mode failed, trying user mode (front camera)...');
          
          // If environment mode fails, try user mode (front camera)
          try {
            await html5QrCode.current.start(
              { facingMode: "user" },
              {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1,
                disableFlip: false,
              },
              async (decodedText) => {
                if (html5QrCode.current && mounted) {
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
                // Suppress common non-error messages
                if (!errorMessage.includes('No MultiFormat Readers') && 
                    !errorMessage.includes('No barcode found') &&
                    !errorMessage.includes('QR code parse error') &&
                    !errorMessage.includes('source width is 0')) {
                  console.debug('QR Error:', errorMessage);
                }
              }
            );
          } catch (userError) {
            console.log('Both environment and user modes failed, trying camera detection...');
            
            // If both fail, try to detect available cameras
            try {
              const devices = await Html5Qrcode.getCameras();
              if (devices && devices.length > 0) {
                // Use the first available camera
                const cameraId = devices[0].id;
                
                if (!cameraId) {
                  throw new Error('No valid camera ID found');
                }

                await html5QrCode.current.start(
                  cameraId,
                  {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1,
                    disableFlip: false,
                  },
                  async (decodedText) => {
                    if (html5QrCode.current && mounted) {
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
                    // Suppress common non-error messages
                    if (!errorMessage.includes('No MultiFormat Readers') && 
                        !errorMessage.includes('No barcode found') &&
                        !errorMessage.includes('QR code parse error') &&
                        !errorMessage.includes('source width is 0')) {
                      console.debug('QR Error:', errorMessage);
                    }
                  }
                );
              } else {
                throw new Error('No cameras found');
              }
            } catch (cameraError) {
              // If all methods fail, throw the error
              throw new Error('Failed to access camera. Please ensure camera permissions are granted and try again.');
            }
          }
        }

      } catch (error) {
        if (!mounted) return;
        
        const message = error instanceof Error ? 
          error.message : 
          'Failed to start camera. Please check permissions and try again.';
        
        setCameraError(message);
        console.error('Scanner initialization error:', error);
      } finally {
        if (mounted) {
          setIsInitializing(false);
        }
      }
    };

    if (isOpen) {
      // Give the dialog time to render completely before starting the scanner
      initializationTimeout = setTimeout(() => {
        startScanner();
      }, 500); // Increased delay to ensure dialog is fully rendered
    }

    // Cleanup function
    return () => {
      mounted = false;
      clearTimeout(initializationTimeout);
      if (html5QrCode.current) {
        html5QrCode.current.stop()
          .catch(error => console.warn('Error stopping scanner:', error))
          .finally(() => {
            html5QrCode.current = null;
          });
      }
    };
  }, [isOpen, onScanSuccess, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Scan QR Code</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Point your camera at the QR code shown by your teacher to mark your attendance.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 bg-muted/50 rounded-lg p-4">
          {isInitializing ? (
            <div className="min-h-[300px] flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Initializing camera...</p>
            </div>
          ) : cameraError ? (
            <div className="min-h-[300px] flex flex-col items-center justify-center">
              <Alert variant="destructive" className="w-full">
                <Camera className="h-4 w-4" />
                <AlertTitle>Camera Error</AlertTitle>
                <AlertDescription className="mt-2">
                  {cameraError}
                  <div className="mt-3 text-sm">
                    <p>• Ensure camera permissions are granted</p>
                    <p>• Try refreshing the page</p>
                    <p>• Check if another app is using the camera</p>
                  </div>
                </AlertDescription>
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
            <div className="min-h-[300px] relative bg-black/5 rounded-lg overflow-hidden">
              <div 
                id={SCANNER_CONTAINER_ID} 
                ref={containerRef}
                className="qr-scanner-container w-full h-full min-h-[300px]"
                style={{ minHeight: '300px' }}
              />
              <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-primary/50 rounded-lg" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}