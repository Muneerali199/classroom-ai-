'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
      const isAuthPage = pathname.endsWith('/login') || pathname.endsWith('/signup');
      const isLandingPage = pathname === '/' || pathname === '/en' || pathname === '/es' || pathname === '/hi';

      // If user is logged in and on an auth page or landing page, redirect to dashboard
      if (user && (isAuthPage || isLandingPage)) {
        router.push('/dashboard');
      }
      
      // If user is not logged in and not on a public/auth page, redirect to login
      if (!user && !isAuthPage && !isLandingPage) {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  return { user, loading };
}
