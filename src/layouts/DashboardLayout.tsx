import { Suspense } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Loader2, Sparkles, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navigation } from '@/routes/config';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator"
import { useDashboardQuery } from '@/hooks/useDashboardQuery';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu"
import { ShellHeader } from "@/components/layout/ShellHeader"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
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

// Header component that uses useSidebar() — must be rendered inside SidebarProvider
const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const { state: sidebarState } = useSidebar();

  const { data: dashboardData } = useDashboardQuery();

  const usageUsed = dashboardData?.dailyUsageCount ?? 0;
  const usageLimit = dashboardData?.dailyLimit ?? 5;

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

  const left = (
    <>
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2" />
      
      {sidebarState === 'collapsed' ? (
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex aspect-square size-7 items-center justify-center rounded-lg bg-indigo-600">
            <Sparkles className="size-3.5 text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight">NextOffer</span>
        </Link>
      ) : (
        <h2 className="text-lg font-semibold tracking-tight hidden sm:flex items-center">
          Analyze Resume 
          <Badge variant="secondary" className="ml-2 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20 font-normal">
            AI Powered
          </Badge>
        </h2>
      )}
    </>
  );

  const right = (
    <>
      <div className="hidden sm:block text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
        <span className="text-foreground">{usageUsed} / {usageLimit}</span> Analyses used today
      </div>

      {/* User Avatar Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
            <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold">
              {initials}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 rounded-lg" align="end" sideOffset={4}>
          <div className="flex flex-col space-y-1 p-2">
            <p className="text-sm font-medium leading-none">{user?.name ?? 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email ?? 'user@example.com'}</p>
            <p className="text-xs leading-none text-muted-foreground capitalize pt-1">{planLabel}</p>
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
    </>
  );

  return <ShellHeader left={left} right={right} />;
};

export const DashboardLayout = () => {
  const location = useLocation();

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
                    <span className="font-bold text-base tracking-tight">NextOffer</span>
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

        {/* Sidebar Footer: empty for clean collapsed state */}
      </Sidebar>

      {/* 2. The Main Content Area wrapped in SidebarInset */}
      <SidebarInset className="bg-slate-50 dark:bg-slate-950/50">
        <DashboardHeader />
        
        <div className="p-4 sm:p-8 flex-1 overflow-y-auto">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
