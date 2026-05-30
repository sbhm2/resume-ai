import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/auth.types';
import { apiClient } from '@/services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('resume_ai_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        // try {
        //   const { data } = await apiClient.get<User>('/auth/profile');
        //   setUser(data);
        // } catch {
        //   logout();
        // }
      }
      setIsLoading(false);
    };
    initAuth();
  }, [token]);

  const setAuth = (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    console.log('resume token',{newToken, newUser})
    localStorage.setItem('resume_ai_token', newToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('resume_ai_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, setAuth, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};