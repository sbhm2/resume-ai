import { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { Login } from '@/pages/auth/Login';
import { Signup } from '@/pages/auth/Signup';
import { GuestRoute } from './GuestRoutes';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardPage } from '@/pages/DashboardPage';
import { GuestDashboardPage } from '@/pages/GuestDashboardPage';
import { UnderConstruction } from '@/pages/UnderConstruction';
import { ResumeEditorPage } from '@/pages/ResumeEditor';
import { useAuth } from '@/providers/AuthProvider';

const ResumeAnalyzer = lazy(() =>
  import('@/pages/ResumeAnalyzer').then((module) => ({ default: module.ResumeAnalyzer }))
);

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Guest-only auth pages (standalone layout) */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* App shell: GuestDashboardLayout for guests, DashboardLayout for authenticated users */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardRouter />} />

        {/* Authenticated-only routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/analyzer" element={<ResumeAnalyzer />} />
          <Route path="/cover-letters" element={<UnderConstruction />} />
          <Route path="/interview" element={<UnderConstruction />} />
          <Route path="/applications" element={<UnderConstruction />} />
          <Route path="/settings" element={<UnderConstruction />} />
          <Route path="/resume-editor/:analysisId" element={<ResumeEditorPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const DashboardRouter = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <DashboardPage /> : <GuestDashboardPage />;
};
