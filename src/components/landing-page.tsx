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
import AboutSection from '@/components/landing/AboutSection';
import PricingSection from '@/components/landing/pricing-section';

export default function LandingPage() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="min-h-screen overflow-x-hidden bg-black"
    >
      {/* Huly-style Hero (exact UI) */}
      <HulyHero />

      {/* Interactive Features Section */}
      <FeaturesSection />

      {/* Tech Stack Section */}
      <TechStackSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* About Section */}
      <AboutSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Team Section */}
      <TeamSection />

      {/* Final CTA Section */}
      <FinalCTASection />

      <CookiesConsent />
    </motion.div>
  );
}