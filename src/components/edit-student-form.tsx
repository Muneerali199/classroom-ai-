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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Student } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

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
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            variant="outline" 
            size="sm"
            style={getNeumorphicStyle()}
            className="border-none"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-none"
        style={getNeumorphicStyle(false, false, 'large')}
      >
        <div className="rounded-3xl p-6">
          <DialogHeader className="mb-6">
            <DialogTitle 
              className="text-2xl font-bold"
              style={{
                background: 'linear-gradient(145deg, #666666, #888888)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Edit Student Profile - {student.name}
            </DialogTitle>
          </DialogHeader>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl"
              style={getNeumorphicStyle(false, true)}
            >
              <AlertTitle className="text-red-800 font-semibold">Error</AlertTitle>
              <AlertDescription className="text-red-700 mt-1">{error}</AlertDescription>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-gray-700 mb-2 block">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter full name"
                    {...register('name')}
                    className={errors.name ? 'border-red-500' : 'border-none'}
                    style={getNeumorphicStyle(false, true)}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="student_id" className="text-gray-700 mb-2 block">Student ID *</Label>
                  <Input
                    id="student_id"
                    type="text"
                    placeholder="STU240001"
                    {...register('student_id')}
                    className={errors.student_id ? 'border-red-500' : 'border-none'}
                    style={getNeumorphicStyle(false, true)}
                  />
                  {errors.student_id && (
                    <p className="mt-2 text-sm text-red-600">{errors.student_id.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-gray-700 mb-2 block">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@school.edu"
                    {...register('email')}
                    className={errors.email ? 'border-red-500' : 'border-none'}
                    style={getNeumorphicStyle(false, true)}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="grade" className="text-gray-700 mb-2 block">Grade/Year *</Label>
                  <Select 
                    value={watch('grade')} 
                    onValueChange={(value) => setValue('grade', value)}
                  >
                    <SelectTrigger 
                      className={errors.grade ? 'border-red-500 border-none' : 'border-none'}
                      style={getNeumorphicStyle(false, true)}
                    >
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent style={getNeumorphicStyle()}>
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
                    <p className="mt-2 text-sm text-red-600">{errors.grade.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date_of_birth" className="text-gray-700 mb-2 block">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    {...register('date_of_birth')}
                    className="border-none"
                    style={getNeumorphicStyle(false, true)}
                  />
                </div>

                <div>
                  <Label htmlFor="phone_number" className="text-gray-700 mb-2 block">Phone Number</Label>
                  <Input
                    id="phone_number"
                    type="tel"
                    placeholder="(555) 123-4567"
                    {...register('phone_number')}
                    className="border-none"
                    style={getNeumorphicStyle(false, true)}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Contact Information</h3>
              
              <div>
                <Label htmlFor="address" className="text-gray-700 mb-2 block">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Student's address"
                  {...register('address')}
                  rows={2}
                  className="border-none"
                  style={getNeumorphicStyle(false, true)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergency_contact_name" className="text-gray-700 mb-2 block">Emergency Contact Name</Label>
                  <Input
                    id="emergency_contact_name"
                    type="text"
                    placeholder="Parent/Guardian name"
                    {...register('emergency_contact_name')}
                    className="border-none"
                    style={getNeumorphicStyle(false, true)}
                  />
                </div>

                <div>
                  <Label htmlFor="emergency_contact_phone" className="text-gray-700 mb-2 block">Emergency Contact Phone</Label>
                  <Input
                    id="emergency_contact_phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    {...register('emergency_contact_phone')}
                    className="border-none"
                    style={getNeumorphicStyle(false, true)}
                  />
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Medical Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="blood_type" className="text-gray-700 mb-2 block">Blood Type</Label>
                  <Select 
                    value={watch('blood_type')} 
                    onValueChange={(value) => setValue('blood_type', value)}
                  >
                    <SelectTrigger className="border-none" style={getNeumorphicStyle(false, true)}>
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent style={getNeumorphicStyle()}>
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
                <Label htmlFor="medical_notes" className="text-gray-700 mb-2 block">Medical Notes/Allergies</Label>
                <Textarea
                  id="medical_notes"
                  placeholder="Any medical conditions, allergies, or special needs"
                  {...register('medical_notes')}
                  rows={2}
                  className="border-none"
                  style={getNeumorphicStyle(false, true)}
                />
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
                  onClick={handleDialogClose}
                  className="w-full border-none"
                  style={getNeumorphicStyle()}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-2" />
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
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Student 
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}