
import React from 'react';
import { motion } from 'framer-motion';
import { features } from '@/components/landing/data';

export default function FeaturesSection() {
  return (
    <motion.section
      id="features"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-24 px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <motion.h2
          className="text-4xl sm:text-5xl font-bold mb-6 text-gray-700"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Powerful Features
        </motion.h2>
        <motion.div
          className="max-w-3xl mx-auto p-6 rounded-3xl"
          style={{
            background: 'linear-gradient(145deg, #efefef, #d9d9d9)',
            boxShadow: 'inset 6px 6px 12px #c8c8c8, inset -6px -6px 12px #ffffff'
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <p className="text-xl text-gray-600">
            Comprehensive tools designed to streamline educational
            management and enhance learning outcomes.
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="group p-8 rounded-3xl transition-all duration-300"
            style={{
              background: 'linear-gradient(145deg, #efefef, #d9d9d9)',
              boxShadow: '12px 12px 24px #c8c8c8, -12px -12px 24px #ffffff'
            }}
            whileHover={{
              scale: 1.02,
              boxShadow: '16px 16px 32px #c0c0c0, -16px -16px 32px #ffffff'
            }}
            whileTap={{ 
              scale: 0.98,
              boxShadow: 'inset 8px 8px 16px #c8c8c8, inset -8px -8px 16px #ffffff'
            }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-gray-600"
              style={{
                background: 'linear-gradient(145deg, #e8e8e8, #d2d2d2)',
                boxShadow: '8px 8px 16px #c0c0c0, -8px -8px 16px #ffffff'
              }}
              whileHover={{ 
                scale: 1.1,
                boxShadow: 'inset 6px 6px 12px #c0c0c0, inset -6px -6px 12px #ffffff'
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {feature.icon}
            </motion.div>
            <motion.h3
              className="text-xl font-bold text-gray-700 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {feature.title}
            </motion.h3>
            <motion.p
              className="text-gray-600 leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              {feature.description}
            </motion.p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
