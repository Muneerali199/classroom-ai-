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
import { Bell, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './language-switcher';

export default function Header() {
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
  
  // Listen to app-wide notifications dispatched via window.dispatchEvent(new CustomEvent('notify', { detail: { title, message, ts } }))
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
    <div className="flex w-full items-center justify-between gap-2 md:gap-4">
      {/* Page Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          Dashboard
        </h1>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full" aria-label={t('notifications')}>
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-red-500 text-white text-[10px] leading-4 text-center">
                  {unread}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl" align="end" forceMount>
            <DropdownMenuLabel className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
              <span className="font-semibold text-gray-900 dark:text-white">{t('notifications')}</span>
              {unread > 0 && (
                <Button variant="ghost" size="sm" className="h-7 px-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={clearNotifications}>
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> {t('clear')}
                </Button>
              )}
            </DropdownMenuLabel>
            {notifications.length === 0 ? (
              <div className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">{t('noRecent')}</div>
            ) : (
              <div className="max-h-72 overflow-auto">
                {notifications.map((n, i) => (
                  <div key={i} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                    <div className="font-medium text-gray-900 dark:text-white text-sm">{n.title}</div>
                    <div className="text-gray-600 dark:text-gray-300 text-xs mt-1">{n.message}</div>
                    <div className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                      {new Date(n.ts).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />
        <LanguageSwitcher />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Avatar className="h-9 w-9 border-2 border-gray-200 dark:border-gray-700 shadow-sm">
                <AvatarImage src={user?.photoURL ?? "https://picsum.photos/100"} alt="User avatar" data-ai-hint="person" />
                <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-semibold">
                  {getInitials(user?.displayName || user?.email, 'T')}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl" align="end" forceMount>
            <DropdownMenuLabel className="font-normal p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-700">
                  <AvatarImage src={user?.photoURL ?? "https://picsum.photos/100"} alt="User avatar" />
                  <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-semibold">
                    {getInitials(user?.displayName || user?.email, 'T')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.displayName ?? 'Teacher'}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {user?.email ?? 'teacher@edutrack.com'}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            <div className="p-2">
              <DropdownMenuItem asChild className="rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Link href="/dashboard/profile" className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                    {t('profile')}
                  </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                {t('settings')}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2 bg-gray-200 dark:bg-gray-700" />
              <DropdownMenuItem onClick={handleLogout} className="rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors px-3 py-2 text-sm text-red-600 dark:text-red-400">
                {t('logout')}
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
