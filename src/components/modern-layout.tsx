'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ModernLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export default function ModernLayout({ 
  children, 
  title, 
  subtitle, 
  actions,
  className = ""
}: ModernLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/50 via-white to-purple-50/30 dark:from-slate-950/50 dark:via-background dark:to-purple-950/30">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [0, 360],
            transition: {
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            },
          }}
          className="absolute top-20 left-[10%] w-32 h-32 bg-gradient-to-br from-primary/10 to-purple-500/10 dark:from-primary/20 dark:to-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [-15, 15, -15],
            x: [10, -10, 10],
            rotate: [360, 0],
            transition: {
              duration: 25,
              repeat: Infinity,
              ease: "linear",
              delay: 3,
            },
          }}
          className="absolute bottom-1/3 right-[15%] w-24 h-24 bg-gradient-to-br from-pink-400/10 to-orange-400/10 dark:from-pink-500/20 dark:to-orange-500/20 rounded-full blur-2xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="container-modern section-padding space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-6 lg:p-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-responsive-xl font-bold font-headline tracking-tight gradient-text">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-muted-foreground text-responsive-sm max-w-2xl text-balance">
                    {subtitle}
                  </p>
                )}
              </div>
              {actions && (
                <div className="flex flex-wrap items-center gap-3">
                  {actions}
                </div>
              )}
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`space-y-8 ${className}`}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}