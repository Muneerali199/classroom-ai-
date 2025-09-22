import TeacherTimetablePanel from '@/components/teacher-timetable-panel';
import { Suspense } from 'react';

export default function TimetablePage() {
  return (
    <Suspense>
      <TeacherTimetablePanel />
    </Suspense>
  );
}
