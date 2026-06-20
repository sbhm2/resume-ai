import { Construction, Sparkles, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { navigation } from '@/routes/config';

export const UnderConstruction = () => {
  const location = useLocation();
  const currentRoute = navigation.find(n => location.pathname.startsWith(n.href));

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="max-w-lg w-full border-border/50 shadow-lg bg-card overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        <CardContent className="flex flex-col items-center gap-6 p-10 text-center">
          <div className="relative">
            <div className="rounded-full bg-amber-50 dark:bg-amber-900/20 p-5 border border-amber-200 dark:border-amber-800/30">
              <Construction className="w-12 h-12 text-amber-500" />
            </div>
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              {currentRoute?.name || 'Page'}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              This feature is currently under development. We're working hard to bring you an 
              amazing experience. Stay tuned for updates!
            </p>
          </div>

          <div className="flex items-center gap-2 w-full pt-2">
            <Button variant="outline" asChild className="flex-1">
              <Link to="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <Button variant="ghost" asChild className="flex-1">
              <Link to="/analyzer">
                Analyze Resume
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};