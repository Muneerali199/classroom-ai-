'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/icons';
import { benefits } from '@/lib/landing-data'; // Updated import path

interface HeroSectionProps {
  scrollToSection: (id: string) => void;
}

export default function HeroSection({ scrollToSection }: HeroSectionProps) {
  const [buttonPressed, setButtonPressed] = useState<Record<string, boolean>>({});

  const handleButtonPress = (buttonId: string, isPressed: boolean) => {
    setButtonPressed(prev => ({ ...prev, [buttonId]: isPressed }));
  };

  return (
    <motion.section
      id="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 sm:py-0"
    >

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 text-center max-w-6xl mx-auto px-4"
      >
        {/* Neumorphic Logo Container */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <motion.div
            className="inline-block p-4 rounded-3xl"
            style={{
              background: 'linear-gradient(145deg, #f0f0f0, #d0d0d0)',
              boxShadow: '12px 12px 24px #bebebe, -12px -12px 24px #ffffff'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ 
              scale: 0.95,
              boxShadow: 'inset 8px 8px 16px #bebebe, inset -8px -8px 16px #ffffff'
            }}
          >
            <motion.div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-gray-600"
              style={{
                background: 'linear-gradient(145deg, #e0e0e0, #c8c8c8)',
                boxShadow: '6px 6px 12px #b8b8b8, -6px -6px 12px #f8f8f8'
              }}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Logo className="w-8 h-8" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-4xl sm:text-6xl lg:text-8xl font-bold mb-6 leading-tight text-gray-700"
        >
          <motion.span
            className="relative"
            style={{
              background: 'linear-gradient(145deg, #666666, #888888)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            EduTrack
          </motion.span>
          <br />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-gray-600"
          >
            Activity & Attendance
          </motion.span>
        </motion.h1>

        {/* Description in neumorphic container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-8 mx-auto max-w-4xl p-6 rounded-3xl"
          style={{
            background: 'linear-gradient(145deg, #ebebeb, #d5d5d5)',
            boxShadow: 'inset 8px 8px 16px #c4c4c4, inset -8px -8px 16px #ffffff'
          }}
        >
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed">
            Secure, institution-managed education platform with controlled access.
            Streamline attendance tracking, manage student progress, and maintain
            data security with dean-supervised account management.
          </p>
        </motion.div>

        {/* Neumorphic CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <motion.div
            onMouseDown={() => handleButtonPress('primary', true)}
            onMouseUp={() => handleButtonPress('primary', false)}
            onMouseLeave={() => handleButtonPress('primary', false)}
          >
            <Link href="/login">
              <motion.button
                className="px-8 py-4 rounded-2xl font-semibold text-gray-700 flex items-center gap-2 transition-all duration-200"
                style={{
                  background: buttonPressed.primary ? 
                    'linear-gradient(145deg, #d0d0d0, #f0f0f0)' : 
                    'linear-gradient(145deg, #f0f0f0, #d0d0d0)',
                  boxShadow: buttonPressed.primary ?
                    'inset 8px 8px 16px #bebebe, inset -8px -8px 16px #ffffff' :
                    '8px 8px 16px #bebebe, -8px -8px 16px #ffffff'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Login to Get Started 
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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
                background: buttonPressed.secondary ? 
                  'linear-gradient(145deg, #d5d5d5, #ebebeb)' : 
                  'linear-gradient(145deg, #ebebeb, #d5d5d5)',
                boxShadow: buttonPressed.secondary ?
                  'inset 6px 6px 12px #c4c4c4, inset -6px -6px 12px #ffffff' :
                  '6px 6px 12px #c4c4c4, -6px -6px 12px #ffffff'
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="w-4 h-4" />
              Watch Demo
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Benefits in neumorphic containers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600"
        >
          {benefits.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 + index * 0.1, duration: 0.6 }}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl"
              style={{
                background: 'linear-gradient(145deg, #ededed, #d7d7d7)',
                boxShadow: '4px 4px 8px #c8c8c8, -4px -4px 8px #ffffff'
              }}
              whileHover={{ scale: 1.05 }}
            >
              <item.icon className="w-4 h-4 text-gray-500" />
              <span>{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Neumorphic Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        onClick={() => scrollToSection('about')}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 p-3 rounded-full"
        style={{
          background: 'linear-gradient(145deg, #f0f0f0, #d0d0d0)',
          boxShadow: '6px 6px 12px #bebebe, -6px -6px 12px #ffffff'
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ 
          scale: 0.9,
          boxShadow: 'inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff'
        }}
      >
        <ChevronDown className="w-5 h-5 text-gray-600 animate-bounce" />
      </motion.button>
    </motion.section>
  );
}
