import { ReactNode } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/providers/theme-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ShellHeaderProps {
  /** Content rendered on the left side of the header (before theme toggle) */
  left?: ReactNode;
  /** Content rendered on the right side of the header (before theme toggle) */
  right?: ReactNode;
  /** Additional className for the header element */
  className?: string;
}

/**
 * Reusable header shell with a sticky top bar, border, and built-in theme toggle.
 * Pass `left` and `right` slots for layout-specific content.
 * Must be rendered inside a SidebarProvider if using SidebarTrigger in the slots.
 */
export const ShellHeader = ({ left, right, className }: ShellHeaderProps) => {
  const { setTheme } = useTheme();

  return (
    <header
      className={`h-16 border-b bg-card flex items-center px-4 justify-between shrink-0 sticky top-0 z-10 shadow-sm ${className ?? ''}`}
    >
      <div className="flex items-center gap-2">{left}</div>

      <div className="flex items-center gap-3">
        {right}

        {/* Theme Toggle — always present */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
