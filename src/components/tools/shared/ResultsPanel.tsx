"use client";

import { CheckCircle2, Download, Archive, ArrowRight, RotateCcw } from "lucide-react";
import { formatBytes, savingsPercent } from "@/lib/utils/fileUtils";
import { triggerDownload, downloadAllAsZip } from "@/lib/utils/downloadUtils";
import type { FileItem } from "./FileList";

interface ResultsPanelProps {
  items: FileItem[];
  onReset: () => void;
}

export default function ResultsPanel({ items, onReset }: ResultsPanelProps) {
  const doneItems = items.filter((i) => i.status === "done" && i.resultBlob);
  if (doneItems.length === 0) return null;

  const totalOriginal = doneItems.reduce((s, i) => s + i.file.size, 0);
  const totalConverted = doneItems.reduce(
    (s, i) => s + (i.resultBlob?.size ?? 0),
    0
  );
  const overallSaving = savingsPercent(totalOriginal, totalConverted);

  const handleDownloadOne = (item: FileItem) => {
    if (item.resultBlob && item.resultName) {
      triggerDownload(item.resultBlob, item.resultName);
    }
  };

  const handleDownloadAll = () => {
    const files = doneItems.map((i) => ({
      blob: i.resultBlob!,
      name: i.resultName!,
    }));
    downloadAllAsZip(files);
  };

  return (
    <div className="w-full space-y-4 animate-slide-up">
      {/* Summary banner */}
      <div className="rounded-2xl overflow-hidden border border-emerald-200 dark:border-emerald-500/20 shadow-sm">
        {/* Dark top strip */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-900 dark:bg-slate-950">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 flex-shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-sm font-semibold text-white">
            {doneItems.length} file{doneItems.length !== 1 ? "s" : ""} compressed successfully
          </p>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-1.5 px-4 py-3
                        bg-emerald-50 dark:bg-emerald-500/10">
          <span className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
            {formatBytes(totalOriginal)}
          </span>
          <ArrowRight className="w-3 h-3 text-emerald-400" />
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
            {formatBytes(totalConverted)}
          </span>
          {overallSaving > 0 && (
            <span className="ml-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400
                             bg-emerald-100 dark:bg-emerald-500/20 px-2 py-0.5 rounded-full">
              -{overallSaving}% saved
            </span>
          )}
          {overallSaving < 0 && (
            <span className="ml-1 text-xs text-emerald-600/60 dark:text-emerald-400/60">
              (PNG is lossless — larger is normal)
            </span>
          )}
        </div>
      </div>

      {/* Individual file results */}
      <div className="space-y-2">
        {doneItems.map((item) => {
          const saving = savingsPercent(item.file.size, item.resultBlob?.size ?? 0);
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-xl border-l-[3px] border-l-emerald-500
                         bg-white dark:bg-slate-800/60
                         border border-slate-100 dark:border-slate-700/50
                         shadow-sm
                         animate-bounce-in"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                  {item.resultName}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs text-slate-400 line-through">
                    {formatBytes(item.file.size)}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-300" />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    {formatBytes(item.resultBlob?.size ?? 0)}
                  </span>
                  {saving > 0 && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium ml-1">
                      -{saving}%
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleDownloadOne(item)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                           bg-slate-900 hover:bg-slate-800
                           text-white
                           text-xs font-medium transition-colors flex-shrink-0
                           shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {doneItems.length > 1 && (
          <button
            onClick={handleDownloadAll}
            className="flex-1 flex items-center justify-center gap-2
                       py-3.5 px-6 rounded-2xl font-semibold text-white text-sm
                       bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                       hover:from-slate-800 hover:via-indigo-600 hover:to-indigo-500
                       shadow-[0_4px_20px_rgba(79,70,229,0.35)] hover:shadow-[0_6px_28px_rgba(79,70,229,0.45)]
                       hover:-translate-y-0.5 active:translate-y-0
                       transition-all duration-200"
          >
            <Archive className="w-4 h-4" />
            Download All as ZIP ({formatBytes(totalConverted)})
          </button>
        )}

        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2
                     py-3.5 px-6 rounded-2xl font-semibold text-sm
                     text-slate-600 dark:text-slate-300
                     bg-slate-100 dark:bg-slate-800
                     hover:bg-slate-200 dark:hover:bg-slate-700
                     transition-all duration-200"
        >
          <RotateCcw className="w-4 h-4" />
          Convert More Files
        </button>
      </div>
    </div>
  );
}
