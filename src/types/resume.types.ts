export interface AnalysisResponseData {
    atsScore: number;
    missingKeywords: string[];
    resumeSuggestions: string[];
    improvedBulletPoints: string[];
    recommendedSkills: string[];
    interviewQuestions: string[];
    coverLetter: string;
  }
  
  export interface AnalysisResponse {
    success: boolean;
    analysisId?: string;
    requestId?: string;
    generatedAt?: string;
    data: AnalysisResponseData;
  }
  
  export interface ApiError {
    message: string;
    status?: number;
  }
  