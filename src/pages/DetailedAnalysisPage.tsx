import { DetailedAnalysisCard } from '@/components/dashboard/DetailedAnalysis';
import { Button } from '@/components/ui/button';
import { dummyAnalysisData } from '@/services/dummyData';
import { ArrowLeft, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DetailedAnalysisPage = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" asChild className="-ml-3 text-muted-foreground mb-2">
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Full Analysis Report</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Report for <span className="font-medium text-foreground">Rohit_Patil_Resume.pdf</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-card">
            Share Report
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-md">
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </Button>
        </div>
      </div>

      {/* The Reusable Card */}
      <DetailedAnalysisCard data={dummyAnalysisData} />
      
    </div>
  );
};