import { Suspense } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Loader2, Sun, Moon, Sparkles, LogOut, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navigation } from '@/routes/config';
import { useTheme } from '@/providers/theme-provider';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator"
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"

const PageLoader = () => (
  <div className="flex h-full w-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
  </div>
);

// Simple Badge component defined inline for the layout header
const Badge = ({ children, className, ...props }: any) => (
  <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)} {...props}>{children}</span>
);

export const DashboardLayout = () => {
  const location = useLocation();
  const { setTheme } = useTheme();
  const { user, logout } = useAuth();

  // Fetch today's usage count from the dashboard API
  const { data: usageData } = useQuery({
    queryKey: ['dashboard-usage'],
    queryFn: async () => {
      const { data } = await apiClient.get('/analysis/dashboard');
      if (data.success) {
        return { used: data.data.dailyUsageCount, limit: data.data.dailyLimit };
      }
      return null;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const usageUsed = usageData?.used ?? 0;
  const usageLimit = usageData?.limit ?? 5;

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part.charAt(0))
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  const planLabel = user?.plan
    ? `${user.plan.charAt(0).toUpperCase()}${user.plan.slice(1)} Plan`
    : 'Free Plan';

  return (
    <SidebarProvider>
      {/* 1. The Sidebar Component */}
      <Sidebar variant="inset" className="border-r">
        
        {/* Sidebar Header: Logo */}
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link to="/dashboard">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-sidebar-primary-foreground">
                    <Sparkles className="size-4 text-white" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-bold text-base tracking-tight">Resume AI</span>
                    <span className="text-xs text-muted-foreground">Pro Workspace</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* Sidebar Content: Navigation */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation.map((item) => {
                  const isActive = location.pathname.includes(item.href);
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive}
                        // tooltip={item.name}
                        className={cn(
                          "transition-all duration-200 font-medium",
                          isActive && "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                        )}
                      >
                        <Link to={item.href}>
                          <item.icon className="size-4" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Sidebar Footer: User Profile */}
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold shrink-0">
                      {initials}
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none overflow-hidden flex-1 text-left">
                      <span className="font-semibold text-sm truncate">{user?.name ?? 'User'}</span>
                      <span className="text-xs text-muted-foreground truncate capitalize">{planLabel}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="top" 
                  align="end" 
                  sideOffset={4}
                >
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{user?.name ?? 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email ?? 'user@example.com'}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/profile">Profile Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout} 
                    className="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-900/10 dark:focus:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* 2. The Main Content Area wrapped in SidebarInset */}
      <SidebarInset className="bg-slate-50 dark:bg-slate-950/50">
        <header className="h-16 border-b bg-card flex items-center px-4 justify-between shrink-0 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-2">
            {/* Sidebar Toggle Button */}
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            
            <h2 className="text-lg font-semibold tracking-tight hidden sm:flex items-center">
              Analyze Resume 
              <Badge variant="secondary" className="ml-2 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20 font-normal">
                AI Powered
              </Badge>
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
              <span className="text-foreground">{usageUsed} / {usageLimit}</span> Analyses used today
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
        
        <div className="p-4 sm:p-8 flex-1 overflow-y-auto">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};