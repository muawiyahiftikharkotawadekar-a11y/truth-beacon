import { describe, it, expect } from "vitest";
import {
  isConfigurationError,
  getConfigErrorMessage,
  getDemoKeyForInputType,
} from "@/lib/error-classification";
import { DEMO_RESULTS } from "@/lib/demo-data";

// ── isConfigurationError ───────────────────────────────────────
describe("isConfigurationError", () => {
  describe("detects missing API key errors", () => {
    it("detects 'API key not configured'", () => {
      expect(
        isConfigurationError("API key not configured"),
      ).toBe(true);
    });

    it("detects message from the backend with full detail", () => {
      expect(
        isConfigurationError(
          "API key not configured. Add your Gemini API key to the environment variables.",
        ),
      ).toBe(true);
    });

    it("detects 'not configured' substring", () => {
      expect(isConfigurationError("GEMINI_API_KEY not configured")).toBe(true);
    });

    it("detects 'invalid API key'", () => {
      expect(isConfigurationError("invalid API key")).toBe(true);
    });

    it("detects 'Invalid API Key' (case-insensitive)", () => {
      expect(isConfigurationError("Invalid API Key")).toBe(true);
    });
  });

  describe("detects HTTP 401/403 auth errors", () => {
    it("detects 403 in error message", () => {
      expect(isConfigurationError("Gemini API error: 403 - Forbidden")).toBe(true);
    });

    it("detects 401 in error message", () => {
      expect(isConfigurationError("Gemini API error: 401 - Unauthorized")).toBe(true);
    });

    it("detects 403 in HTTP context", () => {
      expect(isConfigurationError("Request failed with status code 403")).toBe(true);
    });
  });

  describe("does NOT flag non-config errors", () => {
    it("does not flag network errors", () => {
      expect(isConfigurationError("Network error: fetch failed")).toBe(false);
    });

    it("does not flag timeout errors", () => {
      expect(isConfigurationError("Timeout: request took too long")).toBe(false);
    });

    it("does not flag extraction failures", () => {
      expect(
        isConfigurationError(
          "Unable to read this article. HTTP 503. Please paste the article text instead.",
        ),
      ).toBe(false);
    });

    it("does not flag Gemini 500 errors", () => {
      expect(isConfigurationError("Gemini API error: 500 - Internal error")).toBe(false);
    });

    it("does not flag AI response parse errors", () => {
      expect(isConfigurationError("Invalid response format from AI")).toBe(false);
    });

    it("does not flag empty string", () => {
      expect(isConfigurationError("")).toBe(false);
    });

    it("does not flag 'analysis failed'", () => {
      expect(isConfigurationError("Analysis failed. Please check your input.")).toBe(false);
    });

    it("does not flag rate limiting (429)", () => {
      expect(isConfigurationError("Gemini API error: 429 - Rate limit exceeded")).toBe(false);
    });
  });

  describe("case sensitivity", () => {
    it("is case-insensitive", () => {
      expect(isConfigurationError("API KEY NOT CONFIGURED")).toBe(true);
      expect(isConfigurationError("Api Key Not Configured")).toBe(true);
    });
  });
});

// ── getConfigErrorMessage ──────────────────────────────────────
describe("getConfigErrorMessage", () => {
  it("returns a helpful message with action items", () => {
    const msg = getConfigErrorMessage();
    expect(msg).toContain("GEMINI_API_KEY");
    expect(msg).toContain(".env");
    expect(msg).toContain("demo");
  });

  it("mentions where to configure the key", () => {
    const msg = getConfigErrorMessage();
    expect(msg).toMatch(/GEMINI_API_KEY/i);
  });
});

// ── getDemoKeyForInputType ─────────────────────────────────────
describe("getDemoKeyForInputType", () => {
  it("maps 'url' to 'true' demo", () => {
    expect(getDemoKeyForInputType("url")).toBe("true");
  });

  it("maps 'headline' to 'false' demo", () => {
    expect(getDemoKeyForInputType("headline")).toBe("false");
  });

  it("maps 'text' to 'misleading' demo", () => {
    expect(getDemoKeyForInputType("text")).toBe("misleading");
  });
});

// ── Integration: demo key → valid demo result ──────────────────
describe("demo key → result mapping", () => {
  it("all demo keys from input types are valid keys", () => {
    const keys = ["url", "headline", "text"].map((t) =>
      getDemoKeyForInputType(t as "url" | "headline" | "text"),
    );
    for (const key of keys) {
      expect(DEMO_RESULTS[key]).toBeDefined();
      expect(DEMO_RESULTS[key].verdict).toBeTruthy();
      expect(DEMO_RESULTS[key].claims.length).toBeGreaterThan(0);
    }
  });
});
