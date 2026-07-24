import { useAuth } from '@/providers/AuthProvider';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { GuestDashboardLayout } from '@/layouts/GuestDashboardLayout';
import { Footer } from '@/components/layout/Footer';
import { Loader2 } from 'lucide-react';

export const AppLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">
        {isAuthenticated ? <DashboardLayout /> : <GuestDashboardLayout />}
      </div>
      <Footer />
    </div>
  );
};
