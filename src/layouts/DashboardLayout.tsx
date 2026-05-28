import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Mail, MessageSquare, Briefcase, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Resume Analyzer', href: '/analyzer', icon: FileText },
  { name: 'Cover Letters', href: '/cover-letters', icon: Mail },
  { name: 'Interview Prep', href: '/interview', icon: MessageSquare },
  { name: 'Applications', href: '/applications', icon: Briefcase },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const DashboardLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-surface px-4 py-6 flex flex-col">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">R</span>
          </div>
          <span className="text-xl font-semibold tracking-tight">ResumeAI</span>
        </div>
        
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname.includes(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive ? "bg-gray-100 text-primary" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-border bg-surface flex items-center px-8 justify-between sticky top-0 z-10">
          <h2 className="text-sm font-medium text-gray-500">Workspace / {location.pathname.split('/')[1]}</h2>
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </header>
        <div className="p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};