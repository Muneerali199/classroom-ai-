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
      color: 'from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Attendance marked in seconds with real-time synchronization.',
      color: 'from-green-500/5 to-emerald-500/5 dark:from-green-500/10 dark:to-emerald-500/10',
    },
  ];

  return (
    <section
      id="about"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-white/30 dark:bg-black/20 backdrop-blur-sm transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              About Our Platform
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Secure, institution-controlled educational management with dean-supervised
            access, ensuring data privacy and role-based permissions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Our Mission
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                We're building secure educational technology by providing institutions
                with controlled access management, dean-supervised user creation, and
                role-based permissions ensuring complete data privacy and institutional
                oversight of attendance and student management systems.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
                  viewport={{ once: true }}
                  className={`p-6 rounded-2xl bg-gradient-to-br ${benefit.color} border border-gray-300/20 dark:border-white/10 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4"
                  >
                    <benefit.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">{benefit.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
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
            <div className="relative z-10 p-8 rounded-3xl bg-gradient-to-br from-gray-900/5 to-gray-900/10 dark:from-white/10 dark:to-white/5 backdrop-blur-sm border border-gray-300/30 dark:border-white/20 transition-all duration-300">
              <div className="space-y-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      {stat.label}
                    </span>
                    <span className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
              className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 dark:from-blue-500/30 dark:to-purple-500/30 rounded-full blur-2xl transition-all duration-300"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
