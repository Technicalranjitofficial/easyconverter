"use client";

import { useEffect, useState } from "react";
import { X, ImageIcon } from "lucide-react";
import { formatBytes } from "@/lib/utils/fileUtils";

export type FileStatus = "ready" | "converting" | "done" | "error";

export interface FileItem {
  id: string;
  file: File;
  status: FileStatus;
  progress?: number;
  resultBlob?: Blob;
  resultName?: string;
  errorMessage?: string;
}

interface FileListProps {
  items: FileItem[];
  onRemove: (id: string) => void;
}

function FileThumbnail({ file }: { file: File }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!src) {
    return (
      <div className="w-11 h-11 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
        <ImageIcon className="w-5 h-5 text-slate-400" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="w-11 h-11 rounded-lg object-cover flex-shrink-0 border border-slate-100 dark:border-slate-700"
      loading="lazy"
    />
  );
}

const statusConfig = {
  ready:      { dot: "bg-slate-300 dark:bg-slate-600", label: "Ready" },
  converting: { dot: "bg-amber-400 animate-pulse",     label: "Converting…" },
  done:       { dot: "bg-emerald-500",                 label: "Done" },
  error:      { dot: "bg-red-500",                     label: "Error" },
};

export default function FileList({ items, onRemove }: FileListProps) {
  if (items.length === 0) return null;

  return (
    <div className="w-full space-y-2">
      {/* Dark mini-header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          {items.length} file{items.length !== 1 ? "s" : ""} queued
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500">Ready to compress</span>
      </div>

      {items.map((item) => {
        const cfg = statusConfig[item.status];
        const borderAccent =
          item.status === "done"
            ? "border-l-emerald-500"
            : item.status === "error"
            ? "border-l-red-500"
            : item.status === "converting"
            ? "border-l-amber-400"
            : "border-l-slate-300 dark:border-l-slate-600";
        return (
          <div
            key={item.id}
            className={`flex items-center gap-3 p-3 rounded-xl border-l-[3px] ${borderAccent}
                       bg-white dark:bg-slate-800/60
                       border border-slate-100 dark:border-slate-700/50
                       hover:border-indigo-200 dark:hover:border-indigo-800/60
                       transition-all duration-200 group animate-fade-in`}
          >
            <FileThumbnail file={item.file} />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                {item.file.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`}
                />
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {formatBytes(item.file.size)}
                </span>
                <span className="text-xs text-slate-300 dark:text-slate-600">·</span>
                <span
                  className={`text-xs font-medium ${
                    item.status === "done"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : item.status === "error"
                      ? "text-red-500"
                      : item.status === "converting"
                      ? "text-amber-500"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {item.status === "error" ? item.errorMessage ?? "Failed" : cfg.label}
                </span>
              </div>

              {/* Progress bar while converting */}
              {item.status === "converting" && (
                <div className="mt-1.5 h-1 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300"
                    style={{ width: `${item.progress ?? 30}%` }}
                  />
                </div>
              )}
            </div>

            {/* Remove button */}
            {item.status !== "converting" && (
              <button
                onClick={() => onRemove(item.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity
                           p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700
                           text-slate-400 hover:text-slate-600 dark:hover:text-slate-200
                           flex-shrink-0"
                aria-label={`Remove ${item.file.name}`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
