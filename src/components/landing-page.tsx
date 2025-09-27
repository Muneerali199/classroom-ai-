'use client';

import React from 'react';
import { motion } from 'framer-motion';
import CookiesConsent from '@/components/cookies-consent';
import HulyHero from '@/components/landing/huly-hero';
import FeaturesSection from '@/components/landing/features-section';
import HowItWorksSection from '@/components/landing/how-it-works';
import FinalCTASection from '@/components/landing/final-cta';
import TechStackSection from '@/components/landing/tech-stack';
import TeamSection from '@/components/landing/team-section';

export default function LandingPage() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="min-h-screen overflow-x-hidden"
      style={{ 
        background: 'linear-gradient(180deg, #08090B 0%, #0E1317 100%)'
      }}
    >
      {/* Huly-style Hero (exact UI) */}
      <HulyHero />

      {/* Interactive Features Section */}
      <FeaturesSection />

      {/* Tech Stack Section */}
      <TechStackSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Team Section */}
      <TeamSection />

      {/* Final CTA Section */}
      <FinalCTASection />

      <CookiesConsent />
    </motion.div>
  );
}