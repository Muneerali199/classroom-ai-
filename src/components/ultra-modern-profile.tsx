'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Building2, Calendar, Edit2, Save, Sparkles } from 'lucide-react';
import { THEME_COLORS, THEME_STYLES } from '@/lib/theme-config';

export default function UltraModernProfile() {
  const [isEditing, setIsEditing] = useState(false);

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
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                Profile Settings
              </h1>
              <p className="text-gray-400">Manage your account information</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(!isEditing)}
            className={`${THEME_STYLES.buttonPrimary} flex items-center gap-2`}
          >
            {isEditing ? <Save className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
            <span className="hidden sm:inline">{isEditing ? 'Save' : 'Edit'}</span>
          </motion.button>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className={`${THEME_STYLES.cardElevated} text-center`}>
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-3xl font-black border-4 border-cyan-500/30">
                JD
              </div>
              <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br ${THEME_COLORS.success} flex items-center justify-center border-4 border-black`}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">John Doe</h2>
            <p className="text-cyan-400 mb-4">Teacher</p>
            <div className="flex gap-2 justify-center">
              <span className={`${THEME_STYLES.badgeSuccess}`}>Active</span>
              <span className={`${THEME_STYLES.badgeInfo}`}>Verified</span>
            </div>
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className={`${THEME_STYLES.cardElevated}`}>
            <h3 className="text-xl font-bold text-white mb-6">Personal Information</h3>
            <div className="space-y-4">
              {[
                { icon: User, label: 'Full Name', value: 'John Doe' },
                { icon: Mail, label: 'Email', value: 'john.doe@school.edu' },
                { icon: Phone, label: 'Phone', value: '+1 234 567 8900' },
                { icon: Building2, label: 'Department', value: 'Mathematics' },
                { icon: Calendar, label: 'Joined', value: 'January 2024' }
              ].map((field, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl"
                >
                  <div className={`${THEME_STYLES.iconContainer} bg-gradient-to-br ${THEME_COLORS.primary}`}>
                    <field.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-400">{field.label}</div>
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={field.value}
                        className={`${THEME_STYLES.input} mt-1 w-full`}
                      />
                    ) : (
                      <div className="text-white font-medium">{field.value}</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
