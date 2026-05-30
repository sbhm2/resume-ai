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
      message: error.response?.data?.error || error.response?.data?.message || 'An unexpected error occurred. Please try again.',
      status: error.response?.status,
    };
    return Promise.reject(customError);
  }
);
// Request Interceptor: Attach Token
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('resume_ai_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response Interceptor: Handle 401s & Token Refresh Prep
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // If 401 Unauthorized and we haven't retried yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // TODO: Implement refresh token API call here
          // const { data } = await axios.post('/api/auth/refresh', { token: getRefreshToken() });
          // localStorage.setItem('resume_ai_token', data.accessToken);
          // return apiClient(originalRequest);
          
          // For now, if 401, force logout
          localStorage.removeItem('resume_ai_token');
          window.location.href = '/login';
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );