import { Suspense } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Loader2, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navigation } from '@/routes/config';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShellHeader } from '@/components/layout/ShellHeader';
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
  useSidebar,
} from '@/components/ui/sidebar';

const PageLoader = () => (
  <div className="flex h-full w-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
  </div>
);

// Header component that uses useSidebar() — must be rendered inside SidebarProvider
const GuestHeader = () => {
  const { state: sidebarState } = useSidebar();

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
          NextOffer
        </h2>
      )}
    </>
  );

  const right = (
    <>
      {/* Auth buttons in header — always visible */}
      <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
        <Link to="/login">Log in</Link>
      </Button>
      <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700">
        <Link to="/signup">Get Started</Link>
      </Button>
    </>
  );

  return <ShellHeader left={left} right={right} />;
};

export const GuestDashboardLayout = () => {
  const location = useLocation();

  return (
    <SidebarProvider>
      {/* Sidebar */}
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
                    <span className="text-xs text-muted-foreground">Guest</span>
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
                          'transition-all duration-200 font-medium',
                          isActive && 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300'
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

        {/* Sidebar Footer: Sign-in prompt (collapsed sidebar shows only icon) */}
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="text-muted-foreground">
                <Link to="/login">
                  <LogIn className="size-4" />
                  <span>Log in</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/signup">
                  <UserPlus className="size-4" />
                  <span>Sign up</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content Area */}
      <SidebarInset className="bg-slate-50 dark:bg-slate-950/50">
        <GuestHeader />

        <div className="p-4 sm:p-8 flex-1 overflow-y-auto">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
