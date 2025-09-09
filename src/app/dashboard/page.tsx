import { students } from '@/lib/data';

import DashboardClient from '@/components/dashboard-client';

export default function DashboardPage() {
  return <DashboardClient initialStudents={students} />;
}
