import axios from 'axios';
import { queryClient } from '@/lib/queryClient';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 90000, // 90 seconds timeout for AI processing
});

// Request Interceptor: Attach Token from localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('nextoffer_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle errors and 401 auto-logout
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If 401 Unauthorized, force logout
    if (error.response?.status === 401) {
      localStorage.removeItem('nextoffer_token');
      queryClient.clear();
      return Promise.reject(error);
    }

    // Transform other errors into a consistent format
    const customError = {
      message: error.response?.data?.error || error.response?.data?.message || 'An unexpected error occurred. Please try again.',
      status: error.response?.status,
    };
    return Promise.reject(customError);
  }
);