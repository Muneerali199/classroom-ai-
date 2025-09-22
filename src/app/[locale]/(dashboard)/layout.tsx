import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import Header from '@/components/header';
import DashboardAuthWrapper from '@/components/dashboard-auth-wrapper';
import AppSidebar from '@/components/app-sidebar';
import ChatbotMount from '@/components/chatbot-mount';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardAuthWrapper>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="neo-bg min-h-screen">
          <Header />
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
          {/* Floating AI Chatbot available across dashboard */}
          <ChatbotMount />
        </SidebarInset>
      </SidebarProvider>
    </DashboardAuthWrapper>
  );
}
