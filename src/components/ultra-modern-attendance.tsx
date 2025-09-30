'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Calendar, CheckCircle2, XCircle, Clock, Sparkles, QrCode } from 'lucide-react';
import { THEME_COLORS, THEME_STYLES } from '@/lib/theme-config';

export default function UltraModernAttendance() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`${THEME_STYLES.iconContainerLg} bg-gradient-to-br ${THEME_COLORS.primary}`}>
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                Attendance Tracking
              </h1>
              <p className="text-gray-400">Monitor and manage student attendance</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${THEME_STYLES.buttonPrimary} flex items-center gap-2`}
          >
            <QrCode className="w-5 h-5" />
            <span className="hidden sm:inline">Start Session</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {[
          { 
            icon: Users, 
            label: 'Total Students', 
            value: '156',
            change: 'All enrolled',
            color: THEME_COLORS.primary,
            bg: THEME_COLORS.primaryBg
          },
          { 
            icon: CheckCircle2, 
            label: 'Present Today', 
            value: '142',
            change: '91% attendance',
            color: THEME_COLORS.success,
            bg: THEME_COLORS.successBg
          },
          { 
            icon: XCircle, 
            label: 'Absent', 
            value: '14',
            change: '9% absent',
            color: THEME_COLORS.warning,
            bg: THEME_COLORS.warningBg
          },
          { 
            icon: Clock, 
            label: 'Avg Attendance', 
            value: '94%',
            change: 'This month',
            color: THEME_COLORS.secondary,
            bg: THEME_COLORS.secondaryBg
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="relative group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity`} />
            <div className={`relative ${THEME_STYLES.card} p-4 md:p-6`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`${THEME_STYLES.iconContainerLg} bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`${THEME_STYLES.badgeInfo}`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl md:text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xl w-fit">
          {['overview', 'sessions', 'reports'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? `bg-gradient-to-r ${THEME_COLORS.primary} text-white shadow-lg`
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content Area */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Sessions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className={`${THEME_STYLES.cardElevated}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`${THEME_STYLES.iconContainer} bg-gradient-to-br ${THEME_COLORS.primary}`}>
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Recent Sessions</h2>
            </div>

            <div className="space-y-3">
              {[
                { class: 'Mathematics 101', date: 'Today 9:00 AM', present: 32, total: 35, rate: 91 },
                { class: 'Physics Lab', date: 'Today 11:00 AM', present: 28, total: 30, rate: 93 },
                { class: 'Chemistry', date: 'Yesterday', present: 25, total: 28, rate: 89 }
              ].map((session, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-cyan-500/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white">{session.class}</h3>
                      <p className="text-sm text-gray-400">{session.date}</p>
                    </div>
                    <span className={`${THEME_STYLES.badgeSuccess}`}>
                      {session.rate}%
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-white">{session.present} Present</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400">{session.total} Total</span>
                    </div>
                  </div>
                  <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${session.rate}%` }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                      className={`h-full bg-gradient-to-r ${THEME_COLORS.success}`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className={`${THEME_STYLES.cardElevated}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`${THEME_STYLES.iconContainer} bg-gradient-to-br ${THEME_COLORS.secondary}`}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Quick Stats</h2>
            </div>

            <div className="space-y-4">
              {[
                { label: 'This Week', value: '92%', color: THEME_COLORS.success },
                { label: 'This Month', value: '94%', color: THEME_COLORS.primary },
                { label: 'Semester', value: '91%', color: THEME_COLORS.secondary }
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{stat.label}</span>
                    <span className="text-white font-semibold">{stat.value}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: stat.value }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                      className={`h-full bg-gradient-to-r ${stat.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
