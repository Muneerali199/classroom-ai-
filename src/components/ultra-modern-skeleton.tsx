'use client';

import { motion } from 'framer-motion';

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <motion.div
            className="h-10 w-64 bg-gradient-to-r from-white/10 to-white/5 rounded-xl"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="h-4 w-48 bg-gradient-to-r from-white/10 to-white/5 rounded-lg"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          />
        </div>
        <motion.div
          className="h-12 w-32 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-xl"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
        />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="p-6 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl" />
                <div className="h-6 w-16 bg-white/10 rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="h-8 w-24 bg-white/20 rounded-lg" />
                <div className="h-4 w-32 bg-white/10 rounded-lg" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content Area Skeleton */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2 p-6 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl space-y-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="h-6 w-48 bg-white/20 rounded-lg" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
              <div className="flex justify-between">
                <div className="h-5 w-32 bg-white/20 rounded-lg" />
                <div className="h-5 w-16 bg-cyan-500/20 rounded-full" />
              </div>
              <div className="h-4 w-full bg-white/10 rounded-lg" />
              <div className="h-2 w-full bg-white/10 rounded-full" />
            </div>
          ))}
        </motion.div>

        <motion.div
          className="p-6 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl space-y-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
        >
          <div className="h-6 w-32 bg-white/20 rounded-lg" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-full bg-white/10 rounded-lg" />
              <div className="h-2 w-full bg-white/10 rounded-full" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <motion.div
      className="p-6 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl space-y-4"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl" />
        <div className="h-6 w-20 bg-white/10 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-6 w-32 bg-white/20 rounded-lg" />
        <div className="h-4 w-full bg-white/10 rounded-lg" />
      </div>
    </motion.div>
  );
}

export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {[...Array(items)].map((_, i) => (
        <motion.div
          key={i}
          className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-white/20 rounded-lg" />
            <div className="h-3 w-1/2 bg-white/10 rounded-lg" />
          </div>
          <div className="h-8 w-24 bg-cyan-500/20 rounded-lg" />
        </motion.div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="grid grid-cols-4 gap-4 p-4 bg-white/10 border border-white/10 rounded-xl">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-4 bg-white/20 rounded-lg" />
        ))}
      </div>
      {/* Rows */}
      {[...Array(rows)].map((_, i) => (
        <motion.div
          key={i}
          className="grid grid-cols-4 gap-4 p-4 bg-white/5 border border-white/10 rounded-xl"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
        >
          {[...Array(4)].map((_, j) => (
            <div key={j} className="h-4 bg-white/10 rounded-lg" />
          ))}
        </motion.div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen p-6 space-y-8">
      <motion.div
        className="space-y-2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="h-10 w-64 bg-white/20 rounded-xl" />
        <div className="h-4 w-96 bg-white/10 rounded-lg" />
      </motion.div>
      
      <div className="space-y-6">
        <CardSkeleton />
        <ListSkeleton />
      </div>
    </div>
  );
}
