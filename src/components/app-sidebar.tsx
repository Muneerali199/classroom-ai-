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
    <Sidebar className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-xl border-r border-gray-200 dark:border-gray-800">
      {/* Header */}
      <SidebarHeader>
        <div className="flex items-center gap-3 p-4">
          {/* Logo with gradient background */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
            <Logo className="w-7 h-7 text-white" />
          </div>

          {/* EduTrack gradient text */}
          <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent tracking-tight">
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
                href: '/dashboard/profile',
                label: t('profile'),
                icon: <User />,
              },
            ].map(({ href, label, icon }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(href)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all duration-200
                    ${
                      isActive(href)
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 text-gray-700 dark:text-gray-300'
                    }`}
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
