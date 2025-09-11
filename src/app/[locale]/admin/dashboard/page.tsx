
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome! Manage users, courses, and system settings here.
        </p>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
          <CardDescription>A summary of platform activity and health.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Admin-specific widgets and management tools will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
