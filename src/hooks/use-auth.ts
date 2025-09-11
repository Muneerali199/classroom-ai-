
'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';

interface UserWithRole extends User {
  role?: string;
}

export function useAuth() {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const tokenResult = await user.getIdTokenResult();
        const role = tokenResult.claims.role as string;
        setUser({ ...user, role });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isAuthPage = pathname.endsWith('/login') || pathname.endsWith('/signup');
    const isLandingPage = pathname === '/' || pathname === '/en' || pathname === '/es' || pathname === '/hi';
    const isDashboardPage = pathname.startsWith('/dashboard');
    const isAdminPage = pathname.startsWith('/admin');
    const isStudentPage = pathname.startsWith('/student');

    if (user) {
      const { role } = user as UserWithRole;
      
      if (isAuthPage || isLandingPage) {
        // Redirect logged-in users from auth/landing pages to their dashboard
        if (role === 'admin') router.push('/admin/dashboard');
        else if (role === 'student') router.push('/student/dashboard');
        else router.push('/dashboard'); // Default to teacher dashboard
      } else {
        // Prevent users from accessing dashboards of other roles
        if (role === 'teacher' && !isDashboardPage) router.push('/dashboard');
        if (role === 'admin' && !isAdminPage) router.push('/admin/dashboard');
        if (role === 'student' && !isStudentPage) router.push('/student/dashboard');
      }

    } else {
      // If not logged in, redirect from protected pages to login
      if (!isAuthPage && !isLandingPage) {
        router.push('/login');
      }
    }
  }, [user, loading, pathname, router]);


  return { user, loading };
}
