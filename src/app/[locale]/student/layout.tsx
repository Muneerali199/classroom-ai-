"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Home, User, BookOpen, BarChart3, Hash, Bot, Calendar as CalendarIcon, Video, FileText } from 'lucide-react';
import Header from '@/components/header';
import { Logo } from '@/components/icons';
import { Link } from '@/routing';
import { useTranslations } from 'next-intl';
import DashboardAuthWrapper from '@/components/dashboard-auth-wrapper';
import ChatbotMount from '@/components/chatbot-mount';
import { usePathname } from 'next/navigation';

function StudentSidebar() {
  const t = useTranslations('StudentNav');
  const pathname = usePathname();
  return (
    <Sidebar className="neo-bg">
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
          <SidebarMenu className="px-2 space-y-2">
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname?.includes('/student/dashboard')}
                className="neo-surface hover:shadow-lg rounded-xl">
                <Link href="/student/dashboard">
                  <Home />
                  {t('dashboard')}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname?.includes('/student/pin-attendance')} className="neo-surface hover:shadow-lg rounded-xl">
                <Link href="/student/pin-attendance">
                  <Hash />
                  {t('markAttendance')}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname?.includes('/student/students')} className="neo-surface hover:shadow-lg rounded-xl">
                <Link href="/student/students">
                  <BookOpen />
                  {t('myCourses')}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname?.includes('/student/attendance')} className="neo-surface hover:shadow-lg rounded-xl">
                <Link href="/student/attendance">
                  <BarChart3 />
                  {t('myAttendance')}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname?.includes('/student/assignments')} className="neo-surface hover:shadow-lg rounded-xl">
                <Link href="/student/assignments">
                  <FileText />
                  {t('assignments')}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname?.includes('/student/timetable')} className="neo-surface hover:shadow-lg rounded-xl">
                <Link href="/student/timetable">
                  <CalendarIcon />
                  {t('timetable')}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname?.includes('/student/meetings')} className="neo-surface hover:shadow-lg rounded-xl">
                <Link href="/student/meetings">
                  <Video />
                  {t('meetings')}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname?.includes('/student/assistant')} className="neo-surface hover:shadow-lg rounded-xl">
                <Link href={'/student/assistant'}>
                  <Bot />
                  {t('assistant')}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname?.includes('/student/profile')} className="neo-surface hover:shadow-lg rounded-xl">
                <Link href="/student/profile">
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

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardAuthWrapper>
      <SidebarProvider>
        <StudentSidebar />
        <SidebarInset className="neo-bg min-h-screen">
          <Header />
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
          {/* Floating AI Chatbot for student dashboard */}
          <ChatbotMount />
        </SidebarInset>
      </SidebarProvider>
    </DashboardAuthWrapper>
  );
}
