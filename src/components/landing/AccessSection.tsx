'use client';

import React from 'react';
import { Shield, Users, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AccessSection() {
  const roles = [
    {
      icon: Shield,
      title: '🎓 Dean',
      description: 'Full system administration',
      responsibilities: [
        'Create teacher accounts',
        'Create student accounts',
        'Manage system settings',
        'Full access control',
      ],
      color: 'from-blue-500 to-purple-600',
    },
    {
      icon: Users,
      title: '👨‍🏫 Teacher',
      description: 'Class management & student creation',
      responsibilities: [
        'Create student accounts',
        'Manage attendance sessions',
        'Track class progress',
        'Generate reports',
      ],
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: BookOpen,
      title: '👨‍🎓 Student',
      description: 'Attendance tracking & progress',
      responsibilities: [
        'Join attendance sessions',
        'View attendance history',
        'Update profile information',
        'Access learning materials',
      ],
      color: 'from-orange-500 to-red-600',
    },
  ];

  return (
    <section id="access" className="py-20 sm:py-32 relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Secure, Institution-Managed Access
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
            No public signups. Complete institutional control over user access and data security.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {roles.map((role, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`w-16 h-16 bg-gradient-to-r ${role.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
              >
                <role.icon className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{role.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{role.description}</p>
              <ul className="text-sm text-left space-y-1">
                {role.responsibilities.map((responsibility, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 + idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-2"
                  >
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">{responsibility}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg shadow-lg">
            <Shield className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            <p className="text-yellow-800 dark:text-yellow-200 font-medium">
              No public registration • Dean-controlled access • Institutional data privacy
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
