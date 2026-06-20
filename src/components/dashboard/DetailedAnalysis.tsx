import { Sparkles, TrendingUp, Target, Award, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface DetailedAnalysisData {
  parseRate: number;
  matchScore: number;
  industryRank: string;
  topKeywords: string[];
  missingKeywords: string[];
  premiumInsights: string;
}

export const DetailedAnalysisCard = ({ data }: { data: DetailedAnalysisData }) => {
  return (
    <Card className="border-indigo-100 dark:border-indigo-900/50 shadow-md bg-card overflow-hidden">
      <CardHeader className="pb-4 border-b bg-indigo-50/50 dark:bg-indigo-900/10">
        <CardTitle className="text-lg flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
          <Sparkles className="w-5 h-5" />
          Premium Deep-Dive Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        
        {/* Metric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-500" /> ATS Parse Rate
            </p>
            <p className="text-3xl font-bold text-foreground">{data.parseRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">Excellent readability</p>
          </div>
          
          <div className="space-y-1.5 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50">
            <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> Match Score
            </p>
            <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">{data.matchScore}%</p>
            <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70 mt-1">Strong candidate profile</p>
          </div>
          
          <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" /> Industry Rank
            </p>
            <p className="text-3xl font-bold text-foreground">{data.industryRank}</p>
            <p className="text-xs text-muted-foreground mt-1">Compared to 10k+ applicants</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Matched Keywords */}
          <div>
            <p className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" /> High-Impact Keywords Found
            </p>
            <div className="flex flex-wrap gap-2">
              {data.topKeywords.map((kw) => (
                <Badge key={kw} variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 font-medium">
                  {kw}
                </Badge>
              ))}
            </div>
          </div>

          {/* Missing Keywords */}
          <div>
            <p className="text-sm font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" /> Critical Keywords Missing
            </p>
            <div className="flex flex-wrap gap-2">
              {data.missingKeywords.map((kw) => (
                <Badge key={kw} variant="outline" className="text-rose-600 border-rose-200 dark:text-rose-400 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-900/10 font-medium">
                  {kw}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-5 rounded-xl border border-indigo-100 dark:border-indigo-900/50 text-sm leading-relaxed text-foreground shadow-inner">
          <div className="flex gap-3">
            <div className="mt-0.5">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="font-semibold text-indigo-900 dark:text-indigo-200 mb-1">AI Recruiter Note</p>
              <p className="text-muted-foreground">{data.premiumInsights}</p>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};