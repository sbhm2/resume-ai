import { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Lock,
  AlertCircle,
  FileText,
  Lightbulb,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileUpload } from '@/components/analyzer/FileUpload';
import { SuggestionsList } from '@/components/analyzer/SuggestionsList';
import { BulletPointCard } from '@/components/analyzer/BulletPointCard';
import { InterviewAccordion } from '@/components/analyzer/InterviewAccordion';
import { CoverLetterCard } from '@/components/analyzer/CoverLetterCard';
import { LoadingOverlay, ErrorState } from '@/components/analyzer/States';
import { useAnalyzeResume } from '@/hooks/useAnalyzeResume';
import { cn } from '@/lib/utils';

const MIN_JD_LENGTH = 100;

const getScoreStatus = (score: number) => {
  if (score >= 71) {
    return { label: 'Great Match', color: 'text-emerald-500', arc: 'text-emerald-500' };
  }
  if (score >= 41) {
    return { label: 'Needs Improvement', color: 'text-amber-500', arc: 'text-amber-500' };
  }
  return { label: 'Poor Match', color: 'text-red-500', arc: 'text-red-500' };
};

export const ResumeAnalyzer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState('');
  const { mutate, data, isPending, isError, error, reset } = useAnalyzeResume();

  const analysis = data?.success ? data.data : null;
  const canAnalyze = Boolean(file) && jd.trim().length >= MIN_JD_LENGTH;

  const handleAnalyze = () => {
    if (!file || !canAnalyze) return;
    mutate({ file, jd: jd.trim() });
  };

  const handleReset = () => {
    reset();
    setFile(null);
    setJd('');
  };

  const scoreStatus = analysis ? getScoreStatus(analysis.atsScore) : null;
  const arcOffset = analysis ? 125 - (analysis.atsScore / 100) * 125 : 125;

  return (
    <div className="mx-auto flex w-full max-w-[1600px] min-h-0 flex-col gap-6 xl:grid xl:grid-cols-12 xl:gap-8">
      {/* LEFT: Inputs */}
      <div className="flex min-h-0 flex-col gap-6 xl:col-span-4">
        <Card className="border-border/50 bg-card shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">1. Upload Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload file={file} onFileChange={setFile} />
          </CardContent>
        </Card>

        <Card className="flex min-h-0 flex-col border-border/50 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base">2. Job Description</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setJd('')}
              disabled={!jd}
            >
              Clear
            </Button>
          </CardHeader>
          <CardContent className="flex min-h-0 flex-col gap-4">
            <textarea
              className={cn(
                'min-h-[220px] max-h-[320px] w-full resize-y rounded-xl border bg-slate-50 p-4 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:bg-slate-900',
                jd.length > 0 && jd.length < MIN_JD_LENGTH && 'border-amber-300 dark:border-amber-700'
              )}
              placeholder="Paste the job description here..."
              value={jd}
              onChange={(e) => setJd(e.target.value)}
            />
            <p
              className={cn(
                'text-xs',
                jd.length < MIN_JD_LENGTH ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'
              )}
            >
              {jd.length} / {MIN_JD_LENGTH} characters minimum
            </p>

            <Button
              className="group h-12 w-full bg-indigo-600 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700"
              onClick={handleAnalyze}
              disabled={!canAnalyze || isPending}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 animate-pulse" /> Analyzing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Analyze Resume
                  <ArrowRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" /> Your data is secure and private
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT: Results */}
      <div className="flex min-h-0 min-w-0 flex-col gap-6 xl:col-span-8">
        {isPending && <LoadingOverlay />}

        {isError && !isPending && (
          <ErrorState message={error.message} onRetry={reset} />
        )}

        {!isPending && !isError && !analysis && (
          <Card className="border-dashed border-border/60 bg-card/50 shadow-none">
            <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 rounded-full bg-indigo-50 p-4 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold">Ready to analyze</h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Upload your resume and paste a job description to get ATS score, keyword gaps,
                bullet rewrites, and a tailored cover letter.
              </p>
            </CardContent>
          </Card>
        )}

        {analysis && !isPending && (
          <>
            <Card className="border-border/50 bg-card shadow-sm">
              <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Overall ATS Score</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold tracking-tighter">{analysis.atsScore}</span>
                    <span className="text-xl text-muted-foreground">/ 100</span>
                  </div>
                  <p className={cn('mt-2 text-sm font-semibold', scoreStatus?.color)}>
                    {scoreStatus?.label}
                  </p>
                </div>

                <div className="relative mx-auto h-24 w-40 shrink-0 sm:mx-0">
                  <svg className="h-full w-full" viewBox="0 0 100 50" aria-hidden="true">
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-muted/20"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray="125"
                      strokeDashoffset={arcOffset}
                      className={cn('transition-all duration-1000', scoreStatus?.arc)}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div className="max-w-xs rounded-xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-800/50 dark:bg-indigo-900/20">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 rounded-md bg-indigo-100 p-1.5 text-indigo-600 dark:bg-indigo-800/50 dark:text-indigo-400">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        You&apos;re missing{' '}
                        <span className="font-bold text-indigo-700 dark:text-indigo-300">
                          {analysis.missingKeywords.length} important keywords
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Add these to improve your score
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="min-h-0 min-w-0 border-border/50 bg-card shadow-sm">
              <Tabs defaultValue="overview" className="flex min-h-0 w-full flex-col">
                <div className="shrink-0 overflow-x-auto border-b px-4 sm:px-6">
                  <TabsList className="h-auto w-max min-w-full justify-start gap-4 bg-transparent p-0 sm:gap-6">
                    {['overview', 'suggestions', 'bullets', 'skills', 'cover'].map((tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab}
                        className="rounded-none px-0 py-3 text-sm capitalize data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                      >
                        {tab === 'cover' ? 'Cover Letter' : tab}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <TabsContent value="overview" className="m-0 min-h-0 space-y-6 p-4 sm:p-6">
                  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {[
                      { label: 'Key Skills Missing', value: analysis.missingKeywords.length, tone: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/10' },
                      { label: 'Resume Suggestions', value: analysis.resumeSuggestions.length, tone: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
                      { label: 'Interview Questions', value: analysis.interviewQuestions.length, tone: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/10' },
                      { label: 'Recommended Skills', value: analysis.recommendedSkills.length, tone: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="flex min-w-0 items-center gap-3 rounded-xl border bg-slate-50/50 p-4 dark:bg-slate-900/20"
                      >
                        <div className={cn('shrink-0 rounded-lg p-2.5', stat.bg, stat.tone)}>
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="mb-1 truncate text-xs font-medium text-muted-foreground">
                            {stat.label}
                          </p>
                          <p className="text-xl font-bold">{stat.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="min-w-0 rounded-xl border bg-card p-5">
                      <div className="mb-4 flex items-center gap-2">
                        <h3 className="text-sm font-bold">Missing Keywords</h3>
                        <Badge variant="destructive" className="rounded-full px-2 py-0">
                          {analysis.missingKeywords.length}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {analysis.missingKeywords.map((kw) => (
                          <Badge
                            key={kw}
                            variant="secondary"
                            className="max-w-full truncate border-red-100 bg-red-50 font-normal text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400"
                          >
                            {kw}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="relative min-w-0 overflow-hidden rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-600 to-indigo-800 p-5 text-white shadow-md dark:border-indigo-800">
                      <Sparkles className="absolute right-4 top-4 h-20 w-20 opacity-20" />
                      <h3 className="relative z-10 mb-3 flex items-center gap-2 text-sm font-bold">
                        <Lightbulb className="h-4 w-4" /> AI Summary
                      </h3>
                      <p className="relative z-10 text-sm leading-relaxed text-indigo-50">
                        {analysis.resumeSuggestions[0] ??
                          'Review the suggestions tab for tailored improvements to strengthen your resume for this role.'}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="suggestions" className="m-0 min-h-0 p-4 sm:p-6">
                  <SuggestionsList suggestions={analysis.resumeSuggestions} />
                </TabsContent>

                <TabsContent value="bullets" className="m-0 min-h-0 space-y-6 p-4 sm:p-6">
                  <BulletPointCard bullets={analysis.improvedBulletPoints} />
                  <InterviewAccordion questions={analysis.interviewQuestions} />
                </TabsContent>

                <TabsContent value="skills" className="m-0 min-h-0 p-4 sm:p-6">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="min-w-0 rounded-xl border bg-card p-5">
                      <h3 className="mb-4 text-sm font-bold">Missing Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis.missingKeywords.map((kw) => (
                          <Badge key={kw} variant="secondary" className="font-normal">
                            {kw}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="min-w-0 rounded-xl border bg-card p-5">
                      <h3 className="mb-4 text-sm font-bold">Recommended Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis.recommendedSkills.map((skill) => (
                          <Badge key={skill} variant="outline" className="font-normal">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="cover" className="m-0 min-h-0 p-4 sm:p-6">
                  <CoverLetterCard content={analysis.coverLetter} />
                </TabsContent>
              </Tabs>
            </Card>

            <div className="flex justify-end">
              <Button variant="outline" onClick={handleReset}>
                Analyze New Job
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
