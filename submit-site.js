#!/usr/bin/env node
/**
 * submit-site.js — IndexNow + Bing + Google ping for easyconverter.io
 *
 * Submits ALL 125 pages to IndexNow (Bing, Yandex, DuckDuckGo) + pings
 * the Google sitemap endpoint. Run this after every deploy.
 *
 * Usage:  node submit-site.js
 * Needs:  Node.js 18+ (built-in fetch)
 */

const BASE_URL     = "https://www.easyconverter.io";
const INDEX_KEY    = process.argv[2] || "easyconverter2026indexnow";
const KEY_LOCATION = `${BASE_URL}/${INDEX_KEY}.txt`;

/* ── All URLs (mirrors sitemap.ts logic — no need to run Next.js) ───── */
const STATIC_PAGES = [
  "/",
  "/image/", "/pdf/", "/text/", "/unit/", "/utilities/",
  "/data/", "/code/", "/document/",
  "/about/", "/contact/", "/privacy/", "/terms/", "/cookies/",
];

const TOOL_SLUGS = [
  // Image
  "/image/jpg-to-png/", "/image/png-to-jpg/", "/image/image-to-webp/",
  "/image/image-compressor/", "/image/image-resizer/", "/image/webp-to-jpg/",
  "/image/webp-to-png/", "/image/png-to-webp/", "/image/jpg-to-webp/",
  "/image/svg-to-png/", "/image/gif-to-png/", "/image/image-cropper/",
  "/image/image-to-base64/", "/image/base64-to-image/", "/image/color-picker/",
  "/image/image-metadata/", "/image/image-watermark/",
  // PDF
  "/pdf/merge-pdf/", "/pdf/split-pdf/", "/pdf/pdf-compressor/",
  "/pdf/rotate-pdf/", "/pdf/pdf-to-jpg/", "/pdf/pdf-to-png/",
  "/pdf/pdf-watermark/", "/pdf/pdf-page-numbers/", "/pdf/image-to-pdf/",
  "/pdf/pdf-to-text/", "/pdf/reorder-pdf/", "/pdf/pdf-metadata/",
  "/pdf/extract-images-pdf/", "/pdf/docx-to-pdf/",
  // Text
  "/text/word-counter/", "/text/case-converter/", "/text/lorem-ipsum/",
  "/text/find-replace/", "/text/line-sorter/", "/text/deduplicate-lines/",
  "/text/text-repeater/", "/text/diff-checker/", "/text/readability-score/",
  "/text/markdown-preview/", "/text/text-to-speech/", "/text/random-text/",
  "/text/plagiarism-checker/",
  // Unit
  "/unit/length/", "/unit/weight/", "/unit/temperature/", "/unit/speed/",
  "/unit/data-storage/", "/unit/area/", "/unit/volume/", "/unit/time/",
  "/unit/fuel/", "/unit/pressure/", "/unit/energy/", "/unit/power/",
  "/unit/frequency/", "/unit/angle/", "/unit/resolution/",
  // Utilities
  "/utilities/qr-code/", "/utilities/password/", "/utilities/uuid/",
  "/utilities/base64/", "/utilities/url-encoder/", "/utilities/hash/",
  "/utilities/regex/", "/utilities/epoch/", "/utilities/emoji/",
  "/utilities/age/", "/utilities/emi/", "/utilities/bmi/",
  "/utilities/percentage/", "/utilities/gst/",
  // Data
  "/data/json-formatter/", "/data/csv-to-json/", "/data/json-to-csv/",
  "/data/json-to-xml/", "/data/xml-to-json/", "/data/json-to-yaml/",
  "/data/yaml-to-json/", "/data/csv-to-xml/", "/data/tsv-to-csv/",
  "/data/json-to-typescript/", "/data/excel-to-json/", "/data/json-diff/",
  "/data/json-to-table/", "/data/json-validator/",
  // Code
  "/code/html-formatter/", "/code/css-formatter/", "/code/js-formatter/",
  "/code/html-to-jsx/", "/code/html-entities/", "/code/js-obfuscator/",
  "/code/sql-formatter/", "/code/css-to-tailwind/", "/code/css-prefixer/",
  "/code/color-converter/", "/code/meta-tags/", "/code/robots-txt/",
  "/code/htaccess/",
  // Document
  "/document/html-to-pdf/", "/document/text-to-pdf/",
  "/document/html-markdown/", "/document/pdf-page-counter/",
  "/document/docx-to-txt/", "/document/image-flip-rotate/",
];

const ALL_URLS = [
  ...STATIC_PAGES.map(p => `${BASE_URL}${p}`),
  ...TOOL_SLUGS.map(p => `${BASE_URL}${p}`),
];

/* ── colours ─────────────────────────────────────────────────────────── */
const G = "\x1b[32m", R = "\x1b[31m", Y = "\x1b[33m",
      C = "\x1b[36m", D = "\x1b[2m",  B = "\x1b[1m",  X = "\x1b[0m";
const ok   = m => console.log(`  ${G}✓${X} ${m}`);
const fail = m => console.log(`  ${R}✗${X} ${m}`);
const warn = m => console.log(`  ${Y}⚠${X} ${m}`);
const info = m => console.log(`  ${C}→${X} ${m}`);

/* ── fetch helpers ────────────────────────────────────────────────────── */
async function post(url, body) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(12000),
    });
    return { ok: res.ok, status: res.status, text: await res.text().catch(() => "") };
  } catch (e) { return { ok: false, status: 0, text: e.message }; }
}

async function get(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    return { ok: res.ok, status: res.status, text: await res.text().catch(() => "") };
  } catch (e) { return { ok: false, status: 0, text: e.message }; }
}

/* ── 1. Site health check ────────────────────────────────────────────── */
async function checkHealth() {
  console.log(`\n${B}[1] Site Health Check${X}`);
  const checks = [
    { label: "Homepage",       url: `${BASE_URL}/` },
    { label: "Sitemap",        url: `${BASE_URL}/sitemap.xml` },
    { label: "Robots.txt",     url: `${BASE_URL}/robots.txt` },
    { label: "IndexNow key",   url: `${BASE_URL}/${INDEX_KEY}.txt` },
    { label: "Favicon SVG",    url: `${BASE_URL}/favicon.svg` },
    { label: "Top tool (JPG→PNG)", url: `${BASE_URL}/image/jpg-to-png/` },
    { label: "Top tool (Merge PDF)", url: `${BASE_URL}/pdf/merge-pdf/` },
  ];
  let allOk = true;
  for (const { label, url } of checks) {
    const r = await get(url);
    if (r.status === 200) ok(`${label} — 200 OK`);
    else { fail(`${label} — ${r.status} (${url})`); allOk = false; }
  }
  // Check canonical
  const home = await get(`${BASE_URL}/`);
  if (home.ok) {
    if (home.text.includes('"canonical" href="https://www.easyconverter.io/"')) {
      ok(`Canonical — www + trailing slash ✓`);
    } else {
      warn(`Canonical may not match expected format`);
    }
  }
  return allOk;
}

/* ── 2. IndexNow — submit ALL 125 URLs in one batch call ─────────────── */
async function submitIndexNow() {
  console.log(`\n${B}[2] IndexNow — ${ALL_URLS.length} URLs${X}`);
  info(`Submitting to Bing + api.indexnow.org + Yandex…`);

  const body = {
    host:        "www.easyconverter.io",
    key:         INDEX_KEY,
    keyLocation: KEY_LOCATION,
    urlList:     ALL_URLS,
  };

  const endpoints = [
    "https://api.indexnow.org/indexnow",   // central hub → notifies all partners
    "https://www.bing.com/indexnow",
  ];

  for (const ep of endpoints) {
    const name = new URL(ep).hostname;
    const r = await post(ep, body);
    if (r.status === 200 || r.status === 202) {
      ok(`${name} — accepted (${r.status}) · ${ALL_URLS.length} URLs queued`);
    } else if (r.status === 422) {
      warn(`${name} — key not verified (422). Make sure ${KEY_LOCATION} is accessible.`);
    } else if (r.status === 403) {
      warn(`${name} — key mismatch (403). Check INDEX_KEY matches the file content.`);
    } else {
      fail(`${name} — ${r.status || "network error"}: ${r.text.slice(0, 80)}`);
    }
  }
}

/* ── 3. Google sitemap ping ──────────────────────────────────────────── */
async function pingGoogle() {
  console.log(`\n${B}[3] Google Sitemap Ping${X}`);
  const r = await get(
    `https://www.google.com/ping?sitemap=${encodeURIComponent(`${BASE_URL}/sitemap.xml`)}`
  );
  if (r.status === 200 || r.status === 204) ok(`Google sitemap ping accepted`);
  else warn(`Google ping returned ${r.status} (may still be processed)`);
}

/* ── 4. Ping-o-Matic ─────────────────────────────────────────────────── */
async function pingOMatic() {
  console.log(`\n${B}[4] Ping-o-Matic${X}`);
  const xml = `<?xml version="1.0"?>
<methodCall>
  <methodName>weblogUpdates.ping</methodName>
  <params>
    <param><value><string>EasyConverter.io</string></value></param>
    <param><value><string>${BASE_URL}</string></value></param>
    <param><value><string>${BASE_URL}/sitemap.xml</string></value></param>
  </params>
</methodCall>`;
  try {
    const r = await fetch("http://rpc.pingomatic.com/", {
      method: "POST", headers: { "Content-Type": "text/xml" },
      body: xml, signal: AbortSignal.timeout(8000),
    });
    if (r.ok) ok("Ping-o-Matic — pinged"); else warn(`Ping-o-Matic — ${r.status}`);
  } catch (e) { warn(`Ping-o-Matic — ${e.message.slice(0, 60)}`); }
}

/* ── Main ─────────────────────────────────────────────────────────────── */
async function main() {
  console.log(`\n${B}${C}╔══════════════════════════════════════════════╗${X}`);
  console.log(`${B}${C}║   EasyConverter.io — Site Submission Script  ║${X}`);
  console.log(`${B}${C}╚══════════════════════════════════════════════╝${X}`);
  console.log(`${D}  Submitting ${ALL_URLS.length} URLs · ${BASE_URL}${X}`);
  console.log(`${D}  IndexNow key: ${INDEX_KEY}${X}`);
  console.log(`${D}  Key file:     ${KEY_LOCATION}${X}\n`);

  const healthy = await checkHealth();
  if (!healthy) {
    warn("Some pages returned non-200. Make sure the site is deployed before submitting.");
  }

  await submitIndexNow();
  await pingGoogle();
  await pingOMatic();

  console.log(`\n${B}${G}══════════════════════════════════════════════${X}`);
  console.log(`${B}${G}  Done! Run this after every deploy.${X}`);
  console.log(`${B}${G}══════════════════════════════════════════════${X}`);
  console.log(`
${B}AFTER DEPLOY — add this to your deploy-dashboard post-deploy hook:${X}
${D}  node /path/to/easyconverter/submit-site.js${X}

${B}Or add a webhook call after deploy:${X}
${D}  # EasyConverter is static so no /api/ping endpoint — run the script directly${X}
  `);
}

main().catch(console.error);
