'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import LoginForm from '@/app/login/login-form';
import { Logo } from '@/components/icons';
import { Shield, Users, BookOpen, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const getNeumorphicStyle = (pressed = false, inset = false, size = 'normal') => {
    const shadowSize = size === 'large' ? '16px' : size === 'small' ? '4px' : '8px';
    const shadowBlur = size === 'large' ? '32px' : size === 'small' ? '8px' : '16px';
    
    return {
      background: pressed || inset ? 
        'linear-gradient(145deg, #d0d0d0, #f0f0f0)' : 
        'linear-gradient(145deg, #f0f0f0, #d0d0d0)',
      boxShadow: pressed || inset ?
        `inset ${shadowSize} ${shadowSize} ${shadowBlur} #bebebe, inset -${shadowSize} -${shadowSize} ${shadowBlur} #ffffff` :
        `${shadowSize} ${shadowSize} ${shadowBlur} #bebebe, -${shadowSize} -${shadowSize} ${shadowBlur} #ffffff`
    };
  };

  return (
    <div 
      className="flex flex-col lg:flex-row min-h-screen relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #e3e3e3 0%, #f7f7f7 50%, #e8e8e8 100%)' }}
    >
      {/* Background Pattern Elements */}
      <div className="absolute inset-0 opacity-15 lg:opacity-20">
        <div className="absolute top-10 lg:top-20 left-10 lg:left-20 w-20 h-20 lg:w-32 lg:h-32 rounded-full" style={getNeumorphicStyle(false, true, 'small')}></div>
        <div className="absolute top-1/4 right-16 lg:right-32 w-16 h-16 lg:w-24 lg:h-24 rounded-full" style={getNeumorphicStyle(false, false, 'small')}></div>
        <div className="absolute bottom-20 lg:bottom-32 left-1/4 lg:left-1/3 w-24 h-24 lg:w-40 lg:h-40 rounded-full" style={getNeumorphicStyle(false, true, 'small')}></div>
        <div className="absolute bottom-1/4 right-10 lg:right-20 w-20 h-20 lg:w-28 lg:h-28 rounded-full" style={getNeumorphicStyle(false, false, 'small')}></div>
        <div className="absolute top-1/2 left-1/6 lg:left-1/4 w-12 h-12 lg:w-16 lg:h-16 rounded-full" style={getNeumorphicStyle(false, true, 'small')}></div>
        <div className="absolute top-2/3 right-1/4 lg:right-1/3 w-14 h-14 lg:w-20 lg:h-20 rounded-full" style={getNeumorphicStyle(false, false, 'small')}></div>
      </div>

      {/* Left side - Branding and Features */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-8 xl:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-xl"
        >
          {/* Logo Section */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.4, type: "spring", stiffness: 120 }}
            className="flex items-center gap-4 mb-8 lg:mb-12"
          >
            <div
              className="p-3 lg:p-4 rounded-2xl"
              style={getNeumorphicStyle()}
            >
              <motion.div
                className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center text-gray-600"
                style={getNeumorphicStyle(false, true)}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Logo className="w-6 h-6 lg:w-8 lg:h-8" />
              </motion.div>
            </div>
            <span 
              className="text-4xl lg:text-5xl xl:text-6xl font-bold"
              style={{
                background: 'linear-gradient(145deg, #666666, #888888)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              EduTrack
            </span>
          </motion.div>
          
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 lg:mb-8 leading-tight text-gray-700">
              Smart Attendance
              <span className="block mt-2" style={{
                background: 'linear-gradient(145deg, #555555, #777777)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Management
              </span>
            </h1>
          </motion.div>
          
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mb-8 lg:mb-12"
          >
            <div
              className="p-5 lg:p-6 rounded-2xl"
              style={getNeumorphicStyle(false, true)}
            >
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
                Revolutionize your educational institution with AI-powered attendance tracking, 
                real-time analytics, and seamless user management.
              </p>
            </div>
          </motion.div>
          
          {/* Features List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="space-y-5 lg:space-y-6"
          >
            {[
              {
                icon: Shield,
                title: "Secure & Reliable",
                description: "Enterprise-grade security for your data"
              },
              {
                icon: Users,
                title: "Multi-Role Support", 
                description: "Students, teachers, and administrators"
              },
              {
                icon: BookOpen,
                title: "Real-time Analytics",
                description: "Instant insights and comprehensive reports"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + index * 0.1, duration: 0.6 }}
                className="flex items-center gap-4"
              >
                <div
                  className="p-3 lg:p-4 rounded-xl"
                  style={getNeumorphicStyle()}
                >
                  <div
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center"
                    style={getNeumorphicStyle(false, true, 'small')}
                  >
                    <feature.icon className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base lg:text-lg font-bold text-gray-700 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Decorative Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mt-8 lg:mt-12 flex items-center gap-3"
          >
            <div
              className="p-3 rounded-xl"
              style={getNeumorphicStyle()}
            >
              <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">
              Trusted by 500+ educational institutions
            </p>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Right side - Login Form Area */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md lg:max-w-lg">
          {/* Mobile logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:hidden mb-6 sm:mb-8 flex justify-center"
          >
            <div className="flex items-center gap-3">
              <div
                className="p-3 rounded-xl"
                style={getNeumorphicStyle()}
              >
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-gray-600"
                  style={getNeumorphicStyle(false, true, 'small')}
                >
                  <Logo className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
              <span 
                className="text-2xl sm:text-3xl font-bold"
                style={{
                  background: 'linear-gradient(145deg, #666666, #888888)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                EduTrack
              </span>
            </div>
          </motion.div>
          
          {/* Login Form Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden"
            style={getNeumorphicStyle(false, false, 'large')}
          >
            {/* Inner glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl lg:rounded-3xl"></div>
            
            <div className="relative z-10">
              {/* Title Section - Only show on larger screens in right panel */}
              <div className="text-center mb-6 sm:mb-8">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-700 mb-3"
                  style={{
                    background: 'linear-gradient(145deg, #666666, #888888)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Welcome Back
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="inline-block px-4 py-2 rounded-xl"
                  style={getNeumorphicStyle(false, true, 'small')}
                >
                  <p className="text-gray-600 text-sm sm:text-base">
                    Sign in to access your personalized dashboard
                  </p>
                </motion.div>
              </div>
              
              {/* Login Form */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <LoginForm />
              </motion.div>
              
              {/* Footer Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="mt-6 sm:mt-8 space-y-4 sm:space-y-6"
              >
                {/* Contact Info */}
                <div
                  className="p-4 rounded-xl text-center"
                  style={getNeumorphicStyle(false, true, 'small')}
                >
                  <p className="text-sm text-gray-600">
                    Need an account? Contact your dean or teacher.
                  </p>
                </div>
                
                {/* Legal Links */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                  {[
                    { href: "/privacy-policy", text: "Privacy Policy" },
                    { href: "/terms-and-conditions", text: "Terms of Service" }
                  ].map((link, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full sm:w-auto"
                    >
                      <Link href={link.href}>
                        <div
                          className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs sm:text-sm text-gray-600 hover:text-gray-800 transition-colors font-medium text-center"
                          style={getNeumorphicStyle(false, false, 'small')}
                        >
                          {link.text}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Security Badge */}
                <div className="flex justify-center">
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl"
                    style={getNeumorphicStyle()}
                  >
                    <div
                      className="p-1.5 rounded-lg"
                      style={getNeumorphicStyle(false, true, 'small')}
                    >
                      <Shield className="w-3 h-3 text-gray-600" />
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600 font-medium">
                      256-bit SSL Encrypted
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Additional Features for Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="lg:hidden mt-6 sm:mt-8 space-y-3 sm:space-y-4"
          >
            {[
              { icon: Shield, text: "Secure & Reliable" },
              { icon: Users, text: "Multi-Role Support" },
              { icon: BookOpen, text: "Real-time Analytics" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3 + index * 0.1, duration: 0.6 }}
                className="flex items-center gap-3 p-4 rounded-xl"
                style={getNeumorphicStyle()}
              >
                <div
                  className="p-2 rounded-lg"
                  style={getNeumorphicStyle(false, true, 'small')}
                >
                  <feature.icon className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="lg:hidden mt-6 sm:mt-8 flex justify-center"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl"
              style={getNeumorphicStyle()}
            >
              <div
                className="p-1.5 rounded-lg"
                style={getNeumorphicStyle(false, true, 'small')}
              >
                <Sparkles className="w-3 h-3 text-gray-600" />
              </div>
              <span className="text-xs sm:text-sm text-gray-600 font-medium">
                Trusted by 500+ institutions
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}