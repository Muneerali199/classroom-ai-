import { cookies } from 'next/headers';
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import ModernHeader from '@/components/modern-header';
import DashboardAuthWrapper from '@/components/dashboard-auth-wrapper';
import UltraModernSidebar from '@/components/ultra-modern-sidebar';
import ChatbotMount from '@/components/chatbot-mount';
import { DashboardDataProvider } from '@/contexts/dashboard-data-context';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get sidebar state from cookies for persistence
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <DashboardAuthWrapper>
      <DashboardDataProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <UltraModernSidebar />
          <SidebarInset className="flex flex-1 flex-col bg-black relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
              <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
              <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Modern Header */}
            <ModernHeader />
            
            {/* Main content area with gradient overlay */}
            <main className="relative flex-1 overflow-auto">
              <div className="h-full w-full p-4 md:p-6 lg:p-8">
                {children}
              </div>
            </main>
            
            {/* Floating AI Chatbot */}
            <ChatbotMount />
          </SidebarInset>
        </SidebarProvider>
      </DashboardDataProvider>
    </DashboardAuthWrapper>
  );
}
