import { getStudents } from '@/lib/data';
import DashboardClient from '@/components/dashboard-client';

export default async function DashboardPage() {
  const students = await getStudents();
  return <DashboardClient initialStudents={students} />;
}
