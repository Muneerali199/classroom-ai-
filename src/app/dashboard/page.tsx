import DashboardPage from '@/app/[locale]/dashboard/page';

// This component is a workaround to make the dashboard available at /dashboard
// without being affected by the locale middleware.
export default function UnlocalizedDashboardPage() {
  return <DashboardPage />;
}
