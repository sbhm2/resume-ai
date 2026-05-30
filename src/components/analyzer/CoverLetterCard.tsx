import { useState } from 'react';
import { Copy, Download, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CoverLetterCard = ({ content }: { content: string }) => {
  const [letter, setLetter] = useState(content);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([letter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Cover_Letter.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-surface border rounded-xl shadow-sm overflow-hidden flex flex-col h-[600px]">
      <div className="flex items-center justify-between p-4 border-b bg-accent/30">
        <h3 className="text-sm font-semibold">Generated Cover Letter</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />} Copy
          </Button>
          <Button variant="default" size="sm" onClick={handleDownloadTxt}>
            <Download className="w-4 h-4 mr-2" /> Download TXT
          </Button>
        </div>
      </div>
      <textarea
        value={letter}
        onChange={(e) => setLetter(e.target.value)}
        className="w-full h-full p-6 text-sm leading-relaxed resize-none focus:outline-none focus:ring-inset focus:ring-1 focus:ring-primary/20 bg-background"
      />
    </div>
  );
};