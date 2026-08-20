import { describe, it, expect, beforeEach, vi } from "vitest";
import type { AnalysisResult } from "@/lib/types";
import {
  saveToHistory,
  loadHistory,
  deleteFromHistory,
  clearHistory,
} from "@/lib/history";

// ── Mock localStorage ──────────────────────────────────────────
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
  };
})();

// Replace global localStorage
vi.stubGlobal("localStorage", localStorageMock);

// ── Fixture ────────────────────────────────────────────────────
const fixtureResult: AnalysisResult = {
  inputType: "url",
  inputContent: "https://example.com/article",
  title: "Test Article",
  publisher: "Test Publisher",
  verdict: "TRUE",
  confidence: 85,
  summary: "This is a test summary.",
  claims: [
    {
      claim: "Test claim",
      verdict: "TRUE",
      confidence: 90,
      explanation: "Test explanation",
      evidence: [
        {
          source: "Test Source",
          title: "Test Evidence",
          url: "https://example.com/evidence",
          snippet: "Test snippet",
          type: "supporting",
        },
      ],
    },
  ],
};

// ── Tests ──────────────────────────────────────────────────────
describe("History utilities", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe("loadHistory", () => {
    it("returns empty array when no history exists", () => {
      expect(loadHistory()).toEqual([]);
    });

    it("returns empty array for invalid JSON", () => {
      localStorageMock.setItem("truthbeacon_history", "not-json");
      expect(loadHistory()).toEqual([]);
    });

    it("returns empty array for non-array JSON", () => {
      localStorageMock.setItem("truthbeacon_history", JSON.stringify({}));
      expect(loadHistory()).toEqual([]);
    });
  });

  describe("saveToHistory", () => {
    it("saves a result and loads it back", () => {
      saveToHistory(fixtureResult);
      const history = loadHistory();
      expect(history).toHaveLength(1);
      expect(history[0].verdict).toBe("TRUE");
      expect(history[0].title).toBe("Test Article");
      expect(history[0].fullResult).toEqual(fixtureResult);
    });

    it("assigns a UUID to each entry", () => {
      saveToHistory(fixtureResult);
      const history = loadHistory();
      expect(history[0].id).toBeTruthy();
      expect(typeof history[0].id).toBe("string");
    });

    it("adds a createdAt timestamp", () => {
      saveToHistory(fixtureResult);
      const history = loadHistory();
      expect(history[0].createdAt).toBeGreaterThan(0);
    });

    it("prepends new entries (newest first)", () => {
      saveToHistory({ ...fixtureResult, title: "First" });
      saveToHistory({ ...fixtureResult, title: "Second" });
      const history = loadHistory();
      expect(history[0].title).toBe("Second");
      expect(history[1].title).toBe("First");
    });

    it("caps history at 50 entries", () => {
      for (let i = 0; i < 55; i++) {
        saveToHistory({ ...fixtureResult, title: `Article ${i}` });
      }
      const history = loadHistory();
      expect(history).toHaveLength(50);
      // Most recent (Article 54) should be first
      expect(history[0].title).toBe("Article 54");
    });
  });

  describe("deleteFromHistory", () => {
    it("removes an entry by id", () => {
      saveToHistory(fixtureResult);
      saveToHistory({ ...fixtureResult, title: "To Delete" });
      const history = loadHistory();
      const idToDelete = history[0].id;
      deleteFromHistory(idToDelete);
      const remaining = loadHistory();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].title).toBe("Test Article");
    });

    it("does nothing if id does not exist", () => {
      saveToHistory(fixtureResult);
      deleteFromHistory("nonexistent-id");
      expect(loadHistory()).toHaveLength(1);
    });
  });

  describe("clearHistory", () => {
    it("removes all entries", () => {
      saveToHistory(fixtureResult);
      saveToHistory(fixtureResult);
      clearHistory();
      expect(loadHistory()).toEqual([]);
    });

    it("is safe to call when empty", () => {
      clearHistory();
      expect(loadHistory()).toEqual([]);
    });
  });
});
