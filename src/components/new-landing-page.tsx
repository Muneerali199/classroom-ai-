'use client';

import React from 'react';
import { motion } from 'framer-motion';
import NewHero from '@/components/landing/new-hero';
import NewFeatures from '@/components/landing/new-features';
import NewDemo from '@/components/landing/new-demo';
import NewTechStack from '@/components/landing/new-tech-stack';
import NewTeam from '@/components/landing/new-team';
import FinalCTASection from '@/components/landing/final-cta';
import CookiesConsent from '@/components/cookies-consent';

export default function NewLandingPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="min-h-screen overflow-x-hidden bg-black"
    >
      {/* Hero Section with Navbar */}
      <NewHero />

      {/* Interactive Features Section */}
      <NewFeatures />

      {/* Live Demo Section */}
      <NewDemo />

      {/* Tech Stack Section */}
      <NewTechStack />

      {/* Team Section */}
      <NewTeam />

      {/* Final CTA */}
      <FinalCTASection />

      {/* Cookies Consent */}
      <CookiesConsent />
    </motion.div>
  );
}
