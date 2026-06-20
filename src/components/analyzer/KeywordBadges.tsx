export const KeywordBadges = ({ keywords, title }: { keywords: string[], title: string }) => (
    <div className="bg-surface border rounded-xl p-6 shadow-sm">
      <h3 className="text-sm font-semibold mb-4">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {keywords.map((kw, i) => (
          <span key={i} className="px-3 py-1 bg-accent/50 text-foreground text-xs font-medium rounded-full border">
            {kw}
          </span>
        ))}
      </div>
    </div>
  );