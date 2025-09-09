import {
  CalendarCheck2,
  LayoutDashboard,
  Users,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';

import { students } from '@/lib/data';

import DashboardClient from '@/components/dashboard-client';
import Header from '@/components/header';
import { Logo } from '@/components/icons';

export default function Home() {
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
              <SidebarMenuButton tooltip="Dashboard" isActive>
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Students">
                <Users />
                <span>Students</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Attendance">
                <CalendarCheck2 />
                <span>Attendance</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex min-h-svh flex-col">
          <Header />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <DashboardClient initialStudents={students} />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
