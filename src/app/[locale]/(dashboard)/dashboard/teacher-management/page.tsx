import { Metadata } from 'next';
import TeacherStudentManagement from '@/components/teacher-student-management';
import DashboardAuthWrapper from '@/components/dashboard-auth-wrapper';

export const metadata: Metadata = {
  title: 'Student Management | EduTrack',
  description: 'Create, edit, and manage student accounts',
};

export default function TeacherManagementPage() {
  return (
    <DashboardAuthWrapper requiredRole="teacher">
      <div className="container mx-auto py-6">
        <TeacherStudentManagement />
      </div>
    </DashboardAuthWrapper>
  );
}