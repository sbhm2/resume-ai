import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Edit2, ArrowRight, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Suggestion } from '@/types/editor.types';
import { cn } from '@/lib/utils';

interface Props {
  suggestion: Suggestion;
  isActive: boolean;
  onAccept: (id: string, editedText?: string) => void;
  onReject: (id: string) => void;
  onClick: () => void;
}

const TYPE_COLORS: Record<string, { badge: string; accent: string; label: string }> = {
  summary: { 
    badge: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400', 
    accent: 'border-l-blue-400',
    label: 'Summary'
  },
  bullet: { 
    badge: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400', 
    accent: 'border-l-violet-400',
    label: 'Bullet'
  },
  skill: { 
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400', 
    accent: 'border-l-emerald-400',
    label: 'Skill'
  },
  keyword: { 
    badge: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400', 
    accent: 'border-l-amber-400',
    label: 'Keyword'
  },
};

export const SuggestionCard = ({ suggestion, isActive, onAccept, onReject, onClick }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(suggestion.suggested);

  const colors = TYPE_COLORS[suggestion.type] || TYPE_COLORS.summary;

  const statusColors = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400',
    accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400',
    rejected: 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400',
  };

  return (
    <motion.div
      layout
      onClick={onClick}
      className={cn(
        "p-4 rounded-xl border transition-all cursor-pointer shadow-sm relative overflow-hidden border-l-4",
        colors.accent,
        isActive ? "border-indigo-500 shadow-md bg-indigo-50/30 dark:bg-indigo-900/10 ring-1 ring-indigo-500" : "border-border bg-card hover:border-indigo-300",
        suggestion.status !== 'pending' && "opacity-70"
      )}
    >
      {/* Section label badge */}
      {suggestion.sectionLabel && (
        <div className="flex items-center gap-1.5 mb-2.5">
          <Target className="w-3 h-3 text-muted-foreground" />
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
            {suggestion.sectionLabel}
          </span>
        </div>
      )}

      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn("text-[10px] font-semibold px-2 py-0", colors.badge)}>
            {colors.label}
          </Badge>
          <h4 className="font-semibold text-sm">{suggestion.title}</h4>
        </div>
        <Badge variant="outline" className={cn("text-[10px]", statusColors[suggestion.status])}>
          {suggestion.status === 'pending' ? 'Ready' : suggestion.status}
        </Badge>
      </div>

      <div className="space-y-3 text-sm">
        {/* Original — only show when there's actual original content */}
        {suggestion.original && suggestion.original !== suggestion.suggested && (
          <div className="bg-red-50/50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-red-500 block mb-1">Current</span>
            <span className="text-red-700 dark:text-red-300 line-through decoration-red-300/50">
              {suggestion.original}
            </span>
          </div>
        )}
        
        {/* Suggested / Improved */}
        {isEditing ? (
          <Textarea 
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="min-h-[80px] bg-emerald-50/30 border-emerald-200 focus-visible:ring-emerald-500"
            autoFocus
          />
        ) : (
          <div className={cn(
            "p-3 rounded-lg border relative group",
            suggestion.original && suggestion.original !== suggestion.suggested
              ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30"
              : "bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30"
          )}>
            {suggestion.original && suggestion.original !== suggestion.suggested && (
              <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 block mb-1">
                <ArrowRight className="w-3 h-3 inline mr-1" />Improved
              </span>
            )}
            {!suggestion.original && (
              <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400 block mb-1">New</span>
            )}
            <span className={cn(
              suggestion.original && suggestion.original !== suggestion.suggested
                ? "text-emerald-800 dark:text-emerald-300 font-medium"
                : "text-amber-800 dark:text-amber-300 font-medium"
            )}>
              {suggestion.suggested}
            </span>
            {suggestion.status === 'pending' && (
              <button 
                onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                className="absolute top-2 right-2 p-1.5 bg-white dark:bg-slate-800 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Preview of what will change */}
        {suggestion.status === 'pending' && suggestion.original && suggestion.original !== suggestion.suggested && (
          <div className="px-1">
            <span className="text-[10px] text-muted-foreground italic">
              Accepting will replace the original text with the improved version above
            </span>
          </div>
        )}
      </div>

      {suggestion.status === 'pending' && (
        <div className="flex gap-2 mt-4">
          <Button 
            size="sm" 
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            onClick={(e) => { e.stopPropagation(); onAccept(suggestion.id, isEditing ? editedText : undefined); setIsEditing(false); }}
          >
            <Check className="w-4 h-4 mr-1.5" /> Accept {isActive && <span className="opacity-60 text-[10px] ml-1 border rounded px-1">A</span>}
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="flex-1 hover:bg-red-50 hover:text-red-600 border-border"
            onClick={(e) => { e.stopPropagation(); onReject(suggestion.id); }}
          >
            <X className="w-4 h-4 mr-1.5" /> Reject {isActive && <span className="opacity-60 text-[10px] ml-1 border rounded px-1">R</span>}
          </Button>
        </div>
      )}
    </motion.div>
  );
};