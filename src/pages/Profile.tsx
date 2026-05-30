import { useAuth } from '@/providers/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Calendar, Activity, CreditCard } from 'lucide-react';
import dayjs from 'dayjs'; // Consider installing dayjs for easy date formatting: npm i dayjs
import { Button } from '@/components/ui/button';

export const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account Profile</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage your account settings and preferences.</p>
      </div>

      <Card className="border-border/50 shadow-sm overflow-hidden bg-card">
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="w-24 h-24 border-4 border-indigo-50 dark:border-indigo-900/30">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
              <AvatarFallback className="text-2xl bg-indigo-100 text-indigo-700">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center sm:text-left space-y-2">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="pt-2">
                <Badge variant="secondary" className="capitalize bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                  {user.plan} Plan
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" /> Usage Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center border-b pb-4">
              <span className="text-sm text-muted-foreground">Total Analyses Run</span>
              <span className="font-semibold">{user.totalAnalyses}</span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-sm text-muted-foreground">Account Created</span>
              <span className="font-semibold flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                {dayjs(user.joinDate).format('MMMM D, YYYY')}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-500" /> Subscription details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              You are currently on the <strong className="text-foreground capitalize">{user.plan}</strong> tier.
            </p>
            {user.plan === 'free' && (
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Upgrade to Pro</Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};