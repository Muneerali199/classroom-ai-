import {
  CalendarCheck2,
  LayoutDashboard,
  Users,
  User,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarHeader,
} from '@/components/ui/sidebar';

import Header from '@/components/header';
import { Logo } from '@/components/icons';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('DashboardNav');
  
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
                <Logo className="size-8 text-primary" />
                <span className="text-xl font-bold font-headline">EduTrack</span>
            </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={t('dashboard')} asChild isActive>
                <Link href="/dashboard">
                  <LayoutDashboard />
                  <span>{t('dashboard')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={t('profile')} asChild>
                <Link href="/dashboard/profile">
                 <User />
                 <span>{t('profile')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={t('students')}>
                <Users />
                <span>{t('students')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={t('attendance')}>
                <CalendarCheck2 />
                <span>{t('attendance')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <main className="flex min-h-svh flex-col md:pl-[var(--sidebar-width-icon)] bg-secondary dark:bg-gradient-to-br dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        <Header />
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
