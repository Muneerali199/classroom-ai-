'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

export default function RoleRedirect() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        
        if (!user) {
          router.push('/login');
          return;
        }

        const role = user.user_metadata?.role;
        
        // Redirect based on role
        switch (role) {
          case 'dean':
            router.push('/dean/dashboard');
            break;
          case 'teacher':
            router.push('/dashboard');
            break;
          case 'student':
            router.push('/student/dashboard');
            break;
          default:
            router.push('/login');
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAndRedirect();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-white">Checking your account...</p>
        </div>
      </div>
    );
  }

  return null;
}