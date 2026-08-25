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

// ─── Image → Base64 ──────────────────────────────────────────────────────────

export interface Base64Result {
  dataUri: string;   // data:image/png;base64,...
  rawBase64: string; // just the base64 string
  mimeType: string;
  fileName: string;
  originalSize: number;
  encodedLength: number;
}

export async function imageToBase64(file: File): Promise<Base64Result> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUri = reader.result as string;
      const [prefix, rawBase64] = dataUri.split(",");
      const mimeType = prefix.split(":")[1].split(";")[0];
      resolve({
        dataUri,
        rawBase64,
        mimeType,
        fileName: file.name,
        originalSize: file.size,
        encodedLength: rawBase64.length,
      });
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

// ─── Base64 → Image ──────────────────────────────────────────────────────────

export interface Base64DecodeResult {
  blob: Blob;
  mimeType: string;
  width: number;
  height: number;
  fileName: string;
}

export async function base64ToImage(
  input: string,
  outputFormat: ImageOutputFormat = "image/png",
  quality = 0.92
): Promise<Base64DecodeResult> {
  // Normalise: accept raw base64 or full data URI
  let dataUri = input.trim();
  if (!dataUri.startsWith("data:")) {
    // Attempt to detect mime from magic bytes
    dataUri = `data:image/png;base64,${dataUri}`;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas unavailable"));
      if (outputFormat === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Conversion failed"));
        const ext = outputFormat.split("/")[1].replace("jpeg", "jpg");
        const mimeType = dataUri.split(":")[1]?.split(";")[0] ?? "image/png";
        resolve({ blob, mimeType, width: canvas.width, height: canvas.height, fileName: `decoded-image.${ext}` });
      }, outputFormat, quality);
    };
    img.onerror = () => reject(new Error("Invalid Base64 or unsupported image format"));
    img.src = dataUri;
  });
}

// ─── Color Picker ────────────────────────────────────────────────────────────

export interface PickedColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  rgba: { r: number; g: number; b: number; a: number };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
      case gn: h = ((bn - rn) / d + 2) / 6; break;
      case bn: h = ((rn - gn) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function pickColorFromCanvas(
  canvas: HTMLCanvasElement,
  x: number,
  y: number
): PickedColor {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  const [r, g, b, a] = ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data;
  return {
    hex: rgbToHex(r, g, b),
    rgb: { r, g, b },
    hsl: rgbToHsl(r, g, b),
    rgba: { r, g, b, a },
  };
}

// ─── Image Metadata ──────────────────────────────────────────────────────────

export interface ImageMetadata {
  fileName: string;
  fileSize: number;
  mimeType: string;
  width: number;
  height: number;
  megapixels: string;
  aspectRatio: string;
  // EXIF (JPEG only, parsed manually from raw bytes)
  exif: Record<string, string>;
}

export async function extractImageMetadata(file: File): Promise<ImageMetadata> {
  const dims = await getImageDimensions(file);
  const mp = (dims.width * dims.height / 1_000_000).toFixed(1);
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const g = gcd(dims.width, dims.height);
  const aspectRatio = `${dims.width / g}:${dims.height / g}`;

  // Basic EXIF extraction for JPEG
  const exif: Record<string, string> = {};
  if (file.type === "image/jpeg") {
    try {
      const buf = await file.arrayBuffer();
      const view = new DataView(buf);
      // Find APP1 marker (0xFFE1)
      let offset = 2;
      while (offset < view.byteLength - 2) {
        const marker = view.getUint16(offset);
        if (marker === 0xFFE1) {
          const len = view.getUint16(offset + 2);
          // Check "Exif\0\0"
          const header = String.fromCharCode(...new Uint8Array(buf, offset + 4, 6));
          if (header.startsWith("Exif")) {
            const tiffStart = offset + 10;
            const byteOrder = view.getUint16(tiffStart);
            const le = byteOrder === 0x4949;
            const get16 = (o: number) => le ? view.getUint16(tiffStart + o, true) : view.getUint16(tiffStart + o, false);
            const get32 = (o: number) => le ? view.getUint32(tiffStart + o, true) : view.getUint32(tiffStart + o, false);
            const ifdOffset = get32(4);
            const numEntries = get16(ifdOffset);

            const tagNames: Record<number, string> = {
              0x010F: "Camera Make", 0x0110: "Camera Model",
              0x0131: "Software", 0x0132: "Date Modified",
              0x9003: "Date Taken", 0x9004: "Date Digitized",
              0x8827: "ISO", 0x829A: "Exposure Time",
              0x829D: "F-Number", 0x9201: "Shutter Speed",
              0x9202: "Aperture", 0x9209: "Flash",
              0x920A: "Focal Length", 0xA002: "Image Width",
              0xA003: "Image Height", 0xA434: "Lens Model",
              0x0213: "YCbCr Positioning", 0x0112: "Orientation",
            };

            for (let i = 0; i < numEntries; i++) {
              const entryOffset = ifdOffset + 2 + i * 12;
              const tag = get16(entryOffset);
              const type = get16(entryOffset + 2);
              const count = get32(entryOffset + 4);
              const valOffset = get32(entryOffset + 8);

              if (tagNames[tag]) {
                try {
                  if (type === 2) {
                    // ASCII string
                    const strStart = count <= 4 ? entryOffset + 8 : tiffStart + valOffset;
                    let str = "";
                    for (let c = 0; c < count - 1; c++) {
                      const ch = view.getUint8(strStart + c);
                      if (ch === 0) break;
                      str += String.fromCharCode(ch);
                    }
                    if (str.trim()) exif[tagNames[tag]] = str.trim();
                  } else if (type === 3) {
                    // SHORT
                    const v = count <= 2 ? (le ? view.getUint16(entryOffset + 8, true) : view.getUint16(entryOffset + 8, false)) : get16(tiffStart + valOffset);
                    exif[tagNames[tag]] = String(v);
                  } else if (type === 5) {
                    // RATIONAL
                    const rOff = tiffStart + valOffset;
                    const num = get32(rOff);
                    const den = get32(rOff + 4);
                    if (den !== 0) {
                      if (tag === 0x829A) exif[tagNames[tag]] = `${num}/${den} s`;
                      else if (tag === 0x829D) exif[tagNames[tag]] = `f/${(num / den).toFixed(1)}`;
                      else if (tag === 0x920A) exif[tagNames[tag]] = `${(num / den).toFixed(0)}mm`;
                      else exif[tagNames[tag]] = `${num}/${den}`;
                    }
                  }
                } catch { /* skip malformed entry */ }
              }
            }
          }
          break;
        }
        if ((marker & 0xFF00) !== 0xFF00) break;
        offset += 2 + view.getUint16(offset + 2);
      }
    } catch { /* EXIF parsing is best-effort */ }
  }

  return {
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type,
    width: dims.width,
    height: dims.height,
    megapixels: mp,
    aspectRatio,
    exif,
  };
}

// ─── Watermark ───────────────────────────────────────────────────────────────

export type WatermarkPosition =
  | "top-left" | "top-center" | "top-right"
  | "middle-left" | "center" | "middle-right"
  | "bottom-left" | "bottom-center" | "bottom-right";

export interface WatermarkOptions {
  text: string;
  fontSize: number;        // px relative to image width (e.g. 3 = 3%)
  color: string;           // CSS color string
  opacity: number;         // 0–1
  position: WatermarkPosition;
  fontFamily?: string;
  paddingPercent?: number; // % of image width as padding from edge, default 2
  tile?: boolean;          // repeat across entire image
}

export async function addWatermark(
  file: File,
  opts: WatermarkOptions,
  outputFormat: ImageOutputFormat = "image/jpeg",
  quality = 0.92
): Promise<ConversionResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { URL.revokeObjectURL(objectUrl); return reject(new Error("Canvas unavailable")); }

      // Draw base image
      if (outputFormat === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(objectUrl);

      // Watermark settings
      const fsPx = Math.round((opts.fontSize / 100) * canvas.width);
      ctx.globalAlpha = opts.opacity;
      ctx.font = `bold ${fsPx}px ${opts.fontFamily ?? "Inter, Arial, sans-serif"}`;
      ctx.fillStyle = opts.color;
      ctx.textBaseline = "middle";

      const pad = Math.round(((opts.paddingPercent ?? 2) / 100) * canvas.width);
      const metrics = ctx.measureText(opts.text);
      const tw = metrics.width;
      const th = fsPx;

      if (opts.tile) {
        // Tile across entire image diagonally
        ctx.save();
        const step = tw + fsPx * 4;
        for (let y = -canvas.height; y < canvas.height * 2; y += step) {
          for (let x = -canvas.width; x < canvas.width * 2; x += step) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(-Math.PI / 6);
            ctx.fillText(opts.text, 0, 0);
            ctx.restore();
          }
        }
        ctx.restore();
      } else {
        // Position presets
        let tx = 0, ty = 0;
        const pos = opts.position;
        if (pos.includes("left"))   tx = pad;
        if (pos.includes("center") || pos === "center") tx = (canvas.width - tw) / 2;
        if (pos.includes("right"))  tx = canvas.width - tw - pad;
        if (pos.includes("top"))    ty = pad + th / 2;
        if (pos.includes("middle") || pos === "center") ty = canvas.height / 2;
        if (pos.includes("bottom")) ty = canvas.height - pad - th / 2;
        ctx.fillText(opts.text, tx, ty);
      }

      ctx.globalAlpha = 1;

      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Watermark failed"));
        const ext = outputFormat.split("/")[1].replace("jpeg", "jpg");
        const fileName = file.name.replace(/\.[^.]+$/, `-watermarked.${ext}`);
        resolve({ blob, originalSize: file.size, convertedSize: blob.size, width: canvas.width, height: canvas.height, fileName });
      }, outputFormat, quality);
    };

    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error(`Failed to load: ${file.name}`)); };
    img.src = objectUrl;
  });
}
