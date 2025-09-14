import { getStudents } from '@/lib/data';
import DashboardClient from '@/components/dashboard-client';
import UserManagement from '@/components/user-management';
import { Separator } from '@/components/ui/separator';

export default async function DashboardPage() {
  const students = await getStudents();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Teacher Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Manage your classes and students here.
        </p>
      </div>
      <Separator />
      <div className="grid gap-6">
        <DashboardClient initialStudents={students} />
        <UserManagement userRole="teacher" />
      </div>
    </div>
  );
}
