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
      
      const isAuthPage = pathname === '/login' || pathname === '/signup';
      
      // If user is logged in and on an auth page, redirect to dashboard
      if (user && isAuthPage) {
        router.push('/dashboard');
      }
      
      // If user is not logged in and not on a public/auth page, redirect to login
      if (!user && !isAuthPage && pathname !== '/') {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  return { user, loading };
}
