import { useState, useEffect } from 'react';
import { Copy, Download, Check, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';

interface DocumentEditorProps {
  /** Current document content */
  content: string;
  /** Title shown in the sheet header */
  title: string;
  /** Filename (without extension) for downloads */
  downloadFilename: string;
  /** Whether the sheet is open */
  open: boolean;
  /** Called when the sheet is closed */
  onOpenChange: (open: boolean) => void;
  /** Called when the user saves edits. Receive the edited content. */
  onSave?: (content: string) => void;
  /** Optional: slot for template selector UI (future use) */
  templateSelector?: React.ReactNode;
  /** Supported download formats. Defaults to ['txt'] */
  downloadFormats?: DownloadFormat[];
  /** Whether a save is in progress */
  isSaving?: boolean;
}

type DownloadFormat = 'txt' | 'html';

const downloadAsTxt = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

const downloadAsHtml = (content: string, filename: string) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${filename}</title>
  <style>
    @page { margin: 1in; size: letter; }
    body { font-family: 'Georgia', 'Times New Roman', serif; color: #1a1a1a; line-height: 1.7; padding: 48px 56px; max-width: 800px; margin: 0 auto; }
    h1 { font-size: 22px; font-weight: 700; margin-bottom: 16px; }
    p { font-size: 13px; margin-bottom: 12px; white-space: pre-wrap; }
  </style>
</head>
<body>
  <p style="white-space: pre-wrap; font-size: 13px; line-height: 1.7;">${content}</p>
</body>
</html>`;
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.html`;
  a.click();
  URL.revokeObjectURL(url);
};

export const DocumentEditor = ({
  content,
  title,
  downloadFilename,
  open,
  onOpenChange,
  onSave,
  templateSelector,
  downloadFormats = ['txt'],
  isSaving = false,
}: DocumentEditorProps) => {
  const [editedContent, setEditedContent] = useState(content);
  const [copied, setCopied] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Reset state when content or open changes
  useEffect(() => {
    if (open) {
      setEditedContent(content);
      setHasChanges(false);
    }
  }, [open, content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(editedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: DownloadFormat) => {
    if (format === 'html') {
      downloadAsHtml(editedContent, downloadFilename);
    } else {
      downloadAsTxt(editedContent, downloadFilename);
    }
  };

  const handleSave = () => {
    onSave?.(editedContent);
    setHasChanges(false);
  };

  const handleChange = (value: string) => {
    setEditedContent(value);
    setHasChanges(value !== content);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" />
            {title}
          </SheetTitle>
          <SheetDescription>
            Edit the content below and download when ready.
          </SheetDescription>
        </SheetHeader>

        {/* Template selector slot (future use) */}
        {templateSelector && (
          <div className="px-6 pb-2">
            {templateSelector}
          </div>
        )}

        {/* Editable content */}
        <div className="flex-1 min-h-0 px-6 pb-4">
          <Textarea
            value={editedContent}
            onChange={(e) => handleChange(e.target.value)}
            className="min-h-[400px] h-full text-sm leading-relaxed resize-none font-mono"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 px-6 pb-6 border-t pt-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
            {downloadFormats.map((fmt) => (
              <Button key={fmt} variant="outline" size="sm" onClick={() => handleDownload(fmt)}>
                <Download className="w-4 h-4 mr-1.5" />
                Download {fmt.toUpperCase()}
              </Button>
            ))}
          </div>
          {hasChanges && onSave && (
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
