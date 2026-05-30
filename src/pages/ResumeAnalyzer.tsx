import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FileUpload } from '@/components/analyzer/FileUpload';
import { ATSScoreCard } from '@/components/analyzer/ATSScoreCard';
import { KeywordBadges } from '@/components/analyzer/KeywordBadges';
import { BulletPointCard } from '@/components/analyzer/BulletPointCard';
import { CoverLetterCard } from '@/components/analyzer/CoverLetterCard';
import { LoadingOverlay, ErrorState } from '@/components/analyzer/States';
import { useAnalyzeResume } from '@/hooks/useAnalyzeResume';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SuggestionsList } from '@/components/analyzer/SuggestionsList';
import { InterviewAccordion } from '@/components/analyzer/InterviewAccordion';

interface JDForm {
  jobDescription: string;
}

export const ResumeAnalyzer = () => {
  const [file, setFile] = useState<File | null>(null);
  const { register, watch, handleSubmit, formState: { errors } } = useForm<JDForm>();
  const { mutate, data, isPending, isError, error, reset } = useAnalyzeResume();

  const jdValue = watch('jobDescription', '');

  const onSubmit = (formData: JDForm) => {
    if (!file) return;
    mutate({ file, jd: formData.jobDescription });
  };

  const isFormValid = file !== null && jdValue.length >= 100;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Resume Analyzer</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Tailor your resume instantly to beat the ATS and land interviews.
        </p>
      </div>

      {!data && !isPending && !isError && (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FileUpload file={file} onFileChange={setFile} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Job Description</h3>
              <span className={cn("text-xs", jdValue.length < 100 ? "text-destructive" : "text-muted-foreground")}>
                {jdValue.length} / 100 chars
              </span>
            </div>
            <textarea
              {...register('jobDescription', { 
                required: 'Job description is required',
                minLength: { value: 100, message: 'Minimum 100 characters required for accurate analysis' }
              })}
              placeholder="Paste the target job description here..."
              className={cn(
                "w-full h-64 p-4 text-sm bg-background border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20",
                errors.jobDescription ? "border-destructive focus:ring-destructive/20" : "border-border"
              )}
            />
            {errors.jobDescription && (
              <p className="text-sm text-destructive">{errors.jobDescription.message}</p>
            )}

            <Button 
              type="submit" 
              size="lg" 
              className="w-full mt-4" 
              disabled={!isFormValid || isPending}
            >
              Analyze & Optimize
            </Button>
          </div>
        </form>
      )}

      {isPending && <LoadingOverlay />}

      {isError && (
        <ErrorState message={error.message} onRetry={() => reset()} />
      )}

      {data?.success && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-xl font-bold">Analysis Results</h2>
            <Button variant="outline" onClick={() => reset()}>Analyze New Job</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <ATSScoreCard score={data.data.atsScore} />
            </div>
            <div className="md:col-span-2 space-y-6">
              <KeywordBadges title="Missing Keywords to Add" keywords={data.data.missingKeywords} />
              <KeywordBadges title="Recommended Skills" keywords={data.data.recommendedSkills} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <SuggestionsList suggestions={data.data.resumeSuggestions} />
              <BulletPointCard bullets={data.data.improvedBulletPoints} />
              <InterviewAccordion questions={data.data.interviewQuestions} />
            </div>
            
            <div>
              <CoverLetterCard content={data.data.coverLetter} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};