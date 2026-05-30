import { cn } from '@/lib/utils';

export const ATSScoreCard = ({ score }: { score: number }) => {
  const isGood = score >= 71;
  const isAverage = score >= 41 && score <= 70;
  
  const colorClass = isGood ? 'text-green-500' : isAverage ? 'text-yellow-500' : 'text-red-500';
  const statusText = isGood ? 'Great Match' : isAverage ? 'Needs Improvement' : 'Poor Match';

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-surface border rounded-xl p-6 shadow-sm flex flex-col items-center justify-center h-full">
      <h3 className="text-sm font-semibold text-muted-foreground mb-6">ATS Match Score</h3>
      <div className="relative flex items-center justify-center">
        <svg className="transform -rotate-90 w-32 h-32">
          <circle cx="64" cy="64" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/30" />
          <circle 
            cx="64" cy="64" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" 
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={cn("transition-all duration-1000 ease-out", colorClass)}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-bold">{score}</span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>
      <p className={cn("mt-6 font-medium text-sm", colorClass)}>{statusText}</p>
    </div>
  );
};