import React from 'react';
import { Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { stats } from '@/components/landing/data';

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
      className="py-24 px-4 sm:px-6 lg:px-8"
      style={{
        background: 'linear-gradient(135deg, #e8e8e8 0%, #dadada 100%)'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-700">
            About Our Platform
          </h2>
          <div
            className="max-w-3xl mx-auto p-6 rounded-3xl"
            style={{
              background: 'linear-gradient(145deg, #efefef, #d9d9d9)',
              boxShadow: 'inset 6px 6px 12px #c8c8c8, inset -6px -6px 12px #ffffff'
            }}
          >
            <p className="text-xl text-gray-600 leading-relaxed">
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
              className="p-8 rounded-3xl"
              style={{
                background: 'linear-gradient(145deg, #efefef, #d9d9d9)',
                boxShadow: '12px 12px 24px #c8c8c8, -12px -12px 24px #ffffff'
              }}
            >
              <h3 className="text-2xl font-bold text-gray-700 mb-4">
                Our Mission
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
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
                  className="p-6 rounded-2xl transition-all duration-300"
                  style={{
                    background: 'linear-gradient(145deg, #ededed, #d7d7d7)',
                    boxShadow: '8px 8px 16px #c8c8c8, -8px -8px 16px #ffffff'
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '12px 12px 24px #c0c0c0, -12px -12px 24px #ffffff'
                  }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                    style={{
                      background: 'linear-gradient(145deg, #e0e0e0, #c8c8c8)',
                      boxShadow: '4px 4px 8px #b8b8b8, -4px -4px 8px #f8f8f8'
                    }}
                  >
                    <benefit.icon className="w-6 h-6 text-gray-600" />
                  </motion.div>
                  <h4 className="text-lg font-semibold mb-2 text-gray-700">{benefit.title}</h4>
                  <p className="text-gray-600">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-3xl"
                style={{
                  background: 'linear-gradient(145deg, #f0f0f0, #d0d0d0)',
                  boxShadow: '8px 8px 16px #bebebe, -8px -8px 16px #ffffff'
                }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-bold text-gray-700 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
