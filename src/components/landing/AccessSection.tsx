'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, UserCog, University } from 'lucide-react';

export default function AccessSection() {
  const accessPoints = [
    {
      icon: <University className="w-8 h-8 text-gray-600" />,
      title: 'Institution Controlled',
      description: 'Your institution manages all platform access, ensuring a secure, private environment.',
    },
    {
      icon: <UserCog className="w-8 h-8 text-gray-600" />,
      title: 'Dean Supervised',
      description: 'Deans oversee user creation and role assignments, maintaining strict oversight.',
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-gray-600" />,
      title: 'Role-Based Permissions',
      description: 'Users only see what they need, from student profiles to administrative dashboards.',
    },
  ];

  return (
    <motion.section
      id="access"
      className="py-24 px-4 sm:px-6 lg:px-8"
      style={{
        background: 'linear-gradient(135deg, #e0e0e0 0%, #d3d3d3 100%)'
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
            Secure & Controlled Access
          </h2>
          <div 
            className="max-w-3xl mx-auto p-6 rounded-3xl"
            style={{
              background: 'linear-gradient(145deg, #efefef, #d9d9d9)',
              boxShadow: 'inset 6px 6px 12px #c8c8c8, inset -6px -6px 12px #ffffff'
            }}
          >
            <p className="text-xl text-gray-600 leading-relaxed">
              Our platform is built on a foundation of security, giving educational institutions complete control over their data and user access.
            </p>
          </div>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {accessPoints.map((point, index) => (
            <motion.div
              key={index}
              className="p-8 rounded-3xl text-center"
              style={{
                background: 'linear-gradient(145deg, #efefef, #d9d9d9)',
                boxShadow: '12px 12px 24px #c8c8c8, -12px -12px 24px #ffffff'
              }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.02,
                boxShadow: '16px 16px 32px #c0c0c0, -16px -16px 32px #ffffff'
              }}
            >
              <div 
                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(145deg, #e8e8e8, #d2d2d2)',
                  boxShadow: '8px 8px 16px #c0c0c0, -8px -8px 16px #ffffff'
                }}
              >
                {point.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">{point.title}</h3>
              <p className="text-gray-600">{point.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}