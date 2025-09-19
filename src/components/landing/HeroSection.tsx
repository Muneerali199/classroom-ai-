import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/icons';
import { benefits } from '@/components/landing/data';
import { createPageUrl } from '@/lib/utils';

export default function HeroSection({ scrollToSection }: { scrollToSection: (id: string) => void }) {
  const [scrollYValue, setScrollYValue] = useState(0);
  const [buttonPressed, setButtonPressed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleScroll = () => setScrollYValue(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleButtonPress = (buttonId: string, isPressed: boolean) => {
    setButtonPressed(prev => ({ ...prev, [buttonId]: isPressed }));
  };

  return (
    <motion.section
      id="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 xl:py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 text-center max-w-7xl mx-auto w-full"
      >
        {/* Neumorphic Logo Container */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 200 }}
          className="mb-6 md:mb-8 lg:mb-10 xl:mb-12 flex justify-center"
        >
          <motion.div
            className="inline-flex items-center justify-center p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl md:rounded-2xl lg:rounded-3xl"
            style={{
              background: 'linear-gradient(145deg, #f0f0f0, #d0d0d0)',
              boxShadow: '8px 8px 16px #bebebe, -8px -8px 16px #ffffff',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ 
              scale: 0.95,
              boxShadow: 'inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff'
            }}
          >
            <motion.div
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 rounded-lg md:rounded-xl lg:rounded-2xl flex items-center justify-center text-gray-600"
              style={{
                background: 'linear-gradient(145deg, #e0e0e0, #c8c8c8)',
                boxShadow: '4px 4px 8px #b8b8b8, -4px -4px 8px #f8f8f8'
              }}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Logo className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-10 xl:h-10" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="font-bold mb-4 md:mb-6 lg:mb-8 xl:mb-10 leading-tight text-gray-700"
        >
          <motion.span
            className="block text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
            style={{
              background: 'linear-gradient(145deg, #666666, #888888)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            EduTrack
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-gray-600 block mt-2 sm:mt-3 md:mt-4 lg:mt-5 xl:mt-6"
          >
            Activity & Attendance
          </motion.span>
        </motion.h1>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-6 md:mb-8 lg:mb-10 xl:mb-12 mx-auto max-w-4xl lg:max-w-5xl p-4 sm:p-5 md:p-6 lg:p-7 rounded-xl md:rounded-2xl lg:rounded-3xl"
          style={{
            background: 'linear-gradient(145deg, #ebebeb, #d5d5d5)',
            boxShadow: 'inset 4px 4px 8px #c4c4c4, inset -4px -4px 8px #ffffff'
          }}
        >
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed md:leading-loose">
            Secure, institution-managed education platform with controlled access.
            Streamline attendance tracking, manage student progress, and maintain
            data security with dean-supervised account management.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 lg:gap-6 justify-center items-center mb-8 md:mb-10 lg:mb-12 xl:mb-14"
        >
          <motion.div
            onMouseDown={() => handleButtonPress('primary', true)}
            onMouseUp={() => handleButtonPress('primary', false)}
            onMouseLeave={() => handleButtonPress('primary', false)}
            onTouchStart={() => handleButtonPress('primary', true)}
            onTouchEnd={() => handleButtonPress('primary', false)}
            className="w-full sm:w-auto"
          >
            <Link href={createPageUrl("Login")} className="block w-full sm:w-auto">
              <motion.button
                className="w-full sm:w-auto px-6 py-3 sm:px-7 sm:py-4 md:px-8 md:py-4 lg:px-10 lg:py-5 rounded-xl md:rounded-2xl font-semibold text-gray-700 flex items-center justify-center gap-2 transition-all duration-200 text-sm sm:text-base md:text-lg"
                style={{
                  background: buttonPressed['primary'] ? 
                    'linear-gradient(145deg, #d0d0d0, #f0f0f0)' : 
                    'linear-gradient(145deg, #f0f0f0, #d0d0d0)',
                  boxShadow: buttonPressed['primary'] ?
                    'inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff' :
                    '6px 6px 12px #bebebe, -6px -6px 12px #ffffff'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Login to Get Started 
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            onMouseDown={() => handleButtonPress('secondary', true)}
            onMouseUp={() => handleButtonPress('secondary', false)}
            onMouseLeave={() => handleButtonPress('secondary', false)}
            onTouchStart={() => handleButtonPress('secondary', true)}
            onTouchEnd={() => handleButtonPress('secondary', false)}
            className="w-full sm:w-auto"
          >
            <motion.button
              className="w-full sm:w-auto px-6 py-3 sm:px-7 sm:py-4 md:px-8 md:py-4 lg:px-10 lg:py-5 rounded-xl md:rounded-2xl font-semibold text-gray-700 flex items-center justify-center gap-2 transition-all duration-200 text-sm sm:text-base md:text-lg"
              style={{
                background: buttonPressed['secondary'] ? 
                  'linear-gradient(145deg, #d5d5d5, #ebebeb)' : 
                  'linear-gradient(145deg, #ebebeb, #d5d5d5)',
                boxShadow: buttonPressed['secondary'] ?
                  'inset 4px 4px 8px #c4c4c4, inset -4px -4px 8px #ffffff' :
                  '6px 6px 12px #c4c4c4, -6px -6px 12px #ffffff'
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              Watch Demo
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm md:text-base text-gray-600 max-w-5xl mx-auto"
        >
          {benefits.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 + index * 0.1, duration: 0.6 }}
              className="flex items-center justify-center sm:justify-start space-x-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg md:rounded-xl"
              style={{
                background: 'linear-gradient(145deg, #ededed, #d7d7d7)',
                boxShadow: '3px 3px 6px #c8c8c8, -3px -3px 6px #ffffff'
              }}
              whileHover={{ scale: 1.05 }}
            >
              <item.icon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
              <span className="whitespace-nowrap font-medium">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        onClick={() => scrollToSection('about')}
        className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 p-2 sm:p-3 md:p-4 rounded-full touch-manipulation"
        style={{
          background: 'linear-gradient(145deg, #f0f0f0, #d0d0d0)',
          boxShadow: '4px 4px 8px #bebebe, -4px -4px 8px #ffffff'
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ 
          scale: 0.9,
          boxShadow: 'inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff'
        }}
        aria-label="Scroll to next section"
      >
        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600 animate-bounce" />
      </motion.button>
    </motion.section>
  );
}