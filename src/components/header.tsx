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
    <div className="flex w-full items-center justify-between gap-1 md:gap-4">
      {/* Page Title */}
      <div className="flex items-center gap-2 min-w-0">
        <h1 className="text-base md:text-lg font-semibold !text-white truncate">
          Dashboard
        </h1>
      </div>
      
      <div className="flex items-center gap-1 md:gap-2 lg:gap-4 flex-shrink-0">
        {/* Notifications bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 md:h-9 md:w-9 rounded-full !text-white hover:!bg-gray-700" aria-label={t('notifications')}>
              <Bell className="h-4 w-4 md:h-5 md:w-5" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-red-500 text-white text-[10px] leading-4 text-center">
                  {unread}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72 md:w-80 !bg-gray-800 !border-gray-700 shadow-lg rounded-xl" align="end" forceMount>
            <DropdownMenuLabel className="flex items-center justify-between p-4 !border-b !border-gray-700">
              <span className="font-semibold !text-white">{t('notifications')}</span>
              {unread > 0 && (
                <Button variant="ghost" size="sm" className="h-7 px-2 text-gray-300 hover:text-white hover:bg-gray-700" onClick={clearNotifications}>
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> {t('clear')}
                </Button>
              )}
            </DropdownMenuLabel>
            {notifications.length === 0 ? (
              <div className="p-4 text-sm text-gray-400 text-center">{t('noRecent')}</div>
            ) : (
              <div className="max-h-72 overflow-auto">
                {notifications.map((n, i) => (
                  <div key={i} className="px-4 py-3 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0">
                    <div className="font-medium text-white text-sm">{n.title}</div>
                    <div className="text-gray-300 text-xs mt-1">{n.message}</div>
                    <div className="text-gray-500 text-xs mt-1">
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
            <Button variant="ghost" className="relative h-8 w-8 md:h-10 md:w-10 rounded-full hover:!bg-gray-700 transition-colors">
              <Avatar className="h-7 w-7 md:h-9 md:w-9 border-2 !border-gray-600 shadow-sm">
                <AvatarImage src={user?.photoURL ?? "https://picsum.photos/100"} alt="User avatar" data-ai-hint="person" />
                <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-semibold">
                  {getInitials(user?.displayName || user?.email, 'T')}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 md:w-64 !bg-gray-800 !border-gray-700 shadow-lg rounded-xl" align="end" forceMount>
            <DropdownMenuLabel className="font-normal p-4 !border-b !border-gray-700">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 border-2 !border-gray-600">
                  <AvatarImage src={user?.photoURL ?? "https://picsum.photos/100"} alt="User avatar" />
                  <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-semibold">
                    {getInitials(user?.displayName || user?.email, 'T')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold !text-white">{user?.displayName ?? 'Teacher'}</p>
                  <p className="text-xs !text-gray-300">
                    {user?.email ?? 'teacher@edutrack.com'}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            <div className="p-2">
              <DropdownMenuItem asChild className="rounded-lg hover:!bg-gray-700 transition-colors">
                  <Link href="/dashboard/profile" className="flex items-center px-3 py-2 text-sm !text-gray-300 hover:!text-white">
                    {t('profile')}
                  </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg hover:!bg-gray-700 transition-colors px-3 py-2 text-sm !text-gray-300 hover:!text-white">
                {t('settings')}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2 !bg-gray-700" />
              <DropdownMenuItem onClick={handleLogout} className="rounded-lg hover:!bg-red-900/20 transition-colors px-3 py-2 text-sm !text-red-400 hover:!text-red-300">
                {t('logout')}
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
