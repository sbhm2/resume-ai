import { useState, useRef } from 'react';
import { UploadCloud, FileText, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const FileUpload = ({ file, onFileChange }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    setError(null);
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError('Invalid file type. Please upload a PDF or DOCX.');
      return;
    }
    if (selectedFile.size > MAX_SIZE) {
      setError('File exceeds 2MB limit.');
      return;
    }
    onFileChange(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Resume File</h3>
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-border hover:bg-accent/50",
            error && "border-destructive/50 bg-destructive/5"
          )}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.docx"
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
          />
          <UploadCloud className="w-10 h-10 text-muted-foreground mb-4" />
          <p className="text-sm font-medium">Drag and drop your resume</p>
          <p className="text-xs text-muted-foreground mt-1">Supports PDF, DOCX up to 2MB</p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-background border rounded-xl shadow-sm">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button onClick={() => onFileChange(null)} className="p-2 hover:bg-accent rounded-md text-muted-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1 mt-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </p>
      )}
    </div>
  );
};