
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import UserManagement from '@/components/user-management';
import UserManagementTest from '@/components/user-management-test';

export default function DeanDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Dean Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome! Manage users, courses, and system settings here.
        </p>
      </div>
      <Separator />
      
      <div className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <UserManagement userRole="dean" />
          
          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
              <CardDescription>A summary of platform activity and health.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Dean-specific widgets and management tools will be displayed here.</p>
            </CardContent>
          </Card>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <UserManagementTest />
        )}
      </div>
    </div>
  );
}
