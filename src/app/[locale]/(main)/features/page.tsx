'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/landing/Navigation';
import FeaturesSection from '@/components/landing/FeaturesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import TechStackSection from '@/components/landing/TechStackSection';
import { benefits, architectureHighlights } from '@/lib/landing-data';

export default function FeaturesPage() {
  const scrollToSection = () => {
    // Dummy function for navigation component
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation scrollToSection={scrollToSection} />
      {/* Hero Section */}
      <motion.section
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover the comprehensive tools and capabilities that make EduTrack the leading choice for educational institutions.
          </motion.p>
        </div>
      </motion.section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Benefits Section */}
      <motion.section
        className="py-24 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
              Key Benefits
            </span>
          </motion.h2>
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30 hover:border-gray-300/50 dark:hover:border-gray-600/50 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <benefit.icon className="w-8 h-8 text-green-500 mx-auto mb-4" />
                <p className="text-gray-700 dark:text-gray-300 font-medium">{benefit.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Architecture Highlights */}
      <motion.section
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-gray-900/10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Architecture Highlights
            </span>
          </motion.h2>
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {architectureHighlights.map((highlight, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30 hover:border-gray-300/50 dark:hover:border-gray-600/50 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <highlight.icon className="w-8 h-8 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{highlight.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{highlight.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Tech Stack */}
      <TechStackSection />
    </div>
  );
}