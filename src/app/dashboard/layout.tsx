import React from 'react';

// This layout is needed to satisfy Next.js routing, but the actual UI is in [locale]/dashboard/layout.tsx.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
