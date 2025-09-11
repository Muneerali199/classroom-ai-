import { students } from '@/lib/data';
import AttendanceAnalyticsClient from '@/components/attendance-analytics-client';
import { Separator } from '@/components/ui/separator';

export default function AttendancePage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Attendance Analytics
        </h1>
        <p className="text-muted-foreground">
          Visualize attendance trends and generate AI-powered reports.
        </p>
      </div>
      <Separator />
      <AttendanceAnalyticsClient students={students} />
    </div>
  );
}
