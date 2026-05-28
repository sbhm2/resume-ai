import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';


// Mock Data Structure
const mockAnalysis = {
  score: 84,
  missingKeywords: ['Redux', 'AWS', 'GraphQL', 'Agile Methodology'],
  improvedBullets: [
    { original: "Worked on the backend API.", improved: "Architected scalable RESTful APIs using Node.js, improving response times by 40%." },
    { original: "Fixed bugs in the frontend.", improved: "Resolved 50+ critical UI bugs in React, elevating User Satisfaction scores." }
  ],
  suggestions: [
    "Quantify your impact in the 'Senior Developer' role (e.g., 'Increased performance by 30%').",
    "Move 'Skills' section above 'Education' for better ATS parsing.",
    "Action verbs are missing in 3 bullet points."
  ]
};

export const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{
    score: number;
    missingKeywords: string[];
    improvedBullets: { original: string; improved: string; }[];
    suggestions: string[];
  } | null>(null);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate AI API Call
    setTimeout(() => {
      setResults(mockAnalysis as {
        score: number;
        missingKeywords: string[];
        improvedBullets: { original: string; improved: string; }[];
        suggestions: string[];
      });
      setIsAnalyzing(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-primary">Resume Analyzer</h1>
        <p className="text-gray-500 mt-1">Compare your resume against a job description for ATS optimization.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Inputs */}
        <div className="space-y-6">
          <Card className="p-6 border-dashed border-2 bg-gray-50 flex flex-col items-center justify-center text-center h-48 transition-colors hover:bg-gray-100 cursor-pointer">
            <UploadCloud className="w-10 h-10 text-gray-400 mb-4" />
            <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500 mt-1">PDF or DOCX (max. 5MB)</p>
          </Card>

          <Card className="p-0">
            <div className="p-4 border-b border-border bg-gray-50">
              <h3 className="text-sm font-medium">Target Job Description</h3>
            </div>
            <textarea 
              className="w-full h-48 p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black/5"
              placeholder="Paste the job description here..."
            />
          </Card>

          <Button 
            className="w-full py-6 text-base" 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing Resume via AI...' : 'Analyze & Optimize Resume'}
          </Button>
        </div>

        {/* Right Column: Results / Loading State */}
        <div className="h-full relative">
          <AnimatePresence mode="wait">
            {!isAnalyzing && !results && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-gray-400 border border-dashed border-border rounded-xl"
              >
                <Sparkles className="w-12 h-12 mb-4 opacity-50" />
                <p>Awaiting inputs for AI analysis</p>
              </motion.div>
            )}

            {isAnalyzing && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center bg-white rounded-xl shadow-saas border border-border"
              >
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="w-12 h-12 border-4 border-gray-100 border-t-primary rounded-full mb-4"
                />
                <p className="font-medium animate-pulse">Running ATS simulation...</p>
              </motion.div>
            )}

            {results && !isAnalyzing && (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Score Card */}
                <Card className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">ATS Match Score</h3>
                    <p className="text-sm text-gray-500">Based on industry parser logic</p>
                  </div>
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    {/* SVG Circle represents score */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                      <circle 
                        cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" 
                        strokeDasharray={`${(results.score / 100) * 226} 226`}
                        className="text-primary transition-all duration-1000 ease-out" 
                      />
                    </svg>
                    <span className="absolute text-xl font-bold">{results.score}%</span>
                  </div>
                </Card>

                {/* Missing Keywords */}
                <Card className="p-6">
                  <h3 className="text-sm font-medium mb-4 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-orange-500"/> Missing Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {results.missingKeywords.map(kw => (
                      <span key={kw} className="px-3 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full border border-red-100">
                        {kw}
                      </span>
                    ))}
                  </div>
                </Card>

                {/* AI Improved Bullets */}
                <Card className="p-6">
                  <h3 className="text-sm font-medium mb-4 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> AI Bullet Enhancements</h3>
                  <div className="space-y-4">
                    {results.improvedBullets.map((bullet, idx) => (
                      <div key={idx} className="text-sm p-4 bg-gray-50 rounded-lg border border-border">
                        <p className="text-gray-500 line-through mb-2">{bullet.original}</p>
                        <p className="font-medium text-primary flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5"/> 
                          {bullet.improved}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};