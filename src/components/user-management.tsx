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
import { motion } from 'framer-motion';

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

type DeanCreateUserFormInputs = z.infer<typeof deanCreateUserSchema>;

interface UserManagementProps {
  userRole: 'dean' | 'teacher';
  onSuccess?: () => void;
}

const getNeumorphicStyle = (pressed = false, inset = false, size = 'normal') => {
  const shadowSize = size === 'large' ? '12px' : size === 'small' ? '4px' : '8px';
  const shadowBlur = size === 'large' ? '24px' : size === 'small' ? '8px' : '16px';

  return {
    background: pressed || inset ?
      'linear-gradient(145deg, #d0d0d0, #f0f0f0)' :
      'linear-gradient(145deg, #f0f0f0, #d0d0d0)',
    boxShadow: pressed || inset ?
      `inset ${shadowSize} ${shadowSize} ${shadowBlur} #bebebe, inset -${shadowSize} -${shadowSize} ${shadowBlur} #ffffff` :
      `${shadowSize} ${shadowSize} ${shadowBlur} #bebebe, -${shadowSize} -${shadowSize} ${shadowBlur} #ffffff`
  };
};

export default function UserManagement({ userRole, onSuccess }: UserManagementProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const schema = userRole === 'dean' ? deanCreateUserSchema : createUserSchema;

  const {
    register,
    handleSubmit,
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
        onSuccess?.();
      } else {
        setError(result.error || 'Failed to create user account');
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const allowedRoles = userRole === 'dean'
    ? ['teacher', 'student', 'dean']
    : ['student'];

  return (
    <div
      className="rounded-2xl p-6"
      style={getNeumorphicStyle()}
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className="p-3 rounded-xl"
          style={getNeumorphicStyle(false, true, 'small')}
        >
          <Users className="w-6 h-6 text-gray-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-700">User Management</h3>
      </div>

      <div className="space-y-4">
        <div
          className="p-3 rounded-xl mb-4"
          style={getNeumorphicStyle(false, true, 'small')}
        >
          <p className="text-sm text-gray-600">
            {userRole === 'dean'
              ? 'Create accounts for teachers and students.'
              : 'Create accounts for students in your classes.'}
          </p>
        </div>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl mb-4"
            style={getNeumorphicStyle(false, true)}
          >
            <AlertTitle className="text-green-800 font-semibold">Success</AlertTitle>
            <AlertDescription className="text-green-700 mt-1">{success}</AlertDescription>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl mb-4"
            style={getNeumorphicStyle(false, true)}
          >
            <AlertTitle className="text-red-800 font-semibold">Error</AlertTitle>
            <AlertDescription className="text-red-700 mt-1">{error}</AlertDescription>
          </motion.div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                className="w-full border-none"
                style={getNeumorphicStyle()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New User
              </Button>
            </motion.div>
          </DialogTrigger>
          <DialogContent
            className="max-w-md p-0 border-none"
            style={getNeumorphicStyle(false, false, 'large')}
          >
            <div className="rounded-3xl p-6">
              <DialogHeader className="mb-6">
                <DialogTitle
                  className="text-xl font-bold"
                  style={{
                    background: 'linear-gradient(145deg, #666666, #888888)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Create New User Account
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="displayName" className="text-gray-700 mb-2 block">Full Name</Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Enter full name"
                    {...register('displayName')}
                    className={errors.displayName ? 'border-red-500 border-none' : 'border-none'}
                    style={getNeumorphicStyle(false, true)}
                  />
                  {errors.displayName && (
                    <p className="mt-2 text-sm text-red-600">{errors.displayName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-700 mb-2 block">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    {...register('email')}
                    className={errors.email ? 'border-red-500 border-none' : 'border-none'}
                    style={getNeumorphicStyle(false, true)}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-700 mb-2 block">Role</Label>
                  <RadioGroup
                    value={watchedRole}
                    onValueChange={(value) => setValue('role', value as 'teacher' | 'student' | 'dean')}
                    className="mt-2 space-y-2"
                  >
                    {allowedRoles.map((role) => (
                      <div key={role} className="flex items-center space-x-3">
                        <RadioGroupItem
                          value={role}
                          id={role}
                          style={getNeumorphicStyle(false, true, 'small')}
                          className="border-none"
                        />
                        <Label htmlFor={role} className="capitalize text-gray-700 cursor-pointer">
                          {role}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {errors.role && (
                    <p className="mt-2 text-sm text-red-600">{errors.role.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password" className="text-gray-700 mb-2 block">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    {...register('password')}
                    className={errors.password ? 'border-red-500 border-none' : 'border-none'}
                    style={getNeumorphicStyle(false, true)}
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                  )}
                  {watchedPassword && (
                    <div className="mt-2 p-3 rounded-xl" style={getNeumorphicStyle(false, true, 'small')}>
                      <PasswordPolicy password={watchedPassword} />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-gray-700 mb-2 block">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    {...register('confirmPassword')}
                    className={errors.confirmPassword ? 'border-red-500 border-none' : 'border-none'}
                    style={getNeumorphicStyle(false, true)}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="w-full border-none"
                      style={getNeumorphicStyle()}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full border-none"
                      style={getNeumorphicStyle()}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create User'
                      )}
                    </Button>
                  </motion.div>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
