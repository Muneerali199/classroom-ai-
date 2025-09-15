'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase, getSupabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

function RoleSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get('uid');
  const [role, setRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelection = async () => {
    if (!role) {
      setError('Please select a role');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Update user role in Supabase user metadata
      const { error } = await getSupabase().auth.updateUser({
        data: { role }
      });

      if (error) throw error;

      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen py-12">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Select Your Role
          </h1>
          <p className="text-sm text-muted-foreground">
            Please choose how you want to use this platform
          </p>
        </div>
        
        {error && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <RadioGroup value={role} onValueChange={setRole} className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="teacher" id="teacher" />
              <Label htmlFor="teacher">Teacher</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="student" id="student" />
              <Label htmlFor="student">Student</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dean" id="dean" />
              <Label htmlFor="dean">Dean</Label>
            </div>
          </RadioGroup>
          
          <Button 
            onClick={handleRoleSelection} 
            disabled={isLoading || !role}
            className="w-full"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function RoleSelectionPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
      </div>
    }>
      <RoleSelectionContent />
    </Suspense>
  );
}