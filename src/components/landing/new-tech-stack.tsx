'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code, Sparkles } from 'lucide-react';

const technologies = [
  { name: 'Next.js', category: 'Framework', color: 'from-gray-400 to-gray-600' },
  { name: 'React', category: 'Library', color: 'from-cyan-400 to-blue-500' },
  { name: 'TypeScript', category: 'Language', color: 'from-blue-400 to-blue-600' },
  { name: 'Tailwind CSS', category: 'Styling', color: 'from-cyan-300 to-cyan-500' },
  { name: 'Framer Motion', category: 'Animation', color: 'from-purple-400 to-pink-500' },
  { name: 'Three.js', category: '3D Graphics', color: 'from-emerald-400 to-teal-500' },
  { name: 'Supabase', category: 'Backend', color: 'from-green-400 to-emerald-600' },
  { name: 'PostgreSQL', category: 'Database', color: 'from-blue-500 to-indigo-600' },
  { name: 'next-intl', category: 'i18n', color: 'from-orange-400 to-red-500' },
  { name: 'Chart.js', category: 'Visualization', color: 'from-pink-400 to-rose-500' },
  { name: 'Radix UI', category: 'Components', color: 'from-violet-400 to-purple-600' },
  { name: 'Zod', category: 'Validation', color: 'from-indigo-400 to-blue-500' }
];

export default function NewTechStack() {
  return (
    <section id="tech" className="relative py-20 md:py-32 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3rem_3rem] md:bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-full mb-4 md:mb-6"
          >
            <Code className="w-3 h-3 md:w-4 md:h-4 text-cyan-400" />
            <span className="text-xs md:text-sm text-cyan-400 font-medium">Tech Stack</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6">
            Built with the
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              latest technologies
            </span>
          </h2>
          <p className="text-base md:text-xl text-gray-400 max-w-3xl mx-auto px-4">
            Powered by modern, battle-tested tools for maximum performance and reliability
          </p>
        </motion.div>

        {/* Tech Grid - Mobile Optimized */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 lg:gap-6 mb-12 md:mb-20">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative"
            >
              <div className="relative bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 hover:border-cyan-500/50 transition-all hover:shadow-2xl hover:shadow-cyan-500/20 backdrop-blur-sm">
                {/* Glow Effect on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-10 rounded-xl md:rounded-2xl transition-opacity`} />
                
                <div className="relative z-10 text-center">
                  <div className={`w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 rounded-lg md:rounded-xl bg-gradient-to-br ${tech.color} flex items-center justify-center`}>
                    <Code className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <h3 className="text-xs md:text-sm font-bold text-white mb-1">{tech.name}</h3>
                  <p className="text-[10px] md:text-xs text-gray-400">{tech.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Why This Stack */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-10 backdrop-blur-sm">
            <div className="flex items-start gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 md:mb-3">
                  Why this stack?
                </h3>
                <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                  We've carefully selected each technology to ensure the best developer experience, 
                  optimal performance, and seamless scalability. Our stack enables us to ship features 
                  faster while maintaining enterprise-grade quality.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
              {[
                { title: 'Lightning Fast', desc: 'Optimized for performance' },
                { title: 'Type Safe', desc: 'Catch errors before they happen' },
                { title: 'Scalable', desc: 'Grows with your needs' },
                { title: 'Developer Friendly', desc: 'Best-in-class DX' }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-white/5 border border-white/10 rounded-xl"
                >
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-sm md:text-base font-semibold text-white mb-0.5 md:mb-1">{benefit.title}</h4>
                    <p className="text-xs md:text-sm text-gray-400">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
