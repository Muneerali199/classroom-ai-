import RealPinAttendanceStudent from "@/components/real-pin-attendance-student";

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
            <RealPinAttendanceStudent />
        </div>
    );
}