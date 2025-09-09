import ProfileForm from '@/components/profile-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Profile Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and customize your experience.
        </p>
      </div>
      <Separator />
      <Card>
          <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Update your name, language, and other personal details here.</CardDescription>
          </CardHeader>
          <CardContent>
             <ProfileForm />
          </CardContent>
      </Card>
    </div>
  );
}
