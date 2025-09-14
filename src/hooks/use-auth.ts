
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { usePathname, useRouter } from 'next/navigation';

interface UserWithRole {
  id: string;
  uid?: string;
  email?: string;
  user_metadata?: any;
  displayName?: string;
  photoURL?: string;
  role?: string;
}

export function useAuth() {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (session?.user) {
        const role = session.user.user_metadata?.role as string;
        const displayName = session.user.user_metadata?.displayName || session.user.user_metadata?.full_name;
        const photoURL = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture;
        setUser({
          ...session.user,
          uid: session.user.id,
          displayName,
          photoURL,
          role
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isAuthPage = pathname.includes('/login');
    const localePrefix = pathname.split('/').filter(Boolean)[0];
    const isLandingPage = pathname === '/' || (['en', 'es', 'hi'].includes(localePrefix) && pathname.split('/').filter(Boolean).length === 1)

    const isTeacherDashboard = pathname.startsWith('/dashboard') || pathname.startsWith(`/${localePrefix}/dashboard`);
    const isDeanDashboard = pathname.startsWith('/dean') || pathname.startsWith(`/${localePrefix}/dean`);
    const isStudentDashboard = pathname.startsWith('/student') || pathname.startsWith(`/${localePrefix}/student`);

    if (user) {
      const { role } = user as UserWithRole;
      
      if (isAuthPage || isLandingPage) {
        // Redirect logged-in users from auth/landing pages to their dashboard
        if (role === 'dean') router.push('/dean/dashboard');
        else if (role === 'student') router.push('/student/dashboard');
        else router.push('/dashboard'); // Default to teacher dashboard
      } else {
        // Prevent users from accessing dashboards of other roles
        if (role === 'teacher' && !isTeacherDashboard) router.push('/dashboard');
        if (role === 'dean' && !isDeanDashboard) router.push('/dean/dashboard');
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

