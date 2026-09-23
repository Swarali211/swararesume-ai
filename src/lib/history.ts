import type { AnalysisResult } from "./analyze.functions";

export interface HistoryEntry {
  id: string;
  resumeSnippet: string;
  score: number;
  role: string;
  timestamp: string;
  result: AnalysisResult;
}

const STORAGE_KEY = "resumeiq-analysis-history";

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as HistoryEntry[];
  } catch {
    return [];
  }
}

export function saveHistory(entry: HistoryEntry): HistoryEntry[] {
  const next = [entry, ...loadHistory()].slice(0, 20);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
