import React from 'react';
import { motion } from 'framer-motion';
import { Database, Code, Wind, Bot } from 'lucide-react';

export default function TechStackSection() {
  const technologies = [
    { name: 'React', icon: <Code className="w-10 h-10" /> },
    { name: 'TailwindCSS', icon: <Wind className="w-10 h-10" /> },
    { name: 'PostgreSQL', icon: <Database className="w-10 h-10" /> },
    { name: 'AI Integration', icon: <Bot className="w-10 h-10" /> },
  ];

  return (
    <motion.section
      id="tech-stack"
      className="py-24 px-4 sm:px-6 lg:px-8"
      style={{
        background: 'linear-gradient(135deg, #e8e8e8 0%, #dadada 100%)'
      }}
    >
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl font-bold mb-12 text-gray-700"
        >
          Built with Modern Technology
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              className="flex flex-col items-center justify-center p-6 rounded-3xl"
              style={{
                background: 'linear-gradient(145deg, #efefef, #d9d9d9)',
                boxShadow: '12px 12px 24px #c8c8c8, -12px -12px 24px #ffffff'
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.05,
                boxShadow: '16px 16px 32px #c0c0c0, -16px -16px 32px #ffffff'
              }}
            >
              <div 
                className="w-24 h-24 mb-4 rounded-full flex items-center justify-center text-gray-600"
                style={{
                  background: 'linear-gradient(145deg, #e0e0e0, #c8c8c8)',
                  boxShadow: 'inset 8px 8px 16px #bebebe, inset -8px -8px 16px #ffffff'
                }}
              >
                {tech.icon}
              </div>
              <p className="font-semibold text-lg text-gray-700">{tech.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}