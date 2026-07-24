export interface AnalysisResponseData {
  // === Core fields (always present) ===
  atsScore: number;
  missingKeywords: string[];
  resumeSuggestions: string[];
  improvedBulletPoints: string[];
  recommendedSkills: string[];
  interviewQuestions: string[];
  coverLetter: string;

  // === New — shared across both scenarios ===
  resumeStrengths: string[];
  resumeWeaknesses: string[];
  finalSummary: string;
  overallResumeScore: number;

  // === New — resume-only review fields ===
  resumeQualityScore: number;
  atsFriendlinessScore: number;
  resumeStructureReview: string;
  formattingSuggestions: string[];
  contentQualityReview: string;
  missingTechnicalSkills: string[];
  missingSoftSkills: string[];
  weakBulletPoints: string[];
  suggestedBulletPointImprovements: string[];
  suggestedCareerRoles: string[];
  suggestedTechnologiesToLearn: string[];
  professionalSummaryImprovements: string;
  overallRecommendation: string;

  // === Parsed resume from AI ===
  parsedResume?: {
    name: string;
    contact: string;
    summary: string;
    experience: Array<{
      company: string;
      role: string;
      date: string;
      bullets: string[];
    }>;
    skills: string[];
    education: string;
  };
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

export interface AnalysisStep {
  id: string;
  label: string;
  description: string;
  showIf?: boolean;
}
