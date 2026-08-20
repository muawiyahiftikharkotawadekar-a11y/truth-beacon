export type InputType = "url" | "text" | "headline";
export type VerdictType = "TRUE" | "FALSE" | "MISLEADING" | "UNVERIFIED";
export type ClaimVerdict = "TRUE" | "FALSE" | "PARTIALLY_TRUE" | "UNVERIFIED" | "OPINION" | "SATIRE";
export type EvidenceType = "supporting" | "contradicting" | "context" | "unknown";

export interface EvidenceSource {
  source: string;
  title: string;
  url: string;
  date?: string;
  snippet: string;
  type: EvidenceType;
}

export interface ClaimAnalysis {
  claim: string;
  verdict: ClaimVerdict;
  confidence: number;
  explanation: string;
  evidence: EvidenceSource[];
}

export interface AnalysisResult {
  inputType: InputType;
  inputContent: string;
  title?: string;
  publisher?: string;
  author?: string;
  pubDate?: string;
  verdict: VerdictType;
  confidence: number;
  summary: string;
  claims: ClaimAnalysis[];
  limitations?: string;
  isDemo?: boolean;
}

export interface AnalysisHistoryEntry {
  id: string;
  inputType: InputType;
  inputContent: string;
  title?: string;
  verdict: VerdictType;
  confidence: number;
  summary: string;
  fullResult: AnalysisResult;
  createdAt: number;
}
