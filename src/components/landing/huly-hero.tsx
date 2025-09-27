'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LaserFlow from '@/components/ui/laser-flow';
import ThemeToggle from '@/components/ui/theme-toggle';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HulyHero() {
  const heroImageRef = useRef<HTMLImageElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const tNav = useTranslations('Landing.nav');
  const tHero = useTranslations('Landing.hero');

  useEffect(() => {
    // Simple scroll animations without laser effects
    if (typeof window !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }, []);

  return (
    <>
      {/* Enhanced Navbar - Huly.io style */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 dark:bg-black/90 backdrop-blur-xl border-b border-white/10 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CA</span>
                </div>
                <div className="text-white dark:text-white font-bold text-xl">ClassroomAI</div>
              </div>
              <div className="hidden lg:flex items-center space-x-1">
                <a href="#features" className="text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/5">{tNav('features')}</a>
                <a href="#pricing" className="text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/5">{tNav('pricing')}</a>
                <a href="#about" className="text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/5">{tNav('about')}</a>
                <a href="#contact" className="text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/5">{tNav('contact')}</a>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <a href="/login" className="text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/5">{tNav('signIn')}</a>
              <a href="/signup" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 hover:scale-105">
                {tNav('getStarted')}
              </a>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero Section - Enhanced Huly.io style */}
      <section 
        ref={heroSectionRef}
        className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-900 transition-colors duration-300"
      >
        {/* LaserFlow Background - Only in dark mode */}
        <div className="absolute inset-0 opacity-90 dark:block hidden">
          <LaserFlow
            horizontalBeamOffset={0.15}
            verticalBeamOffset={0.05}
            color="#FF79C6"
            wispDensity={2.0}
            flowSpeed={0.4}
            fogIntensity={0.8}
            wispIntensity={0.6}
            mouseTiltStrength={0.3}
            className="w-full h-full"
          />
        </div>

        {/* Light mode gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:hidden block"></div>
        
        {/* Gradient overlays for depth - different for light/dark mode */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-100/30 via-transparent to-transparent dark:from-black/50 dark:via-transparent dark:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-cyan-500/10 dark:from-cyan-500/5 dark:via-transparent dark:to-blue-500/5" />

        {/* Two-column layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left column - Enhanced Text content */}
            <div className="lg:pr-8 space-y-8">
              {/* Trust indicator */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex items-center gap-3 text-sm"
              >
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 font-medium">Live</span>
                </div>
                <span className="text-gray-400 dark:text-gray-400">•</span>
                <span className="text-gray-600 dark:text-gray-300">Trusted by 10,000+ educators worldwide</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.9] mb-6 text-gray-900 dark:text-white"
                style={{ 
                  fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
                }}
              >
                The future of{' '}
                <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent">
                  classroom
                </span>
                <br />
                management
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl leading-relaxed"
                style={{ 
                  fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
                }}
              >
                Streamline attendance, automate grading, and unlock insights with our AI-powered platform. Built for educators who demand excellence.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button className="group relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 flex items-center justify-center">
                  Get started for free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
                
                <button className="group flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 px-8 py-4 rounded-2xl border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <Play className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />
                  Watch demo
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">10K+</div>
                  <div className="text-sm text-gray-400">Active Teachers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">500K+</div>
                  <div className="text-sm text-gray-400">Students Managed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">99.9%</div>
                  <div className="text-sm text-gray-400">Uptime</div>
                </div>
              </motion.div>
            </div>

            {/* Right column - Enhanced Dashboard preview */}
            <div className="relative lg:ml-8">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="relative"
              >
                
                {/* Main dashboard image with enhanced styling */}
                <div className="relative group">
                  <img
                    ref={heroImageRef}
                    src="/dashboard.png"
                    alt="Dashboard Preview"
                    className="w-full h-auto rounded-3xl shadow-2xl relative z-5 transition-transform duration-500 group-hover:scale-[1.02]"
                    style={{
                      filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.3)) brightness(1.05) contrast(1.1)',
                      boxShadow: '0 0 120px rgba(110, 231, 183, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
                    }}
                  />
                  
                  {/* Glassmorphism overlay */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Feature badges */}
                  <div className="absolute top-4 right-4 bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                    ✨ Live Demo
                  </div>
                  <div className="absolute bottom-4 left-4 bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                    🚀 AI-Powered
                  </div>
                </div>
                
                {/* Floating UI elements */}
                <motion.div
                  animate={{ 
                    y: [0, -15, 0],
                    x: [0, 10, 0]
                  }}
                  transition={{ 
                    duration: 6, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute -top-6 -right-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 shadow-lg backdrop-blur-sm"
                >
                  <div className="text-white text-sm font-semibold">Smart Analytics</div>
                  <div className="text-purple-100 text-xs">Real-time insights</div>
                </motion.div>

                <motion.div
                  animate={{ 
                    y: [0, 12, 0],
                    x: [0, -8, 0]
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 2
                  }}
                  className="absolute -bottom-6 -left-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl p-4 shadow-lg backdrop-blur-sm"
                >
                  <div className="text-white text-sm font-semibold">Auto Grading</div>
                  <div className="text-cyan-100 text-xs">AI-powered assessment</div>
                </motion.div>
                
                {/* Ambient particles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
                    style={{
                      left: `${15 + Math.random() * 70}%`,
                      top: `${15 + Math.random() * 70}%`,
                    }}
                    animate={{
                      y: [0, -30, 0],
                      opacity: [0.2, 0.8, 0.2],
                      scale: [0.5, 1.2, 0.5],
                    }}
                    transition={{
                      duration: 4 + Math.random() * 3,
                      repeat: Infinity,
                      delay: Math.random() * 3,
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>


      {/* Clean Dashboard Preview Section */}
      <section 
        ref={dashboardRef}
        className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Built for{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                modern
              </span>{' '}
              educators
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              Everything you need to manage your classroom efficiently. Real-time attendance tracking, automated grading, and powerful analytics in one seamless platform.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative mx-auto rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 backdrop-blur-md overflow-hidden shadow-2xl"
          >
            {/* Enhanced Image with better styling */}
            <div className="relative group p-6">
              <img
                src="/dashboard.png"
                alt="ClassroomAI Dashboard Preview"
                className="w-full h-auto block rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                style={{ 
                  filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.1))',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)'
                }}
              />
              
              {/* Floating feature badges */}
              <div className="absolute top-10 right-10 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                ✨ AI-Powered
              </div>
              <div className="absolute bottom-10 left-10 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                📊 Real-time Analytics
              </div>
            </div>
          </motion.div>

          {/* Feature highlights below dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          >
            {[
              { icon: '🎯', title: 'Smart Attendance', desc: 'Automated tracking with real-time insights and reporting' },
              { icon: '📝', title: 'Intelligent Grading', desc: 'AI-powered assessment with instant feedback loops' },
              { icon: '📈', title: 'Advanced Analytics', desc: 'Data-driven insights for better learning outcomes' }
            ].map((feature, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
