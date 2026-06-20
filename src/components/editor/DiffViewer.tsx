import { cn } from '@/lib/utils';

interface DiffViewerProps {
  original: string;
  current: string;
  showDiff: boolean;
  className?: string;
}

export const DiffViewer = ({ original, current, showDiff, className }: DiffViewerProps) => {
  if (!showDiff || original === current) {
    return <span className={className}>{current}</span>;
  }

  // Simplified diff rendering (In prod, use the 'diff' npm package)
  // For demonstration, if texts differ, we show old crossed out, new highlighted
  return (
    <span className={cn("leading-relaxed", className)}>
      <span className="bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 line-through mr-2 px-1 rounded">
        {original}
      </span>
      <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 px-1 rounded font-medium">
        {current}
      </span>
    </span>
  );
};