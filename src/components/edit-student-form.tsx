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
import { Loader2, Save, X, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Student } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const editStudentSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  student_id: z.string().min(1, 'Student ID is required'),
  grade: z.string().min(1, 'Grade/Year is required'),
  date_of_birth: z.string().optional().or(z.literal('')),
  phone_number: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  emergency_contact_name: z.string().optional().or(z.literal('')),
  emergency_contact_phone: z.string().optional().or(z.literal('')),
  blood_type: z.string().optional().or(z.literal('')),
  medical_notes: z.string().optional().or(z.literal('')),
});

type EditStudentFormInputs = z.infer<typeof editStudentSchema>;

interface EditStudentFormProps {
  student: Student;
  onSuccess?: (updatedStudent: Student) => void;
}

export default function EditStudentForm({ student, onSuccess }: EditStudentFormProps) {
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
  } = useForm<EditStudentFormInputs>({
    resolver: zodResolver(editStudentSchema),
    defaultValues: {
      name: student.name || '',
      email: student.email || '',
      student_id: student.student_id || '',
      grade: student.grade || '',
      date_of_birth: student.date_of_birth || '',
      phone_number: student.phone_number || '',
      address: student.address || '',
      emergency_contact_name: student.emergency_contact_name || '',
      emergency_contact_phone: student.emergency_contact_phone || '',
      blood_type: student.blood_type || '',
      medical_notes: student.medical_notes || '',
    },
  });

  const onSubmit: SubmitHandler<EditStudentFormInputs> = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      // Clean up empty strings to undefined
      const cleanedData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, value === '' ? undefined : value])
      );

      const result = await AuthService.updateStudent(student.id, cleanedData);

      if (result.success) {
        const updatedStudent = { ...student, ...cleanedData };
        toast({
          title: 'Student Updated',
          description: `${data.name}'s profile has been successfully updated.`,
        });
        setIsDialogOpen(false);
        onSuccess?.(updatedStudent);
      } else {
        setError(result.error || 'Failed to update student');
        toast({
          title: 'Error',
          description: result.error || 'Failed to update student',
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
          <DialogTitle>Edit Student Profile - {student.name}</DialogTitle>
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
                <Label htmlFor="student_id">Student ID *</Label>
                <Input
                  id="student_id"
                  type="text"
                  placeholder="STU240001"
                  {...register('student_id')}
                  className={errors.student_id ? 'border-red-500' : ''}
                />
                {errors.student_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.student_id.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@school.edu"
                  {...register('email')}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="grade">Grade/Year *</Label>
                <Select 
                  value={watch('grade')} 
                  onValueChange={(value) => setValue('grade', value)}
                >
                  <SelectTrigger className={errors.grade ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
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
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  {...register('date_of_birth')}
                />
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
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Student's address"
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
                  placeholder="Parent/Guardian name"
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
          </div>

          {/* Medical Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Medical Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="blood_type">Blood Type</Label>
                <Select 
                  value={watch('blood_type')} 
                  onValueChange={(value) => setValue('blood_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
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
              <Label htmlFor="medical_notes">Medical Notes/Allergies</Label>
              <Textarea
                id="medical_notes"
                placeholder="Any medical conditions, allergies, or special needs"
                {...register('medical_notes')}
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
                  Update Student
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}