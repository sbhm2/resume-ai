import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sparkles, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signupSchema, SignupFormValues } from '@/types/auth.types';
import { cn } from '@/lib/utils';
import { useSignup } from '@/hooks/useAuthQueries';

export const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: signup, isPending } = useSignup();
  const navigate = useNavigate();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema)
  });

  const passwordValue = watch('password', '');
  
  // Simple strength calculation
  const getStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 7) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getStrength(passwordValue);

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
        <h2 className="text-2xl font-bold text-center mb-2">Create an account</h2>
        <p className="text-sm text-muted-foreground text-center mb-8">Join thousands optimizing their resumes with AI.</p>

        <form onSubmit={handleSubmit((data) => signup(data))} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...register('name')} placeholder="John Doe" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} placeholder="you@example.com" />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2 relative">
            <Label htmlFor="password">Password</Label>
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
            {/* Password Strength Bar */}
            {passwordValue && (
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4].map((level) => (
                  <div 
                    key={level} 
                    className={cn(
                      "h-1 w-full rounded-full transition-colors",
                      strength >= level 
                        ? strength < 3 ? "bg-amber-500" : "bg-emerald-500"
                        : "bg-muted"
                    )}
                  />
                ))}
              </div>
            )}
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type={showPassword ? 'text' : 'password'} {...register('confirmPassword')} />
            {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isPending}>
            {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Sign Up
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account? <Link to="/login" className="text-indigo-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};