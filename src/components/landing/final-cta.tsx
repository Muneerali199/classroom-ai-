'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { HulyButton } from '@/components/ui/huly-button';
import { ArrowRight, Calendar, Shield, Users, Zap } from 'lucide-react';

export default function FinalCTASection() {
  const t = useTranslations('Landing.finalCta');

  return (
    <section id="contact" className="relative py-24 overflow-hidden bg-black transition-colors duration-300">
      {/* Clean background */}
      <div className="absolute inset-0 bg-black" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Ready to transform your classroom?
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
            >
              Join thousands of educators who trust ClassroomAI to streamline their teaching workflow and improve student outcomes.
            </motion.p>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12"
          >
            {[
              { icon: Users, label: '10K+ Teachers', value: 'Active Users' },
              { icon: Shield, label: '99.9% Uptime', value: 'Reliability' },
              { icon: Zap, label: '5 Minutes', value: 'Quick Setup' },
              { icon: Calendar, label: '30+ Languages', value: 'Global Support' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="text-white font-semibold text-lg">{item.label}</div>
                <div className="text-gray-400 text-sm">{item.value}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <HulyButton 
              variant="primary"
              size="large" 
              className="text-lg px-10 py-6 group"
            >
              {t('ctaPrimary')}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </HulyButton>
            
            <HulyButton 
              variant="secondary"
              size="large" 
              className="text-lg px-10 py-6 group"
            >
              <Calendar className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              {t('ctaSecondary')}
            </HulyButton>
          </motion.div>

          {/* No Credit Card Required */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-gray-400 text-sm"
          >
            {t('noCredit')}
          </motion.p>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16 pt-12 border-t border-white/10"
          >
            <div className="text-gray-400 text-sm mb-6">Trusted by educators worldwide</div>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
              {/* Mock University Logos */}
              {[
                'MIT', 'Stanford', 'Harvard', 'Oxford', 'IIT Delhi', 'NUS'
              ].map((university, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  className="text-gray-400 font-semibold text-lg hover:text-cyan-400 transition-colors duration-300"
                >
                  {university}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}
