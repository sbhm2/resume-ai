import { apiClient } from './api';

export interface CoverLetterItem {
  id: string;
  jobDescription: string;
  resumeFileName: string;
  createdAt: string;
  coverLetter: string;
}

export const coverLetterService = {
  getAll: async (): Promise<CoverLetterItem[]> => {
    const { data } = await apiClient.get<{ success: boolean; data: CoverLetterItem[] }>(
      '/analysis/cover-letters'
    );
    if (!data.success) throw new Error('Failed to fetch cover letters');
    return data.data;
  },

  update: async (analysisId: string, coverLetter: string): Promise<void> => {
    const { data } = await apiClient.put<{ success: boolean }>(
      `/analysis/cover-letter/${analysisId}`,
      { coverLetter }
    );
    if (!data.success) throw new Error('Failed to save cover letter');
  },
};
