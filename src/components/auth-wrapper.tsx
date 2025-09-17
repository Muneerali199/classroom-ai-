'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

interface AuthWrapperProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export default function AuthWrapper({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/login' 
}: AuthWrapperProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        
        if (!user) {
          router.push(redirectTo);
          return;
        }

        const userRole = user.user_metadata?.role;
        
        if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
          // Redirect to appropriate dashboard based on role
          switch (userRole) {
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
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push(redirectTo);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, allowedRoles, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-white">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}