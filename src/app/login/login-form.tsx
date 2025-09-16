'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AuthService } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle, Mail } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const emailValue = watch('email');

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await AuthService.signIn({
        email: data.email,
        password: data.password,
      });
      
      if (result.success) {
        setSuccess('Sign in successful! Redirecting...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        setError(result.error || 'Failed to sign in. Please check your credentials.');
      }
    } catch (error: unknown) {
      setError((error as Error).message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!emailValue || !emailValue.includes('@')) {
      setError('Please enter a valid email address first');
      return;
    }

    setIsResettingPassword(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await AuthService.resetPassword(emailValue);
      if (result.success) {
        setSuccess('Password reset email sent! Check your inbox.');
        setShowPasswordReset(false);
      } else {
        setError(result.error || 'Failed to send reset email');
      }
    } catch (error: unknown) {
      setError((error as Error).message || 'Failed to send reset email');
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive" className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Failed</AlertTitle>
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800 dark:text-green-200">Success!</AlertTitle>
            <AlertDescription className="text-sm text-green-700 dark:text-green-300">{success}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <button
              type="button"
              onClick={() => setShowPasswordReset(true)}
              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.password.message}
            </p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full h-11 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" 
          disabled={isLoading || !isValid}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing In...
            </>
          ) : (
            'Sign In to Dashboard'
          )}
        </Button>
      </form>

      {showPasswordReset && (
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
          <h3 className="text-sm font-medium mb-2">Reset Password</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handlePasswordReset}
              disabled={isResettingPassword || !emailValue}
              size="sm"
              className="flex-1"
            >
              {isResettingPassword ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPasswordReset(false)}
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Secure login powered by EduTrack Authentication
        </p>
      </div>
    </div>
  );
}