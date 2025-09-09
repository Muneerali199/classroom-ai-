'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useTransition, useEffect } from 'react';

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
    'English', 'Spanish', 'French', 'German', 'Chinese (Mandarin)', 'Japanese', 'Hindi', 'Arabic', 'Portuguese', 
    'Russian', 'Italian', 'Korean', 'Dutch', 'Turkish', 'Swedish', 'Polish', 'Indonesian', 'Vietnamese', 'Thai', 'Malay'
];

export default function ProfileForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
      title: '',
      email: '',
      language: 'English',
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
        // The rest would be loaded from a database in a real app
        title: '',
        language: 'English',
        timezone: 'America/New_York',
        bio: '',
        emailNotifications: true,
        pushNotifications: false,
      });
    }
  }, [user, reset]);

  const onSubmit: SubmitHandler<ProfileFormInputs> = (data) => {
    setError(null);
    startTransition(async () => {
      if (!user) {
        setError('You must be logged in to update your profile.');
        return;
      }
      const result = await updateProfileAction({
        uid: user.uid,
        firstName: data.firstName,
        lastName: data.lastName,
        title: data.title || '',
      });

      if (result.success) {
        toast({
          title: 'Profile Updated',
          description: 'Your profile has been updated successfully.',
        });
      } else {
        setError(result.error || 'An unexpected error occurred.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
       {error && (
        <Alert variant="destructive">
          <AlertTitle>Update Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
            id="firstName"
            {...register('firstName')}
            />
            {errors.firstName && (
            <p className="text-sm text-destructive">{errors.firstName.message}</p>
            )}
        </div>
         <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
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
        <Label htmlFor="title">Role / Title</Label>
        <Input
          id="title"
          placeholder="e.g. Grade 5 Teacher"
          {...register('title')}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          disabled
        />
        <p className="text-xs text-muted-foreground">
            Email address cannot be changed.
        </p>
      </div>

       <div className="space-y-2">
        <Label htmlFor="bio">About Me</Label>
        <Textarea
          id="bio"
          placeholder="Tell us a little about yourself..."
          {...register('bio')}
          className="min-h-[100px]"
        />
        {errors.bio && (
          <p className="text-sm text-destructive">{errors.bio.message}</p>
        )}
      </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select name="language" defaultValue="English">
                <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                    {languages.map(lang => (
                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
          </div>
           <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select name="timezone" defaultValue="America/New_York">
                <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
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
        <Label>Communication Preferences</Label>
        <div className="flex items-center space-x-2">
          <Checkbox id="emailNotifications" defaultChecked />
          <label
            htmlFor="emailNotifications"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
           Email Notifications
          </label>
        </div>
         <div className="flex items-center space-x-2">
          <Checkbox id="pushNotifications" />
          <label
            htmlFor="pushNotifications"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
           Push Notifications
          </label>
        </div>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </form>
  );
}
