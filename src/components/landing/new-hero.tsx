'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles, CheckCircle2, Users, TrendingUp, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { HulyButton } from '@/components/ui/huly-button';

export default function NewHero() {
  const tNav = useTranslations('Landing.nav');
  const tHero = useTranslations('Landing.hero');

  return (
    <>
      {/* Floating Navbar */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-4 sm:top-6 left-0 right-0 z-[100] px-3 sm:px-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-black/95 backdrop-blur-3xl border border-white/40 rounded-2xl px-4 sm:px-6 md:px-8 py-3 sm:py-4 shadow-2xl shadow-black/80">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              {/* Logo */}
              <motion.a
                href="/"
                className="flex items-center gap-2 sm:gap-3 flex-shrink-0"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-9 h-9 sm:w-11 sm:h-11">
                  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <defs>
                      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="50%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <circle cx="100" cy="100" r="95" fill="url(#logoGradient)" opacity="0.15" />
                    <g filter="url(#glow)">
                      <path d="M 60 50 L 140 50 L 140 150 L 100 140 L 60 150 Z" fill="url(#logoGradient)" opacity="0.9" />
                      <path d="M 100 50 L 100 140" stroke="white" strokeWidth="2" opacity="0.6" />
                      <circle cx="80" cy="80" r="4" fill="white" opacity="0.9" />
                      <circle cx="80" cy="100" r="4" fill="white" opacity="0.9" />
                      <circle cx="80" cy="120" r="4" fill="white" opacity="0.9" />
                      <line x1="80" y1="84" x2="80" y2="96" stroke="white" strokeWidth="2" opacity="0.7" />
                      <line x1="80" y1="104" x2="80" y2="116" stroke="white" strokeWidth="2" opacity="0.7" />
                      <circle cx="120" cy="80" r="4" fill="white" opacity="0.9" />
                      <circle cx="120" cy="100" r="4" fill="white" opacity="0.9" />
                      <circle cx="120" cy="120" r="4" fill="white" opacity="0.9" />
                      <line x1="120" y1="84" x2="120" y2="96" stroke="white" strokeWidth="2" opacity="0.7" />
                      <line x1="120" y1="104" x2="120" y2="116" stroke="white" strokeWidth="2" opacity="0.7" />
                      <line x1="84" y1="80" x2="116" y2="80" stroke="white" strokeWidth="2" opacity="0.7" />
                      <line x1="84" y1="100" x2="116" y2="100" stroke="white" strokeWidth="2" opacity="0.7" />
                      <line x1="84" y1="120" x2="116" y2="120" stroke="white" strokeWidth="2" opacity="0.7" />
                      <path d="M 85 65 Q 100 60 115 65" stroke="white" strokeWidth="2.5" fill="none" opacity="0.8" />
                      <circle cx="85" cy="65" r="3" fill="white" opacity="0.9" />
                      <circle cx="115" cy="65" r="3" fill="white" opacity="0.9" />
                    </g>
                  </svg>
                </div>
                <span className="text-white font-bold text-base sm:text-xl hidden xs:block">ClassroomAI</span>
              </motion.a>

            {/* Nav Links - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-1">
              {['Features', 'Demo', 'Tech', 'Team'].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="px-3 py-2 text-sm text-gray-300 hover:text-white rounded-lg transition-all relative group"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="relative z-10">{item}</span>
                  <motion.div
                    className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </motion.a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <motion.a 
                href="/login" 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all font-semibold border border-white/20 hover:border-white/30 whitespace-nowrap"
              >
                Sign In
              </motion.a>
              <motion.a 
                href="/signup"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl transition-all font-semibold shadow-lg hover:shadow-cyan-500/50 whitespace-nowrap"
              >
                Get Started
              </motion.a>
            </div>
          </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-32 pb-20 px-4">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          
          {/* Gradient Orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-[120px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[120px]"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-full"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400 font-medium">AI-Powered Education Platform</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-7xl lg:text-8xl font-black leading-[1.1]"
            >
              <span className="text-white">Transform</span>
              <br />
              <span className="text-white">Your </span>
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Classroom
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-400 max-w-2xl leading-relaxed"
            >
              The all-in-one platform for modern educators. Automate attendance, grade assignments with AI, and unlock powerful insights—all in one beautiful interface.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                  initial={{ x: '100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </button>

              <button className="group px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold text-white backdrop-blur-sm transition-all hover:scale-105 flex items-center gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap items-center gap-6 pt-8 border-t border-white/10"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 border-2 border-black flex items-center justify-center text-xs text-white font-bold">
                      {i}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-gray-400">10,000+ educators</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Sparkles key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-400">4.9/5 rating</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Animated Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative"
          >
            {/* Main Dashboard Card */}
            <div className="relative bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10" />
              
              {/* Header */}
              <div className="relative z-10 flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-400 font-medium">Live</span>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="relative z-10 grid grid-cols-2 gap-4 mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl p-4 backdrop-blur-sm"
                >
                  <Users className="w-6 h-6 text-cyan-400 mb-2" />
                  <div className="text-2xl font-bold text-white">28/30</div>
                  <div className="text-xs text-gray-400">Students Present</div>
                  <motion.div
                    className="mt-2 h-1 bg-black/30 rounded-full overflow-hidden"
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: '93%' }}
                      transition={{ duration: 2, delay: 1 }}
                    />
                  </motion.div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-4 backdrop-blur-sm"
                >
                  <TrendingUp className="w-6 h-6 text-purple-400 mb-2" />
                  <div className="text-2xl font-bold text-white">95%</div>
                  <div className="text-xs text-gray-400">Avg Performance</div>
                  <motion.div
                    className="mt-2 h-1 bg-black/30 rounded-full overflow-hidden"
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-400 to-pink-500"
                      initial={{ width: 0 }}
                      animate={{ width: '95%' }}
                      transition={{ duration: 2, delay: 1.5 }}
                    />
                  </motion.div>
                </motion.div>
              </div>

              {/* Activity List */}
              <div className="relative z-10 space-y-3">
                {[
                  { icon: CheckCircle2, text: 'Attendance marked', time: '2m ago', color: 'emerald' },
                  { icon: Zap, text: 'Assignment auto-graded', time: '5m ago', color: 'cyan' },
                  { icon: TrendingUp, text: 'Analytics updated', time: '10m ago', color: 'purple' }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1 + i * 0.2 }}
                    className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-all"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-${item.color}-500/20 flex items-center justify-center`}>
                      <item.icon className={`w-4 h-4 text-${item.color}-400`} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-white font-medium">{item.text}</div>
                      <div className="text-xs text-gray-400">{item.time}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-6 -right-6 bg-gradient-to-br from-cyan-500 to-blue-600 p-4 rounded-2xl shadow-2xl border border-white/20"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>

            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -bottom-6 -left-6 bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-2xl shadow-2xl border border-white/20"
            >
              <Zap className="w-8 h-8 text-white" />
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-sm text-gray-400">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/20 rounded-full p-1">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-2 bg-cyan-400 rounded-full mx-auto"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
