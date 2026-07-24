import { useAuth } from '@/providers/AuthProvider';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';

export const PremiumBlur = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <>{children}</>;

  return (
    <div className="relative group rounded-xl overflow-hidden">
      {/* Blurred Content */}
      <div className="filter blur-md opacity-50 select-none pointer-events-none transition-all duration-300">
        {children}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/20 backdrop-blur-[2px]">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default" className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20">
              <Lock className="w-4 h-4 mr-2" /> Unlock Full Analysis
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Unlock NextOffer Premium</DialogTitle>
              <DialogDescription>
                Create a free account to access detailed ATS scoring, missing keywords, and AI-powered bullet point rewriting.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 mt-4">
              <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700">
                <Link to="/signup">Create Free Account</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};