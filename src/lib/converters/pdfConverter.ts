/**
 * pdfConverter.ts
 * All PDF operations using pdf-lib (manipulation) + pdfjs-dist (rendering).
 * Everything runs 100% client-side — no files are uploaded.
 */

import { PDFDocument, degrees, rgb, StandardFonts, PageSizes } from "pdf-lib";

// ─── Shared helpers ───────────────────────────────────────────────────────────

export interface PdfResult {
  blob: Blob;
  fileName: string;
  originalSize: number;
  resultSize: number;
  pageCount: number;
}

async function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error(`Failed to read: ${file.name}`));
    reader.readAsArrayBuffer(file);
  });
}

function pdfBlobResult(bytes: Uint8Array, fileName: string, original: number, pageCount: number): PdfResult {
  const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
  return { blob, fileName, originalSize: original, resultSize: blob.size, pageCount };
}

// ─── Merge PDFs ───────────────────────────────────────────────────────────────

export async function mergePdfs(files: File[]): Promise<PdfResult> {
  const merged = await PDFDocument.create();
  let totalOriginal = 0;
  let totalPages = 0;

  for (const file of files) {
    totalOriginal += file.size;
    const buf = await fileToArrayBuffer(file);
    const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach(p => merged.addPage(p));
    totalPages += doc.getPageCount();
  }

  const bytes = await merged.save();
  return pdfBlobResult(bytes, "merged.pdf", totalOriginal, totalPages);
}

// ─── Split PDF ────────────────────────────────────────────────────────────────

export type SplitMode = "all" | "range" | "pages";

export interface SplitOptions {
  mode: SplitMode;
  range?: { from: number; to: number };   // 1-indexed
  pages?: number[];                        // 1-indexed
}

export interface SplitResult {
  blobs: { blob: Blob; fileName: string }[];
  originalSize: number;
}

export async function splitPdf(file: File, opts: SplitOptions): Promise<SplitResult> {
  const buf = await fileToArrayBuffer(file);
  const src = await PDFDocument.load(buf, { ignoreEncryption: true });
  const total = src.getPageCount();
  const baseName = file.name.replace(/\.pdf$/i, "");

  let pageGroups: number[][];

  if (opts.mode === "all") {
    pageGroups = Array.from({ length: total }, (_, i) => [i]);
  } else if (opts.mode === "range" && opts.range) {
    const from = Math.max(1, opts.range.from) - 1;
    const to   = Math.min(total, opts.range.to) - 1;
    pageGroups = [Array.from({ length: to - from + 1 }, (_, i) => from + i)];
  } else if (opts.mode === "pages" && opts.pages) {
    pageGroups = opts.pages
      .filter(p => p >= 1 && p <= total)
      .map(p => [p - 1]);
  } else {
    pageGroups = Array.from({ length: total }, (_, i) => [i]);
  }

  const blobs: { blob: Blob; fileName: string }[] = [];

  for (let i = 0; i < pageGroups.length; i++) {
    const doc = await PDFDocument.create();
    const copied = await doc.copyPages(src, pageGroups[i]);
    copied.forEach(p => doc.addPage(p));
    const bytes = await doc.save();
    const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
    const label = opts.mode === "all"
      ? `page-${pageGroups[i][0] + 1}`
      : opts.mode === "range"
      ? `pages-${opts.range!.from}-${opts.range!.to}`
      : `page-${opts.pages![i]}`;
    blobs.push({ blob, fileName: `${baseName}-${label}.pdf` });
  }

  return { blobs, originalSize: file.size };
}

// ─── Compress PDF ─────────────────────────────────────────────────────────────

export type CompressionLevel = "screen" | "ebook" | "print";

// Image quality per level
const COMPRESSION_QUALITY: Record<CompressionLevel, number> = {
  screen: 0.4,
  ebook:  0.7,
  print:  0.85,
};

// Scale factor for embedded images per level (1 = original size)
const COMPRESSION_SCALE: Record<CompressionLevel, number> = {
  screen: 0.6,
  ebook:  0.8,
  print:  1.0,
};

export async function compressPdf(file: File, level: CompressionLevel = "ebook"): Promise<PdfResult> {
  const buf = await fileToArrayBuffer(file);
  const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
  const quality = COMPRESSION_QUALITY[level];
  const imgScale = COMPRESSION_SCALE[level];

  // Strip metadata
  doc.setTitle(""); doc.setAuthor(""); doc.setSubject("");
  doc.setKeywords([]); doc.setProducer(""); doc.setCreator("");

  // Re-compress embedded JPEG images via Canvas API
  // This is the main source of savings for image-heavy PDFs
  try {
    const context = doc.context;
    for (const [, obj] of context.enumerateIndirectObjects()) {
      if (obj && typeof obj === "object" && "dict" in obj && "contents" in obj) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const streamObj = obj as any;
        const subtype = streamObj.dict?.lookup?.({ toString: () => "/Subtype" });
        const isImage = subtype && subtype.toString() === "/Image";
        if (!isImage) continue;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filter = (streamObj.dict as any)?.get?.("Filter");
        const isJpeg = filter && filter.toString().includes("DCTDecode");
        if (!isJpeg && level !== "screen") continue;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const wObj = (streamObj.dict as any)?.get?.("Width");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const hObj = (streamObj.dict as any)?.get?.("Height");
        if (!wObj || !hObj) continue;

        const origW = Number(wObj);
        const origH = Number(hObj);
        const newW   = Math.max(1, Math.round(origW * imgScale));
        const newH   = Math.max(1, Math.round(origH * imgScale));

        const rawBytes: Uint8Array = streamObj.contents;
        const imgBlob = new Blob([rawBytes as unknown as BlobPart], { type: "image/jpeg" });
        const url = URL.createObjectURL(imgBlob);

        await new Promise<void>(resolve => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width  = newW;
            canvas.height = newH;
            const ctx = canvas.getContext("2d");
            if (!ctx) { URL.revokeObjectURL(url); resolve(); return; }
            ctx.drawImage(img, 0, 0, newW, newH);
            canvas.toBlob(async (blob) => {
              URL.revokeObjectURL(url);
              if (!blob) { resolve(); return; }
              try {
                const newBytes = new Uint8Array(await blob.arrayBuffer());
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                streamObj.contents = newBytes as any;
                // Replace stream content and update Width/Height
                streamObj.contents = newBytes;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (streamObj.dict as any)?.set?.("Width", context.obj(newW));
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (streamObj.dict as any)?.set?.("Height", context.obj(newH));
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (streamObj.dict as any)?.set?.("Length", context.obj(newBytes.length));
              } catch { /* non-fatal */ }
              resolve();
            }, "image/jpeg", quality);
          };
          img.onerror = () => { URL.revokeObjectURL(url); resolve(); };
          img.src = url;
        });
      }
    }
  } catch { /* image re-compression failed — fall back to metadata-only strip */ }

  const bytes = await doc.save({ useObjectStreams: true });
  const baseName = file.name.replace(/\.pdf$/i, "");
  return pdfBlobResult(bytes, `${baseName}-compressed.pdf`, file.size, doc.getPageCount());
}

// ─── Rotate PDF ───────────────────────────────────────────────────────────────

export type RotationAngle = 90 | 180 | 270;
export type RotatePageSelection = "all" | number[]; // number[] = 1-indexed page numbers

export async function rotatePdf(
  file: File,
  angle: RotationAngle,
  selection: RotatePageSelection = "all"
): Promise<PdfResult> {
  const buf = await fileToArrayBuffer(file);
  const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
  const pages = doc.getPages();

  const targets = selection === "all"
    ? pages.map((_, i) => i)
    : (selection as number[]).map(p => p - 1).filter(i => i >= 0 && i < pages.length);

  for (const i of targets) {
    const page = pages[i];
    const current = page.getRotation().angle;
    page.setRotation(degrees((current + angle) % 360));
  }

  const bytes = await doc.save();
  const baseName = file.name.replace(/\.pdf$/i, "");
  return pdfBlobResult(bytes, `${baseName}-rotated.pdf`, file.size, pages.length);
}

// ─── PDF Watermark ────────────────────────────────────────────────────────────

export interface PdfWatermarkOptions {
  text: string;
  fontSize: number;
  opacity: number;        // 0–1
  angle: number;          // degrees
  color: { r: number; g: number; b: number }; // 0–1 each
  tile: boolean;
  position?: "center" | "diagonal";
}

export async function watermarkPdf(file: File, opts: PdfWatermarkOptions): Promise<PdfResult> {
  const buf = await fileToArrayBuffer(file);
  const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.HelveticaBold);

  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(opts.text, opts.fontSize);

    if (opts.tile) {
      const stepX = textWidth + opts.fontSize * 4;
      const stepY = opts.fontSize * 5;
      for (let y = 0; y < height + stepY; y += stepY) {
        for (let x = -textWidth; x < width + textWidth; x += stepX) {
          page.drawText(opts.text, {
            x, y,
            size: opts.fontSize,
            font,
            color: rgb(opts.color.r, opts.color.g, opts.color.b),
            opacity: opts.opacity,
            rotate: degrees(opts.angle),
          });
        }
      }
    } else {
      page.drawText(opts.text, {
        x: (width - textWidth) / 2,
        y: height / 2,
        size: opts.fontSize,
        font,
        color: rgb(opts.color.r, opts.color.g, opts.color.b),
        opacity: opts.opacity,
        rotate: degrees(opts.angle),
      });
    }
  }

  const bytes = await doc.save();
  const baseName = file.name.replace(/\.pdf$/i, "");
  return pdfBlobResult(bytes, `${baseName}-watermarked.pdf`, file.size, doc.getPageCount());
}

// ─── PDF Page Numbers ─────────────────────────────────────────────────────────

export type PageNumberPosition =
  | "bottom-center" | "bottom-left" | "bottom-right"
  | "top-center"    | "top-left"    | "top-right";

export interface PageNumberOptions {
  position: PageNumberPosition;
  fontSize: number;
  startNumber: number;
  prefix?: string;   // e.g. "Page "
  suffix?: string;   // e.g. " of {total}"
  margin?: number;   // px from edge, default 20
}

export async function addPageNumbers(file: File, opts: PageNumberOptions): Promise<PdfResult> {
  const buf = await fileToArrayBuffer(file);
  const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();
  const total = pages.length;
  const margin = opts.margin ?? 20;

  pages.forEach((page, idx) => {
    const { width, height } = page.getSize();
    const num = opts.startNumber + idx;
    const suffix = opts.suffix ? opts.suffix.replace("{total}", String(total)) : "";
    const label = `${opts.prefix ?? ""}${num}${suffix}`;
    const textW = font.widthOfTextAtSize(label, opts.fontSize);

    let x: number;
    let y: number;

    const pos = opts.position;
    if (pos.includes("left"))   x = margin;
    else if (pos.includes("right")) x = width - textW - margin;
    else x = (width - textW) / 2; // center

    if (pos.includes("top"))    y = height - margin - opts.fontSize;
    else                        y = margin;

    page.drawText(label, {
      x, y,
      size: opts.fontSize,
      font,
      color: rgb(0.2, 0.2, 0.2),
      opacity: 0.85,
    });
  });

  const bytes = await doc.save();
  const baseName = file.name.replace(/\.pdf$/i, "");
  return pdfBlobResult(bytes, `${baseName}-numbered.pdf`, file.size, total);
}

// ─── PDF to Images (pdfjs-dist) ───────────────────────────────────────────────

export interface PdfToImageOptions {
  format: "image/jpeg" | "image/png";
  scale: number;    // 1 = 72dpi, 2 = 144dpi, ~4 = 300dpi
  quality?: number; // JPEG quality 0–1
}

export interface PdfPageImage {
  blob: Blob;
  fileName: string;
  pageNumber: number;
  width: number;
  height: number;
}

export async function pdfToImages(
  file: File,
  opts: PdfToImageOptions,
  onProgress?: (done: number, total: number) => void
): Promise<PdfPageImage[]> {
  // Dynamically import pdfjs-dist to avoid SSR issues
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

  const buf = await fileToArrayBuffer(file);
  const pdfDoc = await pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise;
  const total = pdfDoc.numPages;
  const baseName = file.name.replace(/\.pdf$/i, "");
  const ext = opts.format === "image/jpeg" ? "jpg" : "png";
  const results: PdfPageImage[] = [];

  for (let i = 1; i <= total; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: opts.scale });
    const canvas = document.createElement("canvas");
    canvas.width  = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    const ctx = canvas.getContext("2d")!;

    if (opts.format === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    await page.render({ canvasContext: ctx, viewport }).promise;

    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(b => b ? resolve(b) : reject(new Error("Canvas toBlob failed")),
        opts.format, opts.quality ?? 0.92)
    );

    results.push({
      blob,
      fileName: `${baseName}-page-${String(i).padStart(3, "0")}.${ext}`,
      pageNumber: i,
      width: canvas.width,
      height: canvas.height,
    });

    onProgress?.(i, total);
  }

  return results;
}

// ─── PDF info ─────────────────────────────────────────────────────────────────

export interface PdfInfo {
  pageCount: number;
  fileSize: number;
  title?: string;
  author?: string;
}

export async function getPdfInfo(file: File): Promise<PdfInfo> {
  const buf = await fileToArrayBuffer(file);
  const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
  return {
    pageCount: doc.getPageCount(),
    fileSize: file.size,
    title: doc.getTitle() ?? undefined,
    author: doc.getAuthor() ?? undefined,
  };
}

// ─── Detect if PDF has embedded images (for compressor UI) ───────────────────

export async function hasPdfImages(file: File): Promise<boolean> {
  const buf = await fileToArrayBuffer(file);
  const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
  try {
    for (const [, obj] of doc.context.enumerateIndirectObjects()) {
      if (!obj || typeof obj !== "object" || !("dict" in obj) || !("contents" in obj)) continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dict = (obj as any).dict as any;
      if (!dict?.get) continue;
      const subtype = dict.get("Subtype");
      if (subtype && subtype.toString().includes("Image")) return true;
    }
  } catch { /* ignore */ }
  return false;
}

export interface PdfPageThumb {
  pageNumber: number;   // 1-indexed
  dataUrl: string;      // base64 canvas snapshot
  width: number;
  height: number;
}

/**
 * Renders every page of a PDF to a small canvas thumbnail using pdfjs-dist.
 * @param scale  0.15–0.3 is good for thumbnails (default 0.2 ≈ 120px wide for A4)
 */
export async function renderPdfThumbnails(
  file: File,
  scale = 0.2,
  onProgress?: (done: number, total: number) => void
): Promise<PdfPageThumb[]> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

  const buf = await fileToArrayBuffer(file);
  const pdfDoc = await pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise;
  const total = pdfDoc.numPages;
  const thumbs: PdfPageThumb[] = [];

  for (let i = 1; i <= total; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width  = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
    thumbs.push({
      pageNumber: i,
      dataUrl: canvas.toDataURL("image/jpeg", 0.7),
      width: canvas.width,
      height: canvas.height,
    });
    onProgress?.(i, total);
  }
  return thumbs;
}
