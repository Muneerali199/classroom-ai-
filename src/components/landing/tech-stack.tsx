'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const stacks = [
  'Next.js',
  'React',
  'TypeScript',
  'Tailwind CSS',
  'Framer Motion',
  'Three.js',
  'next-intl'
];

export default function TechStackSection() {
  const t = useTranslations('Landing.tech');

  return (
    <section className="relative w-full py-20 md:py-28" style={{ background: 'linear-gradient(180deg, #08090B 0%, #0E1317 100%)' }}>
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            {t('title')}
          </h2>
          <p className="mt-4 text-slate-400 text-base md:text-lg">
            {t('subtitle')}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {stacks.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex items-center justify-center rounded-xl border border-white/10 bg-gray-900/50 backdrop-blur px-4 py-6 text-white text-sm md:text-base font-medium hover:border-cyan-400/50 transition-all duration-300"
            >
              {name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
