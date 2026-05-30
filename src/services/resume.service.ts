import { apiClient } from './api';
import { AnalysisResponse } from '@/types/resume.types';

export const analyzeResume = async (file: File, jobDescription: string): Promise<AnalysisResponse> => {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('jobDescription', jobDescription);

  const response = await apiClient.post<AnalysisResponse>('/resume/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'authorization': ''
    },
  });

  return response.data;
};