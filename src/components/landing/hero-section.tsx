'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Users, Star, BookOpen } from 'lucide-react';
import LaserFlow from '@/components/ui/laser-flow';
import '@/styles/laser-flow.css';

export default function HeroSection() {
  const t = useTranslations('Landing');
  const heroRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={heroRef} className="relative min-h-screen w-full overflow-hidden bg-slate-900">
      {/* LaserFlow Background */}
      <div className="absolute inset-0">
        <LaserFlow 
          color="#2563eb"
          fogIntensity={0.6}
          wispDensity={1.2}
          flowSpeed={0.3}
          horizontalBeamOffset={0.1}
          verticalBeamOffset={0.0}
          className="opacity-80"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-transparent to-slate-900/30" />

      {/* Content */}
      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 flex min-h-screen items-center"
      >
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Main Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Trust Indicator */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center gap-2 text-sm text-blue-300"
              >
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span>Trusted by 10,000+ educators worldwide</span>
              </motion.div>

              {/* Main Headline */}
              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
                >
                  Transform{' '}
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Education
                  </span>{' '}
                  with AI
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed"
                >
                  Intelligent classroom management system that makes teaching and learning more engaging, efficient, and effective with AI-powered insights.
                </motion.p>
              </div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300 group"
                >
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 }}
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
            </motion.div>

            {/* Right Column - Interactive Demo Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              {/* Floating Cards */}
              <div className="relative">
                {/* Main Dashboard Preview */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotateY: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 6, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">ClassroomAI Dashboard</div>
                      <div className="text-gray-400 text-sm">Real-time insights</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Attendance Rate</span>
                      <span className="text-green-400 font-semibold">94.5%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '94.5%' }}
                        transition={{ duration: 2, delay: 1 }}
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">AI Grading</span>
                      <span className="text-blue-400 font-semibold">87 assignments</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '78%' }}
                        transition={{ duration: 2, delay: 1.5 }}
                        className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Floating Feature Cards */}
                <motion.div
                  animate={{ 
                    y: [0, 15, 0],
                    x: [0, 10, 0]
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 shadow-lg"
                >
                  <Users className="w-6 h-6 text-white mb-2" />
                  <div className="text-white text-sm font-semibold">Smart Attendance</div>
                  <div className="text-purple-100 text-xs">AI-powered tracking</div>
                </motion.div>

                <motion.div
                  animate={{ 
                    y: [0, -12, 0],
                    x: [0, -8, 0]
                  }}
                  transition={{ 
                    duration: 7, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 2
                  }}
                  className="absolute -bottom-4 -left-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl p-4 shadow-lg"
                >
                  <Star className="w-6 h-6 text-white mb-2" />
                  <div className="text-white text-sm font-semibold">Performance Analytics</div>
                  <div className="text-cyan-100 text-xs">Real-time insights</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
