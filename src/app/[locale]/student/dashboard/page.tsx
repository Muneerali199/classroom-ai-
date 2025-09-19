'use client';

<<<<<<< HEAD
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BookOpen, BarChart3, Calendar, Award, TrendingUp, User } from 'lucide-react';

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

export default function StudentDashboardPage() {
  // Mock data for the student dashboard
  const stats = [
    {
      title: "Current Courses",
      value: "5",
      description: "Active enrollments",
      icon: BookOpen,
      change: "+2 this semester"
    },
    {
      title: "Attendance", 
      value: "94%",
      description: "Overall rate",
      icon: Calendar,
      change: "Excellent"
    },
    {
      title: "Average Grade", 
      value: "A-",
      description: "Current standing", 
      icon: BarChart3,
      change: "+5% from last term"
    },
    {
      title: "Achievements",
      value: "12",
      description: "Badges earned",
      icon: Award,
      change: "3 new this month"
    }
  ];

  const recentCourses = [
    { name: "Mathematics", progress: 85, grade: "A-" },
    { name: "Science", progress: 72, grade: "B+" },
    { name: "Literature", progress: 90, grade: "A" },
    { name: "History", progress: 68, grade: "B" }
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
                Student Dashboard
              </h1>
              <div
                className="inline-block px-4 py-2 rounded-xl"
                style={getNeumorphicStyle(false, true, 'small')}
              >
                <p className="text-gray-600 text-sm sm:text-base">
                  Welcome! View your courses, attendance, and grades here.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div
                className="p-3 rounded-xl"
                style={getNeumorphicStyle()}
              >
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div
                className="px-4 py-2 rounded-xl"
                style={getNeumorphicStyle(false, true, 'small')}
              >
                <span className="text-sm font-semibold text-gray-700">
                  Student Profile
                </span>
              </div>
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
                    <span className="text-xs text-gray-600 font-medium flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {stat.change}
                    </span>
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

        {/* Main Content Area */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Course Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="rounded-3xl p-6"
            style={getNeumorphicStyle(false, false, 'large')}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="p-3 rounded-xl"
                style={getNeumorphicStyle()}
              >
                <BookOpen className="w-6 h-6 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-700">Course Progress</h2>
            </div>
            
            <div className="space-y-4">
              {recentCourses.map((course, index) => (
                <motion.div
                  key={course.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="p-4 rounded-xl"
                  style={getNeumorphicStyle(false, true)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-700">{course.name}</h3>
                    <span className="px-2 py-1 rounded text-sm font-medium"
                      style={getNeumorphicStyle(false, false, 'small')}
                    >
                      {course.grade}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2"
                    style={getNeumorphicStyle(false, true, 'small')}
                  >
                    <div 
                      className="h-2 rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, #4a6fa5, #2c5282)',
                        width: `${course.progress}%`
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="rounded-3xl p-6"
            style={getNeumorphicStyle(false, false, 'large')}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="p-3 rounded-xl"
                style={getNeumorphicStyle()}
              >
                <Award className="w-6 h-6 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-700">Recent Activities</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { action: "Completed", item: "Math Assignment", time: "2 hours ago" },
                { action: "Submitted", item: "Science Project", time: "1 day ago" },
                { action: "Received", item: "Literature Grade: A", time: "2 days ago" },
                { action: "Attended", item: "History Lecture", time: "3 days ago" }
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index + 0.2 }}
                  className="p-4 rounded-xl"
                  style={getNeumorphicStyle(false, true)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-gray-700">{activity.action} </span>
                      <span className="text-gray-600">{activity.item}</span>
                    </div>
                    <span className="text-xs text-gray-500"
                      style={getNeumorphicStyle(false, false, 'small')}
                    >
                      {activity.time}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="rounded-3xl p-6"
          style={getNeumorphicStyle(false, false, 'large')}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="p-3 rounded-xl"
              style={getNeumorphicStyle()}
            >
              <Calendar className="w-6 h-6 text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-700">Upcoming Events</h2>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Math Exam", date: "Tomorrow", time: "10:00 AM", type: "exam" },
              { title: "Science Lab", date: "Dec 15", time: "2:00 PM", type: "lab" },
              { title: "Literature Essay Due", date: "Dec 18", time: "11:59 PM", type: "assignment" }
            ].map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 * index + 0.3 }}
                className="p-4 rounded-xl"
                style={getNeumorphicStyle(false, true)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-700">{event.title}</h3>
                  <span className="px-2 py-1 rounded text-xs font-medium capitalize"
                    style={getNeumorphicStyle(false, false, 'small')}
                  >
                    {event.type}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{event.date}</span>
                  <span>{event.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
=======
import ModernStudentDashboard from '@/components/modern-student-dashboard';

export default function StudentDashboardPage() {
  return <ModernStudentDashboard />;
}
>>>>>>> 199af3475761fe42d3e41253973aa62af258ba8f
