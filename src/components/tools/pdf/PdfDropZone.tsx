"use client";

import { useCallback } from "react";
import { FileText, Upload } from "lucide-react";

interface PdfDropZoneProps {
  onFilesAdded: (files: File[]) => void;
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
}

export default function PdfDropZone({ onFilesAdded, multiple = true, disabled = false, label }: PdfDropZoneProps) {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    const files = Array.from(e.dataTransfer.files).filter(f => f.type === "application/pdf");
    if (files.length) onFilesAdded(files);
  }, [onFilesAdded, disabled]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).filter(f => f.type === "application/pdf");
    if (files.length) onFilesAdded(files);
    e.target.value = "";
  };

  return (
    <label
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
      className={`relative flex flex-col items-center justify-center w-full min-h-[220px]
                  rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
                  ${disabled
                    ? "border-slate-200 bg-slate-50 cursor-not-allowed opacity-60"
                    : "border-slate-300 bg-gradient-to-b from-slate-50 to-white hover:border-indigo-400 hover:bg-indigo-50/30"
                  }`}
    >
      <input
        type="file"
        accept="application/pdf"
        multiple={multiple}
        disabled={disabled}
        onChange={handleInput}
        className="sr-only"
      />

      <div className="flex flex-col items-center gap-3 p-8 text-center pointer-events-none">
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
          <FileText className="w-7 h-7 text-red-500" />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-700 mb-1">
            {label ?? (multiple ? "Drop PDF files here" : "Drop a PDF file here")}
          </p>
          <p className="text-xs text-slate-400">or click to browse</p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
          <Upload className="w-3.5 h-3.5" />
          PDF only · Max 100 MB per file
        </div>
      </div>
    </label>
  );
}
