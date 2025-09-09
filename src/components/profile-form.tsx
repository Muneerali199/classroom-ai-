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

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  title: z.string().optional(),
  email: z.string().email(),
});

type ProfileFormInputs = z.infer<typeof profileSchema>;

export default function ProfileForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
      title: '', // We don't have this from Firebase Auth, so it starts empty
      email: '',
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
        title: '', // You might want to store and retrieve this from a database
        email: user.email || '',
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
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
      <Button type="submit" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </form>
  );
}
