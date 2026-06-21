import { apiClient } from './api';
import { ResumeData, Suggestion } from '@/types/editor.types';
import { computeDiff } from '@/utils/diff';

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

export interface EditorApiResponse {
  success: boolean;
  data: {
    resume: ResumeData;
    suggestions: Suggestion[];
    analysisData: {
      atsScore: number;
      missingKeywords: string[];
      resumeSuggestions: string[];
      improvedBulletPoints: string[];
      recommendedSkills: string[];
      interviewQuestions: string[];
      coverLetter: string;
    };
  };
}

export const editorService = {
  getAnalysisData: async (analysisId: string) => {
    const { data } = await apiClient.get<EditorApiResponse>(`/analysis/editor-data/${analysisId}`);
    if (!data.success || !data.data) {
      throw new Error('Failed to fetch editor data');
    }
    return data.data;
  },
  
  saveDraft: async (analysisId: string, workingResume: ResumeData, lastSavedResume: ResumeData | null) => {
    // If no previous state, send full payload (first save)
    if (!lastSavedResume) {
      const { data } = await apiClient.put(`/analysis/editor-data/${analysisId}/draft`, {
        mode: 'full',
        workingResume,
      });
      return data;
    }

    // Compute diff — only send what changed
    const diff = computeDiff(lastSavedResume, workingResume);
    if (!diff) return { success: true, message: 'No changes to save' };

    const { data } = await apiClient.put(`/analysis/editor-data/${analysisId}/draft`, {
      mode: 'patch',
      baseHash: diff.baseHash,
      ops: diff.ops,
    });
    return data;
  },

  generateResumeHtml: (resume: ResumeData): string => {
    const experienceHtml = resume.experience.map(exp => `
      <div style="margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <div>
            <strong style="font-size: 14px;">${escapeHtml(exp.role)}</strong>
            ${exp.company ? `<span style="color: #666;"> | <em>${escapeHtml(exp.company)}</em></span>` : ''}
          </div>
          ${exp.date ? `<span style="font-size: 12px; color: #666; white-space: nowrap;">${escapeHtml(exp.date)}</span>` : ''}
        </div>
        <ul style="margin: 8px 0 0 0; padding-left: 20px;">
          ${exp.bullets.filter(b => b.trim()).map(b => `<li style="font-size: 13px; line-height: 1.6; margin-bottom: 4px;">${escapeHtml(b)}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    const skillsHtml = resume.skills.map(s => escapeHtml(s)).join(' &nbsp;|&nbsp; ');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(resume.name)} — Resume</title>
  <style>
    @page { margin: 0.75in; size: letter; }
    @media print {
      body { padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      color: #1a1a1a;
      line-height: 1.5;
      padding: 48px 56px;
      max-width: 800px;
      margin: 0 auto;
    }
    h1 { font-size: 26px; font-weight: 700; text-align: center; letter-spacing: 0.5px; margin-bottom: 4px; }
    .contact { text-align: center; font-size: 13px; color: #555; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #ccc; }
    h2 { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #333; padding-bottom: 6px; border-bottom: 1px solid #ccc; margin-bottom: 12px; margin-top: 24px; }
    p { font-size: 13px; line-height: 1.7; }
    .section { margin-bottom: 20px; }
  </style>
</head>
<body>
  <h1>${escapeHtml(resume.name)}</h1>
  ${resume.contact ? `<div class="contact">${escapeHtml(resume.contact)}</div>` : ''}

  ${resume.summary ? `<div class="section"><h2>Professional Summary</h2><p>${escapeHtml(resume.summary)}</p></div>` : ''}

  ${resume.experience.length > 0 ? `<div class="section"><h2>Experience</h2>${experienceHtml}</div>` : ''}

  ${resume.education ? `<div class="section"><h2>Education</h2><p>${escapeHtml(resume.education)}</p></div>` : ''}

  ${skillsHtml ? `<div class="section"><h2>Skills &amp; Technologies</h2><p style="font-size: 13px;">${skillsHtml}</p></div>` : ''}
</body>
</html>`;
  },

  /** Opens the browser print dialog with the resume rendered as a print-friendly page.
   *  Users can select "Save as PDF" as their destination to get a real PDF. */
  printResume: (resume: ResumeData) => {
    const html = editorService.generateResumeHtml(resume);

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.title = 'Resume Print';

    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document;
    if (!iframeDoc) {
      document.body.removeChild(iframe);
      throw new Error('Could not create print window');
    }

    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();

    // Wait for fonts/images to load, then print
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } finally {
        // Clean up after print dialog closes (or after a timeout)
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 1000);
      }
    }, 500);
  }
};