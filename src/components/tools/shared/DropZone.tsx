"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud, FolderOpen } from "lucide-react";
import { validateFile } from "@/lib/utils/fileUtils";
import { formatBytes } from "@/lib/utils/fileUtils";

interface DropZoneProps {
  onFilesAdded: (files: File[]) => void;
  acceptedTypes: string[];
  maxSizeMB: number;
  maxFiles: number;
  currentCount: number;
  disabled?: boolean;
}

export default function DropZone({
  onFilesAdded,
  acceptedTypes,
  maxSizeMB,
  maxFiles,
  currentCount,
  disabled = false,
}: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    (rawFiles: FileList | File[]) => {
      setError(null);
      const files = Array.from(rawFiles);
      const remaining = maxFiles - currentCount;

      if (files.length > remaining) {
        setError(`You can add ${remaining} more file${remaining !== 1 ? "s" : ""} (max ${maxFiles})`);
        return;
      }

      const valid: File[] = [];
      for (const file of files) {
        const result = validateFile(file, acceptedTypes, maxSizeMB);
        if (!result.valid) {
          setError(result.error ?? "Invalid file");
          return;
        }
        valid.push(file);
      }

      if (valid.length > 0) onFilesAdded(valid);
    },
    [acceptedTypes, maxSizeMB, maxFiles, currentCount, onFilesAdded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;
      processFiles(e.dataTransfer.files);
    },
    [disabled, processFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback(() => setIsDragOver(false), []);

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = "";
  };

  // Clipboard paste support
  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      if (disabled) return;
      const items = Array.from(e.clipboardData.items);
      const imageFiles = items
        .filter((item) => item.kind === "file" && item.type.startsWith("image/"))
        .map((item) => item.getAsFile())
        .filter(Boolean) as File[];
      if (imageFiles.length > 0) processFiles(imageFiles);
    },
    [disabled, processFiles]
  );

  const accept = acceptedTypes.join(",");
  const isFull = currentCount >= maxFiles;

  return (
    <div className="w-full space-y-2">
      <div
        className={`dropzone-base ${isDragOver ? "dropzone-active" : ""} ${
          disabled || isFull ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onPaste={handlePaste}
        role="button"
        tabIndex={0}
        aria-label="Upload files"
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          className="sr-only"
          onChange={handleInputChange}
          disabled={disabled || isFull}
        />

        <div className="flex flex-col items-center gap-3 pointer-events-none px-6 py-8">
          {/* Icon */}
          <div
            className={`p-4 rounded-2xl transition-all duration-300 ${
              isDragOver
                ? "bg-indigo-100 dark:bg-indigo-500/20 scale-110"
                : "bg-slate-100 dark:bg-slate-700/60 group-hover:scale-105"
            }`}
          >
            {isDragOver ? (
              <UploadCloud className="w-9 h-9 text-indigo-500 animate-bounce" />
            ) : (
              <FolderOpen className="w-9 h-9 text-slate-400 dark:text-slate-500" />
            )}
          </div>

          {/* Text */}
          {isDragOver ? (
            <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
              Drop files here!
            </p>
          ) : isFull ? (
            <p className="text-base font-medium text-slate-500 dark:text-slate-400">
              Maximum {maxFiles} files reached
            </p>
          ) : (
            <>
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-200 text-center">
                Drag & drop your images here
              </p>
              <p className="text-sm text-slate-400 dark:text-slate-500">
                or{" "}
                <span className="text-indigo-500 font-medium underline underline-offset-2">
                  browse files
                </span>
                {" "}· paste from clipboard
              </p>
              <p className="text-xs text-slate-300 dark:text-slate-600 text-center">
                {acceptedTypes
                  .map((t) => t.split("/")[1].toUpperCase().replace("JPEG", "JPG"))
                  .join(", ")}{" "}
                · Max {formatBytes(maxSizeMB * 1024 * 1024)} per file · Up to {maxFiles} files
              </p>
            </>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1.5 animate-fade-in">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
