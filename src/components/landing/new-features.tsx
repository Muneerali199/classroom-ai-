'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Brain, BarChart3, Globe, Zap, Shield, 
  CheckCircle2, Sparkles, ArrowRight, Clock, Calendar 
} from 'lucide-react';
import { useTranslations } from 'next-intl';

const features = [
  {
    icon: Users,
    title: 'Smart Attendance',
    description: 'AI-powered attendance tracking with PIN codes, QR scanning, and real-time sync across devices.',
    color: 'from-cyan-400 to-blue-500',
    benefits: ['5-second check-in', 'Auto-sync', '99.9% accuracy', 'Mobile-ready'],
    demo: 'attendance'
  },
  {
    icon: Brain,
    title: 'AI Grading',
    description: 'Intelligent assignment grading with instant feedback, plagiarism detection, and personalized insights.',
    color: 'from-purple-400 to-pink-500',
    benefits: ['10x faster', 'Instant feedback', 'Smart scoring', 'Bias-free'],
    demo: 'grading'
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Powerful insights into student performance, attendance patterns, and learning outcomes.',
    color: 'from-emerald-400 to-teal-500',
    benefits: ['Real-time data', 'Predictive AI', 'Custom reports', 'Visual charts'],
    demo: 'analytics'
  },
  {
    icon: Globe,
    title: 'Multilingual',
    description: 'Support for 30+ languages including all major Indian languages with instant translation.',
    color: 'from-orange-400 to-red-500',
    benefits: ['30+ languages', 'Auto-translate', 'RTL support', 'Regional formats'],
    demo: 'multilingual'
  }
];

export default function NewFeatures() {
  const [activeFeature, setActiveFeature] = useState(0);
  const t = useTranslations('Landing.features');

  return (
    <section id="features" className="relative py-32 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(6,182,212,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(168,85,247,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium">Powerful Features</span>
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            Everything you need.
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Nothing you don't.
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Built for modern educators. Powered by AI. Loved by students.
          </p>
        </motion.div>

        {/* Interactive Feature Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {/* Feature Tabs */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setActiveFeature(index)}
                className={`group relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                  activeFeature === index
                    ? 'bg-gradient-to-br from-white/10 to-white/5 border-cyan-500/50 shadow-2xl shadow-cyan-500/20'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 transition-transform ${
                    activeFeature === index ? 'scale-110' : 'group-hover:scale-105'
                  }`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                      {feature.title}
                      {activeFeature === index && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 rounded-full bg-cyan-400"
                        />
                      )}
                    </h3>
                    <p className="text-gray-400 mb-4">{feature.description}</p>

                    <div className="grid grid-cols-2 gap-2">
                      {feature.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-gray-300">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <ArrowRight className={`w-5 h-5 text-gray-400 transition-all ${
                    activeFeature === index ? 'text-cyan-400 translate-x-1' : 'group-hover:translate-x-1'
                  }`} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Feature Demo */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="sticky top-32"
              >
                <div className="relative bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${features[activeFeature].color} opacity-10`} />

                  {/* Demo Content */}
                  <div className="relative z-10">
                    {activeFeature === 0 && <AttendanceDemo />}
                    {activeFeature === 1 && <GradingDemo />}
                    {activeFeature === 2 && <AnalyticsDemo />}
                    {activeFeature === 3 && <MultilingualDemo />}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {[
            { icon: Zap, title: '10x Faster', desc: 'Save 10+ hours per week on administrative tasks' },
            { icon: Shield, title: '100% Secure', desc: 'Enterprise-grade security with SOC 2 compliance' },
            { icon: Clock, title: '24/7 Support', desc: 'Round-the-clock assistance whenever you need it' }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl text-center backdrop-blur-sm"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
              <p className="text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Demo Components
function AttendanceDemo() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-white">Live Attendance</h4>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400">Active Session</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-3xl font-bold text-white mb-1">28/30</div>
          <div className="text-sm text-gray-400">Present</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-3xl font-bold text-white mb-1">5s</div>
          <div className="text-sm text-gray-400">Avg Time</div>
        </div>
      </div>

      {['John Smith', 'Sarah Johnson', 'Mike Davis'].map((name, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.2 }}
          className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold">
            {name[0]}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-white">{name}</div>
            <div className="text-xs text-gray-400">Checked in • 2m ago</div>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </motion.div>
      ))}
    </div>
  );
}

function GradingDemo() {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-white mb-4">AI Grading Results</h4>
      
      {[
        { name: 'Essay Assignment', score: 95, time: '2.3s' },
        { name: 'Math Problem Set', score: 88, time: '1.8s' },
        { name: 'Code Review', score: 92, time: '3.1s' }
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.2 }}
          className="p-4 bg-white/5 border border-white/10 rounded-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-medium">{item.name}</span>
            <span className="text-xs text-gray-400">Graded in {item.time}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.score}%` }}
                transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                className="h-full bg-gradient-to-r from-purple-400 to-pink-500"
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              {item.score}%
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function AnalyticsDemo() {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-white mb-4">Performance Overview</h4>
      
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Avg Score', value: '92%', color: 'emerald' },
          { label: 'Attendance', value: '95%', color: 'cyan' },
          { label: 'Growth', value: '+12%', color: 'purple' }
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <div className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</div>
            <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {['Mathematics', 'Science', 'English'].map((subject, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white">{subject}</span>
              <span className="text-gray-400">{90 - i * 5}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${90 - i * 5}%` }}
                transition={{ duration: 1, delay: i * 0.2 }}
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MultilingualDemo() {
  const languages = ['English', 'हिन्दी', 'বাংলা', '中文'];
  
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-white mb-4">Language Support</h4>
      
      <div className="grid grid-cols-2 gap-3 mb-6">
        {languages.map((lang, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="p-4 bg-white/5 border border-white/10 rounded-xl text-center cursor-pointer hover:border-cyan-500/50 transition-all"
          >
            <div className="text-xl font-bold text-white mb-1">{lang}</div>
            <div className="text-xs text-gray-400">Native Support</div>
          </motion.div>
        ))}
      </div>

      <div className="p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-5 h-5 text-orange-400" />
          <span className="text-white font-medium">30+ Languages</span>
        </div>
        <p className="text-sm text-gray-400">
          Full interface translation with cultural adaptations and RTL support
        </p>
      </div>
    </div>
  );
}
