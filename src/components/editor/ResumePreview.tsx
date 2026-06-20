import { EditorState } from '@/types/editor.types';
import { DiffViewer } from './DiffViewer';

interface Props {
  state: EditorState;
}

export const ResumePreview = ({ state }: Props) => {
  const { originalResume: orig, workingResume: work, showDiff } = state;

  if (!work) return null;

  return (
    <div className="w-full max-w-[850px] mx-auto bg-white dark:bg-slate-100 text-slate-900 shadow-2xl rounded-sm min-h-[1100px] transition-all duration-300 transform origin-top border border-slate-200 print:shadow-none print:border-none">
      <div className="p-10 md:p-12 lg:p-14">
        
        {/* ── HEADER / CONTACT ── */}
        <div className="text-center mb-7 pb-5 border-b-2 border-slate-800/20">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1.5">
            <DiffViewer original={orig.name} current={work.name} showDiff={showDiff} />
          </h1>
          {work.contact && (
            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
              <DiffViewer original={orig.contact} current={work.contact} showDiff={showDiff} />
            </p>
          )}
        </div>

        {/* ── PROFESSIONAL SUMMARY ── */}
        {work.summary && (
          <div className="mb-7">
            <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-700 pb-1.5 mb-2.5 border-b border-slate-300/60">
              Professional Summary
            </h2>
            <div className="text-sm leading-[1.7] text-slate-800">
              <DiffViewer original={orig.summary} current={work.summary} showDiff={showDiff} />
            </div>
          </div>
        )}

        {/* ── EXPERIENCE ── */}
        {work.experience.length > 0 && (
          <div className="mb-7">
            <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-700 pb-1.5 mb-4 border-b border-slate-300/60">
              Experience
            </h2>
            <div className="space-y-6">
              {work.experience.map((exp) => {
                const origExp = orig.experience.find(e => e.id === exp.id) || exp;
                return (
                  <div key={exp.id} className="break-inside-avoid">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <h3 className="font-bold text-sm text-slate-900">
                          <DiffViewer 
                            original={origExp.role || ''} 
                            current={exp.role || ''} 
                            showDiff={showDiff} 
                          />
                        </h3>
                        {exp.company && (
                          <>
                            <span className="text-slate-400 text-xs hidden sm:inline">|</span>
                            <span className="font-medium text-sm text-slate-600 italic">
                              <DiffViewer 
                                original={origExp.company || ''} 
                                current={exp.company || ''} 
                                showDiff={showDiff} 
                              />
                            </span>
                          </>
                        )}
                      </div>
                      {exp.date && (
                        <span className="text-xs font-medium text-slate-500 whitespace-nowrap ml-2 shrink-0">
                          <DiffViewer 
                            original={origExp.date || ''} 
                            current={exp.date || ''} 
                            showDiff={showDiff} 
                          />
                        </span>
                      )}
                    </div>
                    <ul className="mt-2 space-y-1.5">
                      {exp.bullets.filter(b => b.trim()).map((bullet, bIdx) => (
                        <li key={bIdx} className="text-sm text-slate-800 leading-[1.65] pl-0 relative flex gap-2">
                          <span className="text-slate-400 select-none shrink-0 mt-[1px]">•</span>
                          <span>
                            <DiffViewer 
                              original={origExp.bullets[bIdx] || bullet} 
                              current={bullet} 
                              showDiff={showDiff} 
                            />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── EDUCATION ── */}
        {work.education && (
          <div className="mb-7">
            <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-700 pb-1.5 mb-2.5 border-b border-slate-300/60">
              Education
            </h2>
            <div className="text-sm leading-[1.7] text-slate-800">
              <DiffViewer original={orig.education} current={work.education} showDiff={showDiff} />
            </div>
          </div>
        )}

        {/* ── SKILLS ── */}
        {work.skills.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-700 pb-1.5 mb-2.5 border-b border-slate-300/60">
              Skills &amp; Technologies
            </h2>
            <div className="flex flex-wrap gap-1.5 text-sm leading-relaxed">
              {work.skills.map((skill, idx) => {
                const origSkill = orig.skills[idx];
                return (
                  <span key={skill} className="inline-flex items-center">
                    {idx > 0 && <span className="text-slate-300 mx-1">|</span>}
                    <DiffViewer original={origSkill || skill} current={skill} showDiff={showDiff} />
                  </span>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};