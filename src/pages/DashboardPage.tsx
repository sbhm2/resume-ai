import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  FileText, TrendingUp, Activity, Calendar, ChevronRight, 
  Sparkles, Target, Award, AlertCircle 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import dayjs from 'dayjs';

interface RecentAnalysis {
  id: string;
  resumeFileName: string;
  atsScore: number;
  jobDescription: string;
  createdAt: string;
}

interface DashboardData {
  totalAnalyses: number;
  todayAnalyses: number;
  dailyUsageCount: number;
  dailyLimit: number;
  averageAtsScore: number;
  recentAnalyses: RecentAnalysis[];
}

interface DashboardResponse {
  success: boolean;
  data: DashboardData;
}

export const DashboardPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data } = await apiClient.get<DashboardResponse>('/analysis/dashboard');
      if (!data.success) throw new Error('Failed to fetch dashboard data');
      return data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 pb-10">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const stats = data;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-indigo-600" />
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Overview of your resume analysis activity and performance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Analyses */}
        <Card className="border-border/50 shadow-sm bg-card hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Analyses</p>
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{stats?.totalAnalyses ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Lifetime resume analyses</p>
          </CardContent>
        </Card>

        {/* Today's Analyses */}
        <Card className="border-border/50 shadow-sm bg-card hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Today</p>
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {stats?.dailyUsageCount ?? 0}
              <span className="text-lg font-normal text-muted-foreground"> / {stats?.dailyLimit ?? 5}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">Analyses used today</p>
          </CardContent>
        </Card>

        {/* Average ATS Score */}
        <Card className="border-border/50 shadow-sm bg-card hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Avg. ATS Score</p>
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{stats?.averageAtsScore ?? 0}%</p>
            <p className="text-xs text-muted-foreground mt-1">Across all analyses</p>
          </CardContent>
        </Card>

        {/* Quick Action */}
        <Card className="border-border/50 shadow-sm bg-gradient-to-br from-indigo-500 to-purple-600 hover:shadow-lg transition-shadow group">
          <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[120px]">
            <Button asChild size="lg" className="bg-white/20 hover:bg-white/30 text-white border border-white/30 shadow-lg backdrop-blur-sm">
              <Link to="/analyzer">
                <Sparkles className="w-4 h-4 mr-2" />
                New Analysis
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Analyses */}
      <Card className="border-border/50 shadow-sm bg-card">
        <CardHeader className="pb-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              Recent Analyses
            </CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground">
              <Link to="/history">
                View all <ChevronRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {!stats?.recentAnalyses?.length ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center px-4">
              <FileText className="w-10 h-10 text-muted-foreground opacity-40" />
              <div>
                <p className="font-semibold text-sm">No analyses yet</p>
                <p className="text-xs text-muted-foreground mt-1">Upload your first resume to get started.</p>
              </div>
              <Button asChild size="sm" className="mt-2 bg-indigo-600 hover:bg-indigo-700">
                <Link to="/analyzer">Analyze a Resume</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {stats.recentAnalyses.map((analysis) => (
                <div key={analysis.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors group">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                      analysis.atsScore >= 70 
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' 
                        : analysis.atsScore >= 40 
                          ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                          : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      <span className="text-sm font-bold">{analysis.atsScore}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{analysis.resumeFileName}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {dayjs(analysis.createdAt).format('MMM D, YYYY')}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    asChild
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-xs shrink-0"
                  >
                    <Link to={`/resume-editor/${analysis.id}`}>
                      Edit <ChevronRight className="w-3 h-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/50 shadow-sm bg-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20">
              <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Best ATS Score</p>
              <p className="text-lg font-bold">
                {stats?.recentAnalyses?.length 
                  ? Math.max(...stats.recentAnalyses.map(a => a.atsScore)) 
                  : '-'}%
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20">
              <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Analyses Today</p>
              <p className="text-lg font-bold">{stats?.todayAnalyses ?? 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm bg-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-full bg-amber-50 dark:bg-amber-900/20">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Daily Limit Remaining</p>
              <p className="text-lg font-bold">
                {stats ? Math.max(0, stats.dailyLimit - stats.dailyUsageCount) : '-'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};