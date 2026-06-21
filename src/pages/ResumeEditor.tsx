import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { 
  Download, ArrowLeft, History, Eye, EyeOff, Loader2, CheckCircle2, 
  Plus, Trash2, Sparkles, X, AlertCircle, Layers, Briefcase, GraduationCap, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from 'sonner';

import { useResumeEditor } from '@/hooks/useResumeEditor';
import { editorService } from '@/services/editor.service';
import { ResumePreview, HighlightTarget } from '@/components/editor/ResumePreview';
import { SuggestionCard } from '@/components/editor/SuggestionCard';
import { ResumeData, Suggestion } from '@/types/editor.types';

export const ResumeEditorPage = () => {
  const { analysisId } = useParams();
  const location = useLocation();
  const passedAnalysisData = location.state?.analysisData;
  const [initialData, setInitialData] = useState<{ resume: ResumeData; suggestions: Suggestion[] } | null>(null);
  const [isFetching, setIsFetching] = useState(!passedAnalysisData);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const setSectionRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    sectionRefs.current[id] = el;
  }, []);

  useEffect(() => {
    const loadData = async () => {
      // If we have data passed from the analyzer page, use it
      if (passedAnalysisData) {
        try {
          // For data passed from analyzer, try to fetch from API for the full parsed resume
          if (analysisId) {
            try {
              const apiData = await editorService.getAnalysisData(analysisId);
              setInitialData({
                resume: apiData.resume,
                suggestions: apiData.suggestions
              });
              return;
            } catch {
              // Fallback: construct from passed data
            }
          }
          
          // Construct from passed data (legacy/fallback)
          const dynamicSuggestions: Suggestion[] = [];
          let sId = 1;

          passedAnalysisData.resumeSuggestions?.forEach((sugg: string) => {
            dynamicSuggestions.push({ id: `s${sId++}`, type: 'summary', original: '', suggested: sugg, status: 'pending', title: 'AI Summary Enhancement' });
          });

          passedAnalysisData.improvedBulletPoints?.forEach((bullet: string, idx: number) => {
            dynamicSuggestions.push({ id: `s${sId++}`, type: 'bullet', sectionId: 'exp1', itemIndex: idx, original: '', suggested: bullet, status: 'pending', title: 'Impact Optimization' });
          });

          passedAnalysisData.missingKeywords?.forEach((kw: string) => {
            dynamicSuggestions.push({ id: `s${sId++}`, type: 'skill', original: '', suggested: kw, status: 'pending', title: 'Missing ATS Keyword' });
          });

          setInitialData({
            resume: {
              name: passedAnalysisData.parsedResume?.name || 'Your Name',
              contact: passedAnalysisData.parsedResume?.contact || 'email@example.com | Phone | Location',
              summary: passedAnalysisData.parsedResume?.summary || 'Professional summary',
              experience: passedAnalysisData.parsedResume?.experience?.map((exp: any, idx: number) => ({
                id: `exp${idx + 1}`,
                company: exp.company || '',
                role: exp.role || '',
                date: exp.date || '',
                bullets: exp.bullets || ['']
              })) || [{ id: 'exp1', company: '', role: '', date: '', bullets: [''] }],
              skills: passedAnalysisData.recommendedSkills || [],
              education: passedAnalysisData.parsedResume?.education || 'Your education details'
            },
            suggestions: dynamicSuggestions
          });
        } finally {
          setIsFetching(false);
        }
        return;
      }

      // Fetch from API when no passed data
      if (analysisId) {
        try {
          const apiData = await editorService.getAnalysisData(analysisId);
          setInitialData({
            resume: apiData.resume,
            suggestions: apiData.suggestions
          });
        } catch (err) {
          console.error('Failed to fetch editor data:', err);
          setFetchError('Could not load resume data. Please go back and run the analysis again.');
        } finally {
          setIsFetching(false);
        }
      } else {
        setIsFetching(false);
        setFetchError('No analysis ID provided.');
      }
    };

    loadData();
  }, [analysisId, passedAnalysisData]);

  const { state, dispatch } = useResumeEditor(analysisId || '', initialData);

  // Compute highlight target for the resume preview panel based on active suggestion
  const highlightTarget: HighlightTarget | null = useMemo(() => {
    if (!state.activeSuggestionId) return null;
    const suggestion = state.suggestions.find(s => s.id === state.activeSuggestionId);
    if (!suggestion || suggestion.status !== 'pending') return null;

    switch (suggestion.type) {
      case 'summary':
        return { type: 'summary' };
      case 'bullet':
        return { type: 'experience', sectionId: suggestion.sectionId };
      case 'skill':
      case 'keyword':
        return { type: 'skills' };
      default:
        return null;
    }
  }, [state.activeSuggestionId, state.suggestions]);

  // Auto-scroll the resume preview panel to the highlighted section
  useEffect(() => {
    if (!highlightTarget) return;
    const timer = setTimeout(() => {
      let selector = `[data-section="${highlightTarget.type}"]`;
      if (highlightTarget.sectionId) {
        // For experience entries, target the specific entry by data-section-id
        selector = `[data-section-id="${highlightTarget.sectionId}"]`;
      }
      const el = document.querySelector(selector);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [highlightTarget]);

  const handleExportPDF = () => {
    try {
      editorService.printResume(state.workingResume);
      toast('Print preview opened', { 
        description: 'Select "Save as PDF" in the print dialog to download as PDF.',
        duration: 5000,
      });
    } catch {
      toast.error('Failed to open print dialog');
    }
  };

  // Loading state
  if (isFetching || (!initialData && !fetchError)) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          <p className="text-sm text-muted-foreground">Loading resume editor...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (fetchError) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Card className="max-w-md border-destructive/30">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="rounded-full bg-destructive/10 p-3 text-destructive">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold">Could not load editor</h3>
            <p className="text-sm text-muted-foreground">{fetchError}</p>
            <Button asChild variant="outline">
              <Link to="/analyzer">Back to Analyzer</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!state.workingResume) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="-m-8 flex h-[calc(100vh-4rem)] min-h-0 flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
      
      {/* Top Navbar */}
      <header className="h-14 border-b bg-card flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground -ml-2">
            <Link to="/dashboard"><ArrowLeft className="w-4 h-4 mr-2" /> Exit</Link>
          </Button>
          <div className="h-4 w-px bg-border" />
          <h2 className="font-semibold text-sm flex items-center gap-2">
            Resume Builder
            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 font-medium">Pro</Badge>
          </h2>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground hidden md:flex">
            {state.isSaving ? (
              <><Loader2 className="w-3 h-3 animate-spin" /> Saving draft...</>
            ) : (
              <><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Saved {state.lastSaved || 'just now'}</>
            )}
          </div>

          <div className="flex items-center gap-2">
             <div className="flex items-center space-x-2 mr-4 border-r pr-4 border-border">
              <Switch 
                id="diff-mode" 
                checked={state.showDiff} 
                onCheckedChange={() => dispatch({ type: 'TOGGLE_DIFF' })} 
                className="data-[state=checked]:bg-indigo-600"
              />
              <Label htmlFor="diff-mode" className="text-xs font-medium cursor-pointer flex items-center gap-1.5 hidden sm:flex">
                {state.showDiff ? <Eye className="w-3.5 h-3.5 text-indigo-600" /> : <EyeOff className="w-3.5 h-3.5" />}
                Show Changes
              </Label>
            </div>

            <Button variant="outline" size="sm" onClick={() => dispatch({ type: 'UNDO' })} disabled={state.history.past.length === 0} title="Undo (Ctrl+Z)">
              <History className="w-4 h-4 mr-2 hidden sm:block" /> Undo
            </Button>
            <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white shadow-md dark:bg-slate-100 dark:text-slate-900" onClick={handleExportPDF}>
              <Download className="w-4 h-4 mr-2 hidden sm:block" /> Download
            </Button>
          </div>
        </div>
      </header>

      {/* Main Two-Panel Workspace */}
      <main className="relative grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-12">
        
        {/* LEFT PANEL: Form Editor */}
        <div className="z-10 flex min-h-0 flex-col border-r bg-white shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] dark:bg-slate-950 lg:col-span-5 xl:col-span-4">
          <div className="flex items-center gap-2 border-b px-4 py-2.5 bg-slate-50/50 dark:bg-slate-900/20">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Edit Resume Sections</span>
          </div>
          <ScrollArea className="h-0 min-h-0 flex-1">
            <div className="p-4 sm:p-6 pb-20">
              <Accordion type="multiple" defaultValue={["contact", "summary", "experience", "education", "skills"]} className="w-full space-y-4">
                
                {/* Contact & Name Section */}
                <AccordionItem value="contact" className="border rounded-lg bg-card overflow-hidden shadow-sm">
                  <AccordionTrigger className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900 data-[state=open]:bg-slate-50 dark:data-[state=open]:bg-slate-900 transition-colors">
                    <span className="font-semibold text-sm flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-indigo-500" />
                      Personal Info
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2 space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Full Name</Label>
                      <Input 
                        value={state.workingResume.name}
                        onChange={(e) => dispatch({ type: 'UPDATE_NAME', payload: e.target.value })}
                        className="bg-slate-50/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Contact Info</Label>
                      <Input 
                        value={state.workingResume.contact}
                        onChange={(e) => dispatch({ type: 'UPDATE_CONTACT', payload: e.target.value })}
                        className="bg-slate-50/50"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Professional Summary Section */}
                <AccordionItem ref={setSectionRef('section-summary')} value="summary" className="border rounded-lg bg-card overflow-hidden shadow-sm">
                  <AccordionTrigger className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900 data-[state=open]:bg-slate-50 dark:data-[state=open]:bg-slate-900 transition-colors">
                    <span className="font-semibold text-sm flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Professional Summary
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Summary</Label>
                      <Textarea 
                        value={state.workingResume.summary}
                        onChange={(e) => dispatch({ type: 'UPDATE_SUMMARY', payload: e.target.value })}
                        className="min-h-[120px] bg-slate-50/50"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Experience Section */}
                <AccordionItem ref={setSectionRef('section-experience')} value="experience" className="border rounded-lg bg-card overflow-hidden shadow-sm">
                  <AccordionTrigger className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900 data-[state=open]:bg-slate-50 dark:data-[state=open]:bg-slate-900 transition-colors">
                    <span className="font-semibold text-sm flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                      Experience
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2 space-y-6">
                    {state.workingResume.experience.map((exp, idx) => (
                      <div key={exp.id} className="border rounded-lg p-4 bg-slate-50/30 dark:bg-slate-900/10 space-y-3 relative">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-muted-foreground">Position {idx + 1}</span>
                          {state.workingResume.experience.length > 1 && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 text-destructive hover:text-destructive"
                              onClick={() => dispatch({ type: 'REMOVE_EXPERIENCE', payload: exp.id })}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">Company</Label>
                          <Input 
                            value={exp.company}
                            onChange={(e) => dispatch({ type: 'UPDATE_EXPERIENCE_COMPANY', payload: { id: exp.id, value: e.target.value } })}
                            className="bg-white dark:bg-slate-800"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">Role / Title</Label>
                          <Input 
                            value={exp.role}
                            onChange={(e) => dispatch({ type: 'UPDATE_EXPERIENCE_ROLE', payload: { id: exp.id, value: e.target.value } })}
                            className="bg-white dark:bg-slate-800"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">Date Range</Label>
                          <Input 
                            value={exp.date}
                            onChange={(e) => dispatch({ type: 'UPDATE_EXPERIENCE_DATE', payload: { id: exp.id, value: e.target.value } })}
                            className="bg-white dark:bg-slate-800"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs text-muted-foreground">Bullet Points</Label>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 text-xs"
                              onClick={() => dispatch({ type: 'ADD_BULLET', payload: { sectionId: exp.id } })}
                            >
                              <Plus className="w-3 h-3 mr-1" /> Add Bullet
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {exp.bullets.map((bullet, bIdx) => (
                              <div key={bIdx} className="flex gap-2">
                                <Textarea
                                  value={bullet}
                                  onChange={(e) => dispatch({ type: 'UPDATE_BULLET', payload: { sectionId: exp.id, itemIndex: bIdx, value: e.target.value } })}
                                  className="min-h-[60px] text-xs bg-white dark:bg-slate-800"
                                />
                                {exp.bullets.length > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 shrink-0 self-start text-muted-foreground hover:text-destructive"
                                    onClick={() => dispatch({ type: 'DELETE_BULLET', payload: { sectionId: exp.id, itemIndex: bIdx } })}
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full border-dashed" onClick={() => dispatch({ type: 'ADD_EXPERIENCE' })}>
                      <Plus className="w-4 h-4 mr-2" /> Add Position
                    </Button>
                  </AccordionContent>
                </AccordionItem>

                {/* Education Section */}
                <AccordionItem value="education" className="border rounded-lg bg-card overflow-hidden shadow-sm">
                  <AccordionTrigger className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900 data-[state=open]:bg-slate-50 dark:data-[state=open]:bg-slate-900 transition-colors">
                    <span className="font-semibold text-sm flex items-center gap-2">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
                      Education
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Education Details</Label>
                      <Textarea 
                        value={state.workingResume.education}
                        onChange={(e) => dispatch({ type: 'UPDATE_EDUCATION', payload: e.target.value })}
                        className="min-h-[80px] bg-slate-50/50"
                        placeholder="Degree, University, Graduation Year"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Skills Section */}
                <AccordionItem ref={setSectionRef('section-skills')} value="skills" className="border rounded-lg bg-card overflow-hidden shadow-sm">
                  <AccordionTrigger className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900 data-[state=open]:bg-slate-50 dark:data-[state=open]:bg-slate-900 transition-colors">
                    <span className="font-semibold text-sm flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                      Skills & Technologies
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2 space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Skills</Label>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-xs rounded-full px-3"
                            onClick={() => {
                              const skill = prompt('Enter a skill name:');
                              if (skill && skill.trim()) {
                                dispatch({ type: 'ADD_SKILL', payload: skill.trim() });
                              }
                            }}
                          >
                            <Plus className="w-3 h-3 mr-1" /> Add Skill
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {state.workingResume.skills.map((skill) => (
                          <div key={skill} className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border shadow-sm rounded-md px-2.5 py-1.5 text-xs font-medium group hover:border-red-200 transition-colors">
                            {skill}
                            <button 
                              className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => dispatch({ type: 'REMOVE_SKILL', payload: skill })}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        {state.workingResume.skills.length === 0 && (
                          <p className="text-xs text-muted-foreground italic">No skills added yet</p>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* AI Suggestions Section */}
                <AccordionItem value="suggestions" className="border rounded-lg bg-card overflow-hidden shadow-sm border-amber-200 dark:border-amber-800/30">
                  <AccordionTrigger className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900 data-[state=open]:bg-amber-50/50 dark:data-[state=open]:bg-amber-900/10 transition-colors">
                    <span className="font-semibold text-sm flex items-center gap-2 text-amber-700 dark:text-amber-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Suggestions ({state.suggestions.filter(s => s.status === 'pending').length})
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2 space-y-3">
                    {state.suggestions.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">No suggestions available</p>
                    ) : (
                      state.suggestions.map((suggestion) => (
                        <SuggestionCard
                          key={suggestion.id}
                          suggestion={suggestion}
                          isActive={state.activeSuggestionId === suggestion.id}
                          onAccept={(id, editedText) => dispatch({ type: 'ACCEPT_SUGGESTION', payload: { id, editedText } })}
                          onReject={(id) => dispatch({ type: 'REJECT_SUGGESTION', payload: id })}
                          onClick={() => {
                            dispatch({ type: 'SET_ACTIVE_SUGGESTION', payload: suggestion.id });
                          }}
                        />
                      ))
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </ScrollArea>
        </div>

        {/* RIGHT PANEL: Live Resume Preview */}
        <div className="relative min-h-0 overflow-y-auto bg-slate-100 p-8 pb-32 dark:bg-slate-900/80 lg:col-span-7 xl:col-span-8 flex justify-center">
          {/* The Live Document */}
          <div className="w-full max-w-[800px]">
            <ResumePreview state={state} highlightTarget={highlightTarget} />
          </div>
        </div>
      </main>
    </div>
  );
};