'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Student } from '@/lib/types';
import DashboardClient from '@/components/dashboard-client';
import UserManagement from '@/components/user-management';
import StudentIdGenerator from '@/components/student-id-generator';
import EnhancedStudentForm from '@/components/enhanced-student-form';
import StudentListManager from '@/components/student-list-manager';
import { Users, UserPlus, CreditCard, GraduationCap, BarChart3, Settings, TrendingUp, Calendar, Shield } from 'lucide-react';

interface ModernTeacherDashboardProps {
  initialStudents: Student[];
}

export default function ModernTeacherDashboard({ 
  initialStudents 
}: ModernTeacherDashboardProps) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [activeTab, setActiveTab] = useState('attendance');

  const getNeumorphicStyle = (pressed = false, inset = false, size = 'normal') => {
    const shadowSize = size === 'large' ? '12px' : size === 'small' ? '4px' : '8px';
    const shadowBlur = size === 'large' ? '24px' : size === 'small' ? '8px' : '16px';
    
    return {
      background: pressed || inset ? 
        'linear-gradient(145deg, #d0d0d0, #f0f0f0)' : 
        'linear-gradient(145deg, #f0f0f0, #d0d0d0)',
      boxShadow: pressed || inset ?
        `inset ${shadowSize} ${shadowSize} ${shadowBlur} #bebebe, inset -${shadowSize} -${shadowSize} ${shadowBlur} #ffffff` :
        `${shadowSize} ${shadowSize} ${shadowBlur} #bebebe, -${shadowSize} -${shadowSize} ${shadowBlur} #ffffff`
    };
  };

  const handleStudentDeleted = (deletedStudentId: string) => {
    setStudents(prevStudents => 
      prevStudents.filter(student => student.id !== deletedStudentId)
    );
  };

  const handleStudentUpdated = (updatedStudent: Student) => {
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
  };

  const handleStudentCreated = () => {
    window.location.reload();
  };

  // Calculate statistics
  const totalStudents = students.length;
  const studentsWithEmail = students.filter(s => s.email).length;
  const studentsWithEmergencyContact = students.filter(s => s.emergency_contact_name).length;
  const recentlyAdded = students.filter(s => {
    if (!s.created_at) return false;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(s.created_at) > weekAgo;
  }).length;
  const totalAttendanceRecords = students.reduce((sum, s) => sum + s.attendance.length, 0);

  const stats = [
    {
      title: "Total Students",
      value: totalStudents,
      description: "Active in your classes",
      icon: Users,
      change: recentlyAdded > 0 ? `+${recentlyAdded} this week` : null
    },
    {
      title: "Complete Profiles", 
      value: studentsWithEmail,
      description: "With email addresses",
      icon: GraduationCap,
      change: `${Math.round((studentsWithEmail / totalStudents) * 100) || 0}% complete`
    },
    {
      title: "Emergency Contacts",
      value: studentsWithEmergencyContact,
      description: "Safety information on file", 
      icon: Shield,
      change: `${Math.round((studentsWithEmergencyContact / totalStudents) * 100) || 0}% covered`
    },
    {
      title: "Attendance Records",
      value: totalAttendanceRecords,
      description: "Total records tracked",
      icon: BarChart3,
      change: "All time data"
    }
  ];

  const tabs = [
    { id: 'attendance', label: 'Attendance Management', icon: Calendar },
    { id: 'students', label: 'Student Management', icon: Users },
    { id: 'tools', label: 'Tools & Reports', icon: Settings }
  ];

  return (
    <div 
      className="min-h-screen p-4 sm:p-6 lg:p-8"
      style={{ background: 'linear-gradient(135deg, #e3e3e3 0%, #f7f7f7 50%, #e8e8e8 100%)' }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 rounded-full" style={getNeumorphicStyle(false, true, 'small')}></div>
        <div className="absolute top-1/3 right-32 w-32 h-32 rounded-full" style={getNeumorphicStyle(false, false, 'small')}></div>
        <div className="absolute bottom-40 left-1/4 w-48 h-48 rounded-full" style={getNeumorphicStyle(false, true, 'small')}></div>
        <div className="absolute bottom-1/3 right-20 w-36 h-36 rounded-full" style={getNeumorphicStyle(false, false, 'small')}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl p-6 sm:p-8"
          style={getNeumorphicStyle(false, false, 'large')}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 leading-tight"
                style={{
                  background: 'linear-gradient(145deg, #666666, #888888)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Teacher Dashboard
              </h1>
              <div
                className="inline-block px-4 py-2 rounded-xl"
                style={getNeumorphicStyle(false, true, 'small')}
              >
                <p className="text-gray-600 text-sm sm:text-base">
                  Manage your classes, students, and attendance records
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div
                className="px-4 py-2 rounded-xl"
                style={getNeumorphicStyle()}
              >
                <span className="text-sm font-semibold text-gray-700">
                  {totalStudents} Student{totalStudents !== 1 ? 's' : ''}
                </span>
              </div>
              {recentlyAdded > 0 && (
                <div
                  className="px-4 py-2 rounded-xl"
                  style={getNeumorphicStyle(false, true, 'small')}
                >
                  <span className="text-sm font-medium text-green-700 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +{recentlyAdded} This Week
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="rounded-2xl p-6"
              style={getNeumorphicStyle()}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="p-3 rounded-xl"
                  style={getNeumorphicStyle(false, true, 'small')}
                >
                  <stat.icon className="w-6 h-6 text-gray-600" />
                </div>
                {stat.change && (
                  <div
                    className="px-2 py-1 rounded-lg"
                    style={getNeumorphicStyle(false, false, 'small')}
                  >
                    <span className="text-xs text-gray-600 font-medium">{stat.change}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">{stat.title}</h3>
                <div
                  className="text-3xl font-bold py-2 px-3 rounded-xl text-center"
                  style={getNeumorphicStyle(false, true, 'small')}
                >
                  <span
                    style={{
                      background: 'linear-gradient(145deg, #555555, #777777)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    {stat.value}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="rounded-2xl p-2"
          style={getNeumorphicStyle(false, true)}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-200 ${
                  activeTab === tab.id ? 'text-gray-800' : 'text-gray-600'
                }`}
                style={activeTab === tab.id ? getNeumorphicStyle() : {}}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-semibold text-sm sm:text-base">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl p-6 sm:p-8"
          style={getNeumorphicStyle(false, false, 'large')}
        >
          {activeTab === 'attendance' && (
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="p-3 rounded-xl"
                    style={getNeumorphicStyle()}
                  >
                    <Calendar className="w-6 h-6 text-gray-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-700">Attendance Management</h2>
                </div>
                <div
                  className="p-4 rounded-xl"
                  style={getNeumorphicStyle(false, true, 'small')}
                >
                  <p className="text-gray-600">Track and manage student attendance records</p>
                </div>
              </div>
              <DashboardClient initialStudents={students} />
            </div>
          )}

          {activeTab === 'students' && (
            <div className="space-y-8">
              {/* Student Creation Section */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="p-3 rounded-xl"
                    style={getNeumorphicStyle()}
                  >
                    <UserPlus className="w-6 h-6 text-gray-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-700">Add New Students</h2>
                </div>
                
                <div className="grid gap-6 lg:grid-cols-2">
                  <div
                    className="rounded-2xl p-6"
                    style={getNeumorphicStyle()}
                  >
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-700 mb-2">Quick Registration</h3>
                      <div
                        className="p-3 rounded-xl"
                        style={getNeumorphicStyle(false, true, 'small')}
                      >
                        <p className="text-sm text-gray-600">
                          Fast student account creation with basic information
                        </p>
                      </div>
                    </div>
                    <UserManagement userRole="teacher" onSuccess={handleStudentCreated} />
                  </div>
                  
                  <div
                    className="rounded-2xl p-6"
                    style={getNeumorphicStyle()}
                  >
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-700 mb-2">Detailed Registration</h3>
                      <div
                        className="p-3 rounded-xl"
                        style={getNeumorphicStyle(false, true, 'small')}
                      >
                        <p className="text-sm text-gray-600">
                          Complete student profile with contact and medical information
                        </p>
                      </div>
                    </div>
                    <EnhancedStudentForm onSuccess={handleStudentCreated} />
                  </div>
                </div>
              </div>
              
              {/* Student Management Section */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="p-3 rounded-xl"
                    style={getNeumorphicStyle()}
                  >
                    <Users className="w-6 h-6 text-gray-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-700">Current Students</h2>
                </div>
                <div
                  className="rounded-2xl p-6"
                  style={getNeumorphicStyle(false, true)}
                >
                  <StudentListManager 
                    students={students} 
                    onStudentDeleted={handleStudentDeleted}
                    onStudentUpdated={handleStudentUpdated}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="p-3 rounded-xl"
                    style={getNeumorphicStyle()}
                  >
                    <CreditCard className="w-6 h-6 text-gray-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-700">ID Pass Generator</h2>
                </div>
                <div
                  className="rounded-2xl p-6"
                  style={getNeumorphicStyle()}
                >
                  <StudentIdGenerator students={students} />
                </div>
              </div>
              
              {/* Additional Tools */}
              <div
                className="rounded-2xl p-8"
                style={getNeumorphicStyle()}
              >
                <div className="text-center">
                  <div
                    className="inline-block p-6 rounded-2xl mb-6"
                    style={getNeumorphicStyle(false, true)}
                  >
                    <Settings className="w-12 h-12 mx-auto text-gray-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">Additional Tools</h3>
                  <div
                    className="inline-block px-6 py-3 rounded-xl"
                    style={getNeumorphicStyle(false, true, 'small')}
                  >
                    <p className="text-gray-600">
                      More features coming soon: Bulk import, Export reports, Grade management
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}