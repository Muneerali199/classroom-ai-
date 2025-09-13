
'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useTransition, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { updateProfileAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email(),
  language: z.string().optional(),
  timezone: z.string().optional(),
  bio: z.string().max(200, 'Bio must not exceed 200 characters.').optional(),
  emailNotifications: z.boolean().optional(),
});

type ProfileFormInputs = z.infer<typeof profileSchema>;

const timezones = [
    'Etc/GMT+12', 'Pacific/Midway', 'Pacific/Honolulu', 'America/Juneau', 'America/Los_Angeles', 'America/Denver', 
    'America/Chicago', 'America/New_York', 'America/Caracas', 'America/Halifax', 'America/Sao_Paulo', 'Atlantic/Azores',
    'Europe/London', 'Europe/Paris', 'Europe/Helsinki', 'Asia/Jerusalem', 'Asia/Dubai', 'Asia/Karachi', 'Asia/Dhaka',
    'Asia/Bangkok', 'Asia/Hong_Kong', 'Asia/Tokyo', 'Australia/Sydney', 'Pacific/Auckland',
];
const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'hi', label: 'Hindi' },
    { value: 'zh', label: 'Chinese (Mandarin)' },
];

export default function StudentProfileForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('ProfileForm');
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProfileFormInputs>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      language: locale,
      timezone: 'Etc/GMT+12',
      bio: '',
      emailNotifications: true,
    },
  });

  useEffect(() => {
    if (user) {
      const nameParts = user.displayName?.split(' ') || ['', ''];
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      reset({
        firstName: firstName,
        lastName: lastName,
        email: user.email || '',
        language: locale,
        timezone: 'America/New_York',
        bio: '',
        emailNotifications: true,
      });
    }
  }, [user, reset, locale]);

  const onLanguageChange = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.replace(newPath);
  };

  const onSubmit: SubmitHandler<ProfileFormInputs> = (data) => {
    setError(null);
    startTransition(async () => {
      if (!user) {
        setError(t('loginError'));
        return;
      }
      const result = await updateProfileAction({
        uid: user.id!,
        firstName: data.firstName,
        lastName: data.lastName,
        title: 'Student',
      });

      if (result.success) {
        toast({
          title: t('toast.successTitle'),
          description: t('toast.successDescription'),
        });
      } else {
        setError(result.error || t('toast.errorUnknown'));
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
       {error && (
        <Alert variant="destructive">
          <AlertTitle>{t('updateFailed')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="firstName">{t('firstName')}</Label>
            <Input
            id="firstName"
            {...register('firstName')}
            />
            {errors.firstName && (
            <p className="text-sm text-destructive">{errors.firstName.message}</p>
            )}
        </div>
         <div className="space-y-2">
            <Label htmlFor="lastName">{t('lastName')}</Label>
            <Input
            id="lastName"
            {...register('lastName')}
            />
            {errors.lastName && (
            <p className="text-sm text-destructive">{errors.lastName.message}</p>
            )}
        </div>
      </div>
       <div className="space-y-2">
        <Label htmlFor="role">{t('role')}</Label>
        <Input
          id="role"
          value="Student"
          disabled
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">{t('email')}</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          disabled
        />
        <p className="text-xs text-muted-foreground">
            {t('emailCannotBeChanged')}
        </p>
      </div>

       <div className="space-y-2">
        <Label htmlFor="bio">{t('aboutMe')}</Label>
        <Textarea
          id="bio"
          placeholder={t('bioPlaceholder')}
          {...register('bio')}
          className="min-h-[100px]"
        />
        {errors.bio && (
          <p className="text-sm text-destructive">{errors.bio.message}</p>
        )}
      </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
              <Label htmlFor="language">{t('language')}</Label>
              <Select name="language" defaultValue={locale} onValueChange={onLanguageChange}>
                <SelectTrigger id="language">
                    <SelectValue placeholder={t('languagePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                    {languages.map(lang => (
                        <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
          </div>
           <div className="space-y-2">
              <Label htmlFor="timezone">{t('timezone')}</Label>
              <Select name="timezone" defaultValue="America/New_York">
                <SelectTrigger id="timezone">
                    <SelectValue placeholder={t('timezonePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                    {timezones.map(tz => (
                        <SelectItem key={tz} value={tz}>{tz.replace('_', ' ')}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
          </div>
      </div>

      <div className="space-y-4">
        <Label>{t('communicationPreferences')}</Label>
        <div className="flex items-center space-x-2">
          <Checkbox id="emailNotifications" defaultChecked />
          <label
            htmlFor="emailNotifications"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
           {t('emailNotifications')}
          </label>
        </div>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {t('saveChanges')}
      </Button>
    </form>
  );
}
