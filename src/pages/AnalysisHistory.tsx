import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, ChevronRight, Trash2, Loader2 } from 'lucide-react';
import dayjs from 'dayjs';

// Type for the history response
interface HistoryItem {
  id: string;
  fileName: string;
  atsScore: number;
  jobRole: string;
  createdAt: string;
}

export const AnalysisHistory = () => {
  // Replace this with your actual API endpoint later
  const { data: history, isLoading } = useQuery({
    queryKey: ['analysisHistory'],
    queryFn: async () => {
      // Mocking API delay and response
      return new Promise<HistoryItem[]>((resolve) => setTimeout(() => resolve([
        { id: '1', fileName: 'Rohit_Patil_Resume_v2.pdf', atsScore: 88, jobRole: 'Senior Frontend Engineer', createdAt: new Date().toISOString() },
        { id: '2', fileName: 'Rohit_Patil_Resume_v1.pdf', atsScore: 55, jobRole: 'React Developer', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
      ]), 1000));
    }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analysis History</h1>
        <p className="text-muted-foreground mt-1 text-sm">Review your past resume optimizations and ATS scores.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : history?.length === 0 ? (
        <div className="text-center py-20 bg-card border rounded-xl shadow-sm">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold">No analyses yet</h3>
          <p className="text-sm text-muted-foreground">Upload a resume to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history?.map((item) => (
            <Card key={item.id} className="border-border/50 shadow-sm hover:shadow-md transition-shadow group bg-card">
              <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl flex-shrink-0 ${item.atsScore >= 70 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'}`}>
                    <span className="text-xl font-bold">{item.atsScore}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base line-clamp-1">{item.fileName}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                      <span className="font-medium text-foreground">{item.jobRole}</span> • 
                      <Calendar className="w-3 h-3" /> {dayjs(item.createdAt).format('MMM D, YYYY')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button variant="secondary" className="flex-1 sm:flex-none w-full sm:w-auto bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300 dark:hover:bg-indigo-900/40">
                    View Report <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};