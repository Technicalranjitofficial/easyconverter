"use client";

import { useState, useCallback } from "react";
import { Loader2, Download, RotateCcw, FileText, Info, Save } from "lucide-react";
import PdfDropZone from "./PdfDropZone";
import { readPdfMetadata, writePdfMetadata, type PdfMetadata } from "@/lib/converters/pdfConverter";
import { formatBytes } from "@/lib/utils/fileUtils";
import { triggerDownload } from "@/lib/utils/downloadUtils";

const EMPTY: PdfMetadata = { title: "", author: "", subject: "", keywords: "", creator: "", producer: "" };

export default function PdfMetadataEditor() {
  const [file, setFile]     = useState<File | null>(null);
  const [meta, setMeta]     = useState<PdfMetadata>(EMPTY);
  const [original, setOriginal] = useState<PdfMetadata>(EMPTY);
  const [loading, setLoading]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [result, setResult]     = useState<{ blob: Blob; size: number } | null>(null);

  const handleFile = useCallback(async (files: File[]) => {
    const f = files[0]; if (!f) return;
    setFile(f); setResult(null); setLoading(true);
    try {
      const m = await readPdfMetadata(f);
      setMeta(m); setOriginal(m);
    } catch { alert("Failed to read PDF metadata."); }
    finally { setLoading(false); }
  }, []);

  const handleSave = async () => {
    if (!file) return;
    setSaving(true);
    try {
      const r = await writePdfMetadata(file, meta);
      setResult({ blob: r.blob, size: r.resultSize });
    } catch { alert("Failed to write metadata."); }
    finally { setSaving(false); }
  };

  const clearAll = () => setMeta(EMPTY);
  const reset    = () => { setFile(null); setMeta(EMPTY); setOriginal(EMPTY); setResult(null); };

  const hasChanges = JSON.stringify(meta) !== JSON.stringify(original);

  const FIELDS: { key: keyof PdfMetadata; label: string; placeholder: string }[] = [
    { key: "title",    label: "Title",    placeholder: "Document title" },
    { key: "author",   label: "Author",   placeholder: "Author name" },
    { key: "subject",  label: "Subject",  placeholder: "Document subject" },
    { key: "keywords", label: "Keywords", placeholder: "keyword1, keyword2" },
    { key: "creator",  label: "Creator",  placeholder: "Application that created this PDF" },
    { key: "producer", label: "Producer", placeholder: "PDF producer" },
  ];

  return (
    <div className="w-full space-y-5">
      {!file && <PdfDropZone onFilesAdded={handleFile} multiple={false} />}

      {loading && (
        <div className="flex items-center justify-center py-8 gap-2 text-sm text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />Reading metadata…
        </div>
      )}

      {file && !loading && !result && (
        <>
          <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white">
            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
              <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
            </div>
            {hasChanges && (
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg flex-shrink-0">
                Unsaved changes
              </span>
            )}
          </div>

          {/* Metadata form */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">PDF Metadata</span>
              </div>
              <button onClick={clearAll}
                className="text-xs font-semibold text-slate-400 hover:text-red-400 transition-colors">
                Clear all
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {FIELDS.map(f => (
                <div key={f.key} className="flex items-center gap-4 px-4 py-3 bg-white hover:bg-slate-50 transition-colors">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 w-20 flex-shrink-0">
                    {f.label}
                  </label>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={meta[f.key]}
                      onChange={e => setMeta(prev => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full text-sm text-slate-700 bg-transparent border-0 border-b border-slate-200
                                 focus:border-indigo-400 focus:outline-none py-1 placeholder-slate-300 transition-colors"
                    />
                    {/* Show original value hint */}
                    {original[f.key] && meta[f.key] !== original[f.key] && (
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Was: <span className="text-slate-500 italic">{original[f.key] || "empty"}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleSave} disabled={saving}
            className="w-full flex items-center justify-center gap-2.5
                       py-4 rounded-2xl font-semibold text-white text-base
                       bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                       hover:from-slate-800 hover:via-indigo-600 hover:to-indigo-500
                       disabled:opacity-60 shadow-[0_4px_20px_rgba(79,70,229,0.4)]
                       hover:-translate-y-0.5 transition-all duration-200">
            {saving
              ? <><Loader2 className="w-5 h-5 animate-spin" />Saving…</>
              : <><Save className="w-5 h-5" />Save Metadata</>
            }
          </button>
        </>
      )}

      {result && (
        <div className="rounded-2xl overflow-hidden border border-emerald-200 shadow-sm animate-slide-up">
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-900">
            <Save className="w-4 h-4 text-emerald-400" />
            <p className="text-sm font-semibold text-white">Metadata saved successfully</p>
            <span className="ml-auto text-xs text-slate-400">{formatBytes(result.size)}</span>
          </div>
          <div className="flex gap-3 p-4 bg-emerald-50">
            <button onClick={() => triggerDownload(result.blob, file!.name.replace(".pdf", "-metadata.pdf"))}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white text-sm
                         bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600 hover:-translate-y-0.5 transition-all">
              <Download className="w-4 h-4" />Download Updated PDF
            </button>
            <button onClick={reset}
              className="flex items-center gap-2 py-3 px-5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all">
              <RotateCcw className="w-4 h-4" />Edit Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
