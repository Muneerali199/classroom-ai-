'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getSupabase } from '@/lib/supabase';
import { useTranslations } from 'next-intl';
import { 
  Users, Calendar, ClipboardList, TrendingUp, Award,
  BookOpen, Clock, Target, Zap, CheckCircle2, Plus,
  BarChart3, Eye, Edit, Sparkles
} from 'lucide-react';
import { AuthService } from '@/lib/auth';

export default function UltraModernTeacherDashboard() {
  const t = useTranslations('TeacherDashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    attendanceRate: 0,
    pendingAssignments: 0,
    upcomingClasses: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      // Load teacher data here
      setStats({
        totalStudents: 156,
        attendanceRate: 94,
        pendingAssignments: 8,
        upcomingClasses: 4
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                Teacher Dashboard
              </h1>
              <p className="text-gray-400">Manage your classes and students</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl text-white font-medium flex items-center gap-2 shadow-lg hover:shadow-cyan-500/50 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Class</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {[
          { 
            icon: Users, 
            label: 'Total Students', 
            value: stats.totalStudents,
            change: '+12 this month',
            color: 'from-cyan-400 to-blue-500',
            bg: 'from-cyan-500/20 to-blue-500/20'
          },
          { 
            icon: Target, 
            label: 'Attendance Rate', 
            value: `${stats.attendanceRate}%`,
            change: '+2% from last week',
            color: 'from-emerald-400 to-teal-500',
            bg: 'from-emerald-500/20 to-teal-500/20'
          },
          { 
            icon: ClipboardList, 
            label: 'Pending Reviews', 
            value: stats.pendingAssignments,
            change: '2 due today',
            color: 'from-orange-400 to-red-500',
            bg: 'from-orange-500/20 to-red-500/20'
          },
          { 
            icon: Calendar, 
            label: 'Classes Today', 
            value: stats.upcomingClasses,
            change: 'Next at 10:00 AM',
            color: 'from-purple-400 to-pink-500',
            bg: 'from-purple-500/20 to-pink-500/20'
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
            <div className="relative bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-4 md:p-6 backdrop-blur-sm hover:border-cyan-500/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl md:text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Today's Schedule</h2>
              </div>
              <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium">
                View All
              </button>
            </div>

            <div className="space-y-3">
              {[
                { subject: 'Mathematics 101', time: '9:00 AM - 10:00 AM', room: 'Room 101', students: 32, status: 'In Progress' },
                { subject: 'Physics Advanced', time: '10:30 AM - 11:30 AM', room: 'Lab 2', students: 28, status: 'Next' },
                { subject: 'Chemistry Lab', time: '2:00 PM - 3:00 PM', room: 'Lab 1', students: 25, status: 'Upcoming' }
              ].map((class_item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-cyan-500/50 transition-all group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white">{class_item.subject}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                      <Clock className="w-4 h-4" />
                      {class_item.time}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm text-gray-400">{class_item.room}</div>
                      <div className="text-xs text-gray-500">{class_item.students} students</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      class_item.status === 'In Progress' 
                        ? 'bg-emerald-500/20 text-emerald-400 animate-pulse' 
                        : 'bg-cyan-500/20 text-cyan-400'
                    }`}>
                      {class_item.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Quick Actions</h2>
            </div>

            <div className="space-y-3">
              {[
                { icon: Plus, label: 'Mark Attendance', color: 'from-cyan-500 to-blue-600' },
                { icon: ClipboardList, label: 'Create Assignment', color: 'from-purple-500 to-pink-600' },
                { icon: Eye, label: 'View Analytics', color: 'from-emerald-500 to-teal-600' },
                { icon: Edit, label: 'Grade Papers', color: 'from-orange-500 to-red-600' }
              ].map((action, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="w-full flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-cyan-500/50 transition-all group"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-white">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Performance Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6"
      >
        <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Class Performance</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Average Grade', value: '85%', icon: Award },
              { label: 'Completion Rate', value: '92%', icon: CheckCircle2 },
              { label: 'Participation', value: '88%', icon: Users },
              { label: 'Growth', value: '+12%', icon: TrendingUp }
            ].map((metric, i) => (
              <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <metric.icon className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm text-gray-400">{metric.label}</span>
                </div>
                <div className="text-2xl font-black text-white">{metric.value}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
