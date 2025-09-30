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
  Home, User, Users, Settings, School, Bot, LogOut, Sparkles, BarChart3, Shield
} from 'lucide-react';
import { Link, usePathname, useRouter } from '@/routing';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { getSupabase } from '@/lib/supabase';

const menuItems = [
  {
    title: 'Main',
    items: [
      { href: '/dean/dashboard', label: 'dashboard', icon: Home },
      { href: '/dean/analytics', label: 'analytics', icon: BarChart3 },
    ]
  },
  {
    title: 'Management',
    items: [
      { href: '/dean/users', label: 'userManagement', icon: Users },
      { href: '/dean/courses', label: 'courseManagement', icon: School },
      { href: '/dean/settings', label: 'systemSettings', icon: Settings },
    ]
  },
  {
    title: 'Tools',
    items: [
      { href: '/dashboard/assistant', label: 'assistant', icon: Bot },
      { href: '/dashboard/profile', label: 'profile', icon: User },
      { href: '/dean/security', label: 'security', icon: Shield },
    ]
  }
];

export default function UltraModernDeanSidebar() {
  const t = useTranslations('DeanNav');
  const pathname = usePathname();
  const { user } = useAuth();
  const { state } = useSidebar();
  const router = useRouter();

  const isActive = (path: string) => {
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
            className="w-11 h-11"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <defs>
                <linearGradient id="deanLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <filter id="deanGlow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <circle cx="100" cy="100" r="95" fill="url(#deanLogoGradient)" opacity="0.15" />
              <g filter="url(#deanGlow)">
                <path d="M 60 50 L 140 50 L 140 150 L 100 140 L 60 150 Z" fill="url(#deanLogoGradient)" opacity="0.9" />
                <path d="M 100 50 L 100 140" stroke="white" strokeWidth="2" opacity="0.6" />
                <circle cx="80" cy="80" r="4" fill="white" opacity="0.9" />
                <circle cx="80" cy="100" r="4" fill="white" opacity="0.9" />
                <circle cx="80" cy="120" r="4" fill="white" opacity="0.9" />
                <line x1="80" y1="84" x2="80" y2="96" stroke="white" strokeWidth="2" opacity="0.7" />
                <line x1="80" y1="104" x2="80" y2="116" stroke="white" strokeWidth="2" opacity="0.7" />
                <circle cx="120" cy="80" r="4" fill="white" opacity="0.9" />
                <circle cx="120" cy="100" r="4" fill="white" opacity="0.9" />
                <circle cx="120" cy="120" r="4" fill="white" opacity="0.9" />
                <line x1="120" y1="84" x2="120" y2="96" stroke="white" strokeWidth="2" opacity="0.7" />
                <line x1="120" y1="104" x2="120" y2="116" stroke="white" strokeWidth="2" opacity="0.7" />
                <line x1="84" y1="80" x2="116" y2="80" stroke="white" strokeWidth="2" opacity="0.7" />
                <line x1="84" y1="100" x2="116" y2="100" stroke="white" strokeWidth="2" opacity="0.7" />
                <line x1="84" y1="120" x2="116" y2="120" stroke="white" strokeWidth="2" opacity="0.7" />
                <path d="M 85 65 Q 100 60 115 65" stroke="white" strokeWidth="2.5" fill="none" opacity="0.8" />
                <circle cx="85" cy="65" r="3" fill="white" opacity="0.9" />
                <circle cx="115" cy="65" r="3" fill="white" opacity="0.9" />
              </g>
            </svg>
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
              <span className="text-xs text-gray-400 font-medium">Dean Portal</span>
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
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Dean'}
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
