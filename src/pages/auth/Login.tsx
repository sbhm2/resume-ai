import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sparkles, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { loginSchema, LoginFormValues } from '@/types/auth.types';
import { useLogin } from '@/hooks/useAuthQueries';

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();
  const navigate = useNavigate();
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md bg-card border border-border shadow-lg rounded-2xl p-8 relative">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors rounded-full p-1.5 hover:bg-muted"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-xl text-indigo-600">
            <Sparkles className="w-8 h-8" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">Welcome back</h2>
        <p className="text-sm text-muted-foreground text-center mb-8">Enter your credentials to access your account.</p>

        <form onSubmit={handleSubmit((data) => login(data))} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} placeholder="you@example.com" />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className="text-xs text-indigo-600 hover:underline font-medium">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? 'text' : 'password'} 
                {...register('password')} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="rememberMe" 
              onCheckedChange={(checked) => setValue('rememberMe', checked as boolean)} 
            />
            <Label htmlFor="rememberMe" className="text-sm font-normal text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Remember me for 30 days
            </Label>
          </div>

          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 mt-2" disabled={isPending}>
            {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account? <Link to="/signup" className="text-indigo-600 font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};