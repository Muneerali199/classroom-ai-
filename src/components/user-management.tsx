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
import { Loader2, Plus, Users } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PasswordPolicy } from '@/components/ui/password-policy';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Enhanced password validation for secure authentication
const passwordValidation = z.string()
  .min(6, 'Password must be at least 6 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const createUserSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: passwordValidation,
  confirmPassword: z.string(),
  displayName: z.string().min(1, 'Display name is required'),
  role: z.enum(['teacher', 'student'], {
    required_error: 'You must select a role.',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Schema for dean (can create teachers and students)
const deanCreateUserSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: passwordValidation,
  confirmPassword: z.string(),
  displayName: z.string().min(1, 'Display name is required'),
  role: z.enum(['teacher', 'student', 'dean'], {
    required_error: 'You must select a role.',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type CreateUserFormInputs = z.infer<typeof createUserSchema>;
type DeanCreateUserFormInputs = z.infer<typeof deanCreateUserSchema>;

interface UserManagementProps {
  userRole: 'dean' | 'teacher';
}

export default function UserManagement({ userRole }: UserManagementProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const schema = userRole === 'dean' ? deanCreateUserSchema : createUserSchema;
  
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<DeanCreateUserFormInputs>({
    resolver: zodResolver(schema),
  });

  const watchedPassword = watch('password');
  const watchedRole = watch('role');

  const onSubmit: SubmitHandler<DeanCreateUserFormInputs> = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await AuthService.createUser({
        email: data.email,
        password: data.password,
        displayName: data.displayName,
        role: data.role,
      });

      if (result.success) {
        setSuccess(`${data.role.charAt(0).toUpperCase() + data.role.slice(1)} account created successfully!`);
        reset();
        setIsDialogOpen(false);
      } else {
        setError(result.error || 'Failed to create user account');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const allowedRoles = userRole === 'dean' 
    ? ['teacher', 'student', 'dean'] 
    : ['student'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          User Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {userRole === 'dean' 
              ? 'Create accounts for teachers and students.'
              : 'Create accounts for students in your classes.'}
          </p>
          
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertTitle className="text-green-800">Success</AlertTitle>
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTitle className="text-red-800">Error</AlertTitle>
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create New User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New User Account</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="displayName">Full Name</Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Enter full name"
                    {...register('displayName')}
                    className={errors.displayName ? 'border-red-500' : ''}
                  />
                  {errors.displayName && (
                    <p className="mt-1 text-sm text-red-600">{errors.displayName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    {...register('email')}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label>Role</Label>
                  <RadioGroup
                    value={watchedRole}
                    onValueChange={(value) => setValue('role', value as any)}
                    className="mt-2"
                  >
                    {allowedRoles.map((role) => (
                      <div key={role} className="flex items-center space-x-2">
                        <RadioGroupItem value={role} id={role} />
                        <Label htmlFor={role} className="capitalize">
                          {role}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    {...register('password')}
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                  {watchedPassword && <PasswordPolicy password={watchedPassword} />}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    {...register('confirmPassword')}
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create User'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}