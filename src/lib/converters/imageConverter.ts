export type ImageOutputFormat = "image/jpeg" | "image/png" | "image/webp";

export interface ConversionOptions {
  outputFormat: ImageOutputFormat;
  quality?: number;       // 0–1, default 0.92
  backgroundColor?: string; // for JPG transparency handling, default "#ffffff"
}

export interface ResizeOptions {
  width: number;
  height: number;
  maintainAspect?: boolean;
  outputFormat?: ImageOutputFormat;
  quality?: number;
}

export interface ConversionResult {
  blob: Blob;
  originalSize: number;
  convertedSize: number;
  width: number;
  height: number;
  fileName: string;
}

// ─── Core conversion (format change) ────────────────────────────────────────

export async function convertImage(
  file: File,
  options: ConversionOptions
): Promise<ConversionResult> {
  const { outputFormat, quality = 0.92, backgroundColor = "#ffffff" } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        return reject(new Error("Canvas context unavailable"));
      }

      // Fill background for JPG (transparent areas → white)
      if (outputFormat === "image/jpeg") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(objectUrl);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Conversion failed"));
          const ext = outputFormat.split("/")[1].replace("jpeg", "jpg");
          const fileName = file.name.replace(/\.[^.]+$/, `.${ext}`);
          resolve({
            blob,
            originalSize: file.size,
            convertedSize: blob.size,
            width: canvas.width,
            height: canvas.height,
            fileName,
          });
        },
        outputFormat,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to load image: ${file.name}`));
    };

    img.src = objectUrl;
  });
}

// ─── Compression (same format, reduced quality) ──────────────────────────────

export async function compressImage(
  file: File,
  quality: number // 0–100
): Promise<ConversionResult> {
  const q = Math.min(100, Math.max(1, quality)) / 100;
  // Keep format for PNG (lossless anyway), use JPEG quality for JPG/WebP
  let format: ImageOutputFormat = "image/jpeg";
  if (file.type === "image/webp") format = "image/webp";
  if (file.type === "image/png") format = "image/png";

  return convertImage(file, {
    outputFormat: format,
    quality: format === "image/png" ? 1 : q,
    backgroundColor: "#ffffff",
  });
}

// ─── Resize ──────────────────────────────────────────────────────────────────

export async function resizeImage(
  file: File,
  opts: ResizeOptions
): Promise<ConversionResult> {
  const {
    width,
    height,
    maintainAspect = true,
    outputFormat = "image/jpeg",
    quality = 0.92,
  } = opts;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      let targetW = width;
      let targetH = height;

      if (maintainAspect) {
        const ratio = img.naturalWidth / img.naturalHeight;
        if (width && height) {
          // Fit within box
          if (width / height > ratio) {
            targetW = Math.round(height * ratio);
          } else {
            targetH = Math.round(width / ratio);
          }
        } else if (width) {
          targetH = Math.round(width / ratio);
        } else if (height) {
          targetW = Math.round(height * ratio);
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        return reject(new Error("Canvas context unavailable"));
      }

      if (outputFormat === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, targetW, targetH);
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, targetW, targetH);
      URL.revokeObjectURL(objectUrl);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Resize failed"));
          const ext = outputFormat.split("/")[1].replace("jpeg", "jpg");
          const fileName = file.name.replace(/\.[^.]+$/, `.${ext}`);
          resolve({
            blob,
            originalSize: file.size,
            convertedSize: blob.size,
            width: targetW,
            height: targetH,
            fileName,
          });
        },
        outputFormat,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to load: ${file.name}`));
    };

    img.src = objectUrl;
  });
}

// ─── Batch helper ────────────────────────────────────────────────────────────

export async function batchConvert(
  files: File[],
  options: ConversionOptions,
  onProgress?: (completed: number, total: number) => void
): Promise<ConversionResult[]> {
  const results: ConversionResult[] = [];
  let completed = 0;

  // Process in parallel (browser handles concurrency)
  const promises = files.map(async (file) => {
    const result = await convertImage(file, options);
    completed++;
    onProgress?.(completed, files.length);
    return result;
  });

  const settled = await Promise.allSettled(promises);
  for (const s of settled) {
    if (s.status === "fulfilled") results.push(s.value);
  }
  return results;
}

// ─── Get image dimensions ────────────────────────────────────────────────────

export function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image dimensions"));
    };
    img.src = url;
  });
}

// ─── SVG to PNG ──────────────────────────────────────────────────────────────

export async function svgToPng(
  file: File,
  outputWidth?: number // optional scale override
): Promise<ConversionResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const svgText = reader.result as string;

      // Parse viewBox / width / height from SVG
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgText, "image/svg+xml");
      const svgEl = doc.querySelector("svg");
      if (!svgEl) return reject(new Error("Invalid SVG file"));

      const vb = svgEl.getAttribute("viewBox");
      let naturalW = parseFloat(svgEl.getAttribute("width") ?? "0");
      let naturalH = parseFloat(svgEl.getAttribute("height") ?? "0");

      if ((!naturalW || !naturalH) && vb) {
        const parts = vb.split(/[\s,]+/);
        naturalW = parseFloat(parts[2]) || 512;
        naturalH = parseFloat(parts[3]) || 512;
      }
      if (!naturalW) naturalW = 512;
      if (!naturalH) naturalH = 512;

      // Default 2× for sharpness
      const scale = outputWidth ? outputWidth / naturalW : 2;
      const canvasW = Math.round(naturalW * scale);
      const canvasH = Math.round(naturalH * scale);

      const img = new Image();
      const blob = new Blob([svgText], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = canvasW;
        canvas.height = canvasH;
        const ctx = canvas.getContext("2d");
        if (!ctx) { URL.revokeObjectURL(url); return reject(new Error("Canvas unavailable")); }

        ctx.drawImage(img, 0, 0, canvasW, canvasH);
        URL.revokeObjectURL(url);

        canvas.toBlob((outBlob) => {
          if (!outBlob) return reject(new Error("PNG conversion failed"));
          const fileName = file.name.replace(/\.svg$/i, ".png");
          resolve({
            blob: outBlob,
            originalSize: file.size,
            convertedSize: outBlob.size,
            width: canvasW,
            height: canvasH,
            fileName,
          });
        }, "image/png");
      };

      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error(`Failed to render SVG: ${file.name}`)); };
      img.src = url;
    };

    reader.onerror = () => reject(new Error("Could not read SVG file"));
    reader.readAsText(file);
  });
}

// ─── Crop ────────────────────────────────────────────────────────────────────

export interface CropArea {
  x: number;       // pixels from left
  y: number;       // pixels from top
  width: number;
  height: number;
}

export async function cropImage(
  file: File,
  crop: CropArea,
  outputFormat: ImageOutputFormat = "image/jpeg",
  quality = 0.92
): Promise<ConversionResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(crop.width);
      canvas.height = Math.round(crop.height);

      const ctx = canvas.getContext("2d");
      if (!ctx) { URL.revokeObjectURL(objectUrl); return reject(new Error("Canvas unavailable")); }

      if (outputFormat === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(
        img,
        crop.x, crop.y, crop.width, crop.height,
        0, 0, canvas.width, canvas.height
      );
      URL.revokeObjectURL(objectUrl);

      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Crop failed"));
        const ext = outputFormat.split("/")[1].replace("jpeg", "jpg");
        const fileName = file.name.replace(/\.[^.]+$/, `-cropped.${ext}`);
        resolve({
          blob,
          originalSize: file.size,
          convertedSize: blob.size,
          width: canvas.width,
          height: canvas.height,
          fileName,
        });
      }, outputFormat, quality);
    };

    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error(`Failed to load: ${file.name}`)); };
    img.src = objectUrl;
  });
}
