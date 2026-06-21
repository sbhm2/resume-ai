import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import { useAuth } from '@/providers/AuthProvider';

interface DashboardData {
  totalAnalyses: number;
  todayAnalyses: number;
  dailyUsageCount: number;
  dailyLimit: number;
  averageAtsScore: number;
  recentAnalyses: {
    id: string;
    resumeFileName: string;
    atsScore: number;
    jobDescription: string;
    createdAt: string;
  }[];
}

interface DashboardResponse {
  success: boolean;
  data: DashboardData;
}

export const useDashboardQuery = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data } = await apiClient.get<DashboardResponse>('/analysis/dashboard');
      if (!data.success) throw new Error('Failed to fetch dashboard data');
      return data.data;
    },
    enabled: isAuthenticated,
    staleTime: 60_000, // 60 seconds
    refetchOnWindowFocus: false,
  });
};
