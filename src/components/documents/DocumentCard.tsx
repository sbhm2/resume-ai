import { useState } from 'react';
import { Calendar, Mail, Pencil, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';

export interface DocumentCardProps {
  id: string;
  title: string;
  /** Secondary label, e.g. job description or file name */
  subtitle: string;
  /** Date the document was created */
  createdAt: string;
  /** Preview text shown in the collapsed state */
  preview: string;
  /** Called when the user clicks Edit */
  onEdit: () => void;
  /** Optional badge or action slot on the right */
  badge?: React.ReactNode;
}

export const DocumentCard = ({
  title,
  subtitle,
  createdAt,
  preview,
  onEdit,
  badge,
}: DocumentCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow group bg-card">
      <CardContent className="p-4 sm:p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 flex-shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold truncate">{title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{subtitle}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                <Calendar className="w-3 h-3" />
                {dayjs(createdAt).format('MMM D, YYYY')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {badge}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-indigo-600"
              onClick={onEdit}
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Expandable preview */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground whitespace-pre-wrap line-clamp-8 leading-relaxed">
              {preview}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
