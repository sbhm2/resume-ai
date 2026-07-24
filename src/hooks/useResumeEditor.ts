import { useReducer, useEffect, useRef } from 'react';
import { EditorState, Suggestion, ResumeData } from '@/types/editor.types';
import { toast } from 'sonner';
import { editorService } from '@/services/editor.service';
import { useAuth } from '@/providers/AuthProvider';

type Action = 
  | { type: 'INIT'; payload: { resume: ResumeData; suggestions: Suggestion[] } }
  | { type: 'SET_ACTIVE_SUGGESTION'; payload: string | null }
  | { type: 'TOGGLE_DIFF' }
  | { type: 'ACCEPT_SUGGESTION'; payload: { id: string; editedText?: string } }
  | { type: 'REJECT_SUGGESTION'; payload: string }
  | { type: 'UNDO' }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'SET_LAST_SAVED'; payload: string }
  | { type: 'UPDATE_NAME'; payload: string }
  | { type: 'UPDATE_CONTACT'; payload: string }
  | { type: 'UPDATE_SUMMARY'; payload: string }
  | { type: 'UPDATE_EDUCATION'; payload: string }
  | { type: 'UPDATE_EXPERIENCE_ROLE'; payload: { id: string; value: string } }
  | { type: 'UPDATE_EXPERIENCE_COMPANY'; payload: { id: string; value: string } }
  | { type: 'UPDATE_EXPERIENCE_DATE'; payload: { id: string; value: string } }
  | { type: 'UPDATE_BULLET'; payload: { sectionId: string; itemIndex: number; value: string } }
  | { type: 'ADD_BULLET'; payload: { sectionId: string } }
  | { type: 'DELETE_BULLET'; payload: { sectionId: string; itemIndex: number } }
  | { type: 'ADD_SKILL'; payload: string }
  | { type: 'REMOVE_SKILL'; payload: string }
  | { type: 'ADD_EXPERIENCE' }
  | { type: 'REMOVE_EXPERIENCE'; payload: string }
  | { type: 'RESET' };

const MAX_HISTORY = 20;

const saveHistory = (state: EditorState) => {
  const newPast = [...state.history.past, { workingResume: state.workingResume, suggestions: state.suggestions }];
  if (newPast.length > MAX_HISTORY) newPast.shift();
  return newPast;
};

const initialState: EditorState = {
  originalResume: null as any,
  workingResume: null as any,
  suggestions: [],
  activeSuggestionId: null,
  showDiff: true,
  isSaving: false,
  lastSaved: null,
  history: { past: [], future: [] }
};

const editorReducer = (state: EditorState, action: Action): EditorState => {
  switch (action.type) {
    case 'RESET':
      return initialState;
    case 'INIT':
      return {
        ...state,
        originalResume: action.payload.resume,
        workingResume: action.payload.resume,
        suggestions: action.payload.suggestions,
        activeSuggestionId: action.payload.suggestions[0]?.id || null,
      };
    case 'SET_ACTIVE_SUGGESTION':
      return { ...state, activeSuggestionId: action.payload };
    case 'TOGGLE_DIFF':
      return { ...state, showDiff: !state.showDiff };
    case 'ACCEPT_SUGGESTION': {
      const suggestion = state.suggestions.find(s => s.id === action.payload.id);
      if (!suggestion) return state;

      const newText = action.payload.editedText || suggestion.suggested;
      const newWorkingResume = { ...state.workingResume };

      // Apply changes to the live document
      if (suggestion.type === 'bullet' && suggestion.sectionId && suggestion.itemIndex !== undefined) {
        const expIndex = newWorkingResume.experience.findIndex(e => e.id === suggestion.sectionId);
        if (expIndex !== -1) {
          const newBullets = [...newWorkingResume.experience[expIndex].bullets];
          newBullets[suggestion.itemIndex] = newText;
          newWorkingResume.experience[expIndex] = { ...newWorkingResume.experience[expIndex], bullets: newBullets };
        }
      } else if (suggestion.type === 'skill') {
         if (!newWorkingResume.skills.includes(newText)) {
           newWorkingResume.skills = [...newWorkingResume.skills, newText];
         }
      }

      const newSuggestions = state.suggestions.map(s => 
        s.id === action.payload.id ? { ...s, status: 'accepted' as const, suggested: newText } : s
      );

      // Auto-advance active suggestion
      const nextPending = newSuggestions.find(s => s.status === 'pending');

      return {
        ...state,
        workingResume: newWorkingResume,
        suggestions: newSuggestions,
        activeSuggestionId: nextPending ? nextPending.id : null,
        history: { past: saveHistory(state), future: [] }
      };
    }
    case 'REJECT_SUGGESTION': {
      const newSuggestions = state.suggestions.map(s => 
        s.id === action.payload ? { ...s, status: 'rejected' as const } : s
      );
      const nextPending = newSuggestions.find(s => s.status === 'pending');
      
      return {
        ...state,
        suggestions: newSuggestions,
        activeSuggestionId: nextPending ? nextPending.id : null,
        history: { past: saveHistory(state), future: [] }
      };
    }
    case 'UNDO': {
      if (state.history.past.length === 0) return state;
      const previous = state.history.past[state.history.past.length - 1];
      const newPast = state.history.past.slice(0, -1);
      return {
        ...state,
        workingResume: previous.workingResume,
        suggestions: previous.suggestions,
        history: {
          past: newPast,
          future: [{ workingResume: state.workingResume, suggestions: state.suggestions }, ...state.history.future]
        }
      };
    }
    case 'UPDATE_NAME':
      return { ...state, workingResume: { ...state.workingResume, name: action.payload }, history: { past: saveHistory(state), future: [] } };
    case 'UPDATE_CONTACT':
      return { ...state, workingResume: { ...state.workingResume, contact: action.payload }, history: { past: saveHistory(state), future: [] } };
    case 'UPDATE_SUMMARY':
      return { ...state, workingResume: { ...state.workingResume, summary: action.payload }, history: { past: saveHistory(state), future: [] } };
    case 'UPDATE_EDUCATION':
      return { ...state, workingResume: { ...state.workingResume, education: action.payload }, history: { past: saveHistory(state), future: [] } };
    case 'UPDATE_EXPERIENCE_ROLE': {
      const newExp = state.workingResume.experience.map(e => 
        e.id === action.payload.id ? { ...e, role: action.payload.value } : e
      );
      return { ...state, workingResume: { ...state.workingResume, experience: newExp }, history: { past: saveHistory(state), future: [] } };
    }
    case 'UPDATE_EXPERIENCE_COMPANY': {
      const newExp = state.workingResume.experience.map(e => 
        e.id === action.payload.id ? { ...e, company: action.payload.value } : e
      );
      return { ...state, workingResume: { ...state.workingResume, experience: newExp }, history: { past: saveHistory(state), future: [] } };
    }
    case 'UPDATE_EXPERIENCE_DATE': {
      const newExp = state.workingResume.experience.map(e => 
        e.id === action.payload.id ? { ...e, date: action.payload.value } : e
      );
      return { ...state, workingResume: { ...state.workingResume, experience: newExp }, history: { past: saveHistory(state), future: [] } };
    }
    case 'UPDATE_BULLET': {
      const newExp = state.workingResume.experience.map(e => {
        if (e.id !== action.payload.sectionId) return e;
        const newBullets = [...e.bullets];
        newBullets[action.payload.itemIndex] = action.payload.value;
        return { ...e, bullets: newBullets };
      });
      return { ...state, workingResume: { ...state.workingResume, experience: newExp }, history: { past: saveHistory(state), future: [] } };
    }
    case 'ADD_BULLET': {
      const newExp = state.workingResume.experience.map(e =>
        e.id === action.payload.sectionId ? { ...e, bullets: [...e.bullets, ''] } : e
      );
      return { ...state, workingResume: { ...state.workingResume, experience: newExp }, history: { past: saveHistory(state), future: [] } };
    }
    case 'DELETE_BULLET': {
      const newExp = state.workingResume.experience.map(e => {
        if (e.id !== action.payload.sectionId) return e;
        const newBullets = e.bullets.filter((_, i) => i !== action.payload.itemIndex);
        return { ...e, bullets: newBullets };
      });
      return { ...state, workingResume: { ...state.workingResume, experience: newExp }, history: { past: saveHistory(state), future: [] } };
    }
    case 'ADD_SKILL': {
      if (state.workingResume.skills.includes(action.payload)) return state;
      return { 
        ...state, 
        workingResume: { ...state.workingResume, skills: [...state.workingResume.skills, action.payload] },
        history: { past: saveHistory(state), future: [] }
      };
    }
    case 'REMOVE_SKILL': {
      return { 
        ...state, 
        workingResume: { ...state.workingResume, skills: state.workingResume.skills.filter(s => s !== action.payload) },
        history: { past: saveHistory(state), future: [] }
      };
    }
    case 'ADD_EXPERIENCE': {
      const newId = `exp${state.workingResume.experience.length + 1}`;
      const newEntry = { id: newId, company: '', role: '', date: '', bullets: [''] };
      return { 
        ...state, 
        workingResume: { ...state.workingResume, experience: [...state.workingResume.experience, newEntry] },
        history: { past: saveHistory(state), future: [] }
      };
    }
    case 'REMOVE_EXPERIENCE': {
      return { 
        ...state, 
        workingResume: { 
          ...state.workingResume, 
          experience: state.workingResume.experience.filter(e => e.id !== action.payload) 
        },
        history: { past: saveHistory(state), future: [] }
      };
    }
    case 'SET_SAVING': return { ...state, isSaving: action.payload };
    case 'SET_LAST_SAVED': return { ...state, lastSaved: action.payload };
    default: return state;
  }
};

export const useResumeEditor = (analysisId: string, initialData: { resume: ResumeData; suggestions: Suggestion[] } | null) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (initialData) {
      dispatch({ type: 'INIT', payload: initialData });
    }
  }, [initialData]);

  // Clear editor state on logout
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch({ type: 'RESET' });
    }
  }, [isAuthenticated]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
        toast('Undo successful', { description: 'Reverted last action.', duration: 2000 });
      }
      if (state.activeSuggestionId) {
        if (e.key === 'a' || e.key === 'A') {
          dispatch({ type: 'ACCEPT_SUGGESTION', payload: { id: state.activeSuggestionId } });
        }
        if (e.key === 'r' || e.key === 'R') {
          dispatch({ type: 'REJECT_SUGGESTION', payload: state.activeSuggestionId });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.activeSuggestionId, state.history]);

  // Track the last successfully saved resume for diff computation
  const lastSavedResumeRef = useRef<ResumeData | null>(null);

  // When INIT loads fresh data from server, set it as the baseline for diffs
  useEffect(() => {
    if (state.originalResume) {
      lastSavedResumeRef.current = state.originalResume;
    }
  }, [state.originalResume]);

  // Auto-save logic (Debounced)
  useEffect(() => {
    if (!state.workingResume) return;
    const timeoutId = setTimeout(async () => {
      dispatch({ type: 'SET_SAVING', payload: true });
      try {
        // Build suggestion statuses map: { suggestionId: status }
        const suggestionStatuses: Record<string, string> = {};
        state.suggestions.forEach(s => {
          suggestionStatuses[s.id] = s.status;
        });

        await editorService.saveDraft(
          analysisId,
          state.workingResume,
          lastSavedResumeRef.current,
          suggestionStatuses,
        );
        // Update the baseline for future diffs — computeHash happens inside saveDraft
        lastSavedResumeRef.current = JSON.parse(JSON.stringify(state.workingResume));
        dispatch({ type: 'SET_LAST_SAVED', payload: new Date().toLocaleTimeString() });
      } catch (err) {
        console.error("Autosave failed", err);
      } finally {
        dispatch({ type: 'SET_SAVING', payload: false });
      }
    }, 10000); // Save every 10 seconds of inactivity
    return () => clearTimeout(timeoutId);
  }, [state.workingResume, state.suggestions, analysisId]);

  return { state, dispatch };
};
