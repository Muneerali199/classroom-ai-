
'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useTransition, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/routing';

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
  title: z.string().optional(),
  email: z.string().email(),
  language: z.string().optional(),
  timezone: z.string().optional(),
  bio: z.string().max(200, 'Bio must not exceed 200 characters.').optional(),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
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
    { value: 'ja', label: 'Japanese' },
    { value: 'ar', label: 'Arabic' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'ru', label: 'Russian' },
    { value: 'it', label: 'Italian' },
    { value: 'ko', label: 'Korean' },
    { value: 'nl', label: 'Dutch' },
    { value: 'tr', label: 'Turkish' },
    { value: 'sv', label: 'Swedish' },
    { value: 'pl', label: 'Polish' },
    { value: 'id', label: 'Indonesian' },
    { value: 'vi', label: 'Vietnamese' },
    { value: 'th', label: 'Thai' },
    { value: 'ms', label: 'Malay' },
    { value: 'bn', label: 'Bengali' },
    { value: 'ur', label: 'Urdu' },
    { value: 'fa', label: 'Persian (Farsi)' },
    { value: 'he', label: 'Hebrew' }
];

export default function ProfileForm() {
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
    formState: { errors },
  } = useForm<ProfileFormInputs>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      title: '',
      email: '',
      language: locale,
      timezone: 'Etc/GMT+12',
      bio: '',
      emailNotifications: true,
      pushNotifications: false,
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
        title: '',
        language: locale,
        timezone: 'America/New_York',
        bio: '',
        emailNotifications: true,
        pushNotifications: false,
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
        uid: user.uid || user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        title: data.title || '',
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
       {error && (
        <div className="neumorphic-sm-inset p-4 rounded-xl border-l-4 border-red-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <h4 className="font-semibold text-red-700">{t('updateFailed')}</h4>
          </div>
          <p className="text-sm text-red-600 mt-1">{error}</p>
        </div>
      )}
      
      {/* Personal Information Section */}
      <div className="neumorphic-sm-inset p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Personal Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-600">{t('firstName')}</Label>
              <Input
              id="firstName"
              {...register('firstName')}
              className="neumorphic-input"
              />
              {errors.firstName && (
              <p className="text-sm text-red-600">{errors.firstName.message}</p>
              )}
          </div>
           <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-600">{t('lastName')}</Label>
              <Input
              id="lastName"
              {...register('lastName')}
              className="neumorphic-input"
              />
              {errors.lastName && (
              <p className="text-sm text-red-600">{errors.lastName.message}</p>
              )}
          </div>
        </div>
         <div className="space-y-2 mt-4">
          <Label htmlFor="title" className="text-sm font-medium text-gray-600">{t('role')}</Label>
          <Input
            id="title"
            placeholder={t('rolePlaceholder')}
            {...register('title')}
            className="neumorphic-input"
          />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>
        <div className="space-y-2 mt-4">
          <Label htmlFor="email" className="text-sm font-medium text-gray-600">{t('email')}</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            disabled
            className="neumorphic-input opacity-60"
          />
          <p className="text-xs text-gray-500">
              {t('emailCannotBeChanged')}
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="neumorphic-sm-inset p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          About You
        </h3>
        <div className="space-y-2">
          <Label htmlFor="bio" className="text-sm font-medium text-gray-600">{t('aboutMe')}</Label>
          <Textarea
            id="bio"
            placeholder={t('bioPlaceholder')}
            {...register('bio')}
            className="neumorphic-textarea min-h-[100px]"
          />
          {errors.bio && (
            <p className="text-sm text-red-600">{errors.bio.message}</p>
          )}
        </div>
      </div>

      {/* Preferences Section */}
      <div className="neumorphic-sm-inset p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          Preferences
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="language" className="text-sm font-medium text-gray-600">{t('language')}</Label>
                <Select name="language" defaultValue={locale} onValueChange={onLanguageChange}>
                  <SelectTrigger id="language" className="neumorphic-select">
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
                <Label htmlFor="timezone" className="text-sm font-medium text-gray-600">{t('timezone')}</Label>
                <Select name="timezone" defaultValue="America/New_York">
                  <SelectTrigger id="timezone" className="neumorphic-select">
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
      </div>

      {/* Communication Preferences */}
      <div className="neumorphic-sm-inset p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          {t('communicationPreferences')}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Checkbox id="emailNotifications" defaultChecked className="neumorphic-sm" />
              <label
                htmlFor="emailNotifications"
                className="text-sm font-medium text-gray-600 cursor-pointer"
              >
               {t('emailNotifications')}
              </label>
            </div>
            <div className="neumorphic-toggle w-12 h-6 rounded-full relative cursor-pointer">
              <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300"></div>
            </div>
          </div>
           <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Checkbox id="pushNotifications" className="neumorphic-sm" />
              <label
                htmlFor="pushNotifications"
                className="text-sm font-medium text-gray-600 cursor-pointer"
              >
               {t('pushNotifications')}
              </label>
            </div>
            <div className="neumorphic-toggle w-12 h-6 rounded-full relative cursor-pointer">
              <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isPending}
          className="neumorphic-button px-8 py-3 text-gray-700 font-medium"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t('saveChanges')}
        </Button>
      </div>
    </form>
  );
}
