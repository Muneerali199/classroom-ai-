
'use client';

import React, { useState, useEffect } from 'react';
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
import { Logo } from '@/components/icons';

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
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

    