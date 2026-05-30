import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const InterviewAccordion = ({ questions }: { questions: string[] }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="bg-surface border rounded-xl p-6 shadow-sm">
      <h3 className="text-sm font-semibold mb-4">Predicted Interview Questions</h3>
      <div className="space-y-2">
        {questions.map((q, idx) => (
          <div key={idx} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full flex items-center justify-between p-4 bg-background hover:bg-accent/50 transition-colors text-left"
            >
              <span className="text-sm font-medium">Question {idx + 1}</span>
              <ChevronDown className={cn("w-4 h-4 transition-transform text-muted-foreground", openIdx === idx && "rotate-180")} />
            </button>
            {openIdx === idx && (
              <div className="p-4 pt-0 text-sm text-muted-foreground bg-background border-t">
                {q}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};