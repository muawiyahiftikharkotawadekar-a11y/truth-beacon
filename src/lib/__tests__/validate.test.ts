import { describe, it, expect } from "vitest";
import { validateInput } from "@/lib/validate";

describe("validateInput", () => {
  // ── Empty inputs ──────────────────────────────────────────────
  describe("empty input", () => {
    it("returns error for empty URL", () => {
      expect(validateInput("url", "")).toBe("Please enter a news article URL.");
    });

    it("returns error for whitespace-only URL", () => {
      expect(validateInput("url", "   ")).toBe("Please enter a news article URL.");
    });

    it("returns error for empty text", () => {
      expect(validateInput("text", "")).toBe("Please paste article text to analyze.");
    });

    it("returns error for empty headline", () => {
      expect(validateInput("headline", "")).toBe("Please enter a headline to analyze.");
    });
  });

  // ── URL validation ────────────────────────────────────────────
  describe("URL validation", () => {
    it("accepts valid HTTPS URL", () => {
      expect(validateInput("url", "https://www.reuters.com/article/123")).toBeNull();
    });

    it("accepts valid HTTP URL", () => {
      expect(validateInput("url", "http://example.com/news")).toBeNull();
    });

    it("rejects URL without protocol", () => {
      expect(validateInput("url", "www.reuters.com/article")).toBe(
        "Please enter a valid news article URL.",
      );
    });

    it("rejects FTP protocol", () => {
      expect(validateInput("url", "ftp://files.example.com/doc")).toBe(
        "Please enter a valid HTTP or HTTPS URL.",
      );
    });

    it("rejects plain text as URL", () => {
      expect(validateInput("url", "not a url at all")).toBe(
        "Please enter a valid news article URL.",
      );
    });

    it("accepts URL with path and query", () => {
      expect(
        validateInput("url", "https://example.com/article?id=123&page=2"),
      ).toBeNull();
    });

    it("accepts URL with fragment", () => {
      expect(validateInput("url", "https://example.com/news#section-1")).toBeNull();
    });
  });

  // ── Text validation ───────────────────────────────────────────
  describe("text validation", () => {
    it("accepts text with 20+ characters", () => {
      const text = "A".repeat(20);
      expect(validateInput("text", text)).toBeNull();
    });

    it("rejects text shorter than 20 characters", () => {
      expect(validateInput("text", "Short text")).toBe(
        "Article text is too short. Please paste more content.",
      );
    });

    it("rejects text exceeding 15000 characters", () => {
      const text = "A".repeat(15001);
      expect(validateInput("text", text)).toBe(
        "Article text is too long. Please limit to 15,000 characters.",
      );
    });

    it("accepts text at exactly 15000 characters", () => {
      const text = "A".repeat(15000);
      expect(validateInput("text", text)).toBeNull();
    });

    it("accepts text at boundary (20 chars)", () => {
      const text = "This is twenty chars.";
      expect(validateInput("text", text)).toBeNull();
    });

    it("trims whitespace before checking length", () => {
      expect(validateInput("text", "   x   ")).toBe(
        "Article text is too short. Please paste more content.",
      );
    });
  });

  // ── Headline validation ───────────────────────────────────────
  describe("headline validation", () => {
    it("accepts any non-empty headline", () => {
      expect(validateInput("headline", "Breaking news today")).toBeNull();
    });

    it("accepts single character headline", () => {
      expect(validateInput("headline", "X")).toBeNull();
    });
  });

  // ── Edge cases ────────────────────────────────────────────────
  describe("edge cases", () => {
    it("handles URL with extra whitespace", () => {
      expect(validateInput("url", "  https://example.com  ")).toBeNull();
    });

    it("handles newlines in text", () => {
      const text = "This is a\n\n" + "news article with multiple paragraphs. " + "A".repeat(20);
      expect(validateInput("text", text)).toBeNull();
    });
  });
});
