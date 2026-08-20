"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

interface EvidenceResult {
  source: string;
  title: string;
  url: string;
  date?: string;
  snippet: string;
  type: "supporting" | "contradicting" | "context" | "unknown";
}

interface ClaimAnalysis {
  claim: string;
  verdict: string;
  confidence: number;
  explanation: string;
  evidence: EvidenceResult[];
}

interface AnalysisResponse {
  verdict: string;
  confidence: number;
  summary: string;
  claims: ClaimAnalysis[];
  limitations?: string;
}

interface AnalysisResult {
  inputType: string;
  inputContent: string;
  title?: string;
  publisher?: string;
  author?: string;
  pubDate?: string;
  verdict: string;
  confidence: number;
  summary: string;
  claims: ClaimAnalysis[];
  limitations?: string;
}

async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error(
      "API key not configured. Add your Gemini API key to the environment variables. " +
      "Get a free key at https://aistudio.google.com/apikey",
    );
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 4096,
          responseMimeType: "application/json",
        },
      }),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${res.status} - ${err}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

async function searchGoogle(query: string): Promise<Array<{ title: string; link: string; snippet: string; displayLink: string }>> {
  if (!GOOGLE_SEARCH_API_KEY || !GOOGLE_SEARCH_ENGINE_ID) {
    // Search keys not configured — analysis will still work without web search
    return [];
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&num=5`,
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.items ?? [];
  } catch {
    return [];
  }
}

async function extractArticleFromUrl(url: string): Promise<{
  title: string;
  text: string;
  publisher: string;
  author: string;
  date: string;
}> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; NewsVerifier/1.0; +https://example.com)",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const ogTitleMatch = html.match(
      /<meta\s+(?:[^>]*?)property=["']og:title["'][^>]*content=["']([^"']+)["']/i,
    );
    const title = ogTitleMatch?.[1] ?? titleMatch?.[1] ?? "Unknown Title";

    const authorMatch = html.match(
      /<meta\s+(?:[^>]*?)name=["']author["'][^>]*content=["']([^"']+)["']/i,
    );
    const author = authorMatch?.[1] ?? "";

    const dateMatch = html.match(
      /<meta\s+(?:[^>]*?)(?:property=["']article:published_time["']|name=["']date)["'][^>]*content=["']([^"']+)["']/i,
    );
    const date = dateMatch?.[1] ?? "";

    let publisher = "";
    try {
      const urlObj = new URL(url);
      publisher = urlObj.hostname.replace("www.", "");
    } catch {
      publisher = "Unknown";
    }

    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const bodyHtml = bodyMatch?.[1] ?? html;

    let cleaned = bodyHtml
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[\s\S]*?<\/nav>/gi, "")
      .replace(/<footer[\s\S]*?<\/footer>/gi, "")
      .replace(/<header[\s\S]*?<\/header>/gi, "")
      .replace(/<aside[\s\S]*?<\/aside>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "");

    const articleMatch =
      cleaned.match(/<article[\s\S]*?>([\s\S]*?)<\/article>/i) ??
      cleaned.match(/<main[\s\S]*?>([\s\S]*?)<\/main>/i);

    const contentHtml = articleMatch?.[1] ?? cleaned;

    const text = contentHtml
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 8000);

    return { title, text, publisher, author, date };
  } catch (error) {      throw new Error(
        `Unable to read this article. ${error instanceof Error ? error.message : "The website may be blocking access."} ` +
        "Please paste the article text instead.",
      );
  }
}

async function extractArticleInfo(inputType: string, content: string) {
  if (inputType === "url") {
    return await extractArticleFromUrl(content);
  }

  if (inputType === "headline") {
    return {
      title: content,
      text: content,
      publisher: "Unknown",
      author: "",
      date: "",
    };
  }

  const lines = content.split("\n").filter((l) => l.trim());
  const firstLine = lines[0] ?? "";
  const isTitle =
    firstLine.length < 150 && (lines.length > 1 || firstLine.endsWith("!"));

  return {
    title: isTitle ? firstLine : "Pasted Article",
    text: content,
    publisher: "Pasted Text",
    author: "",
    date: "",
  };
}

async function searchForEvidence(
  claims: Array<{ claim: string }>,
): Promise<Record<string, EvidenceResult[]>> {
  const evidenceMap: Record<string, EvidenceResult[]> = {};

  for (const { claim } of claims) {
    const searchQuery = `"${claim}" fact check`;
    const results = await searchGoogle(searchQuery);

    evidenceMap[claim] = results.map((r) => ({
      source: r.displayLink ?? (() => { try { return new URL(r.link).hostname; } catch { return "unknown"; } })(),
      title: r.title ?? "",
      url: r.link ?? "",
      snippet: r.snippet ?? "",
      type: "unknown" as const,
    }));
  }

  return evidenceMap;
}

async function verifyWithGemini(
  articleInfo: { title: string; text: string; publisher: string; author: string; date: string },
  claims: Array<{ claim: string }>,
  evidenceMap: Record<string, EvidenceResult[]>,
): Promise<AnalysisResponse> {
  const evidenceText = claims
    .map(({ claim }) => {
      const ev = evidenceMap[claim] ?? [];
      if (ev.length === 0) return `Claim: "${claim}"\nNo evidence found.`;
      return `Claim: "${claim}"\nEvidence:\n${ev.map((e, i) => `  ${i + 1}. [${e.type}] ${e.source}: ${e.title} - ${e.snippet}`).join("\n")}`;
    })
    .join("\n\n");

  const prompt = `You are a fact-checking AI assistant. Analyze the following news article and its claims against the available evidence.

ARTICLE INFORMATION:
Title: ${articleInfo.title}
Publisher: ${articleInfo.publisher}
Author: ${articleInfo.author}
Publication Date: ${articleInfo.date}

ARTICLE TEXT:
${articleInfo.text.slice(0, 4000)}

EXTRACTED CLAIMS AND EVIDENCE:
${evidenceText}

INSTRUCTIONS:
1. Analyze each claim against the available evidence.
2. For each claim, assign a verdict: TRUE, FALSE, PARTIALLY_TRUE, UNVERIFIED, OPINION, or SATIRE.
3. Assign a confidence score (0-100) for each claim based on evidence strength.
4. Explain your reasoning for each claim based ONLY on the evidence provided.
5. Determine an overall verdict: TRUE, FALSE, MISLEADING, or UNVERIFIED.
6. Calculate an overall confidence score.
7. Write a brief summary.
8. Note any limitations.

IMPORTANT RULES:
- NEVER invent sources, URLs, evidence, or statistics.
- If evidence is insufficient, use UNVERIFIED — do NOT assume something is false just because evidence is missing.
- Breaking news may lack independent verification; this does not make it false.
- Distinguish between factual claims and opinions.
- Consider publication dates and source reliability.
- Be honest about uncertainty.

Respond with valid JSON matching this exact structure:
{
  "verdict": "TRUE|FALSE|MISLEADING|UNVERIFIED",
  "confidence": number,
  "summary": "Brief explanation of the overall analysis",
  "claims": [
    {
      "claim": "The claim text",
      "verdict": "TRUE|FALSE|PARTIALLY_TRUE|UNVERIFIED|OPINION|SATIRE",
      "confidence": number,
      "explanation": "Why this verdict was reached based on evidence",
      "evidence": [
        {
          "source": "Source name",
          "title": "Article title",
          "url": "Source URL",
          "type": "supporting|contradicting|context|unknown"
        }
      ]
    }
  ],
  "limitations": "Any limitations or caveats about this analysis"
}`;

  let response: string;
  try {
    response = await callGemini(prompt);
  } catch (err) {
    throw new Error(
      `AI analysis failed: ${err instanceof Error ? err.message : "Unknown error"}. ` +
      "Check that your Gemini API key is valid and has quota remaining."
    );
  }

  let parsed: AnalysisResponse;
  try {
    parsed = JSON.parse(response);
  } catch {
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[1]);
    } else {
      throw new Error("Invalid response format from AI");
    }
  }

  if (!parsed.verdict || !parsed.summary || !Array.isArray(parsed.claims)) {
    throw new Error("AI response is missing required fields");
  }

  const validVerdicts = ["TRUE", "FALSE", "MISLEADING", "UNVERIFIED"];
  if (!validVerdicts.includes(parsed.verdict)) {
    parsed.verdict = "UNVERIFIED";
  }

  if (typeof parsed.confidence !== "number") {
    parsed.confidence = 50;
  }

  return parsed;
}

// The main analysis function
export async function runAnalysis(
  inputType: string,
  content: string,
): Promise<AnalysisResult> {
  const articleInfo = await extractArticleInfo(inputType, content);

  const claimsPrompt = `Extract the top 5 most important factual claims from this article that can be fact-checked. Focus on concrete, verifiable assertions. Ignore opinions, predictions, and general commentary.

Article Title: ${articleInfo.title}
Article Text: ${articleInfo.text.slice(0, 4000)}

Respond with valid JSON: { "claims": ["claim 1", "claim 2", ...] }
Only include the JSON, no other text.`;

  let claimsResult: { claims: string[] };
  try {
    const claimsResponse = await callGemini(claimsPrompt);
    const jsonMatch = claimsResponse.match(/```(?:json)?\s*([\s\S]*?)```/);
    claimsResult = JSON.parse(jsonMatch ? jsonMatch[1] : claimsResponse);
  } catch {
    claimsResult = { claims: [articleInfo.title] };
  }

  const claims = (claimsResult.claims ?? [articleInfo.title])
    .slice(0, 5)
    .map((c: string) => ({ claim: c }));

  if (claims.length === 0) {
    claims.push({ claim: articleInfo.title });
  }

  const evidenceMap = await searchForEvidence(claims);

  const verified = await verifyWithGemini(articleInfo, claims, evidenceMap);

  const mergedClaims = verified.claims.map((vc, i) => {
    const searchEvidence = evidenceMap[claims[i]?.claim] ?? [];
    return {
      ...vc,
      evidence:
        vc.evidence && vc.evidence.length > 0
          ? vc.evidence
          : searchEvidence,
    };
  });

  return {
    inputType,
    inputContent: content,
    title: articleInfo.title,
    publisher: articleInfo.publisher,
    author: articleInfo.author || undefined,
    pubDate: articleInfo.date || undefined,
    verdict: verified.verdict,
    confidence: verified.confidence,
    summary: verified.summary,
    claims: mergedClaims,
    limitations: verified.limitations,
  };
}

// Convex action wrapper
export const analyzeInput = action({
  args: {
    inputType: v.string(),
    content: v.string(),
  },
  handler: async (_ctx, args): Promise<AnalysisResult> => {
    return runAnalysis(args.inputType, args.content);
  },
});
