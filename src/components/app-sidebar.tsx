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
import { usePathname } from 'next/navigation';

export default function AppSidebar() {
  const t = useTranslations('DashboardNav');
  const pathname = usePathname();

  const getRelativePath = (path: string) => {
    const segments = pathname.split('/');
    const locale = segments[1];
    return `/${locale}${path}`;
  };

  const isActive = (path: string) => {
    // Check if the current pathname matches the link's path exactly
    // or if it's the dashboard home and the path is a sub-path
    return pathname === getRelativePath(path);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Logo className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            EduTrack
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/dashboard')}>
                <Link href="/dashboard">
                  <Home />
                  {t('dashboard')}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/dashboard/attendance')}
              >
                <Link href="/dashboard/attendance">
                  <BarChart3 />
                  {t('attendance')}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#">
                  <Users />
                  {t('students')}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/dashboard/profile')}
              >
                <Link href="/dashboard/profile">
                  <User />
                  {t('profile')}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
