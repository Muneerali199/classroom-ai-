'use client';

import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import Header from '@/components/header';
import DashboardAuthWrapper from '@/components/dashboard-auth-wrapper';
import AppSidebar from '@/components/app-sidebar';

const getNeumorphicStyle = (pressed = false, inset = false, size = 'normal') => {
  const shadowSize = size === 'large' ? '12px' : size === 'small' ? '4px' : '8px';
  const shadowBlur = size === 'large' ? '24px' : size === 'small' ? '8px' : '16px';
  
  return {
    background: pressed || inset ? 
      'linear-gradient(145deg, #d0d0d0, #f0f0f0)' : 
      'linear-gradient(145deg, #f0f0f0, #d0d0d0)',
    boxShadow: pressed || inset ?
      `inset ${shadowSize} ${shadowSize} ${shadowBlur} #bebebe, inset -${shadowSize} -${shadowSize} ${shadowBlur} #ffffff` :
      `${shadowSize} ${shadowSize} ${shadowBlur} #bebebe, -${shadowSize} -${shadowSize} ${shadowBlur} #ffffff`
  };
};

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
          <main 
            className="min-h-screen p-4 sm:p-6 lg:p-8"
            style={{ 
              background: 'linear-gradient(135deg, #e3e3e3 0%, #f7f7f7 50%, #e8e8e8 100%)',
              minHeight: '100vh'
            }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-20 left-20 w-40 h-40 rounded-full" style={getNeumorphicStyle(false, true, 'small')}></div>
              <div className="absolute top-1/3 right-32 w-32 h-32 rounded-full" style={getNeumorphicStyle(false, false, 'small')}></div>
              <div className="absolute bottom-40 left-1/4 w-48 h-48 rounded-full" style={getNeumorphicStyle(false, true, 'small')}></div>
              <div className="absolute bottom-1/3 right-20 w-36 h-36 rounded-full" style={getNeumorphicStyle(false, false, 'small')}></div>
            </div>
            
            <div className="relative z-10">
              {children}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </DashboardAuthWrapper>
  );
}