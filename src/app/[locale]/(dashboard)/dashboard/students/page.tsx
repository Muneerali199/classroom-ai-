import { getStudents } from '@/lib/data';
import ModernTeacherDashboard from '@/components/modern-teacher-dashboard';

export default async function DashboardPage() {
  const students = await getStudents();
  return <ModernTeacherDashboard initialStudents={students} />;
}