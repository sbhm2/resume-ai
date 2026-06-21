import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mail, Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { coverLetterService, CoverLetterItem } from '@/services/coverLetter.service';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { DocumentEditor } from '@/components/documents/DocumentEditor';

export const CoverLettersPage = () => {
  const queryClient = useQueryClient();
  const [editingLetter, setEditingLetter] = useState<CoverLetterItem | null>(null);

  const { data: coverLetters, isLoading } = useQuery({
    queryKey: ['coverLetters'],
    queryFn: coverLetterService.getAll,
  });

  const saveMutation = useMutation({
    mutationFn: ({ id, coverLetter }: { id: string; coverLetter: string }) =>
      coverLetterService.update(id, coverLetter),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coverLetters'] });
      toast.success('Cover letter saved');
      setEditingLetter(null);
    },
    onError: () => {
      toast.error('Failed to save cover letter');
    },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
          <Mail className="w-6 h-6 text-indigo-600" />
          Cover Letters
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          View, edit, and download your generated cover letters.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : !coverLetters?.length ? (
        <div className="text-center py-20 bg-card border rounded-xl shadow-sm">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold">No cover letters yet</h3>
          <p className="text-sm text-muted-foreground">
            Analyze a resume to generate your first cover letter.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {coverLetters.map((letter) => (
            <DocumentCard
              key={letter.id}
              id={letter.id}
              title={letter.resumeFileName}
              subtitle={`For: ${letter.jobDescription}`}
              createdAt={letter.createdAt}
              preview={letter.coverLetter}
              onEdit={() => setEditingLetter(letter)}
            />
          ))}
        </div>
      )}

      {/* Editor Sheet */}
      {editingLetter && (
        <DocumentEditor
          content={editingLetter.coverLetter}
          title={`Cover Letter — ${editingLetter.resumeFileName}`}
          downloadFilename={`Cover_Letter_${editingLetter.resumeFileName.replace(/\.[^.]+$/, '')}`}
          open={!!editingLetter}
          onOpenChange={(open) => !open && setEditingLetter(null)}
          onSave={(content) => saveMutation.mutate({ id: editingLetter.id, coverLetter: content })}
          isSaving={saveMutation.isPending}
          downloadFormats={['txt', 'html']}
        />
      )}
    </div>
  );
};
