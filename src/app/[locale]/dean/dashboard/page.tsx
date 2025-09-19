
import { EnhancedTeacherService } from '@/lib/enhanced-teacher-service';
import EnhancedDeanDashboard from '@/components/enhanced-dean-dashboard';

export default async function DeanDashboardPage() {
  const teachers = await EnhancedTeacherService.getTeachers();
  return <EnhancedDeanDashboard initialTeachers={teachers} />;
}
