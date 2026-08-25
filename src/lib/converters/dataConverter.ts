/**
 * dataConverter.ts — Pure client-side data format converters.
 */

// ─── JSON helpers ─────────────────────────────────────────────────────────────
export const formatJson  = (s: string) => JSON.stringify(JSON.parse(s), null, 2);
export const minifyJson  = (s: string) => JSON.stringify(JSON.parse(s));
export const validateJson = (s: string): { valid: boolean; error?: string } => {
  try { JSON.parse(s); return { valid: true }; }
  catch (e) { return { valid: false, error: (e as Error).message }; }
};

// ─── CSV helpers ──────────────────────────────────────────────────────────────
function parseCsv(csv: string): { headers: string[]; rows: string[][] } {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
  const rows = lines.slice(1).map(l =>
    l.split(",").map(c => c.trim().replace(/^"|"$/g, ""))
  );
  return { headers, rows };
}

export function csvToJson(csv: string): string {
  const { headers, rows } = parseCsv(csv);
  const result = rows
    .filter(r => r.some(c => c))
    .map(r => {
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => { obj[h] = r[i] ?? ""; });
      return obj;
    });
  return JSON.stringify(result, null, 2);
}

export function jsonToCsv(json: string): string {
  const data = JSON.parse(json);
  const arr = Array.isArray(data) ? data : [data];
  if (!arr.length) return "";
  const headers = Object.keys(arr[0]);
  const rows = arr.map((row: Record<string, unknown>) =>
    headers.map(h => {
      const v = String(row[h] ?? "");
      return v.includes(",") || v.includes('"') ? `"${v.replace(/"/g,'""')}"` : v;
    }).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

// ─── JSON ↔ XML ───────────────────────────────────────────────────────────────
function objToXml(obj: unknown, tag = "root", indent = ""): string {
  if (Array.isArray(obj)) {
    return obj.map(item => objToXml(item, "item", indent)).join("\n");
  }
  if (obj !== null && typeof obj === "object") {
    const inner = Object.entries(obj as Record<string, unknown>)
      .map(([k, v]) => objToXml(v, k, indent + "  "))
      .join("\n");
    return `${indent}<${tag}>\n${inner}\n${indent}</${tag}>`;
  }
  return `${indent}<${tag}>${obj}</${tag}>`;
}
export function jsonToXml(json: string): string {
  const data = JSON.parse(json);
  return `<?xml version="1.0" encoding="UTF-8"?>\n` + objToXml(data, "root", "");
}

function xmlToObj(xml: string): unknown {
  // Simple regex-based XML parser for flat structures
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  function nodeToObj(node: Element): unknown {
    if (!node.children.length) return node.textContent ?? "";
    const obj: Record<string, unknown> = {};
    for (const child of Array.from(node.children)) {
      const key = child.tagName;
      const val = nodeToObj(child);
      if (obj[key] !== undefined) {
        if (!Array.isArray(obj[key])) obj[key] = [obj[key]];
        (obj[key] as unknown[]).push(val);
      } else {
        obj[key] = val;
      }
    }
    return obj;
  }
  return nodeToObj(doc.documentElement);
}
export function xmlToJson(xml: string): string {
  return JSON.stringify(xmlToObj(xml), null, 2);
}

// ─── JSON ↔ YAML (minimal implementation) ────────────────────────────────────
function jsonToYamlObj(obj: unknown, indent = ""): string {
  if (obj === null) return "null";
  if (typeof obj === "string") return /[:#\[\]{},&*|<>'"!%@`]/.test(obj) ? `"${obj.replace(/"/g,'\\"')}"` : obj;
  if (typeof obj === "number" || typeof obj === "boolean") return String(obj);
  if (Array.isArray(obj)) {
    if (!obj.length) return "[]";
    return obj.map(item => `${indent}- ${jsonToYamlObj(item, indent + "  ")}`).join("\n");
  }
  if (typeof obj === "object") {
    return Object.entries(obj as Record<string, unknown>).map(([k, v]) => {
      const vStr = jsonToYamlObj(v, indent + "  ");
      const isComplex = typeof v === "object" && v !== null;
      return `${indent}${k}:${isComplex ? "\n" + vStr : " " + vStr}`;
    }).join("\n");
  }
  return String(obj);
}
export function jsonToYaml(json: string): string {
  return jsonToYamlObj(JSON.parse(json));
}

function yamlToObj(yaml: string): unknown {
  // Minimal YAML parser — handles key: value, lists, nested
  const lines = yaml.split("\n");
  const root: Record<string, unknown> = {};
  const stack: { obj: Record<string, unknown>; indent: number }[] = [{ obj: root, indent: -1 }];
  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const indent = line.length - line.trimStart().length;
    const trimmed = line.trim();
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop();
    const current = stack[stack.length - 1].obj;
    if (trimmed.startsWith("- ")) {
      const key = Object.keys(current).pop() ?? "";
      if (!Array.isArray(current[key])) current[key] = [];
      (current[key] as unknown[]).push(trimmed.slice(2));
    } else if (trimmed.includes(": ")) {
      const colonIdx = trimmed.indexOf(": ");
      const key = trimmed.slice(0, colonIdx);
      const val = trimmed.slice(colonIdx + 2);
      if (val === "") { const nested: Record<string, unknown> = {}; current[key] = nested; stack.push({ obj: nested, indent }); }
      else { current[key] = isNaN(Number(val)) ? val.replace(/^["']|["']$/g, "") : Number(val); }
    }
  }
  return root;
}
export function yamlToJson(yaml: string): string {
  return JSON.stringify(yamlToObj(yaml), null, 2);
}

// ─── JSON → Table HTML ────────────────────────────────────────────────────────
export function jsonToTable(json: string): string {
  const data = JSON.parse(json);
  const arr = Array.isArray(data) ? data : [data];
  if (!arr.length) return "<p>Empty array</p>";
  const headers = Object.keys(arr[0]);
  const thead = `<tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr>`;
  const tbody = arr.map((row: Record<string, unknown>) =>
    `<tr>${headers.map(h => `<td>${row[h] ?? ""}</td>`).join("")}</tr>`
  ).join("\n");
  return `<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%">\n<thead>${thead}</thead>\n<tbody>\n${tbody}\n</tbody>\n</table>`;
}

// ─── JSON → TypeScript interface ─────────────────────────────────────────────
function getTsType(val: unknown): string {
  if (val === null) return "null";
  if (Array.isArray(val)) {
    const t = val.length > 0 ? getTsType(val[0]) : "unknown";
    return `${t}[]`;
  }
  if (typeof val === "object") return "{\n" + Object.entries(val as Record<string, unknown>).map(([k,v]) => `  ${k}: ${getTsType(v)};`).join("\n") + "\n}";
  return typeof val;
}
export function jsonToTypeScript(json: string): string {
  const data = JSON.parse(json);
  const obj = Array.isArray(data) && data.length > 0 ? data[0] : data;
  return "interface Root " + getTsType(obj);
}

// ─── CSV ↔ XML ────────────────────────────────────────────────────────────────
export function csvToXml(csv: string): string {
  const { headers, rows } = parseCsv(csv);
  const items = rows.filter(r => r.some(c => c)).map(r => {
    const fields = headers.map((h, i) => `  <${h}>${r[i] ?? ""}</${h}>`).join("\n");
    return `  <row>\n${fields}\n  </row>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n${items.join("\n")}\n</root>`;
}

// ─── TSV ↔ CSV ─────────────────────────────────────────────────────────────────
export function tsvToCsv(tsv: string): string {
  return tsv.split("\n").map(l => l.split("\t").map(c => c.includes(",") ? `"${c}"` : c).join(",")).join("\n");
}
export function csvToTsv(csv: string): string {
  return csv.split("\n").map(l => l.split(",").map(c => c.replace(/^"|"$/g,"")).join("\t")).join("\n");
}

// ─── SQL → JSON ───────────────────────────────────────────────────────────────
export function sqlToJson(sql: string): string {
  // Parses INSERT INTO ... VALUES ... statements
  const matches = [...sql.matchAll(/INSERT\s+INTO\s+`?(\w+)`?\s*\(([^)]+)\)\s*VALUES\s*([^;]+?)(?:;|$)/gi)];
  if (!matches.length) throw new Error("No INSERT INTO statements found.");
  const result: Record<string, unknown[]> = {};
  for (const m of matches) {
    const table = m[1];
    const cols  = m[2].split(",").map(c => c.trim().replace(/`/g,""));
    const valStr = m[3];
    const rows: unknown[] = [];
    for (const rowM of valStr.matchAll(/\(([^)]+)\)/g)) {
      const vals = rowM[1].split(",").map(v => v.trim().replace(/^'|'$/g,"").replace(/^"|"$/g,""));
      const obj: Record<string, string> = {};
      cols.forEach((c, i) => { obj[c] = vals[i] ?? ""; });
      rows.push(obj);
    }
    result[table] = (result[table] ?? []).concat(rows);
  }
  return JSON.stringify(result, null, 2);
}

// ─── JSON Diff ────────────────────────────────────────────────────────────────
export interface JsonDiffLine {
  type: "same" | "added" | "removed" | "changed";
  key: string;
  a?: string;
  b?: string;
}
export function jsonDiff(jsonA: string, jsonB: string): JsonDiffLine[] {
  const a = JSON.parse(jsonA);
  const b = JSON.parse(jsonB);
  const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);
  const result: JsonDiffLine[] = [];
  for (const k of allKeys) {
    const av = JSON.stringify(a[k]);
    const bv = JSON.stringify(b[k]);
    if (!(k in a))        result.push({ type:"added",   key: k, b: bv });
    else if (!(k in b))   result.push({ type:"removed", key: k, a: av });
    else if (av !== bv)   result.push({ type:"changed", key: k, a: av, b: bv });
    else                  result.push({ type:"same",    key: k, a: av });
  }
  return result;
}
