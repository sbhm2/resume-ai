import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';

export const GuestRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
};