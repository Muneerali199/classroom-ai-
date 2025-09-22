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
import { Home, User, Users, BarChart3, Bot } from 'lucide-react';
import { Logo } from '@/components/icons';
import Link from 'next/link';
import { usePathname } from '@/routing';

export default function AppSidebar() {
  const t = useTranslations('DashboardNav');
  const pathname = usePathname();

  const getRelativePath = (path: string) => {
    const segments = pathname.split('/');
    const locale = segments[1];
    return `/${locale}${path}`;
  };

  const isActive = (path: string) => pathname === getRelativePath(path);

  return (
    <Sidebar className="neo-bg backdrop-blur-lg border-r border-gray-200 dark:border-gray-800">
      {/* Header */}
      <SidebarHeader>
        <div className="flex items-center gap-3 p-4">
          {/* Logo with gradient background */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
            <Logo className="w-7 h-7 text-white" />
          </div>

          {/* EduTrack text */}
          <span className="text-2xl font-extrabold tracking-tight text-gray-800">
            EduTrack
          </span>
        </div>
      </SidebarHeader>

      {/* Menu */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="px-3 space-y-2">
            {[
              { href: '/dashboard', label: t('dashboard'), icon: <Home /> },
              {
                href: '/dashboard/attendance',
                label: t('attendance'),
                icon: <BarChart3 />,
              },
              {
                href: '/dashboard/students',
                label: t('students'),
                icon: <Users />,
              },
              {
                href: '/dashboard/assignments',
                label: 'Assignments',
                icon: <BarChart3 />,
              },
              {
                href: '/dashboard/timetable',
                label: 'Timetable',
                icon: <BarChart3 />,
              },
              {
                href: '/dashboard/meetings',
                label: 'Meetings',
                icon: <Users />,
              },
              {
                href: '/dashboard/assistant',
                label: t('assistant'),
                icon: <Bot />,
              },
              {
                href: '/dashboard/profile',
                label: t('profile'),
                icon: <User />,
              },
            ].map(({ href, label, icon }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(href)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 text-gray-700 dark:text-gray-300 neo-surface hover:shadow-lg ${isActive(href) ? 'ring-2 ring-blue-400' : ''}`}
                >
                  <Link href={href} className="flex items-center gap-3">
                    <span className="w-5 h-5">{icon}</span>
                    {label}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
