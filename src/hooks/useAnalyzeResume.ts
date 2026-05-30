import { useCallback, useState } from 'react';
import { analyzeResume } from '@/services/resume.service';
import { AnalysisResponse, ApiError } from '@/types/resume.types';

interface AnalyzeParams {
  file: File;
  jd: string;
}

export const useAnalyzeResume = () => {
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsPending(false);
  }, []);

  const mutate = useCallback(async ({ file, jd }: AnalyzeParams) => {
    setIsPending(true);
    setError(null);

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
    reset,
  };
};
