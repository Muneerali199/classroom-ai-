import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, Clock, BookOpen } from "lucide-react";

interface TeacherInfoDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  teacherName: string;
  courseId: string;
  sessionEndTime: string;
}

export function TeacherInfoDialog({
  isOpen,
  onConfirm,
  onCancel,
  teacherName,
  courseId,
  sessionEndTime,
}: TeacherInfoDialogProps) {
  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Attendance Session
          </DialogTitle>
          <DialogDescription>
            Confirm your attendance for this session
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <User className="h-8 w-8 text-primary" />
            <div>
              <p className="font-medium">Teacher</p>
              <p className="text-sm text-muted-foreground">{teacherName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <BookOpen className="h-8 w-8 text-primary" />
            <div>
              <p className="font-medium">Course</p>
              <p className="text-sm text-muted-foreground">{courseId}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Clock className="h-8 w-8 text-primary" />
            <div>
              <p className="font-medium">Session Ends</p>
              <p className="text-sm text-muted-foreground">{formatTime(sessionEndTime)}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            Mark Attendance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}