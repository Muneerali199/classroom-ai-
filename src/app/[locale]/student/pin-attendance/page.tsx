'use client';

import { motion } from 'framer-motion';
import PinAttendanceClient from "@/components/pin-attendance-client";
import { Separator } from "@/components/ui/separator";
import { Key, CalendarCheck, Shield } from 'lucide-react';

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

export default function PinAttendancePage() {
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

          <div className="max-w-4xl mx-auto relative z-10 space-y-8">
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
                    Mark Your Attendance
                  </h1>
                  <div
                    className="inline-block px-4 py-2 rounded-xl"
                    style={getNeumorphicStyle(false, true, 'small')}
                  >
                    <p className="text-gray-600 text-sm sm:text-base">
                      Enter the PIN provided by your teacher to mark your attendance.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div
                    className="p-3 rounded-xl"
                    style={getNeumorphicStyle()}
                  >
                    <Key className="w-6 h-6 text-gray-600" />
                  </div>
                  <div
                    className="px-4 py-2 rounded-xl"
                    style={getNeumorphicStyle(false, true, 'small')}
                  >
                    <span className="text-sm font-semibold text-gray-700">
                      Secure PIN
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Information Cards */}
            <div className="grid gap-6 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="rounded-2xl p-6"
                style={getNeumorphicStyle()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="p-3 rounded-xl"
                    style={getNeumorphicStyle(false, true, 'small')}
                  >
                    <CalendarCheck className="w-6 h-6 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-700">How It Works</h3>
                </div>
                <div
                  className="p-4 rounded-xl"
                  style={getNeumorphicStyle(false, true, 'small')}
                >
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Your teacher will provide a unique PIN for each class</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Enter the PIN exactly as shown during class time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Attendance is recorded instantly and securely</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>You can view your attendance history in your dashboard</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="rounded-2xl p-6"
                style={getNeumorphicStyle()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="p-3 rounded-xl"
                    style={getNeumorphicStyle(false, true, 'small')}
                  >
                    <Shield className="w-6 h-6 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-700">Important Notes</h3>
                </div>
                <div
                  className="p-4 rounded-xl"
                  style={getNeumorphicStyle(false, true, 'small')}
                >
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>PINs are time-sensitive and expire after class</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Each PIN can only be used once per student</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Do not share your PIN with other students</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Contact your teacher if you encounter any issues</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>

            {/* PIN Attendance Client Component */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="rounded-3xl p-6 sm:p-8"
              style={getNeumorphicStyle(false, false, 'large')}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="p-3 rounded-xl"
                  style={getNeumorphicStyle()}
                >
                  <Key className="w-6 h-6 text-gray-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-700">Enter Attendance PIN</h2>
              </div>
              
              <PinAttendanceClient />
            </motion.div>

            {/* Recent Attendance History (Placeholder) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="rounded-3xl p-6 sm:p-8"
              style={getNeumorphicStyle(false, false, 'large')}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="p-3 rounded-xl"
                  style={getNeumorphicStyle()}
                >
                  <CalendarCheck className="w-6 h-6 text-gray-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-700">Recent Attendance</h2>
              </div>
              
              <div
                className="p-6 rounded-xl text-center"
                style={getNeumorphicStyle(false, true)}
              >
                <p className="text-gray-600 mb-4">Your attendance history will appear here after marking your first attendance.</p>
                <div className="inline-block px-4 py-2 rounded-xl"
                  style={getNeumorphicStyle(false, false, 'small')}
                >
                  <span className="text-sm text-gray-600">No records yet</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
    );
}