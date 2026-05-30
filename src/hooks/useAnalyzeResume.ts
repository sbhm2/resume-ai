import { useMutation } from '@tanstack/react-query';
import { analyzeResume } from '@/services/resume.service';
import { AnalysisResponse, ApiError } from '@/types/resume.types';

export const useAnalyzeResume = () => {
  return useMutation<AnalysisResponse, ApiError, { file: File; jd: string }>({
    mutationFn: ({ file, jd }) => analyzeResume(file, jd),
  });
};