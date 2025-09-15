'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TeacherService } from '@/lib/teacher-service';
import { Loader2, Save, X, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Teacher } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const editTeacherSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  teacher_id: z.string().min(1, 'Teacher ID is required'),
  department: z.string().min(1, 'Department is required'),
  subject: z.string().optional().or(z.literal('')),
  employment_status: z.string().min(1, 'Employment status is required'),
  hire_date: z.string().optional().or(z.literal('')),
  date_of_birth: z.string().optional().or(z.literal('')),
  phone_number: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  emergency_contact_name: z.string().optional().or(z.literal('')),
  emergency_contact_phone: z.string().optional().or(z.literal('')),
  qualifications: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
});

type EditTeacherFormInputs = z.infer<typeof editTeacherSchema>;

interface EditTeacherFormProps {
  teacher: Teacher;
  onSuccess?: (updatedTeacher: Teacher) => void;
}

export default function EditTeacherForm({ teacher, onSuccess }: EditTeacherFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EditTeacherFormInputs>({
    resolver: zodResolver(editTeacherSchema),
    defaultValues: {
      name: teacher.name || '',
      email: teacher.email || '',
      teacher_id: teacher.teacher_id || '',
      department: teacher.department || '',
      subject: teacher.subject || '',
      employment_status: teacher.employment_status || '',
      hire_date: teacher.hire_date || '',
      date_of_birth: teacher.date_of_birth || '',
      phone_number: teacher.phone_number || '',
      address: teacher.address || '',
      emergency_contact_name: teacher.emergency_contact_name || '',
      emergency_contact_phone: teacher.emergency_contact_phone || '',
      qualifications: teacher.qualifications || '',
      notes: teacher.notes || '',
    },
  });

  const onSubmit: SubmitHandler<EditTeacherFormInputs> = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      // Clean up empty strings to undefined
      const cleanedData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, value === '' ? undefined : value])
      );

      const result = await TeacherService.updateTeacher(teacher.id, cleanedData);

      if (result.success) {
        const updatedTeacher = { ...teacher, ...cleanedData };
        toast({
          title: 'Teacher Updated',
          description: `${data.name}'s profile has been successfully updated.`,
        });
        setIsDialogOpen(false);
        onSuccess?.(updatedTeacher);
      } else {
        setError(result.error || 'Failed to update teacher');
        toast({
          title: 'Error',
          description: result.error || 'Failed to update teacher',
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
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
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Teacher Profile - {teacher.name}</DialogTitle>
        </DialogHeader>
        
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTitle className="text-red-800">Error</AlertTitle>
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter full name"
                  {...register('name')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="teacher_id">Teacher ID *</Label>
                <Input
                  id="teacher_id"
                  type="text"
                  placeholder="TCH240001"
                  {...register('teacher_id')}
                  className={errors.teacher_id ? 'border-red-500' : ''}
                />
                {errors.teacher_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.teacher_id.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
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
                <Label htmlFor="hire_date">Hire Date</Label>
                <Input
                  id="hire_date"
                  type="date"
                  {...register('hire_date')}
                />
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Employment Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">Department *</Label>
                <Select 
                  value={watch('department')} 
                  onValueChange={(value) => setValue('department', value)}
                >
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
              <Select 
                value={watch('employment_status')} 
                onValueChange={(value) => setValue('employment_status', value)}
              >
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

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleDialogClose}
              className="w-full"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Teacher
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}