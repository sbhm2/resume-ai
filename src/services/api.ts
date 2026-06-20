import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 90000, // 30 seconds timeout for AI processing
});

// Request Interceptor: Attach Token from localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('resume_ai_token');
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
      localStorage.removeItem('resume_ai_token');
      // window.location.href = '/login';
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