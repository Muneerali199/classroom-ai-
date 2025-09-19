
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/landing/Navigation';
import HeroSection from '@/components/landing/HeroSection';
import AccessSection from '@/components/landing/AccessSection';
import AboutSection from '@/components/landing/AboutSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import TechStackSection from '@/components/landing/TechStackSection';
import TeamSection from '@/components/landing/TeamSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';
import { Logo } from '@/components/icons';

export default function LandingPage() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
<<<<<<< HEAD
      className="min-h-screen text-gray-700 bg-gray-200 overflow-x-hidden"
      style={{
        background: 'linear-gradient(135deg, #e3e3e3 0%, #d6d6d6 100%)'
      }}
    >
      {/* Subtle floating elements with neumorphic style */}
      <motion.div
        animate={{
          y: [-8, 8, -8],
          transition: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="fixed top-20 left-10 w-16 h-16 rounded-full pointer-events-none z-0"
        style={{
          background: 'linear-gradient(145deg, #f0f0f0, #d0d0d0)',
          boxShadow: '8px 8px 16px #bebebe, -8px -8px 16px #ffffff'
        }}
      />
      <motion.div
        animate={{
          y: [-6, 12, -6],
          transition: {
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          },
        }}
        className="fixed top-60 right-16 w-12 h-12 rounded-full pointer-events-none z-0"
        style={{
          background: 'linear-gradient(145deg, #ebebeb, #d5d5d5)',
          boxShadow: '6px 6px 12px #c4c4c4, -6px -6px 12px #ffffff'
        }}
      />
      <motion.div
        animate={{
          y: [-10, 10, -10],
          transition: {
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6,
          },
        }}
        className="fixed bottom-32 left-24 w-20 h-20 rounded-full pointer-events-none z-0"
        style={{
          background: 'linear-gradient(145deg, #ededed, #d7d7d7)',
          boxShadow: '10px 10px 20px #c0c0c0, -10px -10px 20px #ffffff'
        }}
      />
=======
      className="min-h-screen text-foreground bg-gradient-to-br from-white via-slate-50/50 to-purple-50/30 dark:from-background dark:via-slate-900/50 dark:to-purple-950/30 overflow-x-hidden transition-all duration-500 relative"
    >
      {/* Modern Floating Elements */}
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
          className="absolute top-1/3 right-[15%] w-24 h-24 bg-gradient-to-br from-pink-400/10 to-orange-400/10 dark:from-pink-500/20 dark:to-orange-500/20 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            y: [-10, 10, -10],
            x: [-5, 5, -5],
            rotate: [0, -360],
            transition: {
              duration: 30,
              repeat: Infinity,
              ease: "linear",
              delay: 6,
            },
          }}
          className="absolute bottom-1/3 left-[20%] w-40 h-40 bg-gradient-to-br from-teal-400/8 to-blue-500/8 dark:from-teal-500/15 dark:to-blue-500/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [10, -10, 10],
            x: [-8, 8, -8],
            rotate: [180, 540],
            transition: {
              duration: 35,
              repeat: Infinity,
              ease: "linear",
              delay: 9,
            },
          }}
          className="absolute top-2/3 right-[25%] w-28 h-28 bg-gradient-to-br from-violet-400/10 to-indigo-500/10 dark:from-violet-500/20 dark:to-indigo-500/20 rounded-full blur-2xl"
        />
      </div>

      {/* Gradient Mesh Background */}
      <div className="fixed inset-0 opacity-30 dark:opacity-20 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-purple-500/10 to-transparent rounded-full blur-3xl" />
      </div>
>>>>>>> 199af3475761fe42d3e41253973aa62af258ba8f

      <Navigation scrollToSection={scrollToSection} />
      <HeroSection scrollToSection={scrollToSection} />
      <AccessSection />
      <AboutSection />
      <FeaturesSection />
      <TechStackSection />
      <TeamSection />
      <TestimonialsSection />
      <CTASection />
      <Footer scrollToSectionAction={scrollToSection} />
    </motion.div>
  );
}
