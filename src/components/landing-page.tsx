
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import CookiesConsent from '@/components/cookies-consent';
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

export default function LandingPage() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
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

      {/* Navigation */}
      <Navigation scrollToSection={scrollToSection} />

      {/* Hero Section */}
      <HeroSection scrollToSection={scrollToSection} />

      {/* Controlled Access Section */}
      <AccessSection />

      {/* About Section */}
      <AboutSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Tech Stack Section */}
      <TechStackSection />

      {/* Team Section */}
      <TeamSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer scrollToSection={scrollToSection} />

      <CookiesConsent />
    </motion.div>
  );
}

    