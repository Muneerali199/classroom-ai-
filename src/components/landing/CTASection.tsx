
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Play, Shield, Zap, Users, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/lib/utils';

export default function CTASection() {
  const [buttonPressed, setButtonPressed] = useState<Record<string, boolean>>({});

  const ctaBenefits = [
    { icon: Shield, text: "Enterprise Security" },
    { icon: Zap, text: "Lightning Fast" },
    { icon: Users, text: "24/7 Support" },
  ];

  const handleButtonPress = (buttonId: string, isPressed: boolean) => {
    setButtonPressed(prev => ({ ...prev, [buttonId]: isPressed }));
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #e5e5e5 0%, #d8d8d8 100%)'
      }}
    >
      {/* Subtle neumorphic background elements */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 rounded-full"
        style={{
          background: 'linear-gradient(145deg, #ededed, #d7d7d7)',
          boxShadow: '16px 16px 32px #c0c0c0, -16px -16px 32px #ffffff'
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-40 h-40 rounded-full"
        style={{
          background: 'linear-gradient(145deg, #e8e8e8, #d2d2d2)',
          boxShadow: '20px 20px 40px #c0c0c0, -20px -20px 40px #ffffff'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
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
            className="inline-block p-4 rounded-2xl"
            style={{
              background: 'linear-gradient(145deg, #f0f0f0, #d0d0d0)',
              boxShadow: '12px 12px 24px #bebebe, -12px -12px 24px #ffffff'
            }}
          >
            <Sparkles className="w-12 h-12 text-gray-600" />
          </motion.div>
        </motion.div>

        <motion.h2
          className="text-4xl sm:text-5xl font-bold mb-6 text-gray-700"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          Ready to Transform Your Institution?
        </motion.h2>

        <motion.div
          className="max-w-2xl mx-auto mb-8 p-6 rounded-3xl"
          style={{
            background: 'linear-gradient(145deg, #efefef, #d9d9d9)',
            boxShadow: 'inset 8px 8px 16px #c8c8c8, inset -8px -8px 16px #ffffff'
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-xl text-gray-600">
            Contact your institution's dean to get secure access to EduTrack's
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
          <motion.div
            onMouseDown={() => handleButtonPress('primary', true)}
            onMouseUp={() => handleButtonPress('primary', false)}
            onMouseLeave={() => handleButtonPress('primary', false)}
          >
            <Link href={createPageUrl("login")}>
              <motion.button
                className="px-8 py-4 rounded-2xl font-semibold text-gray-700 flex items-center gap-2 transition-all duration-200"
                style={{
                  background: buttonPressed['primary'] ?
                    'linear-gradient(145deg, #d0d0d0, #f0f0f0)' :
                    'linear-gradient(145deg, #f0f0f0, #d0d0d0)',
                  boxShadow: buttonPressed['primary'] ?
                    'inset 8px 8px 16px #bebebe, inset -8px -8px 16px #ffffff' :
                    '8px 8px 16px #bebebe, -8px -8px 16px #ffffff'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Heart className="w-4 h-4" />
                Login to Get Started
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            onMouseDown={() => handleButtonPress('secondary', true)}
            onMouseUp={() => handleButtonPress('secondary', false)}
            onMouseLeave={() => handleButtonPress('secondary', false)}
          >
            <motion.button
              className="px-8 py-4 rounded-2xl font-semibold text-gray-700 flex items-center gap-2 transition-all duration-200"
              style={{
                background: buttonPressed['secondary'] ?
                  'linear-gradient(145deg, #d5d5d5, #ebebeb)' :
                  'linear-gradient(145deg, #ebebeb, #d5d5d5)',
                boxShadow: buttonPressed['secondary'] ?
                  'inset 6px 6px 12px #c4c4c4, inset -6px -6px 12px #ffffff' :
                  '6px 6px 12px #c4c4c4, -6px -6px 12px #ffffff'
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="w-4 h-4" />
              Schedule Demo
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex items-center justify-center space-x-8 text-sm text-gray-600"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          viewport={{ once: true }}
        >
          {ctaBenefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl"
              style={{
                background: 'linear-gradient(145deg, #ededed, #d7d7d7)',
                boxShadow: '4px 4px 8px #c8c8c8, -4px -4px 8px #ffffff'
              }}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.3 + index * 0.1 }}
              viewport={{ once: true }}
            >
              <benefit.icon className="w-4 h-4 text-gray-500" />
              <span>{benefit.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
