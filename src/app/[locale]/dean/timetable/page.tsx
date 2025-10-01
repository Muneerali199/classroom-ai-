import TimetableManagement from '@/components/timetable-management';
import { Suspense } from 'react';

export default function DeanTimetablePage() {
  return (
    <div className="p-6">
      <Suspense fallback={
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      }>
        <TimetableManagement />
      </Suspense>
    </div>
  );
}
