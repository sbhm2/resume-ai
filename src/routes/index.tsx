import { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Login } from '@/pages/auth/Login';
import { Signup } from '@/pages/auth/Signup';
import { GuestRoute } from './GuestRoutes';
import { ProtectedRoute } from './ProtectedRoute';
import { PremiumBlur } from '@/components/dashboard/PremiumBlur';
import { DetailedAnalysisCard } from '@/components/dashboard/DetailedAnalysis';
import { dummyAnalysisData } from '@/services/dummyData';

// Lazy load pages. 
// Note: Since we used named exports (export const ResumeAnalyzer), we map it to 'default' for React.lazy.
const ResumeAnalyzer = lazy(() => 
  import('@/pages/ResumeAnalyzer').then(module => ({ default: module.ResumeAnalyzer }))
);

// Placeholder component for pages we haven't built yet
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex h-[50vh] items-center justify-center">
    <h2 className="text-xl font-semibold text-muted-foreground">{title} Page Template</h2>
    <div className="space-y-4">
  <h2 className="text-xl font-semibold tracking-tight">Recent Premium Insights</h2>
  
  {/* The Wrapper in Action */}
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
      
      {/* Main App Layout */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Placeholder title="Dashboard" />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/analyzer" element={ <ResumeAnalyzer />} />
          <Route path="/cover-letters" element={<Placeholder title="Cover Letters" />} />
          <Route path="/interview" element={<Placeholder title="Interview Prep" />} />
          <Route path="/applications" element={<Placeholder title="Applications" />} />
          <Route path="/settings" element={<Placeholder title="Settings" />} />
        </Route>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};