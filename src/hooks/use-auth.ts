
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

    const isAuthPage = pathname.includes('/login') || pathname.includes('/signup');
    const localePrefix = pathname.split('/').filter(Boolean)[0];
    const isLandingPage = pathname === '/' || (['en', 'es', 'hi'].includes(localePrefix) && pathname.split('/').filter(Boolean).length === 1)

    const isTeacherDashboard = pathname.startsWith('/dashboard') || pathname.startsWith(`/${localePrefix}/dashboard`);
    const isAdminDashboard = pathname.startsWith('/admin') || pathname.startsWith(`/${localePrefix}/admin`);
    const isStudentDashboard = pathname.startsWith('/student') || pathname.startsWith(`/${localePrefix}/student`);

    if (user) {
      const { role } = user as UserWithRole;
      
      if (isAuthPage || isLandingPage) {
        // Redirect logged-in users from auth/landing pages to their dashboard
        if (role === 'admin') router.push('/admin/dashboard');
        else if (role === 'student') router.push('/student/dashboard');
        else router.push('/dashboard'); // Default to teacher dashboard
      } else {
        // Prevent users from accessing dashboards of other roles
        if (role === 'teacher' && !isTeacherDashboard) router.push('/dashboard');
        if (role === 'admin' && !isAdminDashboard) router.push('/admin/dashboard');
        if (role === 'student' && !isStudentDashboard) router.push('/student/dashboard');
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
