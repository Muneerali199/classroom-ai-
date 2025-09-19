'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Home, User, BookOpen, BarChart3, Hash } from 'lucide-react';
import Header from '@/components/header';
import { Logo } from '@/components/icons';
import Link from 'next/link';
import DashboardAuthWrapper from '@/components/dashboard-auth-wrapper';
import { motion } from 'framer-motion';

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

function StudentSidebar() {
  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/student/dashboard', active: true },
    { icon: Hash, label: 'Mark Attendance', href: '/student/pin-attendance' },
    { icon: BookOpen, label: 'My Courses', href: '#' },
    { icon: BarChart3, label: 'My Attendance', href: '#' },
    { icon: User, label: 'Profile', href: '/student/profile' },
  ];

  return (
    <Sidebar 
      style={getNeumorphicStyle(false, false, 'large')}
      className="border-none"
    >
      <SidebarHeader className="p-4">
        <motion.div 
          className="flex items-center gap-3 p-4 rounded-xl"
          style={getNeumorphicStyle(false, true)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #4a6fa5 0%, #2c5282 50%, #1e40af 100%)',
              boxShadow: '4px 4px 8px #bebebe, -4px -4px 8px #ffffff'
            }}
          >
            <Logo className="w-7 h-7 text-white" />
          </div>
          <span 
            className="text-xl font-bold"
            style={{
              background: 'linear-gradient(145deg, #666666, #888888)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            EduTrack
          </span>
        </motion.div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarMenu className="space-y-2">
            {menuItems.map((item, index) => (
              <SidebarMenuItem key={index}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SidebarMenuButton
                    asChild
                    isActive={item.active}
                    className="border-none transition-all duration-200"
                    style={item.active ? getNeumorphicStyle(true) : getNeumorphicStyle()}
                  >
                    <Link 
                      href={item.href} 
                      className="flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:text-gray-900"
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </motion.div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        
        {/* Student Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 p-4 rounded-xl"
          style={getNeumorphicStyle(false, true)}
        >
          <div className="text-center">
            <div 
              className="inline-block px-3 py-1 rounded-lg mb-2"
              style={getNeumorphicStyle(false, false, 'small')}
            >
              <span className="text-xs font-medium text-green-600">Active Student</span>
            </div>
            <p className="text-sm text-gray-600">Welcome to your learning portal</p>
          </div>
        </motion.div>
      </SidebarContent>
    </Sidebar>
  );
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardAuthWrapper>
      <SidebarProvider>
        <StudentSidebar />
        <SidebarInset>
          <Header />
          <main 
            className="min-h-screen p-4 sm:p-6 lg:p-8"
            style={{ 
              background: 'linear-gradient(135deg, #e3e3e3 0%, #f7f7f7 50%, #e8e8e8 100%)',
              minHeight: '100vh'
            }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-20 left-20 w-40 h-40 rounded-full" style={getNeumorphicStyle(false, true, 'small')}></div>
              <div className="absolute top-1/3 right-32 w-32 h-32 rounded-full" style={getNeumorphicStyle(false, false, 'small')}></div>
              <div className="absolute bottom-40 left-1/4 w-48 h-48 rounded-full" style={getNeumorphicStyle(false, true, 'small')}></div>
              <div className="absolute bottom-1/3 right-20 w-36 h-36 rounded-full" style={getNeumorphicStyle(false, false, 'small')}></div>
            </div>
            
            <div className="relative z-10">
              {children}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </DashboardAuthWrapper>
  );
}