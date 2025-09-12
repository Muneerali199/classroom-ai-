'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

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
  useEffect(() => {
    let qrScanner: Html5QrcodeScanner | null = null;

    const initializeScanner = async () => {
      if (!isOpen) return;

      // Wait for the element to be available in the DOM
      await new Promise(resolve => setTimeout(resolve, 100));

      const element = document.getElementById(id);
      if (!element) {
        console.error(`QR scanner element with id '${id}' not found`);
        return;
      }

      // Create scanner instance
      qrScanner = new Html5QrcodeScanner(
        id,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
          showTorchButtonIfSupported: true
        },
        false // verbose flag
      );

      try {
        await qrScanner.render(
          (decodedText) => {
            // Success callback
            if (qrScanner) {
              qrScanner.clear().then(() => {
                onScanSuccess(decodedText);
                onClose();
              }).catch(console.error);
            }
          },
          (error) => {
            // Failure callback - ignore QR detection errors as they're expected
            console.debug('QR Scan Error:', error);
          }
        );
      } catch (error) {
        console.error('Failed to initialize QR scanner:', error);
      }
    };

    // Initialize scanner when dialog opens
    initializeScanner();

    // Cleanup when dialog closes or component unmounts
    return () => {
      if (qrScanner) {
        try {
          qrScanner.clear();
        } catch (error) {
          console.error('Failed to clear QR scanner:', error);
        }
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
          <div id={id} className="qr-scanner-container min-h-[300px] overflow-hidden" />
        </div>
      </DialogContent>
    </Dialog>
  );
}