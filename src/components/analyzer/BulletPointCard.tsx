import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export const BulletPointCard = ({ bullets }: { bullets: string[] }) => {
  const [copied, setCopied] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-surface border rounded-xl p-6 shadow-sm">
      <h3 className="text-sm font-semibold mb-4">AI Improved Bullet Points</h3>
      <div className="space-y-3">
        {bullets.map((bullet, idx) => (
          <div key={idx} className="group relative p-4 pr-12 bg-accent/30 rounded-lg border transition-colors hover:bg-accent/50 text-sm">
            {bullet}
            <button 
              onClick={() => handleCopy(bullet, idx)}
              className="absolute right-3 top-3 p-1.5 rounded-md hover:bg-background border shadow-sm opacity-0 group-hover:opacity-100 transition-all text-muted-foreground"
              title="Copy bullet"
            >
              {copied === idx ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};