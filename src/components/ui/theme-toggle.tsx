'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = typeof window !== 'undefined' ? localStorage.getItem('color-theme') : null;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = stored ? stored === 'dark' : prefersDark;
    setIsDark(initialDark);
    document.documentElement.classList.toggle('dark', initialDark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('color-theme', next ? 'dark' : 'light');
    } catch {}
  };

  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className={`inline-flex items-center justify-center rounded-full border border-gray-300/70 dark:border-gray-600/70 bg-white/80 dark:bg-slate-900/70 backdrop-blur px-2.5 py-2 shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-yellow-300" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700" />
      )}
    </button>
  );
}
