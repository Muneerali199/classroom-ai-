
import { TeacherService } from '@/lib/teacher-service';
import ModernDeanDashboard from '@/components/modern-dean-dashboard';

export default async function DeanDashboardPage() {
  const teachers = await TeacherService.getTeachers();
  return <ModernDeanDashboard initialTeachers={teachers} />;
}
