export type SuggestionStatus = 'pending' | 'accepted' | 'rejected';
export type SuggestionType = 'bullet' | 'skill' | 'keyword' | 'summary';

export interface Suggestion {
  id: string;
  type: SuggestionType;
  sectionId?: string; // e.g., experience ID
  itemIndex?: number; // e.g., bullet index
  original: string;
  suggested: string;
  status: SuggestionStatus;
  title: string;
  sectionLabel?: string; // e.g., 'Professional Summary', 'Experience — Google', 'Skills'
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  date: string;
  bullets: string[];
}

export interface ResumeData {
  name: string;
  contact: string;
  summary: string;
  experience: Experience[];
  skills: string[];
  education: string;
}

export interface VersionHistory {
  id: string;
  timestamp: string;
  resume: ResumeData;
}

export interface EditorState {
  originalResume: ResumeData;
  workingResume: ResumeData;
  suggestions: Suggestion[];
  activeSuggestionId: string | null;
  showDiff: boolean;
  isSaving: boolean;
  lastSaved: string | null;
  history: {
    past: { workingResume: ResumeData; suggestions: Suggestion[] }[];
    future: { workingResume: ResumeData; suggestions: Suggestion[] }[];
  };
}