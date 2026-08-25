/**
 * codeConverter.ts — Browser-side code formatting/transformation utilities.
 * No external formatters — uses regex + AST-free approaches that work client-side.
 */

// ─── JSON Formatter (already in dataConverter, re-export) ────────────────────
export { formatJson as formatJsonCode, minifyJson as minifyJsonCode } from "./dataConverter";

// ─── HTML Formatter ───────────────────────────────────────────────────────────
export function formatHtml(html: string): string {
  let indent = 0;
  const selfClose = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)/i;
  const lines: string[] = [];
  // Split on tags
  const parts = html.replace(/>\s*</g, ">\n<").split("\n");
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const isClose  = /^<\//.test(trimmed);
    const isOpen   = /^<[^/!]/.test(trimmed) && !selfClose.test(trimmed.slice(1));
    const isSelf   = selfClose.test(trimmed.slice(1)) || /\/>$/.test(trimmed);
    if (isClose) indent = Math.max(0, indent - 1);
    lines.push("  ".repeat(indent) + trimmed);
    if (isOpen && !isSelf && !isClose) indent++;
  }
  return lines.join("\n");
}
export function minifyHtml(html: string): string {
  return html.replace(/<!--[\s\S]*?-->/g, "").replace(/\s{2,}/g, " ").replace(/>\s+</g, "><").trim();
}

// ─── CSS Formatter ────────────────────────────────────────────────────────────
export function formatCss(css: string): string {
  return css
    .replace(/\s*{\s*/g, " {\n  ")
    .replace(/;\s*/g, ";\n  ")
    .replace(/\s*}\s*/g, "\n}\n")
    .replace(/  \n}/g, "\n}")
    .trim();
}
export function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{};:,>+~])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

// ─── CSS Autoprefixer (minimal) ───────────────────────────────────────────────
export function prefixCss(css: string): string {
  const prefixed = css.replace(
    /(transform|transition|animation|flex|grid|user-select|appearance|backface-visibility|box-sizing|text-size-adjust)\s*:/g,
    (_, prop) => `-webkit-${prop}: ...;\n  -moz-${prop}: ...;\n  -ms-${prop}: ...;\n  ${prop}:`
  );
  // Remove the placeholder ...
  return prefixed.replace(/\.\.\./g, (match, offset, str) => {
    // Find the actual value by looking for the unprefixed version
    return "VALUE";
  });
}

// ─── JS Formatter (basic) ────────────────────────────────────────────────────
export function formatJs(js: string): string {
  let indent = 0;
  const lines: string[] = [];
  const tokens = js.replace(/([{}();,])/g, "\n$1\n").split("\n");
  for (const token of tokens) {
    const t = token.trim();
    if (!t) continue;
    if (t === "}") indent = Math.max(0, indent - 1);
    lines.push("  ".repeat(indent) + t);
    if (t === "{") indent++;
    if (t === "}") { /* already handled */ }
  }
  return lines.join("\n").replace(/\n{3,}/g, "\n\n");
}
export function minifyJs(js: string): string {
  return js
    .replace(/\/\/[^\n]*/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([=+\-*/<>!&|,;:{}()\[\]])\s*/g, "$1")
    .trim();
}

// ─── HTML → JSX ───────────────────────────────────────────────────────────────
export function htmlToJsx(html: string): string {
  return html
    .replace(/class=/g, "className=")
    .replace(/for=/g, "htmlFor=")
    .replace(/(<(?:br|hr|img|input|link|meta|area|base|col|embed|param|source|track|wbr)[^>]*)(?<!\/)(>)/gi,
      (_, tag, _end) => tag + " />")
    .replace(/style="([^"]*)"/g, (_, styles) => {
      const obj = styles.split(";").filter(Boolean).map((s: string) => {
        const [k, v] = s.split(":").map((x: string) => x.trim());
        const camel  = k.replace(/-([a-z])/g, (_: string, l: string) => l.toUpperCase());
        return `${camel}: "${v}"`;
      }).join(", ");
      return `style={{ ${obj} }}`;
    })
    .replace(/<!--([\s\S]*?)-->/g, "{/* $1 */}");
}

// ─── HTML Entities encode/decode ─────────────────────────────────────────────
export function encodeHtmlEntities(s: string): string {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
          .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}
export function decodeHtmlEntities(s: string): string {
  const div = document.createElement("div");
  div.innerHTML = s;
  return div.textContent ?? s;
}

// ─── JS Obfuscator (simple — renames variables, removes whitespace) ──────────
export function obfuscateJs(js: string): string {
  // Remove comments
  let code = js.replace(/\/\/[^\n]*/g,"").replace(/\/\*[\s\S]*?\*\//g,"");
  // Build identifier map
  const identifiers = [...new Set(code.match(/\b[a-zA-Z_$][a-zA-Z0-9_$]{2,}\b/g) ?? [])];
  const reserved = new Set(["function","return","var","let","const","if","else","for","while","do","switch","case","break","continue","new","this","typeof","instanceof","in","of","class","import","export","default","from","async","await","try","catch","finally","throw","true","false","null","undefined","console","document","window","Object","Array","String","Number","Boolean","Math","Date","JSON","Promise"]);
  let counter = 0;
  const map: Record<string,string> = {};
  for (const id of identifiers) {
    if (!reserved.has(id)) { map[id] = `_0x${(counter++).toString(16).padStart(4,"0")}`; }
  }
  for (const [orig, obf] of Object.entries(map)) {
    code = code.replace(new RegExp(`\\b${orig}\\b`,"g"), obf);
  }
  return code.replace(/\s+/g," ").replace(/\s*([=+\-*/<>!&|,;:{}()\[\]])\s*/g,"$1").trim();
}

// ─── SQL Formatter ────────────────────────────────────────────────────────────
const SQL_KEYWORDS = ["SELECT","FROM","WHERE","AND","OR","NOT","IN","BETWEEN","LIKE","ORDER BY","GROUP BY","HAVING","LIMIT","OFFSET","JOIN","LEFT JOIN","RIGHT JOIN","INNER JOIN","OUTER JOIN","ON","INSERT INTO","VALUES","UPDATE","SET","DELETE","CREATE TABLE","ALTER TABLE","DROP TABLE","PRIMARY KEY","FOREIGN KEY","INDEX","UNIQUE","NULL","NOT NULL","DEFAULT","AUTO_INCREMENT"];
export function formatSql(sql: string): string {
  let formatted = " " + sql.replace(/\s+/g," ").trim();
  for (const kw of SQL_KEYWORDS.sort((a,b) => b.length - a.length)) {
    formatted = formatted.replace(new RegExp(`\\b${kw}\\b`,"gi"), "\n" + kw.toUpperCase());
  }
  return formatted.trim();
}

// ─── CSS → Tailwind (heuristic mapping) ──────────────────────────────────────
const CSS_TO_TW: [RegExp, string | ((_match: string, ...groups: string[]) => string)][] = [
  [/display:\s*flex/i,              "flex"],
  [/display:\s*grid/i,              "grid"],
  [/display:\s*block/i,             "block"],
  [/display:\s*none/i,              "hidden"],
  [/display:\s*inline-flex/i,       "inline-flex"],
  [/flex-direction:\s*column/i,     "flex-col"],
  [/justify-content:\s*center/i,    "justify-center"],
  [/justify-content:\s*space-between/i,"justify-between"],
  [/align-items:\s*center/i,        "items-center"],
  [/align-items:\s*flex-start/i,    "items-start"],
  [/font-weight:\s*bold/i,          "font-bold"],
  [/font-weight:\s*600/i,           "font-semibold"],
  [/font-size:\s*(\d+)px/i,         (_, n) => `text-[${n}px]`],
  [/color:\s*([^;]+)/i,             (_, c) => `text-[${c.trim()}]`],
  [/background-color:\s*([^;]+)/i,  (_, c) => `bg-[${c.trim()}]`],
  [/border-radius:\s*(\d+)px/i,     (_, n) => `rounded-[${n}px]`],
  [/border-radius:\s*9999px/i,      "rounded-full"],
  [/width:\s*100%/i,                "w-full"],
  [/height:\s*100%/i,               "h-full"],
  [/padding:\s*(\d+)px/i,           (_, n) => `p-[${n}px]`],
  [/margin:\s*auto/i,               "mx-auto"],
  [/cursor:\s*pointer/i,            "cursor-pointer"],
  [/overflow:\s*hidden/i,           "overflow-hidden"],
  [/position:\s*relative/i,         "relative"],
  [/position:\s*absolute/i,         "absolute"],
  [/position:\s*fixed/i,            "fixed"],
  [/opacity:\s*0/i,                 "opacity-0"],
  [/opacity:\s*1/i,                 "opacity-100"],
];
export function cssToTailwind(css: string): string {
  const declarations = css.split(";").map(d => d.trim()).filter(Boolean);
  const classes: string[] = [];
  const unmapped: string[] = [];
  for (const decl of declarations) {
    let matched = false;
    for (const [re, tw] of CSS_TO_TW) {
      if (re.test(decl)) {
        const match = decl.match(re);
        const groups = match?.slice(1) ?? [];
        classes.push(typeof tw === "function" ? (tw as (_m: string, ...g: string[]) => string)("", ...groups) : tw);
        matched = true; break;
      }
    }
    if (!matched) unmapped.push(`/* ${decl} */`);
  }
  return [
    `className="${classes.join(" ")}"`,
    unmapped.length ? "\n\n/* Unmapped — review manually: */\n" + unmapped.join("\n") : ""
  ].join("");
}

// ─── Meta Tags Generator ──────────────────────────────────────────────────────
export function generateMetaTags(title: string, desc: string, url: string, image: string): string {
  return `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${desc}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${image}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${desc}">
<meta property="twitter:image" content="${image}">`;
}

// ─── Robots.txt Generator ─────────────────────────────────────────────────────
export function generateRobotsTxt(
  allow: string[], disallow: string[], sitemap: string, userAgent = "*"
): string {
  const lines = [`User-agent: ${userAgent}`];
  for (const p of allow)    lines.push(`Allow: ${p}`);
  for (const p of disallow) lines.push(`Disallow: ${p}`);
  if (sitemap) lines.push(`\nSitemap: ${sitemap}`);
  return lines.join("\n");
}

// ─── .htaccess Generator (common rules) ──────────────────────────────────────
export function generateHtaccess(rules: { redirect: boolean; www: boolean; https: boolean; cache: boolean; gzip: boolean }): string {
  const parts: string[] = ["# Generated .htaccess\nOptions -Indexes\n"];
  if (rules.https) parts.push(`# Force HTTPS\nRewriteEngine On\nRewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]\n`);
  if (rules.www)   parts.push(`# Force www\nRewriteCond %{HTTP_HOST} !^www\\.(.*)$ [NC]\nRewriteRule ^(.*)$ https://www.%{HTTP_HOST}/$1 [L,R=301]\n`);
  if (rules.cache) parts.push(`# Browser Caching\n<IfModule mod_expires.c>\n  ExpiresActive On\n  ExpiresByType image/jpg "access plus 1 year"\n  ExpiresByType image/png "access plus 1 year"\n  ExpiresByType text/css "access plus 1 month"\n  ExpiresByType application/javascript "access plus 1 month"\n</IfModule>\n`);
  if (rules.gzip)  parts.push(`# Enable Gzip\n<IfModule mod_deflate.c>\n  AddOutputFilterByType DEFLATE text/html text/css application/javascript\n</IfModule>\n`);
  return parts.join("\n");
}

// ─── Color Converter ──────────────────────────────────────────────────────────
export interface ColorResult {
  hex: string; rgb: string; hsl: string; rgba: string;
}
export function convertColor(input: string): ColorResult {
  const s = input.trim().toLowerCase();
  let r = 0, g = 0, b = 0, a = 1;
  if (/^#([0-9a-f]{3,8})$/.test(s)) {
    const h = s.slice(1);
    const hex = h.length === 3 ? h.split("").map(x=>x+x).join("") : h.length === 6 ? h : h.slice(0,6);
    r = parseInt(hex.slice(0,2),16); g = parseInt(hex.slice(2,4),16); b = parseInt(hex.slice(4,6),16);
    if (h.length === 8) a = parseInt(h.slice(6,8),16)/255;
  } else if (/^rgb/.test(s)) {
    const m = s.match(/[\d.]+/g) ?? [];
    r = parseInt(m[0] ?? "0"); g = parseInt(m[1] ?? "0"); b = parseInt(m[2] ?? "0"); a = m[3] ? parseFloat(m[3]) : 1;
  } else if (/^hsl/.test(s)) {
    const m = s.match(/[\d.]+/g) ?? [];
    const hue = parseFloat(m[0] ?? "0")/360, sat = parseFloat(m[1] ?? "0")/100, lig = parseFloat(m[2] ?? "0")/100;
    const q = lig < 0.5 ? lig*(1+sat) : lig+sat-lig*sat;
    const p = 2*lig-q;
    const hue2rgb = (p: number, q: number, t: number) => { if(t<0)t+=1; if(t>1)t-=1; if(t<1/6)return p+(q-p)*6*t; if(t<1/2)return q; if(t<2/3)return p+(q-p)*(2/3-t)*6; return p; };
    r = Math.round(hue2rgb(p,q,hue+1/3)*255); g = Math.round(hue2rgb(p,q,hue)*255); b = Math.round(hue2rgb(p,q,hue-1/3)*255);
  }
  const toHex = (n: number) => n.toString(16).padStart(2,"0");
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  const rn = r/255, gn = g/255, bn = b/255;
  const max = Math.max(rn,gn,bn), min = Math.min(rn,gn,bn);
  const l = (max+min)/2;
  const s2 = max===min ? 0 : l<0.5 ? (max-min)/(max+min) : (max-min)/(2-max-min);
  let h2 = 0;
  if (max!==min) { h2 = max===rn?(gn-bn)/(max-min)+(gn<bn?6:0):max===gn?(bn-rn)/(max-min)+2:(rn-gn)/(max-min)+4; h2/=6; }
  return {
    hex, rgb: `rgb(${r}, ${g}, ${b})`,
    rgba: `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`,
    hsl: `hsl(${Math.round(h2*360)}, ${Math.round(s2*100)}%, ${Math.round(l*100)}%)`,
  };
}
