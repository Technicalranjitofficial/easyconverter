export type ToolCategory = "image" | "pdf" | "video" | "audio" | "unit" | "code";
export type ImageOutputFormat = "image/jpeg" | "image/png" | "image/webp";

export interface FAQ {
  question: string;
  answer: string;
}

export interface ToolConfig {
  id: string;
  category: ToolCategory;
  slug: string;
  title: string;
  headline: string;
  description: string;
  keywords: string[];
  inputFormats: string[];
  outputFormat: string;
  outputExtension: string;
  maxFileSizeMB: number;
  maxBatchSize: number;
  faqs: FAQ[];
  howToSteps: string[];
  relatedTools: string[];
  searchVolume: number;
  comingSoon?: boolean;
  longDescription: string;
  actionVerb: string;
}

export const imageTools: ToolConfig[] = [
  {
    id: "jpg-to-png",
    category: "image",
    slug: "/image/jpg-to-png",
    title: "JPG to PNG Converter – Free Online, No Upload",
    headline: "Convert JPG to PNG Free Online",
    description:
      "Convert JPG to PNG online for free. No upload required — conversion happens instantly in your browser. Supports batch conversion of up to 20 JPEG files at once.",
    longDescription:
      "Our free JPG to PNG converter lets you change JPEG images to PNG format directly in your browser — no file upload, no sign-up, no watermarks. PNG is a lossless format that preserves every pixel of your original JPG while adding transparency support, making it ideal for logos, graphics, and screenshots. The conversion uses your browser's native Canvas API, so your files never leave your device. You can convert JPG to PNG in seconds and batch-process up to 20 JPEG images simultaneously.",
    actionVerb: "convert JPG to PNG",
    keywords: [
      "jpg to png",
      "jpg to png converter",
      "convert jpg to png",
      "jpeg to png converter",
      "jpg to png online",
      "jpg to png free",
      "convert jpeg to png online free",
      "jpg png",
      "jpeg png converter",
      "change jpg to png",
    ],
    inputFormats: ["image/jpeg"],
    outputFormat: "image/png",
    outputExtension: "png",
    maxFileSizeMB: 50,
    maxBatchSize: 20,
    searchVolume: 800000,
    relatedTools: ["png-to-jpg", "image-to-webp", "image-compressor", "png-to-webp"],
    howToSteps: [
      "Click 'Choose Files' or drag and drop your JPG images onto the drop zone.",
      "Click the 'Convert to PNG' button — conversion happens instantly in your browser.",
      "Download your PNG files individually or all at once as a ZIP.",
    ],
    faqs: [
      {
        question: "Is the JPG to PNG converter free?",
        answer:
          "Yes, completely free with no limits. No account required, no watermarks, no hidden fees.",
      },
      {
        question: "Do my files get uploaded to a server?",
        answer:
          "No. All conversion happens directly in your browser using the Canvas API. Your files never leave your device.",
      },
      {
        question: "Will converting JPG to PNG increase file size?",
        answer:
          "Yes, PNG is a lossless format and is typically larger than JPG. If file size matters more than quality, consider using WebP instead.",
      },
      {
        question: "Can I convert multiple JPG files at once?",
        answer:
          "Yes, you can batch convert up to 20 JPG files at once. All files are processed simultaneously.",
      },
      {
        question: "Does PNG support transparency?",
        answer:
          "Yes. Unlike JPG, PNG supports transparent backgrounds. However, the converted PNG will have a white background since JPG has no transparency data.",
      },
    ],
  },
  {
    id: "png-to-jpg",
    category: "image",
    slug: "/image/png-to-jpg",
    title: "PNG to JPG Converter – Free Online, No Upload",
    headline: "Convert PNG to JPG Free Online",
    description:
      "Convert PNG to JPG online for free. Reduce file size by up to 80% with adjustable quality. No upload needed — runs entirely in your browser. Batch convert up to 20 PNG files.",
    longDescription:
      "Our free PNG to JPG converter compresses PNG images to JPEG format directly in your browser, with no file upload or account required. Converting PNG to JPG can reduce file size by 60–80%, making images load faster on websites and emails. Use the quality slider to balance file size against image sharpness. Transparent areas in your PNG are automatically filled with a white background in the JPG output. Batch-convert up to 20 PNG files simultaneously.",
    actionVerb: "convert PNG to JPG",
    keywords: [
      "png to jpg",
      "png to jpg converter",
      "convert png to jpg",
      "png to jpeg",
      "png to jpg online",
      "png to jpg free",
      "convert png to jpeg online free",
      "png jpg converter",
      "change png to jpg",
      "png to jpg without losing quality",
    ],
    inputFormats: ["image/png"],
    outputFormat: "image/jpeg",
    outputExtension: "jpg",
    maxFileSizeMB: 50,
    maxBatchSize: 20,
    searchVolume: 600000,
    relatedTools: ["jpg-to-png", "image-compressor", "image-to-webp", "webp-to-jpg"],
    howToSteps: [
      "Drop your PNG files onto the upload area or click to browse.",
      "Adjust the quality slider (default 92%) to balance size vs. quality.",
      "Click 'Convert to JPG' and download your compressed files.",
    ],
    faqs: [
      {
        question: "Is there quality loss when converting PNG to JPG?",
        answer:
          "JPG uses lossy compression, so some quality is reduced. At 90%+ quality the difference is barely visible. Use the quality slider to control this trade-off.",
      },
      {
        question: "What happens to transparent areas in PNG?",
        answer:
          "JPG doesn't support transparency. Transparent areas in your PNG will be filled with a white background in the converted JPG.",
      },
      {
        question: "How much smaller will the JPG be?",
        answer:
          "Typically 50–80% smaller than the original PNG, depending on the image content and quality setting.",
      },
      {
        question: "Can I batch convert multiple PNG files?",
        answer: "Yes, up to 20 files at once. All convert simultaneously in your browser.",
      },
      {
        question: "Is this tool free to use?",
        answer: "100% free. No sign-up, no watermarks, no limits.",
      },
    ],
  },
  {
    id: "image-to-webp",
    category: "image",
    slug: "/image/image-to-webp",
    title: "Image to WebP Converter – Free Online, No Upload",
    headline: "Convert Images to WebP Free Online",
    description:
      "Convert JPG, PNG, and GIF to WebP online for free. WebP images are 25–35% smaller than JPG at the same quality. No upload required — runs in your browser.",
    longDescription:
      "Our free image to WebP converter changes JPG, PNG, and GIF files to WebP format directly in your browser. WebP is Google's modern image format that delivers smaller file sizes — typically 25–35% smaller than JPEG and up to 80% smaller than PNG — without a visible quality difference. Converting images to WebP improves your website's Core Web Vitals and page speed. No file is uploaded to any server. Batch-convert up to 20 images to WebP at once.",
    actionVerb: "convert images to WebP",
    keywords: [
      "image to webp",
      "jpg to webp",
      "png to webp",
      "convert to webp",
      "convert image to webp online free",
      "webp converter",
      "webp converter online",
      "jpg to webp converter",
      "png to webp converter",
      "image to webp converter free",
    ],
    inputFormats: ["image/jpeg", "image/png", "image/gif"],
    outputFormat: "image/webp",
    outputExtension: "webp",
    maxFileSizeMB: 50,
    maxBatchSize: 20,
    searchVolume: 400000,
    relatedTools: ["webp-to-png", "webp-to-jpg", "image-compressor", "png-to-webp"],
    howToSteps: [
      "Upload your JPG, PNG, or GIF files by dropping them on the upload area.",
      "Optionally adjust the quality setting (default 85% for optimal size/quality balance).",
      "Click convert and download your WebP files.",
    ],
    faqs: [
      {
        question: "Why should I use WebP instead of JPG or PNG?",
        answer:
          "WebP is 25–35% smaller than JPG and up to 80% smaller than PNG at equivalent quality, making pages load faster.",
      },
      {
        question: "Is WebP supported by all browsers?",
        answer:
          "Yes. WebP is supported by Chrome, Firefox, Safari (14+), Edge, and all modern mobile browsers.",
      },
      {
        question: "Does WebP support transparency like PNG?",
        answer:
          "Yes. WebP supports both lossy and lossless compression, as well as transparency (alpha channel).",
      },
      {
        question: "Can I convert GIF to WebP?",
        answer:
          "Yes, but animated GIFs will be converted as a static image (first frame). Animated WebP conversion requires additional processing.",
      },
      {
        question: "Is this converter free?",
        answer: "Completely free, no account needed, no file limits.",
      },
    ],
  },
  {
    id: "image-compressor",
    category: "image",
    slug: "/image/image-compressor",
    title: "Image Compressor – Compress Images Online Free",
    headline: "Compress Images Online Free — Up to 80% Smaller",
    description:
      "Compress JPG, PNG, and WebP images online for free. Reduce image file size by up to 80% without visible quality loss. No upload required — works in your browser.",
    longDescription:
      "Our free online image compressor reduces JPG, PNG, and WebP file sizes by up to 80% without any noticeable quality loss. Large images slow down websites and increase storage costs — our tool uses smart quality compression to shrink your images while keeping them sharp. Use the quality slider to find the perfect balance. All compression happens locally in your browser — your images are never uploaded to any server. Compress images in bulk: up to 20 files simultaneously.",
    actionVerb: "compress images",
    keywords: [
      "image compressor",
      "compress image",
      "compress image online",
      "image compressor online",
      "compress jpg",
      "compress png",
      "reduce image size",
      "compress image without losing quality",
      "online image compressor free",
      "reduce image file size",
      "compress photo",
      "image size reducer",
    ],
    inputFormats: ["image/jpeg", "image/png", "image/webp"],
    outputFormat: "image/jpeg",
    outputExtension: "jpg",
    maxFileSizeMB: 50,
    maxBatchSize: 20,
    searchVolume: 500000,
    relatedTools: ["image-resizer", "jpg-to-png", "image-to-webp", "png-to-jpg"],
    howToSteps: [
      "Upload your images by dropping them onto the area or clicking to browse.",
      "Use the quality slider to set your desired compression level (80% recommended).",
      "Click Compress and download your smaller image files.",
    ],
    faqs: [
      {
        question: "How much can you compress an image?",
        answer:
          "Typically 40–80% file size reduction depending on the original image and quality setting. Photos compress more than graphics.",
      },
      {
        question: "Will compression affect image quality?",
        answer:
          "At 80%+ quality the difference is almost invisible to the naked eye. Lower quality settings show more artifacts but produce smaller files.",
      },
      {
        question: "What image formats can I compress?",
        answer: "JPG, PNG, and WebP. All three formats are supported for batch compression.",
      },
      {
        question: "Is there a file size limit?",
        answer: "Up to 50MB per file, up to 20 files at once.",
      },
      {
        question: "Do files get sent to a server?",
        answer:
          "No. Everything runs locally in your browser. Your images are never uploaded anywhere.",
      },
    ],
  },
  {
    id: "image-resizer",
    category: "image",
    slug: "/image/image-resizer",
    title: "Image Resizer – Resize Images Online Free",
    headline: "Resize Images Online Free — Set Exact Dimensions",
    description:
      "Resize images to exact pixel dimensions online for free. Set custom width and height, maintain aspect ratio. Supports JPG, PNG, WebP. No upload needed.",
    longDescription:
      "Our free online image resizer lets you change image dimensions to exact pixel sizes instantly. Whether you need to resize images for social media (Instagram, Twitter, Facebook), email, or web use, our tool handles it in seconds. Enable aspect ratio lock to prevent distortion when resizing. All resizing happens locally in your browser — no file is ever uploaded to a server. Batch-resize up to 10 images to the same dimensions at once.",
    actionVerb: "resize images",
    keywords: [
      "image resizer",
      "resize image",
      "resize image online",
      "resize image free",
      "image resizer online",
      "resize photo",
      "change image size",
      "crop and resize image online",
      "resize image to specific size",
      "resize jpg",
      "resize png",
      "image resize tool",
    ],
    inputFormats: ["image/jpeg", "image/png", "image/webp"],
    outputFormat: "image/jpeg",
    outputExtension: "jpg",
    maxFileSizeMB: 50,
    maxBatchSize: 10,
    searchVolume: 700000,
    relatedTools: ["image-compressor", "jpg-to-png", "image-to-webp", "image-cropper"],
    howToSteps: [
      "Upload your image files to the resize tool.",
      "Enter your target width and height in pixels. Toggle aspect ratio lock to avoid distortion.",
      "Click Resize and download your resized images.",
    ],
    faqs: [
      {
        question: "Can I resize multiple images at once?",
        answer:
          "Yes, batch resize up to 10 images to the same dimensions simultaneously.",
      },
      {
        question: "What is aspect ratio lock?",
        answer:
          "When enabled, changing the width automatically adjusts the height to maintain the original proportions, preventing distortion.",
      },
      {
        question: "What output format does the resizer use?",
        answer:
          "By default JPG, but you can select PNG or WebP if you need transparency or lossless output.",
      },
      {
        question: "Can I enlarge a small image?",
        answer:
          "Yes, but enlarging an image beyond its original resolution will reduce sharpness. Downscaling always produces better results.",
      },
      {
        question: "Is the image resizer free?",
        answer: "Yes, completely free. No account required.",
      },
    ],
  },
  // ─── WebP conversions ──────────────────────────────────────────────────────
  {
    id: "webp-to-jpg",
    category: "image",
    slug: "/image/webp-to-jpg",
    title: "WebP to JPG Converter – Free Online, No Upload",
    headline: "Convert WebP to JPG Free Online",
    description:
      "Convert WebP to JPG online for free. No upload required — conversion runs in your browser. Fast, private, and supports batch WebP to JPEG conversion.",
    longDescription:
      "Our free WebP to JPG converter changes WebP images to universally compatible JPEG format directly in your browser. WebP is great for the web, but many apps, email clients, and older devices don't support it. Converting WebP to JPG solves compatibility issues instantly. No file is uploaded — everything runs locally. Batch convert up to 20 WebP files to JPG at once.",
    actionVerb: "convert WebP to JPG",
    keywords: [
      "webp to jpg",
      "webp to jpg converter",
      "convert webp to jpg",
      "webp to jpeg",
      "webp to jpg online",
      "webp to jpg free",
      "convert webp to jpeg online free",
      "webp jpg converter",
      "change webp to jpg",
      "webp to jpg without losing quality",
    ],
    inputFormats: ["image/webp"],
    outputFormat: "image/jpeg",
    outputExtension: "jpg",
    maxFileSizeMB: 50,
    maxBatchSize: 20,
    searchVolume: 350000,
    relatedTools: ["webp-to-png", "jpg-to-png", "image-to-webp", "image-compressor"],
    howToSteps: [
      "Drop your WebP files onto the upload area or click to browse.",
      "Click 'Convert to JPG' — your files are processed instantly in the browser.",
      "Download individual JPG files or all at once as a ZIP archive.",
    ],
    faqs: [
      {
        question: "Why convert WebP to JPG?",
        answer:
          "JPG is more universally supported — especially in older apps, email clients, and Windows photo viewers that don't yet handle WebP.",
      },
      {
        question: "Will there be quality loss?",
        answer:
          "Minimal at the default quality setting. Both WebP and JPG are lossy formats, so the conversion preserves most of the original detail.",
      },
      {
        question: "What happens to WebP transparency?",
        answer:
          "JPG doesn't support transparency. Any transparent areas will be filled with a white background during conversion.",
      },
      {
        question: "Can I batch convert WebP files?",
        answer: "Yes, up to 20 WebP files at once.",
      },
      {
        question: "Is this tool free?",
        answer: "100% free. No account, no watermarks, no limits.",
      },
    ],
  },
  {
    id: "webp-to-png",
    category: "image",
    slug: "/image/webp-to-png",
    title: "WebP to PNG Converter – Free Online, No Upload",
    headline: "Convert WebP to PNG Free Online",
    description:
      "Convert WebP to PNG online for free. Preserves transparency. No upload needed — runs in your browser. Free, fast, batch WebP to PNG conversion supported.",
    longDescription:
      "Our free WebP to PNG converter changes WebP images to lossless PNG format directly in your browser — no upload required, no account needed. PNG preserves transparency, so if your WebP has a transparent background it will be carried over to the PNG output. Batch convert up to 20 WebP files to PNG simultaneously.",
    actionVerb: "convert WebP to PNG",
    keywords: [
      "webp to png",
      "webp to png converter",
      "convert webp to png",
      "webp to png online",
      "webp to png free",
      "convert webp to png online free",
      "webp png converter",
      "change webp to png",
    ],
    inputFormats: ["image/webp"],
    outputFormat: "image/png",
    outputExtension: "png",
    maxFileSizeMB: 50,
    maxBatchSize: 20,
    searchVolume: 280000,
    relatedTools: ["webp-to-jpg", "png-to-jpg", "png-to-webp", "image-compressor"],
    howToSteps: [
      "Upload your WebP images by dropping them or clicking to browse.",
      "Click 'Convert to PNG' — no quality settings needed, PNG is lossless.",
      "Download your PNG files individually or as a ZIP.",
    ],
    faqs: [
      {
        question: "Does WebP to PNG preserve transparency?",
        answer:
          "Yes. PNG supports alpha transparency, so if your WebP has a transparent background it will be preserved in the output.",
      },
      {
        question: "Will the PNG be larger than the WebP?",
        answer:
          "Yes. PNG is a lossless format and is typically larger than WebP. If file size matters, consider converting to JPG instead.",
      },
      {
        question: "Is this converter free?",
        answer: "Completely free. No sign-up, no limits, no watermarks.",
      },
      {
        question: "Can I convert multiple WebP files at once?",
        answer: "Yes, up to 20 files simultaneously.",
      },
    ],
  },
  {
    id: "png-to-webp",
    category: "image",
    slug: "/image/png-to-webp",
    title: "PNG to WebP Converter – Free Online, No Upload",
    headline: "Convert PNG to WebP Free Online",
    description:
      "Convert PNG to WebP online for free. Reduce file size by up to 80% while keeping transparency. No upload — fully browser-based PNG to WebP converter.",
    longDescription:
      "Our free PNG to WebP converter changes PNG images to WebP format directly in your browser — up to 80% smaller file sizes with no visible quality difference. WebP supports alpha transparency just like PNG, so your transparent backgrounds are preserved. No file is ever uploaded. Batch convert up to 20 PNG files to WebP at once.",
    actionVerb: "convert PNG to WebP",
    keywords: [
      "png to webp",
      "png to webp converter",
      "convert png to webp",
      "png to webp online",
      "png to webp free",
      "convert png to webp online free",
      "png webp converter",
      "change png to webp",
    ],
    inputFormats: ["image/png"],
    outputFormat: "image/webp",
    outputExtension: "webp",
    maxFileSizeMB: 50,
    maxBatchSize: 20,
    searchVolume: 200000,
    relatedTools: ["webp-to-png", "image-to-webp", "png-to-jpg", "image-compressor"],
    howToSteps: [
      "Drop your PNG files or click to browse and select them.",
      "Optionally adjust the quality slider (default 85% gives great results).",
      "Click 'Convert to WebP' and download your smaller files.",
    ],
    faqs: [
      {
        question: "Does WebP support PNG transparency?",
        answer:
          "Yes. WebP supports alpha transparency just like PNG, so transparent backgrounds are preserved.",
      },
      {
        question: "How much smaller will WebP be compared to PNG?",
        answer:
          "Typically 60–80% smaller. WebP uses much more efficient compression than PNG.",
      },
      {
        question: "Will all browsers display WebP?",
        answer:
          "Yes. WebP is supported by all modern browsers including Chrome, Firefox, Safari 14+, and Edge.",
      },
      {
        question: "Is this converter free?",
        answer: "100% free. No account required.",
      },
    ],
  },
  {
    id: "jpg-to-webp",
    category: "image",
    slug: "/image/jpg-to-webp",
    title: "JPG to WebP Converter – Free Online, No Upload",
    headline: "Convert JPG to WebP Free Online",
    description:
      "Convert JPG to WebP online for free. Up to 35% smaller than JPG at the same quality. No upload needed — runs in your browser. Free JPG to WebP conversion.",
    longDescription:
      "Our free JPG to WebP converter changes JPEG images to WebP format directly in your browser — 25–35% smaller file sizes with no visible difference. WebP improves your website's page load speed and Core Web Vitals scores. No file is ever uploaded. Batch convert up to 20 JPG files to WebP at once.",
    actionVerb: "convert JPG to WebP",
    keywords: [
      "jpg to webp",
      "jpg to webp converter",
      "convert jpg to webp",
      "jpeg to webp",
      "jpg to webp online",
      "jpg to webp free",
      "convert jpg to webp online free",
      "jpeg to webp converter",
      "change jpg to webp",
    ],
    inputFormats: ["image/jpeg"],
    outputFormat: "image/webp",
    outputExtension: "webp",
    maxFileSizeMB: 50,
    maxBatchSize: 20,
    searchVolume: 180000,
    relatedTools: ["webp-to-jpg", "image-to-webp", "jpg-to-png", "image-compressor"],
    howToSteps: [
      "Upload your JPG/JPEG images by dragging and dropping or clicking to browse.",
      "Adjust quality if needed (default 85% is optimal for most photos).",
      "Click 'Convert to WebP' and download your files.",
    ],
    faqs: [
      {
        question: "How much smaller is WebP compared to JPG?",
        answer:
          "WebP is typically 25–35% smaller than JPG at equivalent visual quality.",
      },
      {
        question: "Will my photos look different in WebP?",
        answer:
          "At 85%+ quality, the difference is invisible to the naked eye. WebP simply stores the same data more efficiently.",
      },
      {
        question: "Is this free?",
        answer: "Yes, 100% free with no account required.",
      },
      {
        question: "Can I batch convert JPGs to WebP?",
        answer: "Yes, up to 20 files at once.",
      },
    ],
  },
  // ─── Special tools ─────────────────────────────────────────────────────────
  {
    id: "svg-to-png",
    category: "image",
    slug: "/image/svg-to-png",
    title: "SVG to PNG Converter – Free Online, Any Resolution",
    headline: "Convert SVG to PNG Free Online",
    description:
      "Convert SVG to PNG online for free. Set custom output resolution. No upload — runs entirely in your browser. Free SVG to PNG converter with batch support.",
    longDescription:
      "Our free SVG to PNG converter renders SVG vector files to crisp PNG raster images directly in your browser at any resolution you choose. SVG files aren't accepted by many platforms like Instagram, Twitter, or Slack — converting SVG to PNG solves this instantly. No file is uploaded to any server. Batch convert up to 20 SVG files to PNG at once.",
    actionVerb: "convert SVG to PNG",
    keywords: [
      "svg to png",
      "svg to png converter",
      "convert svg to png",
      "svg to png online",
      "svg to png free",
      "convert svg to png online free",
      "svg png converter",
      "svg to raster",
      "svg to image",
      "change svg to png",
    ],
    inputFormats: ["image/svg+xml"],
    outputFormat: "image/png",
    outputExtension: "png",
    maxFileSizeMB: 10,
    maxBatchSize: 20,
    searchVolume: 250000,
    relatedTools: ["png-to-jpg", "image-to-webp", "jpg-to-png", "image-resizer"],
    howToSteps: [
      "Upload your SVG files by dropping them onto the area or clicking to browse.",
      "Set your desired output width in pixels (height scales automatically).",
      "Click 'Convert to PNG' and download your rasterized images.",
    ],
    faqs: [
      {
        question: "What resolution will the PNG be?",
        answer:
          "By default we render at 2× the SVG's viewBox dimensions for a sharp result. You can set a custom width before converting.",
      },
      {
        question: "Will SVG transparency be preserved in PNG?",
        answer:
          "Yes. PNG supports alpha transparency, so transparent SVG backgrounds remain transparent.",
      },
      {
        question: "Can I convert multiple SVG files at once?",
        answer: "Yes, up to 20 SVG files simultaneously.",
      },
      {
        question: "Is this converter free?",
        answer: "100% free. No account, no upload, no watermarks.",
      },
      {
        question: "Why convert SVG to PNG?",
        answer:
          "SVG is not accepted by many platforms (Twitter, Instagram, Slack, email). PNG is universally supported.",
      },
    ],
  },
  {
    id: "gif-to-png",
    category: "image",
    slug: "/image/gif-to-png",
    title: "GIF to PNG Converter – Free Online, No Upload",
    headline: "Convert GIF to PNG Free Online",
    description:
      "Convert GIF to PNG online for free. Extracts the first frame as a high-quality lossless PNG. No upload needed — runs in your browser. Free GIF to PNG conversion.",
    longDescription:
      "Our free GIF to PNG converter extracts the first frame of your GIF and exports it as a lossless PNG image directly in your browser. This is perfect for getting a clean thumbnail from a GIF, removing animation, or converting a static GIF logo to a more compatible format. No file is ever uploaded. Batch convert up to 20 GIF files to PNG at once.",
    actionVerb: "convert GIF to PNG",
    keywords: [
      "gif to png",
      "gif to png converter",
      "convert gif to png",
      "gif to png online",
      "gif to png free",
      "convert gif to png online free",
      "gif png converter",
      "gif to image",
      "change gif to png",
    ],
    inputFormats: ["image/gif"],
    outputFormat: "image/png",
    outputExtension: "png",
    maxFileSizeMB: 20,
    maxBatchSize: 20,
    searchVolume: 120000,
    relatedTools: ["image-to-webp", "png-to-jpg", "jpg-to-png", "image-compressor"],
    howToSteps: [
      "Upload your GIF files onto the drop zone.",
      "The converter extracts the first frame of each GIF automatically.",
      "Download your PNG images individually or as a ZIP.",
    ],
    faqs: [
      {
        question: "Does this convert the entire GIF animation?",
        answer:
          "No. The converter extracts the first frame as a static PNG. Full animated GIF to animated WebP conversion is coming soon.",
      },
      {
        question: "Will transparency in the GIF be preserved?",
        answer:
          "Yes. If the GIF has a transparent background, the PNG output will also be transparent.",
      },
      {
        question: "Is this tool free?",
        answer: "100% free. No sign-up required.",
      },
      {
        question: "Can I batch convert GIF files?",
        answer: "Yes, up to 20 files at once.",
      },
    ],
  },
  {
    id: "image-cropper",
    category: "image",
    slug: "/image/image-cropper",
    title: "Image Cropper – Crop Images Online Free",
    headline: "Crop Images Online Free — Any Size or Ratio",
    description:
      "Crop images online for free. Set any size or aspect ratio (1:1, 16:9, 4:3). No upload needed — works entirely in your browser. Free online image cropping tool.",
    longDescription:
      "Our free online image cropper lets you visually select any region of your photo and export it at full quality. Lock to common aspect ratios like 1:1 (square), 16:9 (widescreen), 4:3, or 9:16 (portrait/mobile). Output in JPG, PNG, or WebP. No file is ever uploaded — everything runs locally in your browser using the Canvas API.",
    actionVerb: "crop images",
    keywords: [
      "image cropper",
      "crop image",
      "crop image online",
      "crop image free",
      "image crop tool",
      "online image cropper",
      "photo crop online",
      "crop photo online free",
      "crop jpg online",
      "crop png online",
      "image crop online free",
    ],
    inputFormats: ["image/jpeg", "image/png", "image/webp"],
    outputFormat: "image/jpeg",
    outputExtension: "jpg",
    maxFileSizeMB: 50,
    maxBatchSize: 1,
    searchVolume: 450000,
    relatedTools: ["image-resizer", "image-compressor", "jpg-to-png", "image-to-webp"],
    howToSteps: [
      "Upload an image by dropping it onto the crop tool.",
      "Drag the crop handles to select your desired region. Optionally lock an aspect ratio.",
      "Click 'Crop & Download' to save your cropped image.",
    ],
    faqs: [
      {
        question: "What aspect ratios are supported?",
        answer:
          "Free crop (any ratio), 1:1 (square), 16:9 (widescreen), 4:3 (standard), 3:2 (photo print), and 9:16 (portrait/mobile).",
      },
      {
        question: "What output format is used?",
        answer:
          "JPG by default. You can switch to PNG (for transparency) or WebP (for smaller size) before downloading.",
      },
      {
        question: "Is the cropper free?",
        answer: "Yes, completely free. No account needed.",
      },
      {
        question: "Do files get uploaded?",
        answer:
          "No. The cropper runs entirely in your browser using Canvas API. Your image never leaves your device.",
      },
      {
        question: "Can I crop multiple images at once?",
        answer:
          "The cropper works on one image at a time for precise control. For batch resizing use the Image Resizer tool.",
      },
    ],
  },
  // ─── Utility tools ─────────────────────────────────────────────────────────
  {
    id: "image-to-base64",
    category: "image",
    slug: "/image/image-to-base64",
    title: "Image to Base64 Converter – Free Online",
    headline: "Convert Image to Base64 Online Free",
    description:
      "Convert images to Base64 encoded strings online for free. Instantly encode JPG, PNG, WebP, GIF, SVG to Base64 — copy the data URI or raw string. No upload needed.",
    longDescription:
      "Our free image to Base64 converter encodes any image file into a Base64 string directly in your browser. Base64 encoding is useful for embedding images directly in HTML, CSS, or JSON without a separate file request. Copy the raw Base64 string or the full data URI (data:image/png;base64,...) and paste it anywhere. No file is ever uploaded — encoding happens 100% locally.",
    actionVerb: "convert image to Base64",
    keywords: [
      "image to base64",
      "image to base64 converter",
      "convert image to base64",
      "base64 encode image",
      "image base64 encoder",
      "jpg to base64",
      "png to base64",
      "base64 image online",
      "encode image base64 online free",
      "image to base64 string",
    ],
    inputFormats: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"],
    outputFormat: "text/plain",
    outputExtension: "txt",
    maxFileSizeMB: 10,
    maxBatchSize: 1,
    searchVolume: 300000,
    relatedTools: ["base64-to-image", "jpg-to-png", "image-compressor", "svg-to-png"],
    howToSteps: [
      "Upload your image by dropping it onto the tool or clicking to browse.",
      "The Base64 string and data URI are generated instantly.",
      "Click 'Copy' to copy the Base64 string or data URI to your clipboard.",
    ],
    faqs: [
      {
        question: "What is Base64 image encoding?",
        answer:
          "Base64 encoding converts binary image data into a text string that can be embedded directly in HTML, CSS, JSON, or any text-based format without needing a separate file.",
      },
      {
        question: "What's the difference between Base64 and data URI?",
        answer:
          "A data URI includes the MIME type prefix (e.g., data:image/png;base64,...) making it ready to use in img src or CSS background-image. Raw Base64 is just the encoded string without the prefix.",
      },
      {
        question: "Is there a file size limit?",
        answer:
          "Up to 10MB. Larger images produce very long Base64 strings — for big files it's better to serve them as regular files.",
      },
      {
        question: "Is this free?",
        answer: "100% free. No account required.",
      },
    ],
  },
  {
    id: "base64-to-image",
    category: "image",
    slug: "/image/base64-to-image",
    title: "Base64 to Image Converter – Free Online",
    headline: "Convert Base64 to Image Online Free",
    description:
      "Convert Base64 strings back to images online for free. Paste a Base64 string or data URI and download as PNG, JPG, or WebP. No upload needed.",
    longDescription:
      "Our free Base64 to image converter decodes a Base64 encoded string back into a downloadable image file directly in your browser. Paste a raw Base64 string or a full data URI (data:image/png;base64,...) and preview the image instantly. Download as PNG, JPG, or WebP. No server involved — decoding is entirely client-side.",
    actionVerb: "convert Base64 to image",
    keywords: [
      "base64 to image",
      "base64 to image converter",
      "convert base64 to image",
      "base64 decode image",
      "base64 to png",
      "base64 to jpg",
      "decode base64 image online",
      "base64 image decoder",
      "base64 to image online free",
      "data uri to image",
    ],
    inputFormats: ["text/plain"],
    outputFormat: "image/png",
    outputExtension: "png",
    maxFileSizeMB: 10,
    maxBatchSize: 1,
    searchVolume: 220000,
    relatedTools: ["image-to-base64", "jpg-to-png", "image-compressor", "svg-to-png"],
    howToSteps: [
      "Paste your Base64 string or data URI into the text area.",
      "The image preview appears instantly.",
      "Click Download to save the image as PNG, JPG, or WebP.",
    ],
    faqs: [
      {
        question: "What input formats are accepted?",
        answer:
          "Raw Base64 strings and full data URIs (data:image/...;base64,...) are both supported.",
      },
      {
        question: "What output formats are available?",
        answer: "PNG, JPG, and WebP. PNG is the default for lossless output.",
      },
      {
        question: "Is this free?",
        answer: "100% free. No account, no upload.",
      },
      {
        question: "Do I need to include the data URI prefix?",
        answer:
          "No — the tool auto-detects whether you've pasted a raw Base64 string or a full data URI with prefix.",
      },
    ],
  },
  {
    id: "color-picker",
    category: "image",
    slug: "/image/color-picker",
    title: "Color Picker from Image – Get HEX, RGB, HSL Online Free",
    headline: "Pick Colors from Image Online Free",
    description:
      "Pick any color from an image and get its HEX, RGB, and HSL values instantly. Free online color picker tool — no upload needed, works in your browser.",
    longDescription:
      "Our free image color picker lets you click anywhere on a photo to instantly get the exact HEX, RGB, and HSL color codes. Perfect for designers who need to match colors from screenshots, logos, or photos. Move your cursor over the image to preview colors in real time. No image is uploaded — everything runs locally in your browser using the Canvas API.",
    actionVerb: "pick colors from image",
    keywords: [
      "color picker from image",
      "color picker",
      "get color from image",
      "image color picker",
      "pick color from image",
      "color picker online",
      "hex color picker from image",
      "eyedropper tool online",
      "get hex code from image",
      "color picker from photo",
    ],
    inputFormats: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    outputFormat: "text/plain",
    outputExtension: "txt",
    maxFileSizeMB: 20,
    maxBatchSize: 1,
    searchVolume: 500000,
    relatedTools: ["image-to-base64", "image-compressor", "image-resizer", "image-cropper"],
    howToSteps: [
      "Upload an image by dropping it or clicking to browse.",
      "Move your cursor over the image to preview colors in real time.",
      "Click anywhere on the image to lock a color and copy its HEX, RGB, or HSL value.",
    ],
    faqs: [
      {
        question: "What color formats does the picker output?",
        answer: "HEX (#rrggbb), RGB (rgb(r, g, b)), and HSL (hsl(h, s%, l%)) — all three simultaneously.",
      },
      {
        question: "Can I pick colors from any image?",
        answer: "Yes — JPG, PNG, WebP, and GIF files are all supported.",
      },
      {
        question: "Is this tool free?",
        answer: "100% free. No account, no upload.",
      },
      {
        question: "Does my image get uploaded?",
        answer: "No. The color picker runs entirely in your browser. Your image never leaves your device.",
      },
    ],
  },
  {
    id: "image-metadata",
    category: "image",
    slug: "/image/image-metadata",
    title: "Image Metadata Viewer – View EXIF Data Online Free",
    headline: "View Image Metadata & EXIF Data Online Free",
    description:
      "View image metadata and EXIF data online for free. See dimensions, file size, camera model, GPS location, date taken, and more. No upload — runs in your browser.",
    longDescription:
      "Our free image metadata viewer reads all embedded EXIF and file metadata from your images directly in your browser — no file is uploaded. See the image dimensions, DPI, color space, camera make and model, lens info, exposure settings, ISO, GPS coordinates, date/time taken, and software used. Works with JPG, PNG, WebP, and TIFF files.",
    actionVerb: "view image metadata",
    keywords: [
      "image metadata viewer",
      "exif data viewer",
      "view image metadata",
      "exif viewer online",
      "image exif viewer",
      "photo metadata viewer",
      "view exif data online",
      "image info viewer",
      "check image metadata online",
      "exif reader online free",
    ],
    inputFormats: ["image/jpeg", "image/png", "image/webp"],
    outputFormat: "text/plain",
    outputExtension: "json",
    maxFileSizeMB: 50,
    maxBatchSize: 1,
    searchVolume: 180000,
    relatedTools: ["image-to-base64", "image-compressor", "jpg-to-png", "image-resizer"],
    howToSteps: [
      "Drop your image onto the metadata viewer or click to browse.",
      "All available metadata is displayed instantly — dimensions, EXIF, GPS, camera info.",
      "Click any value to copy it, or export all metadata as JSON.",
    ],
    faqs: [
      {
        question: "What metadata can I see?",
        answer:
          "Dimensions, file size, DPI, color space, camera make/model, lens info, focal length, aperture, shutter speed, ISO, GPS coordinates, date taken, and software.",
      },
      {
        question: "Does my image get uploaded?",
        answer:
          "No. Metadata is read directly from the file in your browser. Nothing is sent to any server.",
      },
      {
        question: "Does every image have EXIF data?",
        answer:
          "No. Screenshots, web-saved images, and images processed by some editors have EXIF stripped. Camera photos and RAW files usually have full EXIF.",
      },
      {
        question: "Is this tool free?",
        answer: "100% free. No account required.",
      },
    ],
  },
  {
    id: "image-watermark",
    category: "image",
    slug: "/image/image-watermark",
    title: "Add Watermark to Image – Free Online Tool",
    headline: "Add Watermark to Image Online Free",
    description:
      "Add text or image watermarks to photos online for free. Customize font, size, position, opacity, and color. No upload — runs entirely in your browser.",
    longDescription:
      "Our free online watermark tool lets you add custom text watermarks to images directly in your browser. Choose the watermark text, font size, color, opacity, and position (9 presets or drag to any spot). Perfect for protecting photos, adding copyright notices, or branding images. No image is ever uploaded — everything runs via Canvas API in your browser. Batch watermark up to 20 images at once.",
    actionVerb: "add watermark to images",
    keywords: [
      "add watermark to image",
      "image watermark",
      "watermark image online",
      "add watermark online",
      "watermark photo",
      "add text to image",
      "watermark image free",
      "online watermark tool",
      "add copyright to image",
      "photo watermark online free",
    ],
    inputFormats: ["image/jpeg", "image/png", "image/webp"],
    outputFormat: "image/jpeg",
    outputExtension: "jpg",
    maxFileSizeMB: 50,
    maxBatchSize: 20,
    searchVolume: 350000,
    relatedTools: ["image-compressor", "image-resizer", "image-cropper", "jpg-to-png"],
    howToSteps: [
      "Upload your images by dropping them onto the tool.",
      "Enter your watermark text and customize font, size, color, opacity, and position.",
      "Click 'Apply Watermark' and download your watermarked images.",
    ],
    faqs: [
      {
        question: "Can I add a logo or image as a watermark?",
        answer:
          "Currently text watermarks are supported. Image/logo watermark support is coming soon.",
      },
      {
        question: "Can I batch watermark multiple images?",
        answer: "Yes — apply the same watermark to up to 20 images simultaneously.",
      },
      {
        question: "What output format is used?",
        answer: "JPG by default. Switch to PNG if you need a transparent background preserved.",
      },
      {
        question: "Do my images get uploaded?",
        answer: "No. Watermarking runs entirely in your browser via Canvas API.",
      },
      {
        question: "Is this free?",
        answer: "100% free. No sign-up required.",
      },
    ],
  },
];

export const pdfTools: ToolConfig[] = [
  {
    id: "merge-pdf",
    category: "pdf",
    slug: "/pdf/merge-pdf",
    title: "Merge PDF – Combine PDF Files Online Free",
    headline: "Merge PDF Files Online Free",
    description:
      "Merge multiple PDF files into one online for free. Drag to reorder pages before combining. No upload — runs entirely in your browser using pdf-lib.",
    longDescription:
      "Our free online PDF merger lets you combine multiple PDF files into a single document directly in your browser. Drag and drop to reorder files before merging. All pages from every PDF are preserved in the output. No file is ever uploaded to a server — pdf-lib processes everything locally. Merge up to 20 PDF files at once.",
    actionVerb: "merge PDF files",
    keywords: [
      "merge pdf", "combine pdf", "merge pdf files online free",
      "pdf merger", "combine pdf files", "join pdf online",
      "pdf merge online free", "merge pdf online", "combine pdf online free",
    ],
    inputFormats: ["application/pdf"],
    outputFormat: "application/pdf",
    outputExtension: "pdf",
    maxFileSizeMB: 100,
    maxBatchSize: 20,
    searchVolume: 3000000,
    relatedTools: ["split-pdf", "pdf-compressor", "rotate-pdf", "pdf-page-numbers"],
    howToSteps: [
      "Upload your PDF files by dropping them onto the tool.",
      "Drag to reorder the files if needed.",
      "Click 'Merge PDFs' and download your combined file.",
    ],
    faqs: [
      { question: "How many PDFs can I merge at once?", answer: "Up to 20 PDF files simultaneously." },
      { question: "Is the page order preserved?", answer: "Yes — pages appear in the order you arrange the files. Drag to reorder before merging." },
      { question: "Are my files uploaded?", answer: "No. All merging happens locally in your browser using pdf-lib. Nothing is sent to any server." },
      { question: "Is this free?", answer: "100% free. No account required." },
      { question: "Is there a file size limit?", answer: "Up to 100MB per file." },
    ],
  },
  {
    id: "split-pdf",
    category: "pdf",
    slug: "/pdf/split-pdf",
    title: "Split PDF – Split PDF Pages Online Free",
    headline: "Split PDF Files Online Free",
    description:
      "Split a PDF into individual pages or custom page ranges online for free. No upload — runs in your browser. Free PDF splitter tool.",
    longDescription:
      "Our free PDF splitter lets you extract individual pages or custom page ranges from any PDF file directly in your browser. Choose to split every page into a separate file, extract a specific range (e.g., pages 3–7), or select individual pages to extract. No file is uploaded — pdf-lib handles everything locally.",
    actionVerb: "split PDF files",
    keywords: [
      "split pdf", "split pdf online", "split pdf free", "pdf splitter",
      "extract pages from pdf", "pdf page extractor", "split pdf into pages",
      "separate pdf pages online free", "divide pdf",
    ],
    inputFormats: ["application/pdf"],
    outputFormat: "application/pdf",
    outputExtension: "pdf",
    maxFileSizeMB: 100,
    maxBatchSize: 1,
    searchVolume: 1200000,
    relatedTools: ["merge-pdf", "pdf-compressor", "rotate-pdf", "pdf-to-jpg"],
    howToSteps: [
      "Upload a PDF file by dropping it onto the tool.",
      "Choose a split mode: every page, a page range, or selected pages.",
      "Click 'Split PDF' and download the resulting files as a ZIP.",
    ],
    faqs: [
      { question: "Can I extract a specific range of pages?", answer: "Yes — enter a range like '2-5' or pick individual pages to extract." },
      { question: "What happens to the original PDF?", answer: "Nothing — your original file is unchanged. The split creates new files." },
      { question: "Are files uploaded?", answer: "No. Everything runs in your browser." },
      { question: "Is this free?", answer: "100% free. No account required." },
    ],
  },
  {
    id: "pdf-compressor",
    category: "pdf",
    slug: "/pdf/pdf-compressor",
    title: "PDF Compressor – Compress PDF Online Free",
    headline: "Compress PDF Online Free — Reduce PDF File Size",
    description:
      "Compress PDF files online for free. Reduce PDF file size significantly without losing quality. No upload — runs in your browser. Free PDF compression tool.",
    longDescription:
      "Our free PDF compressor reduces PDF file size by removing redundant data, compressing embedded images, and stripping unnecessary metadata. No file is uploaded — compression runs locally in your browser using pdf-lib. Batch compress up to 10 PDF files at once.",
    actionVerb: "compress PDF files",
    keywords: [
      "compress pdf", "pdf compressor", "reduce pdf size", "compress pdf online free",
      "pdf size reducer", "pdf compressor online", "reduce pdf file size",
      "shrink pdf online", "compress pdf without losing quality",
    ],
    inputFormats: ["application/pdf"],
    outputFormat: "application/pdf",
    outputExtension: "pdf",
    maxFileSizeMB: 100,
    maxBatchSize: 10,
    searchVolume: 2000000,
    relatedTools: ["merge-pdf", "split-pdf", "rotate-pdf", "pdf-to-jpg"],
    howToSteps: [
      "Upload your PDF files by dropping them onto the compressor.",
      "Select the compression level (screen, ebook, or print quality).",
      "Click 'Compress PDF' and download your smaller files.",
    ],
    faqs: [
      { question: "How much can you compress a PDF?", answer: "Typically 20–80% smaller depending on how many embedded images the PDF contains." },
      { question: "Will text quality be affected?", answer: "No. Text is vector-based and is not affected by compression. Only embedded images are re-compressed." },
      { question: "Are files uploaded?", answer: "No. Everything runs locally in your browser." },
      { question: "Is this free?", answer: "100% free. No account or sign-up required." },
    ],
  },
  {
    id: "rotate-pdf",
    category: "pdf",
    slug: "/pdf/rotate-pdf",
    title: "Rotate PDF – Rotate PDF Pages Online Free",
    headline: "Rotate PDF Pages Online Free",
    description:
      "Rotate PDF pages online for free. Rotate all pages or individual pages by 90°, 180°, or 270°. No upload — works in your browser. Free PDF rotation tool.",
    longDescription:
      "Our free PDF page rotator lets you fix sideways or upside-down pages in any PDF file directly in your browser. Rotate all pages at once or select specific pages to rotate individually. Choose 90° clockwise, 90° counter-clockwise, or 180°. No file is uploaded — pdf-lib handles everything locally.",
    actionVerb: "rotate PDF pages",
    keywords: [
      "rotate pdf", "rotate pdf online", "rotate pdf pages", "pdf rotator",
      "rotate pdf free", "rotate pages in pdf", "turn pdf pages online",
      "rotate pdf online free", "flip pdf pages",
    ],
    inputFormats: ["application/pdf"],
    outputFormat: "application/pdf",
    outputExtension: "pdf",
    maxFileSizeMB: 100,
    maxBatchSize: 1,
    searchVolume: 800000,
    relatedTools: ["merge-pdf", "split-pdf", "pdf-compressor", "pdf-page-numbers"],
    howToSteps: [
      "Upload your PDF by dropping it onto the tool.",
      "Choose which pages to rotate and the rotation direction.",
      "Click 'Rotate PDF' and download your corrected file.",
    ],
    faqs: [
      { question: "Can I rotate specific pages only?", answer: "Yes — select individual pages to rotate or rotate all pages at once." },
      { question: "What rotation angles are supported?", answer: "90° clockwise, 90° counter-clockwise, and 180°." },
      { question: "Are files uploaded?", answer: "No. Everything runs in your browser." },
      { question: "Is this free?", answer: "100% free. No account required." },
    ],
  },
  {
    id: "pdf-to-jpg",
    category: "pdf",
    slug: "/pdf/pdf-to-jpg",
    title: "PDF to JPG Converter – Free Online, No Upload",
    headline: "Convert PDF to JPG Online Free",
    description:
      "Convert PDF pages to JPG images online for free. Each page becomes a separate JPG file. No upload — runs in your browser using PDF.js. Download as ZIP.",
    longDescription:
      "Our free PDF to JPG converter renders each page of your PDF as a high-quality JPG image directly in your browser using PDF.js. Each page is exported as a separate JPG file. Download all images as a ZIP archive. No file is uploaded to any server.",
    actionVerb: "convert PDF to JPG",
    keywords: [
      "pdf to jpg", "pdf to jpg converter", "convert pdf to jpg", "pdf to image",
      "pdf to jpg online free", "pdf pages to jpg", "export pdf as jpg",
      "convert pdf to image online free", "pdf to jpeg",
    ],
    inputFormats: ["application/pdf"],
    outputFormat: "image/jpeg",
    outputExtension: "jpg",
    maxFileSizeMB: 50,
    maxBatchSize: 1,
    searchVolume: 1500000,
    relatedTools: ["pdf-to-png", "merge-pdf", "split-pdf", "jpg-to-png"],
    howToSteps: [
      "Upload your PDF file by dropping it onto the tool.",
      "Select the image quality (DPI) — higher DPI = sharper images but larger files.",
      "Click 'Convert to JPG' and download all pages as a ZIP file.",
    ],
    faqs: [
      { question: "Does each PDF page become a separate JPG?", answer: "Yes — each page is rendered as its own JPG image file." },
      { question: "What DPI are the exported images?", answer: "Default is 150 DPI (good quality). You can increase to 300 DPI for print quality." },
      { question: "Are files uploaded?", answer: "No. PDF.js renders pages entirely in your browser." },
      { question: "Is this free?", answer: "100% free. No account needed." },
    ],
  },
  {
    id: "pdf-to-png",
    category: "pdf",
    slug: "/pdf/pdf-to-png",
    title: "PDF to PNG Converter – Free Online, No Upload",
    headline: "Convert PDF to PNG Online Free",
    description:
      "Convert PDF pages to PNG images online for free. Each page becomes a lossless PNG file. No upload — runs in your browser. Free PDF to PNG converter.",
    longDescription:
      "Our free PDF to PNG converter renders each page of your PDF as a lossless PNG image directly in your browser using PDF.js. PNG output preserves crisp text and is ideal for presentations, screenshots, and archiving. Download all pages as a ZIP. No file is uploaded.",
    actionVerb: "convert PDF to PNG",
    keywords: [
      "pdf to png", "pdf to png converter", "convert pdf to png",
      "pdf to png online free", "pdf pages to png", "export pdf as png",
      "convert pdf to image online free",
    ],
    inputFormats: ["application/pdf"],
    outputFormat: "image/png",
    outputExtension: "png",
    maxFileSizeMB: 50,
    maxBatchSize: 1,
    searchVolume: 600000,
    relatedTools: ["pdf-to-jpg", "merge-pdf", "split-pdf", "png-to-jpg"],
    howToSteps: [
      "Upload your PDF file onto the tool.",
      "Select the DPI for the output images.",
      "Click 'Convert to PNG' and download all pages as a ZIP.",
    ],
    faqs: [
      { question: "Why choose PNG over JPG for PDF conversion?", answer: "PNG is lossless — text stays perfectly sharp and there are no compression artifacts, making it better for documents." },
      { question: "Are files uploaded?", answer: "No. Everything runs in your browser using PDF.js." },
      { question: "Is this free?", answer: "100% free." },
    ],
  },
  {
    id: "pdf-watermark",
    category: "pdf",
    slug: "/pdf/pdf-watermark",
    title: "Add Watermark to PDF – Free Online Tool",
    headline: "Add Watermark to PDF Online Free",
    description:
      "Add a text watermark to PDF pages online for free. Customize text, size, opacity, and position. No upload — runs in your browser with pdf-lib.",
    longDescription:
      "Our free PDF watermark tool lets you add a custom text watermark to every page of a PDF directly in your browser. Adjust the watermark text, font size, opacity, rotation angle, and position. Choose diagonal tile mode for full-page coverage. No file is uploaded — pdf-lib handles everything locally.",
    actionVerb: "add watermark to PDF",
    keywords: [
      "pdf watermark", "add watermark to pdf", "watermark pdf online",
      "pdf watermark free", "add text watermark to pdf",
      "watermark pdf online free", "pdf stamp online",
    ],
    inputFormats: ["application/pdf"],
    outputFormat: "application/pdf",
    outputExtension: "pdf",
    maxFileSizeMB: 100,
    maxBatchSize: 5,
    searchVolume: 500000,
    relatedTools: ["merge-pdf", "pdf-compressor", "rotate-pdf", "pdf-page-numbers"],
    howToSteps: [
      "Upload your PDF files onto the watermark tool.",
      "Enter your watermark text and customize size, opacity, and rotation.",
      "Click 'Apply Watermark' and download your watermarked PDFs.",
    ],
    faqs: [
      { question: "Can I watermark multiple PDFs at once?", answer: "Yes, up to 5 PDFs at once with the same watermark settings." },
      { question: "Can I make the watermark diagonal?", answer: "Yes — enable tile mode to repeat the watermark diagonally across every page." },
      { question: "Are files uploaded?", answer: "No. All processing runs locally in your browser." },
      { question: "Is this free?", answer: "100% free. No account required." },
    ],
  },
  {
    id: "pdf-page-numbers",
    category: "pdf",
    slug: "/pdf/pdf-page-numbers",
    title: "Add Page Numbers to PDF – Free Online Tool",
    headline: "Add Page Numbers to PDF Online Free",
    description:
      "Add page numbers to PDF files online for free. Choose position, font size, and starting number. No upload — runs in your browser with pdf-lib.",
    longDescription:
      "Our free PDF page numbering tool adds page numbers to every page of your PDF directly in your browser. Choose where to place the numbers (bottom center, bottom right, top center, etc.), customize the font size, and set the starting number. No file is uploaded — pdf-lib handles everything locally.",
    actionVerb: "add page numbers to PDF",
    keywords: [
      "add page numbers to pdf", "pdf page numbers", "number pdf pages",
      "add page numbers to pdf online free", "pdf page numbering",
      "insert page numbers in pdf online",
    ],
    inputFormats: ["application/pdf"],
    outputFormat: "application/pdf",
    outputExtension: "pdf",
    maxFileSizeMB: 100,
    maxBatchSize: 5,
    searchVolume: 400000,
    relatedTools: ["merge-pdf", "pdf-watermark", "rotate-pdf", "pdf-compressor"],
    howToSteps: [
      "Upload your PDF file onto the tool.",
      "Choose the position, font size, and starting page number.",
      "Click 'Add Page Numbers' and download your numbered PDF.",
    ],
    faqs: [
      { question: "Where can I place the page numbers?", answer: "Bottom center, bottom left, bottom right, top center, top left, or top right." },
      { question: "Can I start numbering from a specific number?", answer: "Yes — set any starting number (useful for documents that are part of a larger set)." },
      { question: "Are files uploaded?", answer: "No. Everything runs in your browser." },
      { question: "Is this free?", answer: "100% free. No account required." },
    ],
  },
  // ─── Additional PDF tools ─────────────────────────────────────────────────
  {
    id: "image-to-pdf",
    category: "pdf",
    slug: "/pdf/image-to-pdf",
    title: "Image to PDF Converter – Free Online, No Upload",
    headline: "Convert Images to PDF Online Free",
    description:
      "Convert JPG, PNG, and WebP images to PDF online for free. Arrange image order, set page size and orientation. No upload — runs entirely in your browser.",
    longDescription:
      "Our free image to PDF converter lets you combine one or more JPG, PNG, or WebP images into a single PDF document directly in your browser. Drag to reorder images, choose page size (A4, Letter, or fit-to-image), and set portrait or landscape orientation. No file is uploaded — pdf-lib handles everything locally.",
    actionVerb: "convert images to PDF",
    keywords: [
      "image to pdf", "jpg to pdf", "png to pdf", "convert image to pdf",
      "images to pdf online free", "jpg to pdf converter", "png to pdf converter",
      "photos to pdf", "convert jpg to pdf online free", "image to pdf online",
    ],
    inputFormats: ["image/jpeg", "image/png", "image/webp"],
    outputFormat: "application/pdf",
    outputExtension: "pdf",
    maxFileSizeMB: 50,
    maxBatchSize: 30,
    searchVolume: 1800000,
    relatedTools: ["merge-pdf", "pdf-compressor", "pdf-to-jpg", "jpg-to-png"],
    howToSteps: [
      "Upload your JPG, PNG, or WebP images by dropping them onto the tool.",
      "Drag to reorder images and choose page size and orientation.",
      "Click 'Convert to PDF' and download your PDF.",
    ],
    faqs: [
      { question: "How many images can I convert at once?", answer: "Up to 30 images. Each image becomes a separate page in the PDF." },
      { question: "What page sizes are supported?", answer: "A4, US Letter, and 'fit to image' (page sized exactly to the image dimensions)." },
      { question: "Are files uploaded?", answer: "No. Conversion runs in your browser using pdf-lib." },
      { question: "Is this free?", answer: "100% free. No account required." },
    ],
  },
  {
    id: "pdf-to-text",
    category: "pdf",
    slug: "/pdf/pdf-to-text",
    title: "PDF to Text Converter – Extract Text from PDF Free",
    headline: "Extract Text from PDF Online Free",
    description:
      "Extract all text from PDF files online for free. Copy text or download as a .txt file. No upload — runs in your browser using PDF.js.",
    longDescription:
      "Our free PDF to text extractor pulls all readable text from every page of your PDF directly in your browser using PDF.js. The extracted text preserves paragraph order and can be copied to clipboard or downloaded as a .txt file. No file is uploaded to any server.",
    actionVerb: "extract text from PDF",
    keywords: [
      "pdf to text", "extract text from pdf", "pdf to text converter",
      "convert pdf to text online free", "pdf text extractor",
      "copy text from pdf", "pdf to txt", "extract text from pdf online",
    ],
    inputFormats: ["application/pdf"],
    outputFormat: "text/plain",
    outputExtension: "txt",
    maxFileSizeMB: 50,
    maxBatchSize: 1,
    searchVolume: 600000,
    relatedTools: ["pdf-to-jpg", "split-pdf", "merge-pdf", "pdf-metadata"],
    howToSteps: [
      "Upload your PDF by dropping it onto the tool.",
      "All text is extracted instantly and displayed in the text area.",
      "Click 'Copy All' or 'Download .txt' to save the text.",
    ],
    faqs: [
      { question: "Does it extract text from scanned PDFs?", answer: "No. Only PDFs with embedded text layers are supported. Scanned documents require OCR, which is a server-side operation." },
      { question: "Is the text order preserved?", answer: "Yes — text is extracted page by page in reading order." },
      { question: "Are files uploaded?", answer: "No. PDF.js extracts text entirely in your browser." },
      { question: "Is this free?", answer: "100% free. No account required." },
    ],
  },
  {
    id: "reorder-pdf",
    category: "pdf",
    slug: "/pdf/reorder-pdf",
    title: "Reorder PDF Pages – Drag & Drop Online Free",
    headline: "Reorder PDF Pages Online Free",
    description:
      "Reorder PDF pages by dragging and dropping thumbnails. Delete unwanted pages. No upload — runs in your browser with pdf-lib.",
    longDescription:
      "Our free PDF page reorder tool lets you visually drag and drop page thumbnails to rearrange them in any order. You can also delete pages you don't need. The result is a new PDF with pages in your chosen order. No file is uploaded — pdf-lib handles everything locally.",
    actionVerb: "reorder PDF pages",
    keywords: [
      "reorder pdf pages", "rearrange pdf pages", "pdf page reorder online",
      "drag and drop pdf pages", "reorder pdf online free", "rearrange pages in pdf",
      "pdf page organizer", "reorganize pdf pages",
    ],
    inputFormats: ["application/pdf"],
    outputFormat: "application/pdf",
    outputExtension: "pdf",
    maxFileSizeMB: 100,
    maxBatchSize: 1,
    searchVolume: 500000,
    relatedTools: ["merge-pdf", "split-pdf", "rotate-pdf", "pdf-compressor"],
    howToSteps: [
      "Upload your PDF — all pages appear as draggable thumbnails.",
      "Drag pages to rearrange them. Click the ✕ on any thumbnail to delete it.",
      "Click 'Save PDF' and download the reordered file.",
    ],
    faqs: [
      { question: "Can I delete pages?", answer: "Yes — click the × button on any thumbnail to remove that page." },
      { question: "Is there a page limit?", answer: "No hard limit — the tool handles PDFs of any length." },
      { question: "Are files uploaded?", answer: "No. Everything runs locally in your browser." },
      { question: "Is this free?", answer: "100% free. No account required." },
    ],
  },
  {
    id: "pdf-metadata",
    category: "pdf",
    slug: "/pdf/pdf-metadata",
    title: "PDF Metadata Editor – View & Edit PDF Info Online Free",
    headline: "Edit PDF Metadata Online Free",
    description:
      "View and edit PDF metadata online for free. Change title, author, subject, and keywords. No upload — runs in your browser with pdf-lib.",
    longDescription:
      "Our free PDF metadata editor lets you view and edit the title, author, subject, creator, and keywords of any PDF file directly in your browser. Useful for organizing documents, removing personal information, or updating document properties. No file is uploaded — pdf-lib handles everything locally.",
    actionVerb: "edit PDF metadata",
    keywords: [
      "pdf metadata editor", "edit pdf metadata", "pdf metadata viewer",
      "change pdf title author", "remove pdf metadata online",
      "pdf properties editor", "edit pdf info online free",
    ],
    inputFormats: ["application/pdf"],
    outputFormat: "application/pdf",
    outputExtension: "pdf",
    maxFileSizeMB: 100,
    maxBatchSize: 1,
    searchVolume: 300000,
    relatedTools: ["pdf-compressor", "merge-pdf", "split-pdf", "pdf-to-text"],
    howToSteps: [
      "Upload your PDF — all current metadata is displayed instantly.",
      "Edit any fields: title, author, subject, keywords, creator.",
      "Click 'Save PDF' and download the updated file.",
    ],
    faqs: [
      { question: "What metadata fields can I edit?", answer: "Title, Author, Subject, Keywords, Creator, and Producer." },
      { question: "Can I remove all metadata?", answer: "Yes — clear all fields and save to produce a metadata-stripped PDF." },
      { question: "Are files uploaded?", answer: "No. Everything runs in your browser." },
      { question: "Is this free?", answer: "100% free. No account required." },
    ],
  },
  {
    id: "extract-images-pdf",
    category: "pdf",
    slug: "/pdf/extract-images-pdf",
    title: "Extract Images from PDF – Free Online Tool",
    headline: "Extract Images from PDF Online Free",
    description:
      "Extract all images from a PDF file online for free. Download individual images or all as a ZIP. No upload — runs in your browser using PDF.js.",
    longDescription:
      "Our free PDF image extractor renders each page of your PDF and extracts the page as a high-quality image directly in your browser using PDF.js. Download individual images or all at once as a ZIP archive. No file is uploaded to any server.",
    actionVerb: "extract images from PDF",
    keywords: [
      "extract images from pdf", "pdf image extractor", "save images from pdf",
      "extract pictures from pdf", "pdf to images online free",
      "get images from pdf", "extract images from pdf online free",
    ],
    inputFormats: ["application/pdf"],
    outputFormat: "image/jpeg",
    outputExtension: "jpg",
    maxFileSizeMB: 50,
    maxBatchSize: 1,
    searchVolume: 400000,
    relatedTools: ["pdf-to-jpg", "pdf-to-png", "split-pdf", "merge-pdf"],
    howToSteps: [
      "Upload your PDF — each page is rendered as an image thumbnail.",
      "Select which pages to extract or choose 'Extract All'.",
      "Download individual images or all as a ZIP.",
    ],
    faqs: [
      { question: "What format are the extracted images?", answer: "JPG by default. You can switch to PNG for lossless output." },
      { question: "Can I choose which pages to extract?", answer: "Yes — select specific pages from the thumbnail grid before downloading." },
      { question: "Are files uploaded?", answer: "No. PDF.js renders pages in your browser." },
      { question: "Is this free?", answer: "100% free. No account required." },
    ],
  },
  {
    id: "docx-to-pdf",
    category: "pdf",
    slug: "/pdf/docx-to-pdf",
    title: "Word to PDF Converter – Free Online, No Upload",
    headline: "Convert Word to PDF Online Free",
    description:
      "Convert DOCX Word documents to PDF online for free. Preview your document before converting. No upload — runs entirely in your browser using docx-preview.",
    longDescription:
      "Our free Word to PDF converter renders your DOCX file as a live preview in your browser using docx-preview, then exports it to PDF. Preview the rendered document before saving. Supports text formatting, images, tables, and lists. No file is ever uploaded — everything runs locally using docx-preview and the browser's built-in print API.",
    actionVerb: "convert Word to PDF",
    keywords: [
      "word to pdf", "docx to pdf", "convert word to pdf",
      "word to pdf converter", "docx to pdf online free",
      "convert docx to pdf online", "word document to pdf",
      "doc to pdf converter online free",
    ],
    inputFormats: [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ],
    outputFormat: "application/pdf",
    outputExtension: "pdf",
    maxFileSizeMB: 20,
    maxBatchSize: 1,
    searchVolume: 3500000,
    relatedTools: ["merge-pdf", "pdf-compressor", "image-to-pdf", "split-pdf"],
    howToSteps: [
      "Upload your Word (.docx) file by dropping it onto the tool.",
      "Preview the rendered document — check it looks correct.",
      "Click 'Save as PDF' and your browser saves the document as a PDF.",
    ],
    faqs: [
      { question: "Will my formatting be preserved?", answer: "Most formatting is preserved — text styles, bold/italic, images, tables, and lists. Very complex layouts (e.g. multi-column, custom fonts, tracked changes) may appear slightly different." },
      { question: "Is my file uploaded?", answer: "No. docx-preview renders your file 100% in the browser. Nothing is sent to any server." },
      { question: "What file formats are supported?", answer: "DOCX (.docx) files from Microsoft Word, Google Docs exports, and LibreOffice." },
      { question: "Is this free?", answer: "100% free. No account required." },
    ],
  },
];



export function getToolById(id: string): ToolConfig | undefined {
  return allTools.find((t) => t.id === id);
}

export function getRelatedTools(tool: ToolConfig): ToolConfig[] {
  return tool.relatedTools
    .map((id) => getToolById(id))
    .filter(Boolean) as ToolConfig[];
}

export function getToolsByCategory(category: ToolCategory): ToolConfig[] {
  return allTools.filter((t) => t.category === category && !t.comingSoon);
}

// ─── Text Tools ───────────────────────────────────────────────────────────────
export const textTools: ToolConfig[] = [
  { id:"word-counter",       category:"text" as ToolCategory, slug:"/text/word-counter",       title:"Word Counter – Count Words, Characters Free",          headline:"Count Words & Characters Online Free",            description:"Count words, characters, lines, sentences and paragraphs instantly.",              longDescription:"",actionVerb:"count words",            keywords:["word counter","character counter","count words online","char count"],       inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:900000,relatedTools:[],howToSteps:["Type or paste text.","See stats instantly."],faqs:[] },
  { id:"case-converter",     category:"text" as ToolCategory, slug:"/text/case-converter",     title:"Case Converter – Upper, Lower, Title Case Online",      headline:"Convert Text Case Online Free",                    description:"Convert text to UPPER CASE, lower case, Title Case, camelCase, snake_case.",        longDescription:"",actionVerb:"convert case",           keywords:["case converter","uppercase converter","lowercase converter","title case"],   inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:700000,relatedTools:[],howToSteps:["Paste text.","Choose case mode.","Copy result."],faqs:[] },
  { id:"lorem-ipsum",        category:"text" as ToolCategory, slug:"/text/lorem-ipsum",        title:"Lorem Ipsum Generator – Free Placeholder Text",         headline:"Generate Lorem Ipsum Online Free",                 description:"Generate Lorem Ipsum placeholder text. Set paragraph and sentence count.",          longDescription:"",actionVerb:"generate lorem ipsum",  keywords:["lorem ipsum","lorem ipsum generator","placeholder text","dummy text"],      inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:600000,relatedTools:[],howToSteps:["Set paragraphs.","Set sentences.","Click Generate."],faqs:[] },
  { id:"find-replace",       category:"text" as ToolCategory, slug:"/text/find-replace",       title:"Find and Replace Text Online Free",                     headline:"Find & Replace Text Online Free",                  description:"Find and replace text online. Supports regex and case-sensitive matching.",          longDescription:"",actionVerb:"find and replace",       keywords:["find and replace","text find replace","online find replace"],               inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:400000,relatedTools:[],howToSteps:["Paste text.","Enter find/replace.","Click Replace."],faqs:[] },
  { id:"line-sorter",        category:"text" as ToolCategory, slug:"/text/line-sorter",        title:"Line Sorter – Sort Lines Alphabetically Online Free",   headline:"Sort Lines Online Free",                           description:"Sort lines alphabetically A-Z, Z-A, by length, reverse order or shuffle.",         longDescription:"",actionVerb:"sort lines",             keywords:["line sorter","sort lines alphabetically","sort list online"],               inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:300000,relatedTools:[],howToSteps:["Paste lines.","Choose sort order.","Copy result."],faqs:[] },
  { id:"deduplicate-lines",  category:"text" as ToolCategory, slug:"/text/deduplicate-lines",  title:"Remove Duplicate Lines Online Free",                    headline:"Remove Duplicate Lines Online Free",               description:"Remove duplicate lines from any text online for free. Case-sensitive option.",       longDescription:"",actionVerb:"remove duplicates",      keywords:["remove duplicate lines","deduplicate text","unique lines"],                 inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:200000,relatedTools:[],howToSteps:["Paste text.","Click Remove Duplicates.","Copy result."],faqs:[] },
  { id:"text-repeater",      category:"text" as ToolCategory, slug:"/text/text-repeater",      title:"Text Repeater – Repeat Text Online Free",               headline:"Repeat Text Online Free",                          description:"Repeat any text N times with a custom separator. Free online text repeater.",        longDescription:"",actionVerb:"repeat text",            keywords:["text repeater","repeat text online","duplicate text"],                      inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:150000,relatedTools:[],howToSteps:["Enter text.","Set repeat count.","Copy result."],faqs:[] },
  { id:"diff-checker",       category:"text" as ToolCategory, slug:"/text/diff-checker",       title:"Text Diff Checker – Compare Two Texts Online Free",     headline:"Compare Two Texts Online Free",                    description:"Compare two texts and see differences highlighted. Free online diff checker.",       longDescription:"",actionVerb:"compare texts",          keywords:["diff checker","text diff","compare two texts online","text comparison"],    inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:400000,relatedTools:[],howToSteps:["Paste original text.","Paste modified text.","Click Compare."],faqs:[] },
  { id:"readability-score",  category:"text" as ToolCategory, slug:"/text/readability-score",  title:"Readability Score – Flesch-Kincaid Checker Online Free",headline:"Check Text Readability Online Free",               description:"Get the Flesch-Kincaid readability score of your text instantly.",                  longDescription:"",actionVerb:"check readability",      keywords:["readability score","flesch kincaid","readability checker online","reading level"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:250000,relatedTools:[],howToSteps:["Paste text.","See Flesch score and grade level."],faqs:[] },
  { id:"markdown-preview",   category:"text" as ToolCategory, slug:"/text/markdown-preview",   title:"Markdown Preview – Live Markdown Editor Online Free",   headline:"Preview Markdown Online Free",                     description:"Write Markdown and see a live HTML preview instantly. Free online Markdown editor.", longDescription:"",actionVerb:"preview markdown",       keywords:["markdown preview","markdown editor online","live markdown preview"],        inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:350000,relatedTools:[],howToSteps:["Type Markdown.","See live preview.","Copy or download."],faqs:[] },
  { id:"text-to-speech",     category:"text" as ToolCategory, slug:"/text/text-to-speech",     title:"Text to Speech Online Free – Browser-Based TTS",        headline:"Convert Text to Speech Online Free",               description:"Convert text to speech online free. Choose voice, speed and pitch. No upload.",      longDescription:"",actionVerb:"convert text to speech", keywords:["text to speech","tts online free","text to audio","speech synthesis"],      inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:800000,relatedTools:[],howToSteps:["Type text.","Choose voice settings.","Click Play."],faqs:[] },
  { id:"random-text",        category:"text" as ToolCategory, slug:"/text/random-text",        title:"Random Text Generator – Generate Random Words Online",  headline:"Generate Random Text Online Free",                 description:"Generate random text with custom word count. Free online random text generator.",    longDescription:"",actionVerb:"generate random text",   keywords:["random text generator","random words generator","random text online"],      inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:200000,relatedTools:[],howToSteps:["Set word count.","Click Generate.","Copy text."],faqs:[] },
  { id:"plagiarism-checker", category:"text" as ToolCategory, slug:"/text/plagiarism-checker", title:"Plagiarism Checker – Text Similarity Checker Online",   headline:"Check Text Similarity Online Free",                description:"Check similarity between two texts. Basic plagiarism detection — no server upload.", longDescription:"",actionVerb:"check plagiarism",       keywords:["plagiarism checker","text similarity checker","plagiarism detector online"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:500000,relatedTools:[],howToSteps:["Paste original text.","Paste text to check.","Click Check."],faqs:[] },
];


// ─── Unit Converter Tools ──────────────────────────────────────────────────────
export const unitTools: ToolConfig[] = [
  { id:"unit-length",      category:"unit" as ToolCategory, slug:"/unit/length",      title:"Length Converter – Free Online Unit Converter",        headline:"Length Converter",         description:"Convert length units: metres, km, miles, feet, inches, cm.",               longDescription:"",actionVerb:"convert length",      keywords:["length converter","meter to feet","km to miles","cm to inches"],      inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:800000,relatedTools:[],howToSteps:["Enter value.","Select units.","See result."],faqs:[] },
  { id:"unit-weight",      category:"unit" as ToolCategory, slug:"/unit/weight",      title:"Weight Converter – kg, lbs, oz Online Free",           headline:"Weight Converter",         description:"Convert weight units: kg, pounds, ounces, grams, tons.",                   longDescription:"",actionVerb:"convert weight",      keywords:["weight converter","kg to lbs","pounds to kg","oz to grams"],          inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:700000,relatedTools:[],howToSteps:["Enter value.","Select units.","See result."],faqs:[] },
  { id:"unit-temperature", category:"unit" as ToolCategory, slug:"/unit/temperature", title:"Temperature Converter – °C, °F, Kelvin Online Free",   headline:"Temperature Converter",    description:"Convert Celsius to Fahrenheit, Kelvin and more.",                           longDescription:"",actionVerb:"convert temperature", keywords:["temperature converter","celsius to fahrenheit","fahrenheit to celsius"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:900000,relatedTools:[],howToSteps:["Enter value.","Select units.","See result."],faqs:[] },
  { id:"unit-speed",       category:"unit" as ToolCategory, slug:"/unit/speed",       title:"Speed Converter – km/h, mph, m/s Online Free",         headline:"Speed Converter",          description:"Convert speed: km/h, mph, m/s, knots and more.",                           longDescription:"",actionVerb:"convert speed",       keywords:["speed converter","kmh to mph","mph to kmh"],                           inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:400000,relatedTools:[],howToSteps:["Enter value.","Select units.","See result."],faqs:[] },
  { id:"unit-data-storage",category:"unit" as ToolCategory, slug:"/unit/data-storage",title:"Data Storage Converter – KB, MB, GB, TB Online Free",  headline:"Data Storage Converter",   description:"Convert KB, MB, GB, TB, PB, bits and bytes.",                              longDescription:"",actionVerb:"convert data storage", keywords:["data storage converter","mb to gb","kb to mb","bytes converter"],      inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:600000,relatedTools:[],howToSteps:["Enter value.","Select units.","See result."],faqs:[] },
  { id:"unit-area",        category:"unit" as ToolCategory, slug:"/unit/area",        title:"Area Converter – sq ft, acres, hectares Online Free",  headline:"Area Converter",           description:"Convert sq metres, sq feet, acres, hectares and more.",                    longDescription:"",actionVerb:"convert area",        keywords:["area converter","square feet to meters","acres to hectares"],          inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:350000,relatedTools:[],howToSteps:["Enter value.","Select units.","See result."],faqs:[] },
  { id:"unit-volume",      category:"unit" as ToolCategory, slug:"/unit/volume",      title:"Volume Converter – Litres, Gallons, ml Online Free",   headline:"Volume Converter",         description:"Convert litres, gallons, ml, cups, cubic metres.",                         longDescription:"",actionVerb:"convert volume",      keywords:["volume converter","liters to gallons","ml to cups"],                   inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:350000,relatedTools:[],howToSteps:["Enter value.","Select units.","See result."],faqs:[] },
  { id:"unit-time",        category:"unit" as ToolCategory, slug:"/unit/time",        title:"Time Converter – Seconds, Hours, Days Online Free",    headline:"Time Converter",           description:"Convert seconds, minutes, hours, days, weeks, months, years.",             longDescription:"",actionVerb:"convert time",        keywords:["time converter","seconds to minutes","hours to seconds"],              inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:500000,relatedTools:[],howToSteps:["Enter value.","Select units.","See result."],faqs:[] },
  { id:"unit-fuel",        category:"unit" as ToolCategory, slug:"/unit/fuel",        title:"Fuel Economy Converter – MPG, km/L, L/100km Free",     headline:"Fuel Economy Converter",   description:"Convert MPG to km/L, L/100km and more.",                                   longDescription:"",actionVerb:"convert fuel economy", keywords:["fuel economy converter","mpg to km/l","l per 100km to mpg"],           inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:150000,relatedTools:[],howToSteps:["Enter value.","Select units.","See result."],faqs:[] },
  { id:"unit-pressure",    category:"unit" as ToolCategory, slug:"/unit/pressure",    title:"Pressure Converter – PSI, Bar, Pascal Online Free",    headline:"Pressure Converter",       description:"Convert PSI, bar, pascal, atm, kPa and more.",                             longDescription:"",actionVerb:"convert pressure",    keywords:["pressure converter","psi to bar","bar to psi","pascal to atm"],        inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:300000,relatedTools:[],howToSteps:["Enter value.","Select units.","See result."],faqs:[] },
  { id:"unit-energy",      category:"unit" as ToolCategory, slug:"/unit/energy",      title:"Energy Converter – Joules, Calories, kWh Online Free", headline:"Energy Converter",         description:"Convert joules, calories, kWh, BTU and more.",                             longDescription:"",actionVerb:"convert energy",      keywords:["energy converter","joules to calories","kwh converter","btu to joules"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:250000,relatedTools:[],howToSteps:["Enter value.","Select units.","See result."],faqs:[] },
  { id:"unit-power",       category:"unit" as ToolCategory, slug:"/unit/power",       title:"Power Converter – Watts, kW, Horsepower Online Free",  headline:"Power Converter",          description:"Convert watts, kilowatts, horsepower, BTU/hour.",                          longDescription:"",actionVerb:"convert power",       keywords:["power converter","watts to horsepower","kw to hp"],                    inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:200000,relatedTools:[],howToSteps:["Enter value.","Select units.","See result."],faqs:[] },
  { id:"unit-frequency",   category:"unit" as ToolCategory, slug:"/unit/frequency",   title:"Frequency Converter – Hz, kHz, MHz, GHz Online Free",  headline:"Frequency Converter",      description:"Convert Hz, kHz, MHz, GHz, RPM.",                                          longDescription:"",actionVerb:"convert frequency",   keywords:["frequency converter","hz to khz","mhz to ghz","rpm converter"],        inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:180000,relatedTools:[],howToSteps:["Enter value.","Select units.","See result."],faqs:[] },
  { id:"unit-angle",       category:"unit" as ToolCategory, slug:"/unit/angle",       title:"Angle Converter – Degrees, Radians, Gradians Online",  headline:"Angle Converter",          description:"Convert degrees, radians, gradians, arcminutes, arcseconds.",              longDescription:"",actionVerb:"convert angle",       keywords:["angle converter","degrees to radians","radians to degrees"],           inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:200000,relatedTools:[],howToSteps:["Enter value.","Select units.","See result."],faqs:[] },
  { id:"unit-resolution",  category:"unit" as ToolCategory, slug:"/unit/resolution",  title:"Resolution Converter – PPI, DPI, PPCM Online Free",    headline:"Resolution Converter",     description:"Convert image resolution: PPI, DPI, PPCM, dots/mm.",                      longDescription:"",actionVerb:"convert resolution",  keywords:["resolution converter","ppi to dpi","dpi converter"],                   inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:100000,relatedTools:[],howToSteps:["Enter value.","Select units.","See result."],faqs:[] },
];


// ─── Utility Tools ────────────────────────────────────────────────────────────
export const utilityTools: ToolConfig[] = [
  { id:"util-qr-code",    category:"utilities" as ToolCategory, slug:"/utilities/qr-code",    title:"QR Code Generator – Free Online",               headline:"QR Code Generator",          description:"Generate QR codes for URLs and text. Download as PNG. Free.",                 longDescription:"",actionVerb:"generate QR code",     keywords:["qr code generator","generate qr code","qr code maker"],             inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:1500000,relatedTools:[],howToSteps:["Enter URL or text.","Customize colors.","Download PNG."],faqs:[] },
  { id:"util-password",   category:"utilities" as ToolCategory, slug:"/utilities/password",   title:"Password Generator – Strong Random Passwords",  headline:"Password Generator",         description:"Generate strong random passwords with custom length and character sets.",    longDescription:"",actionVerb:"generate password",    keywords:["password generator","random password generator","strong password"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:800000, relatedTools:[],howToSteps:["Set length.","Choose character types.","Generate."],faqs:[] },
  { id:"util-uuid",       category:"utilities" as ToolCategory, slug:"/utilities/uuid",       title:"UUID Generator – Generate UUIDs Online Free",   headline:"UUID Generator",             description:"Generate UUID v4 identifiers online free. Batch up to 50.",                  longDescription:"",actionVerb:"generate UUID",        keywords:["uuid generator","generate uuid","random uuid online","uuid v4"],    inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:400000, relatedTools:[],howToSteps:["Set count.","Click Generate.","Copy UUIDs."],faqs:[] },
  { id:"util-base64",     category:"utilities" as ToolCategory, slug:"/utilities/base64",     title:"Base64 Encode Decode – Free Online Tool",       headline:"Base64 Encoder / Decoder",   description:"Encode and decode Base64 strings online free. No upload.",                   longDescription:"",actionVerb:"encode/decode base64",  keywords:["base64 encode","base64 decode","base64 converter online"],          inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:600000, relatedTools:[],howToSteps:["Choose mode.","Paste text.","Click Encode/Decode."],faqs:[] },
  { id:"util-url-encoder",category:"utilities" as ToolCategory, slug:"/utilities/url-encoder",title:"URL Encoder Decoder – Free Online",             headline:"URL Encoder / Decoder",      description:"URL encode and decode strings online free.",                                  longDescription:"",actionVerb:"encode/decode URL",     keywords:["url encoder","url decoder","url encode decode online"],             inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:300000, relatedTools:[],howToSteps:["Choose mode.","Paste URL.","Click Encode/Decode."],faqs:[] },
  { id:"util-hash",       category:"utilities" as ToolCategory, slug:"/utilities/hash",       title:"Hash Generator – SHA-256, SHA-512 Online Free", headline:"Hash Generator",             description:"Generate SHA-1, SHA-256, SHA-384, SHA-512 hashes online free.",               longDescription:"",actionVerb:"generate hash",        keywords:["hash generator","sha256 generator","sha-256 online","hash text"],   inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:400000, relatedTools:[],howToSteps:["Enter text.","Choose algorithm.","Generate hash."],faqs:[] },
  { id:"util-regex",      category:"utilities" as ToolCategory, slug:"/utilities/regex",      title:"Regex Tester – Test Regular Expressions Online", headline:"Regex Tester",               description:"Test regular expressions online with live match highlighting.",               longDescription:"",actionVerb:"test regex",           keywords:["regex tester","regular expression tester online","regex checker"],  inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:500000, relatedTools:[],howToSteps:["Enter pattern.","Enter test string.","See matches."],faqs:[] },
  { id:"util-epoch",      category:"utilities" as ToolCategory, slug:"/utilities/epoch",      title:"Epoch Converter – Unix Timestamp to Date",      headline:"Unix Timestamp Converter",   description:"Convert Unix timestamps to dates and vice versa. Free online epoch converter.",longDescription:"",actionVerb:"convert epoch",        keywords:["epoch converter","unix timestamp to date","timestamp converter"],   inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:350000, relatedTools:[],howToSteps:["Enter timestamp.","See date.","Or pick date for epoch."],faqs:[] },
  { id:"util-emoji",      category:"utilities" as ToolCategory, slug:"/utilities/emoji",      title:"Emoji Picker – Copy Emoji Online Free",         headline:"Emoji Picker",               description:"Browse and copy emojis from all categories. Free online emoji picker.",       longDescription:"",actionVerb:"pick emoji",           keywords:["emoji picker","copy emoji online","emoji keyboard online"],          inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:600000, relatedTools:[],howToSteps:["Browse categories.","Click emoji to copy.","Collect multiple."],faqs:[] },
  { id:"util-age",        category:"utilities" as ToolCategory, slug:"/utilities/age",        title:"Age Calculator – Calculate Age from Birth Date", headline:"Age Calculator",             description:"Calculate exact age in years, months, days from date of birth.",              longDescription:"",actionVerb:"calculate age",        keywords:["age calculator","calculate age","date of birth calculator"],        inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:700000, relatedTools:[],howToSteps:["Enter date of birth.","See age instantly."],faqs:[] },
  { id:"util-emi",        category:"utilities" as ToolCategory, slug:"/utilities/emi",        title:"EMI Calculator – Loan EMI Calculator Free Online",headline:"EMI Calculator",            description:"Calculate EMI for home loan, car loan, personal loan.",                      longDescription:"",actionVerb:"calculate EMI",        keywords:["emi calculator","loan emi calculator","home loan calculator"],      inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:900000, relatedTools:[],howToSteps:["Enter loan amount.","Enter rate and tenure.","See EMI breakdown."],faqs:[] },
  { id:"util-bmi",        category:"utilities" as ToolCategory, slug:"/utilities/bmi",        title:"BMI Calculator – Body Mass Index Online Free",  headline:"BMI Calculator",             description:"Calculate BMI online free. Metric and imperial units supported.",            longDescription:"",actionVerb:"calculate BMI",        keywords:["bmi calculator","body mass index calculator online"],               inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:800000, relatedTools:[],howToSteps:["Enter weight and height.","See BMI and category."],faqs:[] },
  { id:"util-percentage", category:"utilities" as ToolCategory, slug:"/utilities/percentage", title:"Percentage Calculator – Free Online",           headline:"Percentage Calculator",      description:"Calculate percentages: % of number, % change, increase/decrease.",          longDescription:"",actionVerb:"calculate percentage", keywords:["percentage calculator","percent calculator online free"],            inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:700000, relatedTools:[],howToSteps:["Choose mode.","Enter values.","See result."],faqs:[] },
  { id:"util-gst",        category:"utilities" as ToolCategory, slug:"/utilities/gst",        title:"GST Calculator – Add & Remove GST Online Free", headline:"GST Calculator",             description:"Calculate GST India: add GST or remove GST. All GST slabs.",                 longDescription:"",actionVerb:"calculate GST",        keywords:["gst calculator","gst calculator india","calculate gst online"],     inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:600000, relatedTools:[],howToSteps:["Enter amount.","Choose GST rate.","See breakdown."],faqs:[] },
];


// ─── Data Tools ──────────────────────────────────────────────────────────────
export const dataTools: ToolConfig[] = [
  { id:"data-json-formatter", category:"data" as ToolCategory, slug:"/data/json-formatter", title:"JSON Formatter & Minifier Online Free", headline:"JSON Formatter", description:"Format or minify JSON online free. Validate and beautify JSON.", longDescription:"",actionVerb:"json formatter", keywords:["json formatter", "json beautifier", "format json online", "json minifier"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:900000,relatedTools:[],howToSteps:["Paste input.","Click convert.","Copy result."],faqs:[] },
  { id:"data-csv-to-json", category:"data" as ToolCategory, slug:"/data/csv-to-json", title:"CSV to JSON Converter Online Free", headline:"CSV to JSON", description:"Convert CSV to JSON online free. No upload needed.", longDescription:"",actionVerb:"csv to json", keywords:["csv to json", "convert csv to json online free"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:400000,relatedTools:[],howToSteps:["Paste input.","Click convert.","Copy result."],faqs:[] },
  { id:"data-json-to-csv", category:"data" as ToolCategory, slug:"/data/json-to-csv", title:"JSON to CSV Converter Online Free", headline:"JSON to CSV", description:"Convert JSON array to CSV online free. No upload needed.", longDescription:"",actionVerb:"json to csv", keywords:["json to csv", "convert json to csv online free"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:350000,relatedTools:[],howToSteps:["Paste input.","Click convert.","Copy result."],faqs:[] },
  { id:"data-json-to-xml", category:"data" as ToolCategory, slug:"/data/json-to-xml", title:"JSON to XML Converter Online Free", headline:"JSON to XML", description:"Convert JSON to XML online free. Browser-based, no upload.", longDescription:"",actionVerb:"json to xml", keywords:["json to xml", "convert json to xml online"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:300000,relatedTools:[],howToSteps:["Paste input.","Click convert.","Copy result."],faqs:[] },
  { id:"data-xml-to-json", category:"data" as ToolCategory, slug:"/data/xml-to-json", title:"XML to JSON Converter Online Free", headline:"XML to JSON", description:"Convert XML to JSON online free. Browser-based, no upload.", longDescription:"",actionVerb:"xml to json", keywords:["xml to json", "convert xml to json online"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:300000,relatedTools:[],howToSteps:["Paste input.","Click convert.","Copy result."],faqs:[] },
  { id:"data-json-to-yaml", category:"data" as ToolCategory, slug:"/data/json-to-yaml", title:"JSON to YAML Converter Online Free", headline:"JSON to YAML", description:"Convert JSON to YAML online free. No upload needed.", longDescription:"",actionVerb:"json to yaml", keywords:["json to yaml", "convert json to yaml online"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:200000,relatedTools:[],howToSteps:["Paste input.","Click convert.","Copy result."],faqs:[] },
  { id:"data-yaml-to-json", category:"data" as ToolCategory, slug:"/data/yaml-to-json", title:"YAML to JSON Converter Online Free", headline:"YAML to JSON", description:"Convert YAML to JSON online free. No upload needed.", longDescription:"",actionVerb:"yaml to json", keywords:["yaml to json", "convert yaml to json online"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:200000,relatedTools:[],howToSteps:["Paste input.","Click convert.","Copy result."],faqs:[] },
  { id:"data-csv-to-xml", category:"data" as ToolCategory, slug:"/data/csv-to-xml", title:"CSV to XML Converter Online Free", headline:"CSV to XML", description:"Convert CSV to XML online free. No upload needed.", longDescription:"",actionVerb:"csv to xml", keywords:["csv to xml", "convert csv to xml online"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:150000,relatedTools:[],howToSteps:["Paste input.","Click convert.","Copy result."],faqs:[] },
  { id:"data-tsv-to-csv", category:"data" as ToolCategory, slug:"/data/tsv-to-csv", title:"TSV to CSV Converter – Free Online", headline:"TSV ↔ CSV Converter", description:"Convert TSV to CSV or CSV to TSV online free.", longDescription:"",actionVerb:"tsv ↔ csv converter", keywords:["tsv to csv", "csv to tsv converter online"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:100000,relatedTools:[],howToSteps:["Paste input.","Click convert.","Copy result."],faqs:[] },
  { id:"data-json-to-typescript", category:"data" as ToolCategory, slug:"/data/json-to-typescript", title:"JSON to TypeScript Interface Generator Free", headline:"JSON to TypeScript", description:"Generate TypeScript interfaces from JSON online free.", longDescription:"",actionVerb:"json to typescript", keywords:["json to typescript", "json to ts interface"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:250000,relatedTools:[],howToSteps:["Paste input.","Click convert.","Copy result."],faqs:[] },
  { id:"data-excel-to-json", category:"data" as ToolCategory, slug:"/data/excel-to-json", title:"Excel to JSON Converter Online Free", headline:"Excel to JSON", description:"Convert Excel (.xlsx) to JSON online free. No upload needed.", longDescription:"",actionVerb:"excel to json", keywords:["excel to json", "xlsx to json", "convert excel to json online free"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:400000,relatedTools:[],howToSteps:["Paste input.","Click convert.","Copy result."],faqs:[] },
  { id:"data-json-diff", category:"data" as ToolCategory, slug:"/data/json-diff", title:"JSON Diff Checker – Compare Two JSONs Free", headline:"JSON Diff Checker", description:"Compare two JSON objects and see differences. Free online.", longDescription:"",actionVerb:"json diff checker", keywords:["json diff", "compare json online", "json diff checker"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:200000,relatedTools:[],howToSteps:["Paste input.","Click convert.","Copy result."],faqs:[] },
  { id:"data-json-to-table", category:"data" as ToolCategory, slug:"/data/json-to-table", title:"JSON to HTML Table Converter Online Free", headline:"JSON to Table", description:"Convert JSON array to HTML table online free.", longDescription:"",actionVerb:"json to table", keywords:["json to table", "json to html table", "convert json to table"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:150000,relatedTools:[],howToSteps:["Paste input.","Click convert.","Copy result."],faqs:[] },
  { id:"data-json-validator", category:"data" as ToolCategory, slug:"/data/json-validator", title:"JSON Validator – Validate JSON Online Free", headline:"JSON Validator", description:"Validate and format JSON online free. Instant syntax checking.", longDescription:"",actionVerb:"json validator", keywords:["json validator", "validate json online", "json checker"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:500000,relatedTools:[],howToSteps:["Paste input.","Click convert.","Copy result."],faqs:[] },
];

// ─── Code Tools ──────────────────────────────────────────────────────────────
export const codeTools: ToolConfig[] = [
  { id:"code-html-formatter", category:"code" as ToolCategory, slug:"/code/html-formatter", title:"HTML Formatter & Minifier Online Free", headline:"HTML Formatter", description:"Format and minify HTML online free.", longDescription:"",actionVerb:"html formatter", keywords:["html formatter", "html beautifier", "html minifier"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:500000,relatedTools:[],howToSteps:["Paste input.","Click convert.","Copy result."],faqs:[] },
  { id:"code-css-formatter", category:"code" as ToolCategory, slug:"/code/css-formatter", title:"CSS Formatter & Minifier Online Free", headline:"CSS Formatter", description:"Format and minify CSS online free.", longDescription:"",actionVerb:"css formatter", keywords:["css formatter", "css beautifier online", "css minifier"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:400000,relatedTools:[],howToSteps:["Paste input.","Click convert.","Copy result."],faqs:[] },
  { id:"code-js-formatter", category:"code" as ToolCategory, slug:"/code/js-formatter", title:"JavaScript Formatter & Minifier Online Free", headline:"JS Formatter", description:"Format and minify JavaScript online free.", longDescription:"",actionVerb:"js formatter", keywords:["js formatter", "javascript formatter online", "js minifier"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:500000,relatedTools:[],howToSteps:["Paste input.","Click convert.","Copy result."],faqs:[] },
  { id:"code-html-to-jsx", category:"code" as ToolCategory, slug:"/code/html-to-jsx", title:"HTML to JSX Converter – Free Online", headline:"HTML to JSX", description:"Convert HTML to JSX online free.", longDescription:"",actionVerb:"html to jsx", keywords:["html to jsx", "convert html to jsx online"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:300000,relatedTools:[],howToSteps:["Paste input.","Click convert.","Copy result."],faqs:[] },
  { id:"code-html-entities", category:"code" as ToolCategory, slug:"/code/html-entities", title:"HTML Entities Encode Decode Online Free", headline:"HTML Entities", description:"Encode or decode HTML entities online free.", longDescription:"",actionVerb:"html entities", keywords:["html entities encoder", "html encode decode online"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:200000,relatedTools:[],howToSteps:["Paste input.","Click convert.","Copy result."],faqs:[] },
  { id:"code-js-obfuscator", category:"code" as ToolCategory, slug:"/code/js-obfuscator", title:"JavaScript Obfuscator Online Free", headline:"JS Obfuscator", description:"Obfuscate JavaScript code online free.", longDescription:"",actionVerb:"js obfuscator", keywords:["js obfuscator", "javascript obfuscator online"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:250000,relatedTools:[],howToSteps:["Paste input.","Click convert.","Copy result."],faqs:[] },
  { id:"code-sql-formatter", category:"code" as ToolCategory, slug:"/code/sql-formatter", title:"SQL Formatter – Format SQL Online Free", headline:"SQL Formatter", description:"Format and beautify SQL queries online free.", longDescription:"",actionVerb:"sql formatter", keywords:["sql formatter", "format sql online", "sql beautifier"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:400000,relatedTools:[],howToSteps:["Paste input.","Click convert.","Copy result."],faqs:[] },
  { id:"code-css-to-tailwind", category:"code" as ToolCategory, slug:"/code/css-to-tailwind", title:"CSS to Tailwind Converter Online Free", headline:"CSS to Tailwind", description:"Convert CSS to Tailwind CSS classes online free.", longDescription:"",actionVerb:"css to tailwind", keywords:["css to tailwind", "convert css to tailwind online"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:300000,relatedTools:[],howToSteps:["Paste input.","Click convert.","Copy result."],faqs:[] },
  { id:"code-css-prefixer", category:"code" as ToolCategory, slug:"/code/css-prefixer", title:"CSS Autoprefixer – Add Vendor Prefixes Free", headline:"CSS Autoprefixer", description:"Add CSS vendor prefixes automatically online.", longDescription:"",actionVerb:"css autoprefixer", keywords:["css autoprefixer", "add vendor prefixes css"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:200000,relatedTools:[],howToSteps:["Paste input.","Click convert.","Copy result."],faqs:[] },
  { id:"code-color-converter", category:"code" as ToolCategory, slug:"/code/color-converter", title:"Color Converter – HEX, RGB, HSL Online Free", headline:"Color Converter", description:"Convert colors between HEX, RGB, RGBA and HSL online free.", longDescription:"",actionVerb:"color converter", keywords:["color converter", "hex to rgb", "rgb to hex", "hsl converter"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:600000,relatedTools:[],howToSteps:["Paste input.","Click convert.","Copy result."],faqs:[] },
  { id:"code-meta-tags", category:"code" as ToolCategory, slug:"/code/meta-tags", title:"Meta Tags Generator – SEO Meta Tags Free", headline:"Meta Tags Generator", description:"Generate SEO and Open Graph meta tags online free.", longDescription:"",actionVerb:"meta tags generator", keywords:["meta tags generator", "seo meta tags generator"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:350000,relatedTools:[],howToSteps:["Paste input.","Click convert.","Copy result."],faqs:[] },
  { id:"code-robots-txt", category:"code" as ToolCategory, slug:"/code/robots-txt", title:"Robots.txt Generator – Free Online", headline:"Robots.txt Generator", description:"Generate a robots.txt file for your website online free.", longDescription:"",actionVerb:"robots.txt generator", keywords:["robots txt generator", "generate robots.txt online"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:200000,relatedTools:[],howToSteps:["Paste input.","Click convert.","Copy result."],faqs:[] },
  { id:"code-htaccess", category:"code" as ToolCategory, slug:"/code/htaccess", title:"Htaccess Generator – .htaccess Free Online", headline:".htaccess Generator", description:"Generate .htaccess rules: HTTPS, www, caching, gzip.", longDescription:"",actionVerb:".htaccess generator", keywords:["htaccess generator", "generate .htaccess online"], inputFormats:[],outputFormat:"",outputExtension:"",maxFileSizeMB:0,maxBatchSize:1,searchVolume:150000,relatedTools:[],howToSteps:["Paste input.","Click convert.","Copy result."],faqs:[] },
];

export const allTools: ToolConfig[] = [...imageTools, ...pdfTools, ...textTools, ...unitTools, ...utilityTools, ...dataTools, ...codeTools];
