'use client';

import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from './ui/skeleton';

export default function DashboardAuthWrapper({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div>
          <Skeleton className="h-9 w-1/2" />
          <Skeleton className="mt-2 h-5 w-1/3" />
        </div>
        <Skeleton className="h-10 w-full max-w-lg" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!user) {
    return null; // The useAuth hook handles redirection
  }

	// If a specific role is required, ensure the user has it
	if (requiredRole && user?.user_metadata?.role !== requiredRole) {
		return null;
	}

	return <>{children}</>;
}
