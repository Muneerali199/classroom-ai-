'use client';

import Link from 'next/link';
import { useRouter } from '@/routing';
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

export default function Header() {
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
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 neo-surface px-4 md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex w-full items-center justify-end gap-4">
        {/* Notifications bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-red-500 text-white text-[10px] leading-4 text-center">
                  {unread}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72" align="end" forceMount>
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unread > 0 && (
                <Button variant="ghost" size="sm" className="h-7 px-2" onClick={clearNotifications}>
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear
                </Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground">No recent notifications</div>
            ) : (
              <div className="max-h-72 overflow-auto">
                {notifications.map((n, i) => (
                  <div key={i} className="px-3 py-2 text-sm border-b last:border-b-0">
                    <div className="font-medium">{n.title}</div>
                    <div className="text-muted-foreground text-xs">{n.message}</div>
                  </div>
                ))}
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-9 w-9 border-2 border-border">
                <AvatarImage src={user?.photoURL ?? "https://picsum.photos/100"} alt="User avatar" data-ai-hint="person" />
                <AvatarFallback>{getInitials(user?.displayName || user?.email, 'T')}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.displayName ?? 'Teacher'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email ?? 'teacher@edutrack.com'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
