'use client';

import { app } from '@/lib/firebase';
import { useEffect } from 'react';
import { getAnalytics, isSupported } from 'firebase/analytics';

export default function FirebaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    isSupported().then((supported) => {
      if (supported) {
        getAnalytics(app);
      }
    });
  }, []);

  return <>{children}</>;
}
