import { Lightbulb } from 'lucide-react';

export const SuggestionsList = ({ suggestions }: { suggestions: string[] }) => (
  <div className="bg-surface border rounded-xl p-6 shadow-sm">
    <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
      <Lightbulb className="w-4 h-4 text-yellow-500" /> Actionable Suggestions
    </h3>
    <div className="grid gap-3">
      {suggestions.map((suggestion, idx) => (
        <div key={idx} className="flex gap-3 items-start p-4 bg-accent/30 rounded-lg border">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-background border text-xs font-bold text-muted-foreground shrink-0 mt-0.5">
            {idx + 1}
          </span>
          <p className="text-sm leading-relaxed">{suggestion}</p>
        </div>
      ))}
    </div>
  </div>
);