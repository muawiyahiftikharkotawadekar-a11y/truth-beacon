import type { AnalysisHistoryEntry, AnalysisResult } from "./types";

const STORAGE_KEY = "truthbeacon_history";

export function saveToHistory(result: AnalysisResult): void {
  try {
    const existing = loadHistory();
    const entry: AnalysisHistoryEntry = {
      id: crypto.randomUUID(),
      inputType: result.inputType,
      inputContent: result.inputContent,
      title: result.title,
      verdict: result.verdict,
      confidence: result.confidence,
      summary: result.summary,
      fullResult: result,
      createdAt: Date.now(),
    };
    existing.unshift(entry);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(existing.slice(0, 50)),
    );
  } catch {
    // Silently fail — localStorage may be unavailable
  }
}

export function loadHistory(): AnalysisHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as AnalysisHistoryEntry[];
  } catch {
    return [];
  }
}

export function deleteFromHistory(id: string): void {
  const history = loadHistory().filter((entry) => entry.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
