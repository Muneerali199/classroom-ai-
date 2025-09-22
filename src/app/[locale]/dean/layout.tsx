
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
import { Home, User, Users, Settings, School, Bot } from 'lucide-react';
import Header from '@/components/header';
import { Logo } from '@/components/icons';
import { Link } from '@/routing';
import DashboardAuthWrapper from '@/components/dashboard-auth-wrapper';
import ChatbotMount from '@/components/chatbot-mount';

function DeanSidebar() {
  return (
    <Sidebar className="neo-bg">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Logo className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            EduTrack Dean
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="px-2 space-y-2">
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive className="neo-surface hover:shadow-lg rounded-xl">
                <Link href="/dean/dashboard">
                  <Home />
                  Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="neo-surface hover:shadow-lg rounded-xl">
                <Link href="#">
                  <Users />
                  User Management
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton className="neo-surface hover:shadow-lg rounded-xl">
                <School />
                Course Management
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton className="neo-surface hover:shadow-lg rounded-xl">
                <Settings />
                System Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="neo-surface hover:shadow-lg rounded-xl">
                <Link href={'/dashboard/assistant'}>
                  <Bot />
                  AI Assistant
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="neo-surface hover:shadow-lg rounded-xl">
                <Link href="/dashboard/profile">
                  <User />
                  Profile
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function DeanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardAuthWrapper>
      <SidebarProvider>
        <DeanSidebar />
        <SidebarInset className="neo-bg min-h-screen">
          <Header />
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
          {/* Floating AI Chatbot for dean dashboard */}
          <ChatbotMount />
        </SidebarInset>
      </SidebarProvider>
    </DashboardAuthWrapper>
  );
}
