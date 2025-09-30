'use client';

import { motion } from 'framer-motion';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { useTranslations } from 'next-intl';
import { 
  Home, User, Users, BarChart3, Bot, Calendar,
  ClipboardList, BookOpen, Settings, LogOut, Sparkles
} from 'lucide-react';
import { Link, usePathname, useRouter } from '@/routing';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { getSupabase } from '@/lib/supabase';

const menuItems = [
  {
    title: 'Main',
    items: [
      { href: '/dashboard', label: 'dashboard', icon: Home },
      { href: '/dashboard/attendance', label: 'attendance', icon: BarChart3 },
      { href: '/dashboard/students', label: 'students', icon: Users },
    ]
  },
  {
    title: 'Academic',
    items: [
      { href: '/dashboard/assignments', label: 'assignments', icon: ClipboardList },
      { href: '/dashboard/timetable', label: 'timetable', icon: Calendar },
      { href: '/dashboard/meetings', label: 'meetings', icon: BookOpen },
    ]
  },
  {
    title: 'Tools',
    items: [
      { href: '/dashboard/assistant', label: 'assistant', icon: Bot },
      { href: '/dashboard/profile', label: 'profile', icon: User },
      { href: '/dashboard/settings', label: 'settings', icon: Settings },
    ]
  }
];

export default function UltraModernSidebar() {
  const t = useTranslations('DashboardNav');
  const pathname = usePathname();
  const { user } = useAuth();
  const { state } = useSidebar();
  const router = useRouter();

  const isActive = (path: string) => {
    // For root dashboard, match exactly
    if (path === '/dashboard') {
      return pathname === '/dashboard' || pathname.endsWith('/dashboard');
    }
    // For other paths, check if current pathname starts with the path
    return pathname === path || pathname.startsWith(path + '/');
  };

  const getInitials = (name: string | null | undefined, fallback: string) => {
    if (!name) return fallback;
    const parts = name.split(' ');
    if (parts.length > 1 && parts[0] && parts[parts.length - 1]) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return (name[0] || '').toUpperCase();
  };

  const handleLogout = async () => {
    await getSupabase().auth.signOut();
    router.push('/login');
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-white/10 bg-black backdrop-blur-xl">
      {/* Header with Animated Logo */}
      <SidebarHeader className="border-b border-white/10 p-6">
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden shadow-lg shadow-cyan-500/50"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 20, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            />
            <span className="text-white font-black text-xl relative z-10 drop-shadow-lg">CA</span>
          </motion.div>
          {state === 'expanded' && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              <span className="text-lg font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
                ClassroomAI
              </span>
              <span className="text-xs text-gray-400 font-medium">Smart Education</span>
            </motion.div>
          )}
        </div>
      </SidebarHeader>

      {/* Navigation Content */}
      <SidebarContent className="px-3 py-6">
        {menuItems.map((section, sectionIdx) => (
          <div key={sectionIdx} className="mb-6">
            {state === 'expanded' && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="px-3 mb-3"
              >
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  </motion.div>
                  {section.title}
                </h3>
              </motion.div>
            )}
            
            <SidebarMenu className="space-y-2">
              {section.items.map((item, idx) => {
                const active = isActive(item.href);
                return (
                  <SidebarMenuItem key={idx}>
                    <SidebarMenuButton
                      asChild
                      className={`group relative transition-all duration-300 rounded-xl overflow-hidden ${
                        active
                          ? 'bg-gradient-to-r from-cyan-500/20 via-blue-600/20 to-purple-600/10 border border-cyan-500/60 text-white shadow-lg shadow-cyan-500/30'
                          : 'text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 border border-transparent hover:border-white/10'
                      }`}
                    >
                      <Link href={item.href}>
                        <motion.div
                          whileHover={{ scale: 1.15, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          className={`${active ? 'text-cyan-400' : 'text-gray-400 group-hover:text-cyan-400'} transition-colors duration-300`}
                        >
                          <item.icon className="w-5 h-5 drop-shadow-lg" />
                        </motion.div>
                        {state === 'expanded' && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`font-semibold text-sm ${active ? 'text-white' : 'group-hover:text-white'}`}
                          >
                            {t(item.label)}
                          </motion.span>
                        )}
                        {active && (
                          <>
                            <motion.div
                              layoutId="activeIndicator"
                              className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-500 rounded-r-full shadow-lg shadow-cyan-500/50"
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent"
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          </>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </div>
        ))}
      </SidebarContent>

      {/* Footer with User Profile */}
      <SidebarFooter className="border-t border-white/10 p-4 bg-gradient-to-b from-transparent to-black/50">
        <div className="space-y-2">
          {/* User Profile */}
          <motion.div 
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 hover:border-cyan-500/60 hover:shadow-lg hover:shadow-cyan-500/20 transition-all cursor-pointer group`}
          >
            <Avatar className="h-10 w-10 border-2 border-cyan-500/60 shadow-lg shadow-cyan-500/30">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 text-white text-sm font-black">
                {getInitials(user?.user_metadata?.full_name || user?.email, 'U')}
              </AvatarFallback>
            </Avatar>
            {state === 'expanded' && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-1 min-w-0"
              >
                <div className="text-sm font-bold text-white truncate group-hover:text-cyan-400 transition-colors">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                </div>
                <div className="text-xs text-gray-500 truncate group-hover:text-gray-400 transition-colors">
                  {user?.email}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Logout Button */}
          {state === 'expanded' && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-red-500/10 to-red-600/10 hover:from-red-500/20 hover:to-red-600/20 border border-red-500/40 hover:border-red-500/60 text-red-400 hover:text-red-300 transition-all text-sm font-bold shadow-lg hover:shadow-red-500/20"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          )}
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
