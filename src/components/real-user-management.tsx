'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { RealUserService, type CreateUserData } from '@/lib/real-user-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, UserPlus, CheckCircle, AlertCircle } from 'lucide-react';

const userSchema = z.object({
  email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  displayName: z.string().min(1, 'Display name is required'),
  role: z.enum(['teacher', 'student', 'dean'], { required_error: 'Please select a role' }),
});

type UserFormInputs = z.infer<typeof userSchema>;

interface RealUserManagementProps {
  userRole: 'teacher' | 'dean';
  onSuccess?: () => void;
}

export default function RealUserManagement({ userRole, onSuccess }: RealUserManagementProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [createdUser, setCreatedUser] = useState<any>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<UserFormInputs>({
    resolver: zodResolver(userSchema),
    mode: 'onChange',
  });

  const selectedRole = watch('role');

  const onSubmit: SubmitHandler<UserFormInputs> = async (data) => {
    setStatus('submitting');
    setMessage('');
    setCreatedUser(null);
    
    try {
      // Validate permissions
      if (userRole === 'teacher' && data.role !== 'student') {
        setStatus('error');
        setMessage('Teachers can only create student accounts');
        return;
      }

      const userData: CreateUserData = {
        email: data.email,
        password: data.password,
        displayName: data.displayName,
        role: data.role,
      };

      const result = await RealUserService.createUser(userData);
      
      if (result.success) {
        setStatus('success');
        setMessage(`${data.role} account created successfully!`);
        setCreatedUser({
          email: data.email,
          displayName: data.displayName,
          role: data.role
        });
        reset();
        onSuccess?.();
      } else {
        setStatus('error');
        setMessage(result.error || 'Failed to create user account');
      }
    } catch (error: unknown) {
      setStatus('error');
      setMessage((error as Error).message || 'An unexpected error occurred');
    } finally {
      setStatus('idle');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setMessage('');
    setCreatedUser(null);
    reset();
  };

  // Determine available roles based on user permissions
  const availableRoles = userRole === 'dean' 
    ? [
        { value: 'student', label: 'Student' },
        { value: 'teacher', label: 'Teacher' },
        { value: 'dean', label: 'Dean' }
      ]
    : [
        { value: 'student', label: 'Student' }
      ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Create New User Account
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'success' && createdUser && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800 dark:text-green-200">Success!</AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300">
              {message}
              <div className="mt-2 text-sm">
                <strong>Email:</strong> {createdUser.email}<br />
                <strong>Name:</strong> {createdUser.displayName}<br />
                <strong>Role:</strong> {createdUser.role}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {status === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="displayName">Full Name *</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="Enter full name"
                disabled={status === 'submitting'}
                {...register('displayName')}
              />
              {errors.displayName && (
                <p className="text-sm text-red-500">{errors.displayName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select onValueChange={(value) => setValue('role', value as any)} disabled={status === 'submitting'}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              disabled={status === 'submitting'}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password (min 6 characters)"
              disabled={status === 'submitting'}
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Password should be at least 6 characters long
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={status === 'submitting' || !isValid}
              className="flex-1"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create {selectedRole || 'User'} Account
                </>
              )}
            </Button>
            
            {(status === 'success' || status === 'error') && (
              <Button type="button" variant="outline" onClick={handleReset}>
                Create Another
              </Button>
            )}
          </div>
        </form>

        <div className="text-xs text-muted-foreground border-t pt-4">
          <p><strong>Note:</strong> The new user will be able to sign in immediately with the provided credentials.</p>
          {userRole === 'teacher' && (
            <p><strong>Teachers can only create student accounts.</strong> Contact a dean to create teacher accounts.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}