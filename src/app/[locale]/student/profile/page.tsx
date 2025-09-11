import StudentProfileForm from '@/components/student-profile-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTranslations } from 'next-intl';

export default function StudentProfilePage() {
  const t = useTranslations('ProfilePage');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          {t('title')}
        </h1>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>
      <Separator />
      <Card>
          <CardHeader>
              <CardTitle>{t('cardTitle')}</CardTitle>
              <CardDescription>{t('cardDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
             <StudentProfileForm />
          </CardContent>
      </Card>
    </div>
  );
}
