"use client";

import { useState, useCallback, useId } from "react";
import { Loader2, Wand2 } from "lucide-react";
import DropZone from "@/components/tools/shared/DropZone";
import FileList, { type FileItem } from "@/components/tools/shared/FileList";
import ResultsPanel from "@/components/tools/shared/ResultsPanel";
import { convertImage, type ImageOutputFormat } from "@/lib/converters/imageConverter";

interface ImageConverterCoreProps {
  outputFormat: ImageOutputFormat;
  outputExtension: string;
  acceptedTypes: string[];
  maxFileSizeMB?: number;
  maxBatchSize?: number;
  quality?: number;
  /** Label on the convert button */
  actionLabel?: string;
}

export default function ImageConverterCore({
  outputFormat,
  outputExtension,
  acceptedTypes,
  maxFileSizeMB = 50,
  maxBatchSize = 20,
  quality = 0.92,
  actionLabel,
}: ImageConverterCoreProps) {
  const uid = useId();
  const [items, setItems] = useState<FileItem[]>([]);
  const [converting, setConverting] = useState(false);
  const [allDone, setAllDone] = useState(false);

  const addFiles = useCallback((files: File[]) => {
    const newItems: FileItem[] = files.map((file) => ({
      id: `${uid}-${file.name}-${file.lastModified}`,
      file,
      status: "ready",
    }));
    setItems((prev) => [...prev, ...newItems]);
    setAllDone(false);
  }, [uid]);

  const removeFile = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const handleConvert = async () => {
    const readyItems = items.filter((i) => i.status === "ready");
    if (readyItems.length === 0) return;

    setConverting(true);

    // Mark all as converting
    setItems((prev) =>
      prev.map((i) =>
        i.status === "ready" ? { ...i, status: "converting", progress: 10 } : i
      )
    );

    // Process in parallel
    const promises = readyItems.map(async (item) => {
      try {
        // Animate progress
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, progress: 40 } : i))
        );

        const result = await convertImage(item.file, { outputFormat, quality });

        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  status: "done",
                  progress: 100,
                  resultBlob: result.blob,
                  resultName: result.fileName,
                }
              : i
          )
        );
      } catch (err) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  status: "error",
                  errorMessage: err instanceof Error ? err.message : "Conversion failed",
                }
              : i
          )
        );
      }
    });

    await Promise.allSettled(promises);
    setConverting(false);
    setAllDone(true);
  };

  const handleReset = () => {
    setItems([]);
    setAllDone(false);
  };

  const readyCount = items.filter((i) => i.status === "ready").length;
  const doneItems = items.filter((i) => i.status === "done");
  const buttonLabel =
    actionLabel ??
    `Convert ${readyCount > 0 ? readyCount : ""} file${readyCount !== 1 ? "s" : ""} to ${outputExtension.toUpperCase()}`;

  return (
    <div className="w-full space-y-4">
      {/* Drop zone — hide when all done */}
      {!allDone && (
        <DropZone
          onFilesAdded={addFiles}
          acceptedTypes={acceptedTypes}
          maxSizeMB={maxFileSizeMB}
          maxFiles={maxBatchSize}
          currentCount={items.length}
          disabled={converting}
        />
      )}

      {/* File list — only show pending/converting items */}
      {!allDone && items.length > 0 && (
        <FileList
          items={items.filter((i) => i.status !== "done")}
          onRemove={removeFile}
        />
      )}

      {/* Convert button */}
      {!allDone && readyCount > 0 && (
        <button
          onClick={handleConvert}
          disabled={converting || readyCount === 0}
          className="w-full flex items-center justify-center gap-2.5
                     py-4 px-8 rounded-2xl font-semibold text-white text-base
                     bg-gradient-to-r from-indigo-600 to-indigo-500
                     hover:from-indigo-500 hover:to-indigo-400
                     disabled:opacity-60 disabled:cursor-not-allowed
                     shadow-lg shadow-indigo-500/25
                     hover:shadow-xl hover:shadow-indigo-500/30
                     hover:-translate-y-0.5 active:translate-y-0 active:shadow-md
                     transition-all duration-200"
        >
          {converting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Converting…
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              {buttonLabel}
            </>
          )}
        </button>
      )}

      {/* Results */}
      {doneItems.length > 0 && (
        <ResultsPanel items={doneItems} onReset={handleReset} />
      )}
    </div>
  );
}
