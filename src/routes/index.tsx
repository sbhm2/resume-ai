import { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { Login } from '@/pages/auth/Login';
import { Signup } from '@/pages/auth/Signup';
import { GuestRoute } from './GuestRoutes';
import { ProtectedRoute } from './ProtectedRoute';
import { PremiumBlur } from '@/components/dashboard/PremiumBlur';
import { DetailedAnalysisCard } from '@/components/dashboard/DetailedAnalysis';
import { dummyAnalysisData } from '@/services/dummyData';

const ResumeAnalyzer = lazy(() =>
  import('@/pages/ResumeAnalyzer').then((module) => ({ default: module.ResumeAnalyzer }))
);

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex h-[50vh] items-center justify-center">
    {/* <h2 className="text-xl font-semibold text-muted-foreground">{title} Page Template</h2> */}
    <div className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight">Recent Premium Insights</h2>
      <PremiumBlur>
        <DetailedAnalysisCard data={dummyAnalysisData} />
      </PremiumBlur>
    </div>
  </div>
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
        <Route path="/dashboard" element={<Placeholder title="Dashboard" />} />

        {/* Authenticated-only routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/analyzer" element={<ResumeAnalyzer />} />
          <Route path="/cover-letters" element={<Placeholder title="Cover Letters" />} />
          <Route path="/interview" element={<Placeholder title="Interview Prep" />} />
          <Route path="/applications" element={<Placeholder title="Applications" />} />
          <Route path="/settings" element={<Placeholder title="Settings" />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
