'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Play, Shield, Zap, Users, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CTASection() {
  const ctaBenefits = [
    { icon: Shield, text: "Enterprise Security" },
    { icon: Zap, text: "Lightning Fast" },
    { icon: Users, text: "24/7 Support" },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      {/* Modern floating elements */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 backdrop-blur-sm"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-400/20 backdrop-blur-sm"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg"
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>
        </motion.div>

        <motion.h2
          className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          Ready to Transform Your Institution?
        </motion.h2>

        <motion.div
          className="max-w-2xl mx-auto mb-8 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-xl text-gray-700 dark:text-gray-300">
            Contact your institution&apos;s dean to get secure access to EduTrack&apos;s
            comprehensive attendance and student management platform.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          viewport={{ once: true }}
        >
          <motion.div>
            <Link href="/login">
              <motion.button
                className="px-8 py-4 rounded-xl font-semibold text-white flex items-center gap-2 transition-all duration-200 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Heart className="w-4 h-4" />
                Login to Get Started
              </motion.button>
            </Link>
          </motion.div>

          <motion.div>
            <motion.button
              className="px-8 py-4 rounded-xl font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2 transition-all duration-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="w-4 h-4" />
              Schedule Demo
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex items-center justify-center space-x-8 text-sm text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          viewport={{ once: true }}
        >
          {ctaBenefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.3 + index * 0.1 }}
              viewport={{ once: true }}
            >
              <benefit.icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span>{benefit.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  );
}