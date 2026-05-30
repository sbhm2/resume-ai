import { Suspense } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Loader2, Sun, Moon, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navigation } from '@/routes/config';
import { useTheme } from '@/providers/theme-provider';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const PageLoader = () => (
  <div className="flex h-full w-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
  </div>
);

export const DashboardLayout = () => {
  const location = useLocation();
  const { setTheme } = useTheme();

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card px-4 py-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 px-2 mb-10">
            <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xl font-bold tracking-tight">Resume AI</span>
          </div>
          
          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const isActive = location.pathname.includes(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-500/20 shadow-sm" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Snippet */}
        <div className="flex items-center gap-3 px-3 py-3 border rounded-xl bg-card shadow-sm mt-8">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">RP</div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate">Rohit Patil</p>
            <p className="text-xs text-muted-foreground truncate">Free Plan</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950/50">
        <header className="h-16 border-b bg-card flex items-center px-8 justify-between shrink-0">
          <h2 className="text-lg font-semibold tracking-tight">
            Analyze Resume <Badge variant="secondary" className="ml-2 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20 font-normal">AI Powered</Badge>
          </h2>
          
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
              <span className="text-foreground">3 / 5</span> Analyses left today
            </div>
            
            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        <div className="p-8 flex-1 overflow-y-auto">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
};

// Simple Badge component defined inline for the layout header (if not using Shadcn Badge here)
const Badge = ({ children, className, ...props }: any) => (
  <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)} {...props}>{children}</span>
);