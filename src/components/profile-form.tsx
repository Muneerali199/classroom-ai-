'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { updateProfileAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const profileSchema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
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
    formState: { errors },
  } = useForm<ProfileFormInputs>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || '',
      email: user?.email || '',
    },
  });

  const onSubmit: SubmitHandler<ProfileFormInputs> = (data) => {
    setError(null);
    startTransition(async () => {
      if (!user) {
        setError('You must be logged in to update your profile.');
        return;
      }
      const result = await updateProfileAction({
        uid: user.uid,
        displayName: data.displayName,
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
      <div className="space-y-2">
        <Label htmlFor="displayName">Display Name</Label>
        <Input
          id="displayName"
          {...register('displayName')}
        />
        {errors.displayName && (
          <p className="text-sm text-destructive">{errors.displayName.message}</p>
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
