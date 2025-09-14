import PinAttendanceClient from "@/components/pin-attendance-client";
import { Separator } from "@/components/ui/separator";

export default function PinAttendancePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight">
                    Mark Your Attendance
                </h1>
                <p className="text-muted-foreground">
                    Enter the PIN provided by your teacher to mark your attendance.
                </p>
            </div>
            <Separator />
            <PinAttendanceClient />
        </div>
    );
}