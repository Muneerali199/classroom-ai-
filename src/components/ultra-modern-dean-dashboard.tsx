'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getSupabase } from '@/lib/supabase';
import { useTranslations } from 'next-intl';
import { 
  Users, GraduationCap, Building2, TrendingUp, Award,
  UserCheck, FileText, DollarSign, Target, Sparkles,
  BarChart3, PieChart, Activity, AlertCircle
} from 'lucide-react';
import { AuthService } from '@/lib/auth';

export default function UltraModernDeanDashboard() {
  const t = useTranslations('DeanDashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalFaculty: 0,
    totalStudents: 0,
    departments: 0,
    avgAttendance: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      // Load dean data here
      setStats({
        totalFaculty: 45,
        totalStudents: 1250,
        departments: 8,
        avgAttendance: 93
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
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white">
              Dean Dashboard
            </h1>
            <p className="text-gray-400">Institution overview and analytics</p>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {[
          { 
            icon: GraduationCap, 
            label: 'Total Students', 
            value: stats.totalStudents,
            change: '+85 this semester',
            color: 'from-cyan-400 to-blue-500',
            bg: 'from-cyan-500/20 to-blue-500/20'
          },
          { 
            icon: Users, 
            label: 'Faculty Members', 
            value: stats.totalFaculty,
            change: '+3 new hires',
            color: 'from-purple-400 to-pink-500',
            bg: 'from-purple-500/20 to-pink-500/20'
          },
          { 
            icon: Building2, 
            label: 'Departments', 
            value: stats.departments,
            change: 'All active',
            color: 'from-emerald-400 to-teal-500',
            bg: 'from-emerald-500/20 to-teal-500/20'
          },
          { 
            icon: Target, 
            label: 'Avg Attendance', 
            value: `${stats.avgAttendance}%`,
            change: '+2% this month',
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

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Department Performance */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Department Performance</h2>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Computer Science', students: 320, attendance: 95, performance: 88, faculty: 12 },
                { name: 'Mathematics', students: 280, attendance: 93, performance: 85, faculty: 10 },
                { name: 'Physics', students: 250, attendance: 91, performance: 87, faculty: 9 },
                { name: 'Chemistry', students: 220, attendance: 92, performance: 86, faculty: 8 }
              ].map((dept, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-cyan-500/50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-white">{dept.name}</h3>
                    <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full">
                      {dept.faculty} Faculty
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <div className="text-gray-400 text-xs mb-1">Students</div>
                      <div className="text-white font-semibold">{dept.students}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs mb-1">Attendance</div>
                      <div className="text-emerald-400 font-semibold">{dept.attendance}%</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs mb-1">Performance</div>
                      <div className="text-cyan-400 font-semibold">{dept.performance}%</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Alerts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Alerts</h2>
            </div>

            <div className="space-y-3">
              {[
                { type: 'warning', title: 'Low Attendance', desc: 'Physics Lab - 75%', time: '2h ago' },
                { type: 'info', title: 'New Enrollment', desc: '15 students pending', time: '5h ago' },
                { type: 'success', title: 'Budget Approved', desc: 'CS Department', time: '1d ago' }
              ].map((alert, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-4 bg-white/5 border rounded-xl ${
                    alert.type === 'warning' ? 'border-orange-500/30' : 
                    alert.type === 'success' ? 'border-emerald-500/30' : 
                    'border-cyan-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      alert.type === 'warning' ? 'bg-orange-500/20' : 
                      alert.type === 'success' ? 'bg-emerald-500/20' : 
                      'bg-cyan-500/20'
                    }`}>
                      <AlertCircle className={`w-4 h-4 ${
                        alert.type === 'warning' ? 'text-orange-400' : 
                        alert.type === 'success' ? 'text-emerald-400' : 
                        'text-cyan-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white text-sm">{alert.title}</h4>
                      <p className="text-xs text-gray-400 mt-1">{alert.desc}</p>
                      <span className="text-xs text-gray-500 mt-1 inline-block">{alert.time}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Financial Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6"
      >
        <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Financial Overview</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Budget', value: '$2.5M', icon: DollarSign, color: 'text-emerald-400' },
              { label: 'Allocated', value: '$1.8M', icon: PieChart, color: 'text-cyan-400' },
              { label: 'Available', value: '$700K', icon: Activity, color: 'text-purple-400' },
              { label: 'Pending', value: '$150K', icon: FileText, color: 'text-orange-400' }
            ].map((metric, i) => (
              <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
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
