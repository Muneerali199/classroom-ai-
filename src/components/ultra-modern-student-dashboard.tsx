'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getSupabase } from '@/lib/supabase';
import { useTranslations } from 'next-intl';
import { 
  Sparkles, TrendingUp, Calendar, BookOpen, Award, 
  Clock, Target, Zap, CheckCircle2, AlertCircle
} from 'lucide-react';
import { AuthService } from '@/lib/auth';
import type { Student } from '@/lib/types';

export default function UltraModernStudentDashboard() {
  const t = useTranslations('StudentDashboard');
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [attendanceStats, setAttendanceStats] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      if (user) {
        const supabase = getSupabase();
        const { data } = await supabase
          .from('students')
          .select('*')
          .eq('auth_user_id', user.id)
          .single();
        if (data) setStudentData(data as any);
      }
    } catch (error) {
      console.error('Error loading student data:', error);
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
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">
              Welcome back, {studentData?.full_name || 'Student'}!
            </h1>
            <p className="text-gray-400">Here's your academic overview</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { 
            icon: Target, 
            label: 'Attendance', 
            value: '92%', 
            change: '+5%',
            color: 'from-cyan-400 to-blue-500',
            bg: 'from-cyan-500/20 to-blue-500/20'
          },
          { 
            icon: Award, 
            label: 'Average Grade', 
            value: '85%', 
            change: '+3%',
            color: 'from-purple-400 to-pink-500',
            bg: 'from-purple-500/20 to-pink-500/20'
          },
          { 
            icon: BookOpen, 
            label: 'Assignments', 
            value: '12/15', 
            change: '3 pending',
            color: 'from-emerald-400 to-teal-500',
            bg: 'from-emerald-500/20 to-teal-500/20'
          },
          { 
            icon: TrendingUp, 
            label: 'Performance', 
            value: 'Excellent', 
            change: 'Top 10%',
            color: 'from-orange-400 to-red-500',
            bg: 'from-orange-500/20 to-red-500/20'
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
            <div className="relative bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-cyan-500/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Classes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Upcoming Classes</h2>
            </div>

            <div className="space-y-3">
              {[
                { subject: 'Mathematics', time: '9:00 AM - 10:00 AM', room: 'Room 101', status: 'Live' },
                { subject: 'Physics', time: '10:30 AM - 11:30 AM', room: 'Lab 2', status: 'Next' },
                { subject: 'Chemistry', time: '2:00 PM - 3:00 PM', room: 'Lab 1', status: 'Upcoming' }
              ].map((class_item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-cyan-500/50 transition-all group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{class_item.subject}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      {class_item.time}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      class_item.status === 'Live' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-cyan-500/20 text-cyan-400'
                    }`}>
                      {class_item.status}
                    </span>
                    <span className="text-xs text-gray-500">{class_item.room}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Assignments */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Assignments</h2>
            </div>

            <div className="space-y-3">
              {[
                { title: 'Math Homework', due: 'Tomorrow', status: 'pending' },
                { title: 'Physics Lab Report', due: '2 days', status: 'pending' },
                { title: 'Chemistry Quiz', due: 'Completed', status: 'completed' }
              ].map((assignment, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-purple-500/50 transition-all"
                >
                  <div className="flex items-start gap-3">
                    {assignment.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-white text-sm">{assignment.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">Due: {assignment.due}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6"
      >
        <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Performance Overview</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {['Mathematics', 'Physics', 'Chemistry'].map((subject, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white font-medium">{subject}</span>
                  <span className="text-cyan-400">{90 - i * 5}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${90 - i * 5}%` }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
