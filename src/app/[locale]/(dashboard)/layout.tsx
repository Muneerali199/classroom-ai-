import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import Header from '@/components/header';
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
