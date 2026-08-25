export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

export function getExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() ?? "";
}

export function stripExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, "");
}

export function getMimeType(ext: string): string {
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    avif: "image/avif",
  };
  return map[ext.toLowerCase()] ?? "application/octet-stream";
}

export function savingsPercent(original: number, converted: number): number {
  if (original === 0) return 0;
  return Math.round(((original - converted) / original) * 100);
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

export function validateFile(
  file: File,
  acceptedTypes: string[],
  maxSizeMB: number
): { valid: boolean; error?: string } {
  if (!acceptedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported format: ${file.type || "unknown"}. Accepted: ${acceptedTypes.join(", ")}`,
    };
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return {
      valid: false,
      error: `File too large: ${formatBytes(file.size)}. Max: ${maxSizeMB}MB`,
    };
  }
  return { valid: true };
}
