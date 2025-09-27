import { getStudents } from '@/lib/data';
import AttendanceAnalyticsClient from '@/components/attendance-analytics-client';
import { Separator } from '@/components/ui/separator';
import { getTranslations } from 'next-intl/server';

export default async function AttendancePage() {
  const students = await getStudents();
  const t = await getTranslations('TeacherDashboard');
  
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          {t('attendanceTracking')}
        </h1>
        <p className="text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>
      <Separator />
      <AttendanceAnalyticsClient students={students} />
    </div>
  );
}
