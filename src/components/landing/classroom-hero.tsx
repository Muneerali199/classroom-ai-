'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Star } from 'lucide-react';
import LaserFlow from '@/components/ui/laser-flow';

export default function ClassroomHero() {
  const t = useTranslations('Landing.hero');
  const revealImgRef = useRef<HTMLDivElement>(null);

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center px-4 py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: '#060010' }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const el = revealImgRef.current;
        if (el) {
          el.style.setProperty('--mx', `${x}px`);
          el.style.setProperty('--my', `${y + rect.height * 0.5}px`);
        }
      }}
      onMouseLeave={() => {
        const el = revealImgRef.current;
        if (el) {
          el.style.setProperty('--mx', '-9999px');
          el.style.setProperty('--my', '-9999px');
        }
      }}
    >
      {/* LaserFlow Background */}
      <div className="absolute inset-0">
        <LaserFlow
          horizontalBeamOffset={0.1}
          verticalBeamOffset={0.0}
          color="#FF79C6"
          fogIntensity={0.6}
          wispDensity={1.2}
          flowSpeed={0.3}
        />
      </div>

      {/* Content Container */}
      <div 
        className="relative z-10 w-full max-w-4xl mx-auto text-center"
        style={{
          backgroundColor: '#060010',
          borderRadius: '20px',
          border: '2px solid #FF79C6',
          padding: '3rem 2rem',
          boxShadow: '0 0 50px rgba(255, 121, 198, 0.3)'
        }}
      >
        {/* Trust Indicator */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center gap-2 text-sm text-blue-300 mb-6"
        >
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span>{t('trustIndicator')}</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight mb-8 tracking-tight"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          Transform Education
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            with AI
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          {t('subtitle')}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
        >
          {/* Primary Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 border-0 min-w-[200px]"
            >
              {t('ctaPrimary')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>

          {/* Secondary Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-gray-300 text-gray-300 hover:bg-white/10 hover:border-gray-200 font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 min-w-[200px] bg-transparent"
            >
              <Play className="mr-2 h-5 w-5" />
              {t('ctaSecondary')}
            </Button>
          </motion.div>
        </motion.div>

        {/* Small Link */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <a
            href="#waitlist"
            className="text-sm text-gray-400 hover:text-gray-200 transition-colors duration-200 font-medium underline underline-offset-4 decoration-1 hover:decoration-2"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Join the waitlist
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-16 pt-8 border-t border-white/10"
        >
          <p className="text-sm text-gray-400 mb-6 font-medium">
            Everything you need for modern classroom management:
          </p>
          
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">10K+</div>
              <div className="text-sm text-gray-400">{t('statsTeachers')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">500K+</div>
              <div className="text-sm text-gray-400">{t('statsStudents')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">99.9%</div>
              <div className="text-sm text-gray-400">{t('statsUptime')}</div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-gray-400 font-medium">
            {[
              'Smart Attendance',
              'AI Grading', 
              'Performance Analytics',
              'Multilingual Support',
              'Real-time Insights',
              'Secure & Reliable'
            ].map((feature, index) => (
              <motion.span
                key={feature}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                className="hover:text-gray-200 transition-colors duration-200 cursor-default"
              >
                {feature}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Reveal Effect Overlay */}
      <div
        ref={revealImgRef}
        className="absolute inset-0 pointer-events-none z-5 opacity-20"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,121,198,0.3) 0%, transparent 60%)',
          '--mx': '-9999px',
          '--my': '-9999px',
          WebkitMaskImage: 'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
          maskImage: 'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          mixBlendMode: 'lighten'
        } as React.CSSProperties}
      />
    </section>
  );
}
