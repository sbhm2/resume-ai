import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      navigate('/analyzer');
    },
  });
};

export const useSignup = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.signup,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      navigate('/analyzer');
    },
  });
};