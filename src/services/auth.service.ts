import { apiClient } from './api';
import { AuthResponse, LoginFormValues, SignupFormValues, User } from '@/types/auth.types';

export const authService = {
  login: async (credentials: LoginFormValues): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/signin', credentials);
    return data;
  },
  
  signup: async (userData: SignupFormValues): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/signup', userData);
    return data;
  },

  getProfile: async (): Promise<User> => {
    const { data } = await apiClient.get<User>('/auth/profile');
    return data;
  }
};