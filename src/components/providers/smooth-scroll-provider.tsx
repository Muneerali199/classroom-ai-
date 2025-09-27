'use client';

import { ReactNode, useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    // Initialize Lenis with faster, smoother settings
    const lenis = new Lenis({
      duration: 0.8, // Faster scrolling
      easing: (t) => 1 - Math.pow(1 - t, 3), // Smooth cubic easing
      wheelMultiplier: 1.5, // More responsive mouse wheel
      touchMultiplier: 2.5, // Faster touch scrolling
    });

    // Get scroll value
    lenis.on('scroll', (e: any) => {
      // console.log(e)
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
