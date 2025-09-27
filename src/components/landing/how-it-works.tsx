'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Settings, Zap, BarChart3, ArrowRight, CheckCircle } from 'lucide-react';

const StepCard = ({ 
  step, 
  icon: Icon, 
  title, 
  description, 
  delay 
}: { 
  step: number;
  icon: React.ElementType; 
  title: string; 
  description: string; 
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="relative group"
  >
    {/* Connection Line */}
    {step < 3 && (
      <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform translate-x-1/2 z-0">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: delay + 0.5 }}
          className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 origin-left"
        />
      </div>
    )}
    
    <div className="relative z-10 text-center">
      {/* Step Number */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
        className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-300"
      >
        {step}
      </motion.div>
      
      {/* Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay + 0.3 }}
        className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white dark:bg-white/5 backdrop-blur-lg border border-gray-200 dark:border-white/10 flex items-center justify-center group-hover:bg-gray-50 dark:group-hover:bg-white/10 group-hover:border-blue-500/30 transition-all duration-300"
      >
        <Icon className="w-10 h-10 text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-300" />
      </motion.div>
      
      {/* Content */}
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay + 0.4 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-300"
      >
        {title}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay + 0.5 }}
        className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-sm mx-auto group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300"
      >
        {description}
      </motion.p>
    </div>
  </motion.div>
);

export default function HowItWorksSection() {
  const t = useTranslations('Landing.howItWorks');

  const steps = [
    {
      icon: Settings,
      title: t('step1.title'),
      description: t('step1.description')
    },
    {
      icon: Zap,
      title: t('step2.title'),
      description: t('step2.description')
    },
    {
      icon: BarChart3,
      title: t('step3.title'),
      description: t('step3.description')
    }
  ];

  return (
    <section className="relative py-24 bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)`
        }} />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6"
          >
            {t('title')}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            {t('subtitle')}
          </motion.p>
        </motion.div>

        {/* Steps */}
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-8 mb-20">
          {steps.map((step, index) => (
            <StepCard
              key={index}
              step={index + 1}
              icon={step.icon}
              title={step.title}
              description={step.description}
              delay={index * 0.2}
            />
          ))}
        </div>

        {/* Demo Preview */}
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div
            className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-600/10 dark:to-purple-600/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-gray-200 dark:border-white/10"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  See It In Action
                </h3>
                <div className="space-y-4 mb-8">
                  {[
                    'Setup completed in under 5 minutes',
                    'Instant AI-powered attendance tracking',
                    'Real-time performance analytics',
                    'Seamless integration with existing systems'
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </motion.div>
                  ))}
                </div>
                
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 group transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-blue-500/25"
                >
                  Watch Demo Video
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
              </div>
              
              <div className="relative">
                {/* Mock Dashboard */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="bg-white/80 dark:bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 dark:border-white/10 relative overflow-hidden"
                >
                  {/* Browser Chrome */}
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <div className="ml-4 text-gray-500 dark:text-gray-400 text-sm">classroom-ai.com/dashboard</div>
                  </div>
                  
                  {/* Dashboard Content */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-gray-900 dark:text-white font-semibold">Today's Overview</div>
                      <div className="text-green-400 text-sm">Live</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-500/20 rounded-lg p-3">
                        <div className="text-blue-600 dark:text-blue-300 text-sm">Present</div>
                        <div className="text-gray-900 dark:text-white text-2xl font-bold">28/30</div>
                      </div>
                      <div className="bg-purple-500/20 rounded-lg p-3">
                        <div className="text-purple-600 dark:text-purple-300 text-sm">Graded</div>
                        <div className="text-gray-900 dark:text-white text-2xl font-bold">45</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">AI Processing</span>
                        <span className="text-blue-400">92%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: '92%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 2, delay: 1.5 }}
                          className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating notification */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 2 }}
                    className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow-lg"
                  >
                    New insights ready!
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
