/**
 * textConverter.ts
 * Pure functions for all 15 text tools — no external dependencies needed.
 */

// ─── Case Converter ───────────────────────────────────────────────────────────
export const toUpperCase   = (s: string) => s.toUpperCase();
export const toLowerCase   = (s: string) => s.toLowerCase();
export const toTitleCase   = (s: string) =>
  s.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
export const toSentenceCase = (s: string) =>
  s.replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
export const toCamelCase   = (s: string) =>
  s.trim().replace(/[-_\s]+(.)/g, (_, c) => c.toUpperCase()).replace(/^[A-Z]/, c => c.toLowerCase());
export const toPascalCase  = (s: string) =>
  s.trim().replace(/[-_\s]+(.)/g, (_, c) => c.toUpperCase()).replace(/^(.)/, c => c.toUpperCase());
export const toSnakeCase   = (s: string) =>
  s.trim().replace(/\s+/g, "_").replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
export const toKebabCase   = (s: string) =>
  s.trim().replace(/\s+/g, "-").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
export const toAlternatingCase = (s: string) =>
  [...s].map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join("");
export const toInverseCase = (s: string) =>
  [...s].map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join("");

// ─── Word / Char / Sentence Counter ──────────────────────────────────────────
export interface TextStats {
  words: number;
  chars: number;
  charsNoSpaces: number;
  lines: number;
  sentences: number;
  paragraphs: number;
  readingTimeMin: number;
}
export function analyzeText(text: string): TextStats {
  const trimmed = text.trim();
  const words       = trimmed ? trimmed.split(/\s+/).length : 0;
  const chars       = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const lines       = trimmed ? text.split("\n").length : 0;
  const sentences   = trimmed ? (text.match(/[.!?]+/g) ?? []).length : 0;
  const paragraphs  = trimmed ? text.split(/\n\s*\n/).length : 0;
  const readingTimeMin = Math.ceil(words / 200);
  return { words, chars, charsNoSpaces, lines, sentences, paragraphs, readingTimeMin };
}

// ─── Lorem Ipsum ─────────────────────────────────────────────────────────────
const LOREM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
const LOREM_SENTENCES = LOREM.split(". ").map(s => s.trim().replace(/\.$/, ""));
export function generateLorem(paragraphs = 3, sentencesPerParagraph = 5): string {
  const result: string[] = [];
  for (let p = 0; p < paragraphs; p++) {
    const sentences: string[] = [];
    for (let s = 0; s < sentencesPerParagraph; s++) {
      sentences.push(LOREM_SENTENCES[(p * sentencesPerParagraph + s) % LOREM_SENTENCES.length] + ".");
    }
    result.push(sentences.join(" "));
  }
  return result.join("\n\n");
}

// ─── Find & Replace ───────────────────────────────────────────────────────────
export function findAndReplace(
  text: string,
  find: string,
  replace: string,
  useRegex = false,
  caseSensitive = true
): { result: string; count: number } {
  if (!find) return { result: text, count: 0 };
  let count = 0;
  let result: string;
  if (useRegex) {
    const flags = caseSensitive ? "g" : "gi";
    const re    = new RegExp(find, flags);
    result      = text.replace(re, () => { count++; return replace; });
  } else {
    const flags = caseSensitive ? "g" : "gi";
    const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re    = new RegExp(escaped, flags);
    result      = text.replace(re, () => { count++; return replace; });
  }
  return { result, count };
}

// ─── Line Sorter ─────────────────────────────────────────────────────────────
export const sortLinesAZ        = (s: string) => s.split("\n").sort((a,b) => a.localeCompare(b)).join("\n");
export const sortLinesZA        = (s: string) => s.split("\n").sort((a,b) => b.localeCompare(a)).join("\n");
export const reverseLinesOrder  = (s: string) => s.split("\n").reverse().join("\n");
export const sortLinesByLength  = (s: string) => s.split("\n").sort((a,b) => a.length - b.length).join("\n");
export const shuffleLines       = (s: string) => {
  const lines = s.split("\n");
  for (let i = lines.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lines[i], lines[j]] = [lines[j], lines[i]];
  }
  return lines.join("\n");
};

// ─── Deduplicate Lines ────────────────────────────────────────────────────────
export function deduplicateLines(text: string, caseSensitive = true): { result: string; removed: number } {
  const lines = text.split("\n");
  const seen  = new Set<string>();
  const out: string[] = [];
  let removed = 0;
  for (const line of lines) {
    const key = caseSensitive ? line : line.toLowerCase();
    if (seen.has(key)) { removed++; } else { seen.add(key); out.push(line); }
  }
  return { result: out.join("\n"), removed };
}

// ─── Text Repeater ────────────────────────────────────────────────────────────
export function repeatText(text: string, times: number, separator = "\n"): string {
  return Array(Math.max(1, times)).fill(text).join(separator);
}

// ─── Diff Checker ─────────────────────────────────────────────────────────────
export interface DiffLine {
  type: "same" | "added" | "removed";
  text: string;
}
export function diffTexts(original: string, modified: string): DiffLine[] {
  const aLines = original.split("\n");
  const bLines = modified.split("\n");
  const result: DiffLine[] = [];
  const maxLen = Math.max(aLines.length, bLines.length);
  for (let i = 0; i < maxLen; i++) {
    const a = aLines[i];
    const b = bLines[i];
    if (a === undefined) {
      result.push({ type: "added",   text: b });
    } else if (b === undefined) {
      result.push({ type: "removed", text: a });
    } else if (a === b) {
      result.push({ type: "same",    text: a });
    } else {
      result.push({ type: "removed", text: a });
      result.push({ type: "added",   text: b });
    }
  }
  return result;
}

// ─── Readability Score (Flesch-Kincaid) ──────────────────────────────────────
function syllableCount(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!word) return 0;
  const vowels = word.match(/[aeiouy]+/g);
  let count = vowels ? vowels.length : 1;
  if (word.endsWith("e") && count > 1) count--;
  return Math.max(1, count);
}
export interface ReadabilityResult {
  fleschScore: number;
  grade: string;
  difficulty: string;
  avgSentenceLength: number;
  avgSyllablesPerWord: number;
}
export function readabilityScore(text: string): ReadabilityResult {
  const words     = text.trim().split(/\s+/).filter(Boolean);
  const sentences = (text.match(/[.!?]+/g) ?? []).length || 1;
  const syllables = words.reduce((s, w) => s + syllableCount(w), 0);
  const wc = words.length || 1;
  const asl  = wc / sentences;
  const asw  = syllables / wc;
  const score = 206.835 - 1.015 * asl - 84.6 * asw;
  const clamped = Math.min(100, Math.max(0, score));
  let grade = "", difficulty = "";
  if (clamped >= 90)      { grade = "5th grade";    difficulty = "Very Easy"; }
  else if (clamped >= 80) { grade = "6th grade";    difficulty = "Easy"; }
  else if (clamped >= 70) { grade = "7th grade";    difficulty = "Fairly Easy"; }
  else if (clamped >= 60) { grade = "8–9th grade";  difficulty = "Standard"; }
  else if (clamped >= 50) { grade = "10–12th grade";difficulty = "Fairly Difficult"; }
  else if (clamped >= 30) { grade = "College";       difficulty = "Difficult"; }
  else                    { grade = "College+";      difficulty = "Very Confusing"; }
  return { fleschScore: Math.round(clamped * 10) / 10, grade, difficulty, avgSentenceLength: Math.round(asl * 10) / 10, avgSyllablesPerWord: Math.round(asw * 100) / 100 };
}

// ─── Random Text ──────────────────────────────────────────────────────────────
const WORDS = ["the","quick","brown","fox","jumps","over","lazy","dog","and","runs","away","fast","slow","big","small","happy","sad","blue","red","green"];
export function randomText(wordCount = 50): string {
  const out: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    out.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }
  out[0] = out[0].charAt(0).toUpperCase() + out[0].slice(1);
  return out.join(" ") + ".";
}

// ─── Simple Plagiarism / Similarity ──────────────────────────────────────────
export function similarityScore(a: string, b: string): number {
  const setA = new Set(a.toLowerCase().split(/\s+/));
  const setB = new Set(b.toLowerCase().split(/\s+/));
  const intersection = [...setA].filter(w => setB.has(w)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : Math.round((intersection / union) * 100);
}
