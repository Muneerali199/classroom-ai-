'use client';

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AttendanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AttendanceDialog({
  isOpen,
  onClose,
  title,
  description,
  children,
}: AttendanceDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}