import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const LoadingOverlay = () => (
  <div className="flex flex-col items-center justify-center py-24 bg-surface border rounded-xl shadow-sm text-center">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-accent rounded-full"></div>
      <div className="w-16 h-16 border-4 border-primary rounded-full absolute top-0 left-0 border-t-transparent animate-spin"></div>
    </div>
    <h3 className="text-lg font-semibold mt-6">Analyzing your resume...</h3>
    <p className="text-sm text-muted-foreground mt-2 max-w-sm">
      Our AI is comparing your resume against the job description to generate personalized insights.
    </p>
  </div>
);

export const ErrorState = ({ message, onRetry }: { message: string, onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center py-16 bg-destructive/5 border border-destructive/20 rounded-xl text-center">
    <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
    <h3 className="text-lg font-semibold text-destructive mb-2">Analysis Failed</h3>
    <p className="text-sm text-muted-foreground max-w-sm mb-6">{message}</p>
    <Button variant="outline" onClick={onRetry}>Try Again</Button>
  </div>
);