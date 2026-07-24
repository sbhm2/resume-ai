import { useCallback, useState } from 'react';
import { analyzeResume } from '@/services/resume.service';
import { AnalysisResponse, ApiError } from '@/types/resume.types';

interface AnalyzeParams {
  file: File;
  jd?: string;
}

export const useAnalyzeResume = () => {
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [hasJd, setHasJd] = useState(false);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsPending(false);
    setHasJd(false);
  }, []);

  const mutate = useCallback(async ({ file, jd }: AnalyzeParams) => {
    // Clear previous data immediately to prevent flash of old results
    setData(null);
    setIsPending(true);
    setError(null);
    setHasJd(Boolean(jd && jd.trim().length >= 100));

    try {
      const result = await analyzeResume(file, jd);
      setData(result);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setIsPending(false);
    }
  }, []);

  return {
    mutate,
    data,
    isPending,
    isError: error !== null,
    error: error ?? { message: 'Something went wrong' },
    hasJd,
    reset,
  };
};
