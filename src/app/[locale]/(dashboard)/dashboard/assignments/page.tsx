import TeacherAssignmentsPanel from '@/components/teacher-assignments-panel';
import { useAuth } from '@/hooks/use-auth';
import { Suspense } from 'react';

export default function AssignmentsPage() {
  // Render client-only panel via wrapper component
  return (
    <Suspense>
      <TeacherAssignmentsPanel />
    </Suspense>
  );
}
