import { Link } from 'react-router-dom';
import { 
  Sparkles, Mail, MessageSquare, 
  ArrowRight, CheckCircle2, Zap, Shield, PenLine, 
  History, Download, BarChart3 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: BarChart3,
    title: 'ATS Resume Analysis',
    description: 'Get your resume scored against any job description with AI. Discover exactly how you stack up against Applicant Tracking Systems.',
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
  },
  {
    icon: PenLine,
    title: 'AI Resume Editor',
    description: 'Refine every section of your resume with AI-powered suggestions. Accept changes with one click and watch your score improve.',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    icon: Mail,
    title: 'AI Cover Letter Generator',
    description: 'Generate personalized, job-specific cover letters that highlight your strengths and match the role you are applying for.',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
  },
  {
    icon: MessageSquare,
    title: 'AI Interview Preparation',
    description: 'Practice with AI-generated interview questions based on your target role and get feedback on your responses.',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    icon: History,
    title: 'Resume History',
    description: 'Track your progress over time. Revisit past analyses, compare scores, and see how your resume evolves with each optimization.',
    color: 'text-sky-600 dark:text-sky-400',
    bgColor: 'bg-sky-50 dark:bg-sky-900/20',
  },
  {
    icon: Download,
    title: 'Resume Export',
    description: 'Export your polished resume as a beautifully formatted document, ready to submit to any job application portal.',
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-50 dark:bg-rose-900/20',
  },
];

const benefits = [
  'AI-powered resume optimization',
  'Job description matching',
  'ATS compatibility check',
  'Interview question practice',
  'Cover letter generation',
  'Progress tracking',
];

export const GuestDashboardPage = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-16 animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="text-center space-y-6 pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-sm font-medium border border-indigo-100 dark:border-indigo-500/20">
          <Sparkles className="w-4 h-4" />
          AI-Powered Resume Optimization
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          Land Your Next Offer with{' '}
          <span className="text-indigo-600 dark:text-indigo-400">AI</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload your resume, analyze it against any job description, receive ATS optimization suggestions,
          generate tailored cover letters, practice interview questions, and improve your chances of
          getting shortlisted — all powered by AI.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700">
            <Link to="/signup">
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/login">Log In</Link>
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-8">Everything You Need to Land the Job</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 bg-card group">
              <CardContent className="p-6">
                <div className={`inline-flex p-3 rounded-xl ${feature.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <Card className="border-border/50 shadow-sm bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        <CardContent className="p-8 sm:p-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Why Choose NextOffer?</h2>
              <p className="text-white/80 mb-6">
                Stand out from the competition with intelligent resume optimization 
                powered by cutting-edge AI technology.
              </p>
              <div className="space-y-3">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-white/90 flex-shrink-0" />
                    <span className="text-white/90">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center sm:items-end gap-4">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Zap className="w-8 h-8 text-yellow-300" />
                <div>
                  <p className="font-bold text-xl">5 Free Analyses</p>
                  <p className="text-white/70 text-sm">No credit card required</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Shield className="w-8 h-8 text-emerald-300" />
                <div>
                  <p className="font-bold text-xl">100% Private</p>
                  <p className="text-white/70 text-sm">Your data stays secure</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <div className="text-center space-y-4 pt-4">
        <h2 className="text-2xl font-bold">Ready to Land Your Next Offer?</h2>
        <p className="text-muted-foreground">
          Join thousands of job seekers who have improved their resumes with NextOffer AI.
        </p>
        <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 mt-4">
          <Link to="/signup">
            Start for Free
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
};
