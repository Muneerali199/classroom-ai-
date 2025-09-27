'use client';

import { ReactNode } from 'react';
import SmoothScrollProvider from '@/components/providers/smooth-scroll-provider';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
        {children}
      </div>
    </SmoothScrollProvider>
  );
}
