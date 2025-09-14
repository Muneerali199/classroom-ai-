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

// Enhanced password validation for secure authentication
const passwordValidation = z.string()
  .min(6, 'Password must be at least 6 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const enhancedTeacherSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: passwordValidation,
  confirmPassword: z.string(),
  displayName: z.string().min(1, 'Full name is required'),
  teacher_id: z.string().min(1, 'Teacher ID is required'),
  department: z.string().min(1, 'Department is required'),
  subject: z.string().optional(),
  employment_status: z.string().min(1, 'Employment status is required'),
  hire_date: z.string().min(1, 'Hire date is required'),
  date_of_birth: z.string().optional(),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  qualifications: z.string().optional(),
  notes: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type EnhancedTeacherFormInputs = z.infer<typeof enhancedTeacherSchema>;

interface EnhancedTeacherFormProps {
  onSuccess?: () => void;
}

export default function EnhancedTeacherForm({ onSuccess }: EnhancedTeacherFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EnhancedTeacherFormInputs>({
    resolver: zodResolver(enhancedTeacherSchema),
  });

  const watchedPassword = watch('password');

  const onSubmit: SubmitHandler<EnhancedTeacherFormInputs> = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Create the teacher account
      const result = await AuthService.createUser({
        email: data.email,
        password: data.password,
        displayName: data.displayName,
        role: 'teacher',
      });

      if (result.success) {
        // Here you would typically save the additional teacher information to your database
        setSuccess(`Teacher account created successfully for ${data.displayName}!`);
        reset();
        setIsDialogOpen(false);
        onSuccess?.();
      } else {
        setError(result.error || 'Failed to create teacher account');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const generateTeacherId = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    setValue('teacher_id', `TCH${year}${random}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Enhanced Teacher Registration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Create detailed teacher profiles with complete employment and contact information.
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
                Add New Teacher (Enhanced)
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Teacher Profile</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="displayName">Full Name *</Label>
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
                      <Label htmlFor="teacher_id">Teacher ID *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="teacher_id"
                          type="text"
                          placeholder="TCH240001"
                          {...register('teacher_id')}
                          className={errors.teacher_id ? 'border-red-500' : ''}
                        />
                        <Button type="button" variant="outline" onClick={generateTeacherId}>
                          Generate
                        </Button>
                      </div>
                      {errors.teacher_id && (
                        <p className="mt-1 text-sm text-red-600">{errors.teacher_id.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="teacher@school.edu"
                        {...register('email')}
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone_number">Phone Number</Label>
                      <Input
                        id="phone_number"
                        type="tel"
                        placeholder="(555) 123-4567"
                        {...register('phone_number')}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date_of_birth">Date of Birth</Label>
                      <Input
                        id="date_of_birth"
                        type="date"
                        {...register('date_of_birth')}
                      />
                    </div>

                    <div>
                      <Label htmlFor="hire_date">Hire Date *</Label>
                      <Input
                        id="hire_date"
                        type="date"
                        {...register('hire_date')}
                        className={errors.hire_date ? 'border-red-500' : ''}
                      />
                      {errors.hire_date && (
                        <p className="mt-1 text-sm text-red-600">{errors.hire_date.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Employment Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Employment Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="department">Department *</Label>
                      <Select onValueChange={(value) => setValue('department', value)}>
                        <SelectTrigger className={errors.department ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mathematics">Mathematics</SelectItem>
                          <SelectItem value="Science">Science</SelectItem>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="History">History</SelectItem>
                          <SelectItem value="Physical Education">Physical Education</SelectItem>
                          <SelectItem value="Arts">Arts</SelectItem>
                          <SelectItem value="Music">Music</SelectItem>
                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                          <SelectItem value="Languages">Languages</SelectItem>
                          <SelectItem value="Administration">Administration</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.department && (
                        <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="subject">Primary Subject</Label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="e.g., Algebra, Biology, Literature"
                        {...register('subject')}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="employment_status">Employment Status *</Label>
                    <Select onValueChange={(value) => setValue('employment_status', value)}>
                      <SelectTrigger className={errors.employment_status ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select employment status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Substitute">Substitute</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.employment_status && (
                      <p className="mt-1 text-sm text-red-600">{errors.employment_status.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="qualifications">Qualifications & Certifications</Label>
                    <Textarea
                      id="qualifications"
                      placeholder="Degrees, certifications, licenses..."
                      {...register('qualifications')}
                      rows={2}
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                  
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      placeholder="Teacher's address"
                      {...register('address')}
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                      <Input
                        id="emergency_contact_name"
                        type="text"
                        placeholder="Contact person name"
                        {...register('emergency_contact_name')}
                      />
                    </div>

                    <div>
                      <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                      <Input
                        id="emergency_contact_phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        {...register('emergency_contact_phone')}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional information..."
                      {...register('notes')}
                      rows={2}
                    />
                  </div>
                </div>

                {/* Account Security */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Account Security</h3>
                  
                  <div>
                    <Label htmlFor="password">Password *</Label>
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
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
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
                      'Create Teacher Profile'
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