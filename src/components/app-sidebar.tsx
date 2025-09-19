'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useTranslations } from 'next-intl';
import { Home, User, Users, BarChart3 } from 'lucide-react';
import { Logo } from '@/components/icons';
import Link from 'next/link';
<<<<<<< HEAD
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
=======
import { usePathname } from '@/routing';
>>>>>>> 199af3475761fe42d3e41253973aa62af258ba8f

export default function AppSidebar() {
  const t = useTranslations('DashboardNav');
  const pathname = usePathname();

  const getRelativePath = (path: string) => {
    const segments = pathname.split('/');
    const locale = segments[1];
    return `/${locale}${path}`;
  };

  const isActive = (path: string) => {
    return pathname === getRelativePath(path);
  };

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

  return (
    <Sidebar
      style={{
        background: 'linear-gradient(135deg, #e3e3e3 0%, #f7f7f7 50%, #e8e8e8 100%)',
        boxShadow: getNeumorphicStyle(false, false, 'small').boxShadow
      }}
      className="border-0"
    >
      <SidebarHeader className="p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 p-3 rounded-2xl"
          style={getNeumorphicStyle()}
        >
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={getNeumorphicStyle(false, true)}
          >
            <Logo className="w-6 h-6 text-gray-700" />
          </div>
          <span className="text-xl font-bold text-gray-700">
            EduTrack
          </span>
        </motion.div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive('/dashboard')}
                  className="rounded-xl border-0"
                  style={isActive('/dashboard') ? getNeumorphicStyle() : getNeumorphicStyle(false, true)}
                >
                  <Link 
                    href="/dashboard" 
                    className={`flex items-center gap-3 p-3 ${isActive('/dashboard') ? 'text-gray-800' : 'text-gray-600'}`}
                  >
                    <div 
                      className="p-2 rounded-lg"
                      style={getNeumorphicStyle(false, true, 'small')}
                    >
                      <Home className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{t('dashboard')}</span>
                  </Link>
                </SidebarMenuButton>
              </motion.div>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
<<<<<<< HEAD
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
=======
              <SidebarMenuButton
                asChild
                isActive={isActive('/dashboard/students')}
              >
                <Link href="/dashboard/students">
                  <Users />
                  {t('students')}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/dashboard/profile')}
>>>>>>> 199af3475761fe42d3e41253973aa62af258ba8f
              >
                <SidebarMenuButton
                  asChild
                  isActive={isActive('/dashboard/attendance')}
                  className="rounded-xl border-0"
                  style={isActive('/dashboard/attendance') ? getNeumorphicStyle() : getNeumorphicStyle(false, true)}
                >
                  <Link 
                    href="/dashboard/attendance"
                    className={`flex items-center gap-3 p-3 ${isActive('/dashboard/attendance') ? 'text-gray-800' : 'text-gray-600'}`}
                  >
                    <div 
                      className="p-2 rounded-lg"
                      style={getNeumorphicStyle(false, true, 'small')}
                    >
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{t('attendance')}</span>
                  </Link>
                </SidebarMenuButton>
              </motion.div>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <SidebarMenuButton 
                  asChild
                  className="rounded-xl border-0"
                  style={getNeumorphicStyle(false, true)}
                >
                  <Link 
                    href="#" 
                    className="flex items-center gap-3 p-3 text-gray-600"
                  >
                    <div 
                      className="p-2 rounded-lg"
                      style={getNeumorphicStyle(false, true, 'small')}
                    >
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{t('students')}</span>
                  </Link>
                </SidebarMenuButton>
              </motion.div>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <SidebarMenuButton
                  asChild
                  isActive={isActive('/dashboard/profile')}
                  className="rounded-xl border-0"
                  style={isActive('/dashboard/profile') ? getNeumorphicStyle() : getNeumorphicStyle(false, true)}
                >
                  <Link 
                    href="/dashboard/profile"
                    className={`flex items-center gap-3 p-3 ${isActive('/dashboard/profile') ? 'text-gray-800' : 'text-gray-600'}`}
                  >
                    <div 
                      className="p-2 rounded-lg"
                      style={getNeumorphicStyle(false, true, 'small')}
                    >
                      <User className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{t('profile')}</span>
                  </Link>
                </SidebarMenuButton>
              </motion.div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}