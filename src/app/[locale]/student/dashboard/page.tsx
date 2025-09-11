
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function StudentDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Student Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome! View your courses, attendance, and grades here.
        </p>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>A summary of your academic performance.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Student-specific widgets and information will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
