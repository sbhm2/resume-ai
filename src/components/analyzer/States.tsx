import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center py-16 bg-destructive/5 border border-destructive/20 rounded-xl text-center">
    <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
    <h3 className="text-lg font-semibold text-destructive mb-2">Analysis Failed</h3>
    <p className="text-sm text-muted-foreground max-w-sm mb-6">{message}</p>
    <Button variant="outline" onClick={onRetry}>Try Again</Button>
  </div>
);
