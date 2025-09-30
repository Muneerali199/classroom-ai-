import { cookies } from 'next/headers';
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import ModernHeader from '@/components/modern-header';
import DashboardAuthWrapper from '@/components/dashboard-auth-wrapper';
import UltraModernStudentSidebar from '@/components/ultra-modern-student-sidebar';
import ChatbotMount from '@/components/chatbot-mount';
import { DashboardDataProvider } from '@/contexts/dashboard-data-context';

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';

  return (
    <DashboardAuthWrapper>
      <DashboardDataProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <UltraModernStudentSidebar />
          <SidebarInset className="flex flex-1 flex-col bg-black relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
              <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
              <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            <ModernHeader />
            <div className="flex-1 overflow-y-auto relative z-10">
              <main className="p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
            <ChatbotMount />
          </SidebarInset>
        </SidebarProvider>
      </DashboardDataProvider>
    </DashboardAuthWrapper>
  );
}
