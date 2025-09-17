'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AuthService } from '@/lib/auth';
import { Loader2, Key, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PasswordPolicy } from '@/components/ui/password-policy';
import type { Student } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

// Enhanced password validation for secure authentication
const passwordValidation = z.string()
  .min(6, 'Password must be at least 6 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const resetPasswordSchema = z.object({
  newPassword: passwordValidation,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormInputs = z.infer<typeof resetPasswordSchema>;

interface ResetStudentPasswordProps {
  student: Student;
  onSuccess?: () => void;
}

export default function ResetStudentPassword({ student, onSuccess }: ResetStudentPasswordProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordFormInputs>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const watchedPassword = watch('newPassword');

  const onSubmit: SubmitHandler<ResetPasswordFormInputs> = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!student.email) {
        setError('Student email is required to reset password');
        return;
      }

      const result = await AuthService.resetStudentPassword(student.id, data.newPassword);

      if (result.success) {
        toast({
          title: 'Password Reset Successful',
          description: `New password has been set for ${student.name}`,
        });
        setIsDialogOpen(false);
        reset();
        onSuccess?.();
      } else {
        setError(result.error || 'Failed to reset password');
        toast({
          title: 'Error',
          description: result.error || 'Failed to reset password',
          variant: 'destructive',
        });
      }
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setError(null);
    reset();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-orange-600 border-orange-200 hover:bg-orange-50">
          <Key className="h-4 w-4 mr-1" />
          Reset Password
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Password for {student.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Warning Notice */}
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="text-orange-800">Security Notice</AlertTitle>
            <AlertDescription className="text-orange-700">
              You are about to reset the password for <strong>{student.name}</strong>. 
              They will need to use the new password to access their account.
            </AlertDescription>
          </Alert>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTitle className="text-red-800">Error</AlertTitle>
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="student-info">Student Information</Label>
              <div className="p-3 bg-muted rounded-lg text-sm">
                <div><strong>Name:</strong> {student.name}</div>
                <div><strong>Student ID:</strong> {student.student_id || student.id}</div>
                <div><strong>Email:</strong> {student.email || 'No email on file'}</div>
              </div>
            </div>

            <div>
              <Label htmlFor="newPassword">New Password *</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  {...register('newPassword')}
                  className={errors.newPassword ? 'border-red-500 pr-10' : 'pr-10'}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
              )}
              {watchedPassword && <PasswordPolicy password={watchedPassword} />}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm New Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  {...register('confirmPassword')}
                  className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleDialogClose}
                className="w-full"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || !student.email} 
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <Key className="mr-2 h-4 w-4" />
                    Reset Password
                  </>
                )}
              </Button>
            </div>

            {!student.email && (
              <div className="text-center text-sm text-muted-foreground">
                Student email is required to reset password. Please edit the student profile to add an email address first.
              </div>
            )}
            
            {!student.auth_user_id && student.email && (
              <div className="text-center text-sm text-orange-600">
                Note: Password reset requires running database migration 007 first to link student accounts.
              </div>
            )}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}