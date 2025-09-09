import ProfileForm from '@/components/profile-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Profile Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and update your personal information.
        </p>
      </div>
      <Card>
          <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Update your name and other details here.</CardDescription>
          </CardHeader>
          <CardContent>
             <ProfileForm />
          </CardContent>
      </Card>
    </div>
  );
}
