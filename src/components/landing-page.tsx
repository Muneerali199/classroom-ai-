
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
      className="min-h-screen text-gray-900 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 dark:text-white overflow-x-hidden transition-all duration-500"
    >
      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [-10, 10, -10],
          transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="fixed top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 dark:from-blue-500/30 dark:to-purple-500/30 rounded-full blur-xl pointer-events-none z-0"
      />
      <motion.div
        animate={{
          y: [-10, 10, -10],
          transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          },
        }}
        className="fixed top-40 right-20 w-16 h-16 bg-gradient-to-br from-pink-400/20 to-orange-400/20 dark:from-pink-500/30 dark:to-orange-500/30 rounded-full blur-xl pointer-events-none z-0"
      />
      <motion.div
        animate={{
          y: [-10, 10, -10],
          transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          },
        }}
        className="fixed bottom-40 left-20 w-24 h-24 bg-gradient-to-br from-green-400/20 to-blue-400/20 dark:from-green-500/30 dark:to-blue-500/30 rounded-full blur-xl pointer-events-none z-0"
      />

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

    