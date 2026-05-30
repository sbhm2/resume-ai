import { Link } from 'react-router-dom';
import { Sun, Moon, LogOut, User as UserIcon, History, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/theme-provider';

export const TopNavbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { setTheme } = useTheme();

  return (
    <header className="h-16 border-b bg-card flex items-center px-8 justify-between shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold tracking-tight hidden md:block">
          ResumeAI
        </h2>
        {isAuthenticated && (
          <Badge variant="secondary" className="ml-2 text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 font-normal">
            Pro Plan
          </Badge>
        )}
      </div>
      
      <div className="flex items-center gap-4">
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

        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 border border-indigo-100 dark:border-indigo-800">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer flex items-center"><UserIcon className="mr-2 h-4 w-4" /> Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/history" className="cursor-pointer flex items-center"><History className="mr-2 h-4 w-4" /> Analysis History</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer focus:bg-red-50 dark:focus:bg-red-900/10 flex items-center">
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};