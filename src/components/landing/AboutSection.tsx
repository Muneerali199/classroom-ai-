'use client';

import React from 'react';
import { Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { stats } from '@/lib/landing-data';

export default function AboutSection() {
  const benefits = [
    {
      icon: Users,
      title: 'For Everyone',
      description: 'Students, teachers, and deans all benefit from our intuitive platform.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Attendance marked in seconds with real-time synchronization.',
    },
  ];

  return (
    <section
      id="about"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-black"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
            About Our Platform
          </h2>
          <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-black border border-white/10 shadow-lg">
            <p className="text-xl text-gray-400 leading-relaxed">
              Secure, institution-controlled educational management with dean-supervised
              access, ensuring data privacy and role-based permissions.
            </p>
          </div>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <motion.div 
              className="p-8 rounded-2xl bg-black border border-white/10 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                Our Mission
              </h3>
              <p className="text-lg text-gray-400 leading-relaxed">
                We&apos;re building secure educational technology by providing institutions
                with controlled access management, dean-supervised user creation, and
                role-based permissions ensuring complete data privacy and institutional
                oversight of attendance and student management systems.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-2xl transition-all duration-300 bg-black border border-white/10 shadow-sm hover:shadow-lg hover:shadow-cyan-500/20 hover:border-cyan-500/50"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md"
                  >
                    <benefit.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <h4 className="font-bold text-white mb-2">{benefit.title}</h4>
                  <p className="text-sm text-gray-400">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="p-8 rounded-2xl bg-black border border-white/10 shadow-lg">
              <div className="space-y-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <span className="font-medium text-white">
                      {stat.label}
                    </span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      {stat.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}