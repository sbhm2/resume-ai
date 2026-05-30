import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 30000, // 30 seconds timeout for AI processing
});

// Interceptor for centralized error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message: error.response?.data?.message || 'An unexpected error occurred. Please try again.',
      status: error.response?.status,
    };
    return Promise.reject(customError);
  }
);