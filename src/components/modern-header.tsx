'use client';

import { Link, useRouter } from '@/routing';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { getSupabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { ThemeToggle } from './theme-toggle';
import { useEffect, useState } from 'react';
import { Bell, Trash2, Sparkles, LogOut, User, Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './language-switcher';
import { motion } from 'framer-motion';

export default function ModernHeader() {
  const t = useTranslations('Header');
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Array<{ title: string; message: string; ts: number }>>([]);
  const unread = notifications.length;

  const handleLogout = async () => {
    await getSupabase().auth.signOut();
    router.push('/login');
  };
  
  const getInitials = (name: string | null | undefined, fallback: string) => {
    if (!name) return fallback;
    const parts = name.split(' ');
    if (parts.length > 1 && parts[0] && parts[parts.length - 1]) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return (name[0] || '').toUpperCase();
  }
  
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ title: string; message: string; ts?: number }>;
      setNotifications(prev => [{ title: ce.detail.title, message: ce.detail.message, ts: ce.detail.ts || Date.now() }, ...prev].slice(0, 10));
    };
    window.addEventListener('notify', handler as EventListener);
    return () => window.removeEventListener('notify', handler as EventListener);
  }, []);

  const clearNotifications = () => setNotifications([]);

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 w-full border-b border-white/10 bg-gradient-to-r from-gray-900/95 via-black/95 to-gray-900/95 backdrop-blur-xl"
    >
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        {/* Sidebar Trigger */}
        <SidebarTrigger className="text-white hover:bg-white/10" />
        
        {/* Logo/Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-white/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <span className="text-white font-black text-sm relative z-10">CA</span>
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              ClassroomAI
            </h1>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="relative h-9 w-9 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold flex items-center justify-center"
                  >
                    {unread}
                  </motion.span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-80 bg-gradient-to-br from-gray-900 to-black border border-white/10 shadow-2xl rounded-2xl p-0" 
              align="end"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  <span className="font-semibold text-white">{t('notifications')}</span>
                </div>
                {unread > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2 text-xs text-gray-400 hover:text-white hover:bg-white/10"
                    onClick={clearNotifications}
                  >
                    <Trash2 className="h-3 w-3 mr-1" /> {t('clear')}
                  </Button>
                )}
              </div>
              
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">{t('noRecent')}</p>
                </div>
              ) : (
                <div className="max-h-80 overflow-auto">
                  {notifications.map((n, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-4 hover:bg-white/5 transition-all border-b border-white/5 last:border-b-0 cursor-pointer"
                    >
                      <div className="font-medium text-white text-sm">{n.title}</div>
                      <div className="text-gray-400 text-xs mt-1">{n.message}</div>
                      <div className="text-gray-500 text-xs mt-1">
                        {new Date(n.ts).toLocaleTimeString()}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-9 gap-2 rounded-xl px-2 hover:bg-white/10 transition-all"
              >
                <Avatar className="h-7 w-7 border-2 border-cyan-500/50">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-blue-600 text-white text-xs font-bold">
                    {getInitials(user?.user_metadata?.full_name || user?.email, 'U')}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline text-sm text-white font-medium">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-64 bg-gradient-to-br from-gray-900 to-black border border-white/10 shadow-2xl rounded-2xl p-2" 
              align="end"
            >
              <DropdownMenuLabel className="p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-cyan-500/50">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-blue-600 text-white font-bold">
                      {getInitials(user?.user_metadata?.full_name || user?.email, 'U')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate">
                      {user?.user_metadata?.full_name || 'User'}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {user?.email}
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem 
                className="p-3 text-white hover:bg-white/10 rounded-xl cursor-pointer transition-all"
                asChild
              >
                <Link href="/dashboard/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-cyan-400" />
                  {t('profile')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="p-3 text-white hover:bg-white/10 rounded-xl cursor-pointer transition-all"
                asChild
              >
                <Link href="/dashboard/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-blue-400" />
                  {t('settings')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem 
                className="p-3 text-red-400 hover:bg-red-500/10 rounded-xl cursor-pointer transition-all"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t('logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}
