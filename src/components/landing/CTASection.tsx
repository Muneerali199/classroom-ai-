'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Play, Shield, Zap, Users, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

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
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-600/20 dark:to-purple-600/20 backdrop-blur-sm relative overflow-hidden"
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.3, 1],
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
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 backdrop-blur-sm border border-gray-300/30 dark:border-white/20"
          >
            <Sparkles className="w-12 h-12 text-blue-500 dark:text-blue-400" />
          </motion.div>
        </motion.div>

        <motion.h2
          className="text-4xl sm:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Ready to Transform Your Institution?
          </span>
        </motion.h2>

        <motion.p
          className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          Contact your institution's dean to get secure access to EduTrack's
          comprehensive attendance and student management platform.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          viewport={{ once: true }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button size="lg" className="group w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow duration-300" asChild>
              <Link href="/login">
                <Heart className="mr-2 group-hover:animate-pulse" />
                Login to Get Started
              </Link>
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-gray-900/10 dark:bg-white/10 border-gray-300/30 dark:border-white/20 hover:bg-gray-900/20 dark:hover:bg-white/20 backdrop-blur-sm">
              <Play className="mr-2" />
              Schedule Demo
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          viewport={{ once: true }}
        >
          {ctaBenefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.3 + index * 0.1 }}
              viewport={{ once: true }}
            >
              <benefit.icon className="w-5 h-5 text-green-400" />
              <span>{benefit.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
