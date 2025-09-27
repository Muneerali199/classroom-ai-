import { cookies } from 'next/headers';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import Header from '@/components/header';
import DashboardAuthWrapper from '@/components/dashboard-auth-wrapper';
import AppSidebar from '@/components/app-sidebar';
import ChatbotMount from '@/components/chatbot-mount';
import { Separator } from '@/components/ui/separator';

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
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset className="flex flex-1 flex-col bg-background">
          {/* Header with sidebar trigger */}
          <header className="flex h-16 shrink-0 items-center gap-2 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex-1">
              <Header />
            </div>
          </header>
          
          {/* Main content area that expands with sidebar */}
          <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="h-full w-full">
              {children}
            </div>
          </main>
          
          {/* Floating AI Chatbot available across dashboard */}
          <ChatbotMount />
        </SidebarInset>
      </SidebarProvider>
    </DashboardAuthWrapper>
  );
}
