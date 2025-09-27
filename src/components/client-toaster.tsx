'use client';

import { useEffect, useState } from 'react';
import { Toaster } from '@/components/ui/toaster';

export default function ClientToaster() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <Toaster />;
}
