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
import { Loader2, Plus, UserPlus } from 'lucide-react';
import { PasswordPolicy } from '@/components/ui/password-policy';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';

// Enhanced password validation for secure authentication
const passwordValidation = z.string()
  .min(6, 'Password must be at least 6 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const enhancedStudentSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: passwordValidation,
  confirmPassword: z.string(),
  displayName: z.string().min(1, 'Full name is required'),
  studentId: z.string().min(1, 'Student ID is required'),
  grade: z.string().min(1, 'Grade/Year is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  bloodType: z.string().optional(),
  medicalNotes: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type EnhancedStudentFormInputs = z.infer<typeof enhancedStudentSchema>;

interface EnhancedStudentFormProps {
  onSuccess?: () => void;
}

export default function EnhancedStudentForm({ onSuccess }: EnhancedStudentFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EnhancedStudentFormInputs>({
    resolver: zodResolver(enhancedStudentSchema),
  });

  const watchedPassword = watch('password');

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

  const onSubmit: SubmitHandler<EnhancedStudentFormInputs> = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Create the user account first
      const result = await AuthService.createUser({
        email: data.email,
        password: data.password,
        displayName: data.displayName,
        role: 'student',
      });

      if (result.success) {
        // Here you would typically save the additional student information to your database
        // For now, we'll just show success
        setSuccess(`Student account created successfully for ${data.displayName}!`);
        reset();
        setIsDialogOpen(false);
        onSuccess?.();
      } else {
        setError(result.error || 'Failed to create student account');
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const generateStudentId = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    setValue('studentId', `STU${year}${random}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="border-0" style={getNeumorphicStyle(false, false, 'large')}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-700">
            <div 
              className="p-2 rounded-lg"
              style={getNeumorphicStyle(false, true, 'small')}
            >
              <UserPlus className="h-5 w-5" />
            </div>
            Enhanced Student Registration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Create detailed student profiles with all information needed for ID passes and records.
            </p>
            
            {success && (
              <Alert 
                className="border-0"
                style={getNeumorphicStyle(false, true)}
              >
                <AlertTitle className="text-green-700">Success</AlertTitle>
                <AlertDescription className="text-green-600">{success}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert 
                className="border-0"
                style={getNeumorphicStyle(false, true)}
              >
                <AlertTitle className="text-red-700">Error</AlertTitle>
                <AlertDescription className="text-red-600">{error}</AlertDescription>
              </Alert>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    className="w-full rounded-xl"
                    style={getNeumorphicStyle()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Student (Enhanced)
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent 
                className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border-0 p-6"
                style={getNeumorphicStyle(false, false, 'large')}
              >
                <DialogHeader>
                  <DialogTitle className="text-gray-700">Create New Student Profile</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4 p-4 rounded-2xl" style={getNeumorphicStyle(false, true)}>
                    <h3 className="text-lg font-semibold text-gray-700">Basic Information</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="displayName" className="text-gray-700">Full Name *</Label>
                        <Input
                          id="displayName"
                          type="text"
                          placeholder="Enter full name"
                          {...register('displayName')}
                          className={`rounded-xl ${errors.displayName ? 'border-red-500' : 'border-0'}`}
                          style={getNeumorphicStyle(false, true)}
                        />
                        {errors.displayName && (
                          <p className="mt-1 text-sm text-red-600">{errors.displayName.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="studentId" className="text-gray-700">Student ID *</Label>
                        <div className="flex gap-2">
                          <Input
                            id="studentId"
                            type="text"
                            placeholder="STU240001"
                            {...register('studentId')}
                            className={`rounded-xl ${errors.studentId ? 'border-red-500' : 'border-0'}`}
                            style={getNeumorphicStyle(false, true)}
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={generateStudentId}
                            className="rounded-xl"
                            style={getNeumorphicStyle()}
                          >
                            Generate
                          </Button>
                        </div>
                        {errors.studentId && (
                          <p className="mt-1 text-sm text-red-600">{errors.studentId.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email" className="text-gray-700">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="student@school.edu"
                          {...register('email')}
                          className={`rounded-xl ${errors.email ? 'border-red-500' : 'border-0'}`}
                          style={getNeumorphicStyle(false, true)}
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="grade" className="text-gray-700">Grade/Year *</Label>
                        <Select onValueChange={(value) => setValue('grade', value)}>
                          <SelectTrigger 
                            className={`rounded-xl ${errors.grade ? 'border-red-500' : 'border-0'}`}
                            style={getNeumorphicStyle(false, true)}
                          >
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                          <SelectContent style={getNeumorphicStyle(false, false, 'large')}>
                            <SelectItem value="9">Grade 9</SelectItem>
                            <SelectItem value="10">Grade 10</SelectItem>
                            <SelectItem value="11">Grade 11</SelectItem>
                            <SelectItem value="12">Grade 12</SelectItem>
                            <SelectItem value="freshman">Freshman</SelectItem>
                            <SelectItem value="sophomore">Sophomore</SelectItem>
                            <SelectItem value="junior">Junior</SelectItem>
                            <SelectItem value="senior">Senior</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.grade && (
                          <p className="mt-1 text-sm text-red-600">{errors.grade.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dateOfBirth" className="text-gray-700">Date of Birth *</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          {...register('dateOfBirth')}
                          className={`rounded-xl ${errors.dateOfBirth ? 'border-red-500' : 'border-0'}`}
                          style={getNeumorphicStyle(false, true)}
                        />
                        {errors.dateOfBirth && (
                          <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phoneNumber" className="text-gray-700">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          type="tel"
                          placeholder="(555) 123-4567"
                          {...register('phoneNumber')}
                          className="rounded-xl border-0"
                          style={getNeumorphicStyle(false, true)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4 p-4 rounded-2xl" style={getNeumorphicStyle(false, true)}>
                    <h3 className="text-lg font-semibold text-gray-700">Contact Information</h3>
                    
                    <div>
                      <Label htmlFor="address" className="text-gray-700">Address</Label>
                      <Textarea
                        id="address"
                        placeholder="Student's address"
                        {...register('address')}
                        rows={2}
                        className="rounded-xl border-0"
                        style={getNeumorphicStyle(false, true)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="emergencyContact" className="text-gray-700">Emergency Contact Name</Label>
                        <Input
                          id="emergencyContact"
                          type="text"
                          placeholder="Parent/Guardian name"
                          {...register('emergencyContact')}
                          className="rounded-xl border-0"
                          style={getNeumorphicStyle(false, true)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="emergencyPhone" className="text-gray-700">Emergency Contact Phone</Label>
                        <Input
                          id="emergencyPhone"
                          type="tel"
                          placeholder="(555) 123-4567"
                          {...register('emergencyPhone')}
                          className="rounded-xl border-0"
                          style={getNeumorphicStyle(false, true)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div className="space-y-4 p-4 rounded-2xl" style={getNeumorphicStyle(false, true)}>
                    <h3 className="text-lg font-semibold text-gray-700">Medical Information (Optional)</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="bloodType" className="text-gray-700">Blood Type</Label>
                        <Select onValueChange={(value) => setValue('bloodType', value)}>
                          <SelectTrigger className="rounded-xl border-0" style={getNeumorphicStyle(false, true)}>
                            <SelectValue placeholder="Select blood type" />
                          </SelectTrigger>
                          <SelectContent style={getNeumorphicStyle(false, false, 'large')}>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="medicalNotes" className="text-gray-700">Medical Notes/Allergies</Label>
                      <Textarea
                        id="medicalNotes"
                        placeholder="Any medical conditions, allergies, or special needs"
                        {...register('medicalNotes')}
                        rows={2}
                        className="rounded-xl border-0"
                        style={getNeumorphicStyle(false, true)}
                      />
                    </div>
                  </div>

                  {/* Account Security */}
                  <div className="space-y-4 p-4 rounded-2xl" style={getNeumorphicStyle(false, true)}>
                    <h3 className="text-lg font-semibold text-gray-700">Account Security</h3>
                    
                    <div>
                      <Label htmlFor="password" className="text-gray-700">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        {...register('password')}
                        className={`rounded-xl ${errors.password ? 'border-red-500' : 'border-0'}`}
                        style={getNeumorphicStyle(false, true)}
                      />
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                      )}
                      {watchedPassword && <PasswordPolicy password={watchedPassword} />}
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        {...register('confirmPassword')}
                        className={`rounded-xl ${errors.confirmPassword ? 'border-red-500' : 'border-0'}`}
                        style={getNeumorphicStyle(false, true)}
                      />
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                      )}
                    </div>
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
                        className="w-full rounded-xl"
                        style={getNeumorphicStyle()}
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
                        className="w-full rounded-xl"
                        style={getNeumorphicStyle()}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          'Create Student Profile'
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}