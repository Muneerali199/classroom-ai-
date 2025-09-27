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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle, Mail, Users, GraduationCap, UserCheck } from 'lucide-react';

// Dean email domains - configure these as needed
const DEAN_EMAIL_DOMAINS = ['dean.edu', 'admin.edu', 'principal.edu'];
const DEAN_EMAILS = ['dean@school.edu', 'admin@school.edu', 'principal@school.edu'];

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['student', 'teacher', 'dean'], {
    required_error: 'Please select your role',
  }),
}).refine((data) => {
  // Dean role validation - must use specific dean email
  if (data.role === 'dean') {
    const isDeanEmail = DEAN_EMAILS.includes(data.email.toLowerCase()) || 
                       DEAN_EMAIL_DOMAINS.some(domain => data.email.toLowerCase().endsWith(`@${domain}`));
    return isDeanEmail;
  }
  return true;
}, {
  message: 'Dean access requires a valid dean email address',
  path: ['email'],
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
    setValue,
    formState: { errors, isValid },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const emailValue = watch('email');
  const selectedRole = watch('role');

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
        // Get user role from database and verify it matches selected role
        const user = await AuthService.getCurrentUser();
        const actualRole = user?.user_metadata?.role;
        
        // Verify that selected role matches actual user role
        if (actualRole !== data.role) {
          setError(`Access denied. Your account is registered as ${actualRole}, but you selected ${data.role}.`);
          await AuthService.signOut(); // Sign out the user
          return;
        }
        
        setSuccess('Sign in successful! Redirecting...');
        
        let redirectPath = '/dashboard'; // default
        switch (actualRole) {
          case 'dean':
            redirectPath = '/dean/dashboard';
            break;
          case 'teacher':
            redirectPath = '/dashboard';
            break;
          case 'student':
            redirectPath = '/student/dashboard';
            break;
        }
        
        setTimeout(() => {
          router.push(redirectPath);
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
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Authentication Failed</span>
            </div>
            <p className="text-sm text-red-300 mt-1">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Success!</span>
            </div>
            <p className="text-sm text-green-300 mt-1">{success}</p>
          </div>
        )}

        {/* Role Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-white">
            Select Your Role
          </Label>
          <Select onValueChange={(value) => setValue('role', value as 'student' | 'teacher' | 'dean')}>
            <SelectTrigger 
              className="w-full bg-gray-900/50 border border-white/10 rounded-xl h-12 px-4 text-white backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300"
              suppressHydrationWarning
            >
              <SelectValue placeholder="Choose your role" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900/95 border border-white/10 rounded-xl backdrop-blur-sm">
              <SelectItem value="student" className="cursor-pointer hover:bg-white/10 rounded-lg text-white">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-cyan-400" />
                  <span>Student</span>
                </div>
              </SelectItem>
              <SelectItem value="teacher" className="cursor-pointer hover:bg-white/10 rounded-lg text-white">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-cyan-400" />
                  <span>Teacher</span>
                </div>
              </SelectItem>
              <SelectItem value="dean" className="cursor-pointer hover:bg-white/10 rounded-lg text-white">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-cyan-400" />
                  <span>Dean</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.role && (
            <p className="text-sm text-red-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.role.message}
            </p>
          )}
          {selectedRole === 'dean' && (
            <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 text-blue-400">
                <UserCheck className="h-4 w-4" />
                <span className="text-sm font-medium">Dean Access</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Dean login requires a verified dean email address
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-white">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              className="pl-10 bg-gray-900/50 border border-white/10 rounded-xl h-12 text-white placeholder-slate-400 backdrop-blur-sm hover:border-cyan-400/50 focus:border-cyan-400 transition-all duration-300"
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-white">
              Password
            </Label>
            <button
              type="button"
              onClick={() => setShowPasswordReset(true)}
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="pr-10 bg-gray-900/50 border border-white/10 rounded-xl h-12 text-white placeholder-slate-400 backdrop-blur-sm hover:border-cyan-400/50 focus:border-cyan-400 transition-all duration-300"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400 hover:text-cyan-400 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.password.message}
            </p>
          )}
        </div>

        <button 
          type="submit" 
          className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-cyan-500/25" 
          disabled={isLoading || !isValid}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
              Signing In...
            </>
          ) : (
            'Sign In to Dashboard'
          )}
        </button>
      </form>

      {showPasswordReset && (
        <div className="bg-gray-900/50 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
          <h3 className="text-sm font-medium mb-2 text-white">Reset Password</h3>
          <p className="text-xs text-slate-400 mb-3">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePasswordReset}
              disabled={isResettingPassword || !emailValue}
              className="flex-1 h-8 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-xs font-medium text-white disabled:opacity-50 transition-colors duration-300"
            >
              {isResettingPassword ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin inline" />
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowPasswordReset(false)}
              className="px-4 h-8 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-medium text-white transition-colors duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="text-center">
        <p className="text-xs text-slate-400">
          Secure login powered by ClassroomAI Authentication
        </p>
      </div>
    </div>
  );
}