'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Users, Brain, BarChart3, Globe, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  delay 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: delay * 0.1 }}
    whileHover={{ 
      y: -10,
      transition: { duration: 0.3 }
    }}
    className="group relative bg-white dark:bg-gray-900/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-200 dark:border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-400/10"
  >
    {/* Gradient overlay on hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    
    <div className="relative z-10">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-8 h-8 text-white" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-500 dark:group-hover:text-blue-300 transition-colors duration-300">
        {title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
        {description}
      </p>
      
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: delay * 0.1 + 0.3 }}
        className="mt-6 flex items-center text-blue-500 dark:text-blue-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        Learn more
        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
      </motion.div>
    </div>
  </motion.div>
);

export default function FeaturesSection() {
  const t = useTranslations('Landing.features');

  const features = [
    {
      icon: Users,
      title: t('smartAttendance.title'),
      description: t('smartAttendance.description')
    },
    {
      icon: Brain,
      title: t('gradingAssistant.title'),
      description: t('gradingAssistant.description')
    },
    {
      icon: BarChart3,
      title: t('analytics.title'),
      description: t('analytics.description')
    },
    {
      icon: Globe,
      title: t('multilingual.title'),
      description: t('multilingual.description')
    }
  ];

  return (
    <section className="relative py-24 bg-gray-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-100/20 dark:via-gray-900/20 to-transparent" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/10 dark:bg-blue-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
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
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            {t('subtitle')}
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index}
            />
          ))}
        </div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-600/10 dark:to-purple-600/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-gray-200 dark:border-white/10"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Why Choose ClassroomAI?
              </h3>
              
              <div className="space-y-4">
                {[
                  'AI-powered automation saves 10+ hours per week',
                  'Support for 30+ languages including Indian languages',
                  '99.9% uptime with enterprise-grade security',
                  'Seamless integration with existing systems'
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1 }}
                className="mt-8"
              >
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg group"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </motion.div>
            </div>
            
            <div className="relative">
              {/* Demo visualization */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="bg-white/80 dark:bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 dark:border-white/10"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">ClassroomAI Dashboard</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">Students Present</span>
                    <span className="text-green-400 font-semibold">28/30</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: '93%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, delay: 1 }}
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">Assignments Graded</span>
                    <span className="text-blue-400 font-semibold">45/50</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: '90%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, delay: 1.5 }}
                      className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
