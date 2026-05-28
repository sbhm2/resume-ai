import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ResumeAnalyzer } from './pages/ResumeAnalyzer';
import React from 'react';

// Placeholders for other pages
const Placeholder = ({ title }: { title: string }) => <div className="text-xl font-semibold text-gray-400 mt-10">{title} Page Template</div>;
export const App = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          {/* Redirect root to dashboard for now */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Main Application Layout */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Placeholder title="Dashboard" />} />
            <Route path="/analyzer" element={<ResumeAnalyzer />} />
            <Route path="/cover-letters" element={<Placeholder title="Cover Letters" />} />
            <Route path="/interview" element={<Placeholder title="Interview Prep" />} />
            <Route path="/applications" element={<Placeholder title="Application Tracker" />} />
            <Route path="/settings" element={<Placeholder title="Settings" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
};