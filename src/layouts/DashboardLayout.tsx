import { Suspense } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navigation } from '@/routes/config';

// The loading fallback shown while lazy-loaded chunks are being fetched
const PageLoader = () => (
  <div className="flex h-[60vh] w-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
  </div>
);

export const DashboardLayout = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-surface px-4 py-6 flex flex-col">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">R</span>
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
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-secondary text-secondary-foreground" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b bg-surface flex items-center px-8 justify-between sticky top-0 z-10">
          <h2 className="text-sm font-medium text-muted-foreground capitalize">
            Workspace / {location.pathname.split('/')[1] || 'Dashboard'}
          </h2>
          <div className="w-8 h-8 bg-secondary rounded-full border"></div>
        </header>
        
        <div className="p-8 max-w-6xl mx-auto">
          {/* Suspense boundary catches the lazy-loading fallback */}
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
};