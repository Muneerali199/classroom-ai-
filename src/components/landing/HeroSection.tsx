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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollYValue(window.scrollY);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    
    // Initial check
    checkMobile();
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
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
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 text-center max-w-7xl mx-auto w-full"
      >
        {/* Neumorphic Logo Container - Fixed centering */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 200 }}
          className="mb-8 sm:mb-10 lg:mb-12 flex justify-center"
        >
          <motion.div
            className="inline-flex items-center justify-center p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl lg:rounded-[2rem]"
            style={{
              background: 'linear-gradient(145deg, #f0f0f0, #d0d0d0)',
              boxShadow: isMobile ? 
                '8px 8px 16px #bebebe, -8px -8px 16px #ffffff' : 
                '16px 16px 32px #bebebe, -16px -16px 32px #ffffff'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ 
              scale: 0.95,
              boxShadow: 'inset 8px 8px 16px #bebebe, inset -8px -8px 16px #ffffff'
            }}
          >
            <motion.div
              className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-xl sm:rounded-2xl lg:rounded-3xl flex items-center justify-center text-gray-600"
              style={{
                background: 'linear-gradient(145deg, #e0e0e0, #c8c8c8)',
                boxShadow: isMobile ? 
                  '6px 6px 12px #b8b8b8, -6px -6px 12px #f8f8f8' : 
                  '10px 10px 20px #b8b8b8, -10px -10px 20px #f8f8f8'
              }}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Logo className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Main Title - Enhanced responsive typography */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="font-bold mb-6 sm:mb-8 lg:mb-10 leading-tight text-gray-700"
        >
          <motion.span
            className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl"
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
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-gray-600 block mt-3 sm:mt-4 lg:mt-6"
          >
            Activity & Attendance
          </motion.span>
        </motion.h1>

        {/* Description in neumorphic container - Better responsive spacing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-8 sm:mb-10 lg:mb-12 mx-auto max-w-5xl p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl lg:rounded-[2rem]"
          style={{
            background: 'linear-gradient(145deg, #ebebeb, #d5d5d5)',
            boxShadow: isMobile ?
              'inset 6px 6px 12px #c4c4c4, inset -6px -6px 12px #ffffff' :
              'inset 10px 10px 20px #c4c4c4, inset -10px -10px 20px #ffffff'
          }}
        >
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed">
            Secure, institution-managed education platform with controlled access.
            Streamline attendance tracking, manage student progress, and maintain
            data security with dean-supervised account management.
          </p>
        </motion.div>

        {/* Neumorphic CTA Buttons - Enhanced responsive design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center items-center mb-10 sm:mb-12 lg:mb-16"
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
                className="w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 lg:px-12 lg:py-6 rounded-2xl sm:rounded-3xl font-semibold text-gray-700 flex items-center justify-center gap-3 transition-all duration-200 text-base sm:text-lg lg:text-xl"
                style={{
                  background: buttonPressed['primary'] ? 
                    'linear-gradient(145deg, #d0d0d0, #f0f0f0)' : 
                    'linear-gradient(145deg, #f0f0f0, #d0d0d0)',
                  boxShadow: buttonPressed['primary'] ?
                    'inset 6px 6px 12px #bebebe, inset -6px -6px 12px #ffffff' :
                    isMobile ? 
                      '8px 8px 16px #bebebe, -8px -8px 16px #ffffff' :
                      '12px 12px 24px #bebebe, -12px -12px 24px #ffffff'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Login to Get Started 
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-1" />
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
              className="w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 lg:px-12 lg:py-6 rounded-2xl sm:rounded-3xl font-semibold text-gray-700 flex items-center justify-center gap-3 transition-all duration-200 text-base sm:text-lg lg:text-xl"
              style={{
                background: buttonPressed['secondary'] ? 
                  'linear-gradient(145deg, #d5d5d5, #ebebeb)' : 
                  'linear-gradient(145deg, #ebebeb, #d5d5d5)',
                boxShadow: buttonPressed['secondary'] ?
                  'inset 6px 6px 12px #c4c4c4, inset -6px -6px 12px #ffffff' :
                  isMobile ? 
                    '6px 6px 12px #c4c4c4, -6px -6px 12px #ffffff' :
                    '10px 10px 20px #c4c4c4, -10px -10px 20px #ffffff'
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="w-5 h-5 sm:w-6 sm:h-6" />
              Watch Demo
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Benefits in neumorphic containers - Better responsive grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 text-sm sm:text-base text-gray-600 max-w-5xl mx-auto"
        >
          {benefits.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 + index * 0.1, duration: 0.6 }}
              className="flex items-center space-x-2 sm:space-x-3 px-4 py-2 sm:px-5 sm:py-3 lg:px-6 lg:py-4 rounded-xl sm:rounded-2xl"
              style={{
                background: 'linear-gradient(145deg, #ededed, #d7d7d7)',
                boxShadow: isMobile ? 
                  '4px 4px 8px #c8c8c8, -4px -4px 8px #ffffff' : 
                  '6px 6px 12px #c8c8c8, -6px -6px 12px #ffffff'
              }}
              whileHover={{ scale: 1.05 }}
            >
              <item.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-500 flex-shrink-0" />
              <span className="whitespace-nowrap font-medium">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Neumorphic Scroll Indicator - Enhanced positioning */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        onClick={() => scrollToSection('about')}
        className="absolute bottom-6 sm:bottom-8 lg:bottom-10 left-1/2 transform -translate-x-1/2 p-3 sm:p-4 lg:p-5 rounded-full"
        style={{
          background: 'linear-gradient(145deg, #f0f0f0, #d0d0d0)',
          boxShadow: isMobile ? 
            '6px 6px 12px #bebebe, -6px -6px 12px #ffffff' : 
            '10px 10px 20px #bebebe, -10px -10px 20px #ffffff'
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ 
          scale: 0.9,
          boxShadow: 'inset 6px 6px 12px #bebebe, inset -6px -6px 12px #ffffff'
        }}
      >
        <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-gray-600 animate-bounce" />
      </motion.button>
    </motion.section>
  );
}