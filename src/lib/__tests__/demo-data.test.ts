import { describe, it, expect } from "vitest";
import {
  DEMO_TRUE,
  DEMO_FALSE,
  DEMO_MISLEADING,
  DEMO_UNVERIFIED,
  DEMO_RESULTS,
} from "@/lib/demo-data";
import type { AnalysisResult, VerdictType } from "@/lib/types";

// ── Helpers ────────────────────────────────────────────────────
function assertValidResult(result: AnalysisResult) {
  expect(result).toBeDefined();
  expect(typeof result.inputType).toBe("string");
  expect(["url", "text", "headline"]).toContain(result.inputType);
  expect(typeof result.inputContent).toBe("string");
  expect(result.inputContent.length).toBeGreaterThan(0);
  expect(typeof result.verdict).toBe("string");
  expect(
    ["TRUE", "FALSE", "MISLEADING", "UNVERIFIED"],
  ).toContain(result.verdict);
  expect(typeof result.confidence).toBe("number");
  expect(result.confidence).toBeGreaterThanOrEqual(0);
  expect(result.confidence).toBeLessThanOrEqual(100);
  expect(typeof result.summary).toBe("string");
  expect(result.summary.length).toBeGreaterThan(0);
  expect(Array.isArray(result.claims)).toBe(true);
  expect(result.claims.length).toBeGreaterThan(0);
  expect(result.claims.length).toBeLessThanOrEqual(5);
}

function assertValidClaim(claim: unknown) {
  const c = claim as AnalysisResult["claims"][0];
  expect(typeof c.claim).toBe("string");
  expect(c.claim.length).toBeGreaterThan(0);
  expect(
    ["TRUE", "FALSE", "PARTIALLY_TRUE", "UNVERIFIED", "OPINION", "SATIRE"],
  ).toContain(c.verdict);
  expect(typeof c.confidence).toBe("number");
  expect(c.confidence).toBeGreaterThanOrEqual(0);
  expect(c.confidence).toBeLessThanOrEqual(100);
  expect(typeof c.explanation).toBe("string");
  expect(c.explanation.length).toBeGreaterThan(0);
  expect(Array.isArray(c.evidence)).toBe(true);
}

function assertValidEvidence(ev: unknown) {
  const e = ev as AnalysisResult["claims"][0]["evidence"][0];
  expect(typeof e.source).toBe("string");
  expect(typeof e.title).toBe("string");
  expect(typeof e.url).toBe("string");
  expect(e.url.startsWith("http")).toBe(true);
  expect(typeof e.snippet).toBe("string");
  expect(["supporting", "contradicting", "context", "unknown"]).toContain(e.type);
}

// ── Demo data structure ────────────────────────────────────────
describe("Demo data structure", () => {
  const demos: [string, AnalysisResult][] = [
    ["DEMO_TRUE", DEMO_TRUE],
    ["DEMO_FALSE", DEMO_FALSE],
    ["DEMO_MISLEADING", DEMO_MISLEADING],
    ["DEMO_UNVERIFIED", DEMO_UNVERIFIED],
  ];

  it.each(demos)("%s has valid top-level structure", (_name, result) => {
    assertValidResult(result);
  });

  it.each(demos)("%s claims have valid structure", (_name, result) => {
    for (const claim of result.claims) {
      assertValidClaim(claim);
      for (const ev of claim.evidence) {
        assertValidEvidence(ev);
      }
    }
  });
});

// ── Verdict-specific checks ────────────────────────────────────
describe("Demo verdict correctness", () => {
  it("DEMO_TRUE has verdict TRUE with high confidence", () => {
    expect(DEMO_TRUE.verdict).toBe("TRUE");
    expect(DEMO_TRUE.confidence).toBeGreaterThanOrEqual(80);
  });

  it("DEMO_FALSE has verdict FALSE", () => {
    expect(DEMO_FALSE.verdict).toBe("FALSE");
    expect(DEMO_FALSE.confidence).toBeGreaterThanOrEqual(70);
  });

  it("DEMO_MISLEADING has verdict MISLEADING", () => {
    expect(DEMO_MISLEADING.verdict).toBe("MISLEADING");
  });

  it("DEMO_UNVERIFIED has verdict UNVERIFIED with low confidence", () => {
    expect(DEMO_UNVERIFIED.verdict).toBe("UNVERIFIED");
    expect(DEMO_UNVERIFIED.confidence).toBeLessThanOrEqual(50);
  });
});

// ── DEMO_RESULTS map ───────────────────────────────────────────
describe("DEMO_RESULTS map", () => {
  it("contains all four verdict types", () => {
    expect(Object.keys(DEMO_RESULTS)).toEqual(
      expect.arrayContaining(["true", "false", "misleading", "unverified"]),
    );
    expect(Object.keys(DEMO_RESULTS)).toHaveLength(4);
  });

  it("maps 'true' to DEMO_TRUE", () => {
    expect(DEMO_RESULTS.true).toBe(DEMO_TRUE);
  });

  it("maps 'false' to DEMO_FALSE", () => {
    expect(DEMO_RESULTS.false).toBe(DEMO_FALSE);
  });

  it("maps 'misleading' to DEMO_MISLEADING", () => {
    expect(DEMO_RESULTS.misleading).toBe(DEMO_MISLEADING);
  });

  it("maps 'unverified' to DEMO_UNVERIFIED", () => {
    expect(DEMO_RESULTS.unverified).toBe(DEMO_UNVERIFIED);
  });
});

// ── Evidence type consistency ──────────────────────────────────
describe("Evidence type classification", () => {
  it("DEMO_FALSE contradicting evidence uses contradicting type", () => {
    const allEvidence = DEMO_FALSE.claims.flatMap((c) => c.evidence);
    const contradicting = allEvidence.filter((e) => e.type === "contradicting");
    expect(contradicting.length).toBeGreaterThan(0);
  });

  it("DEMO_UNVERIFIED uses context evidence (not false)", () => {
    const allEvidence = DEMO_UNVERIFIED.claims.flatMap((c) => c.evidence);
    expect(allEvidence.length).toBeGreaterThan(0);
    // Should NOT have contradicting evidence since it's unverified
    const contradicting = allEvidence.filter((e) => e.type === "contradicting");
    expect(contradicting).toHaveLength(0);
  });
});
