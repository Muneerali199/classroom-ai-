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
import { Home, Users, BookOpen, BarChart3 } from 'lucide-react';
import Header from '@/components/header';
import { Logo } from '@/components/icons';
import Link from 'next/link';
import DashboardAuthWrapper from '@/components/dashboard-auth-wrapper';
import AppSidebar from '@/components/app-sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardAuthWrapper>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </DashboardAuthWrapper>
  );
}
