'use client';

import React from 'react';
import { Cloud, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { techStack, architectureHighlights } from '@/lib/landing-data';

export default function TechStackSection() {
  return (
    <section
      id="tech-stack"
      className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-block p-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full mb-6"
          >
            <div className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <span className="text-white font-semibold text-sm tracking-wide">TECHNOLOGY STACK</span>
            </div>
          </motion.div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8">
            <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-slate-100 dark:via-blue-100 dark:to-slate-100 bg-clip-text text-transparent">
              Our Tech Stack
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Built with cutting-edge technologies for maximum performance,
            scalability, and developer experience. Every tool chosen for its reliability and innovation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6 mb-20"
        >
          {techStack.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
              <div className="relative p-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300/50 dark:hover:border-blue-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 group-hover:bg-white dark:group-hover:bg-slate-800">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="w-16 h-16 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all duration-300 overflow-hidden p-2 ring-1 ring-slate-100 dark:ring-slate-700"
                >
                  <div className="w-full h-full flex items-center justify-center">
                    {/* ensure images scale and keep aspect ratio */}
                    {React.isValidElement(tech.icon)
                      ? React.cloneElement(tech.icon as React.ReactElement, { className: 'w-full h-full object-contain' })
                      : tech.icon}
                  </div>
                </motion.div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2 text-center group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {tech.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center font-medium">
                  {tech.category}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl" />
          <div className="relative p-8 md:p-12 rounded-3xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-2xl">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent"
            >
              Architecture Highlights
            </motion.h3>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8 md:gap-12"
            >
              {architectureHighlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 1.2 + index * 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className="group text-center p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-700 dark:to-slate-600 border border-slate-200/50 dark:border-slate-600/50 hover:border-blue-300/50 dark:hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg"
                >
                  <motion.div
                    whileHover={{
                      scale: 1.1,
                      rotate: 10,
                      transition: { type: "spring", stiffness: 400 }
                    }}
                    className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-all duration-300"
                  >
                    <highlight.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {highlight.title}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {highlight.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
