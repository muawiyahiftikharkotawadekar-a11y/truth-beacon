import { VerdictDisplay, VerdictBadge } from "./VerdictBadge";
import { ClaimCard } from "./ClaimCard";
import type { AnalysisResult as AnalysisResultType } from "@/lib/types";
import { FileText, Globe, Clock, User, AlertCircle } from "lucide-react";

export function AnalysisResult({
  result,
  isDemo,
}: {
  result: AnalysisResultType;
  isDemo?: boolean;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 pb-16">
      {/* Demo banner */}
      {isDemo && (
        <div className="rounded-lg border border-dashed border-amber-500/30 bg-amber-500/5 px-4 py-3 text-center text-xs text-amber-600 dark:text-amber-400">
          Demo Mode — This is a sample result for demonstration purposes.
        </div>
      )}

      {/* Verdict section */}
      <section className="rounded-xl border border-border/40 bg-card/30 px-6 py-2">
        <div className="py-2 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
          Verification Result
        </div>
        <VerdictDisplay
          verdict={result.verdict}
          confidence={result.confidence}
        />
      </section>

      {/* Article info */}
      <section className="rounded-xl border border-border/40 bg-card/30 p-6">
        <div className="mb-4 flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
            Article Information
          </h3>
        </div>
        <div className="space-y-2">
          {result.title && (
            <p className="text-sm font-medium">{result.title}</p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {result.publisher && (
              <span className="inline-flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {result.publisher}
              </span>
            )}
            {result.author && (
              <span className="inline-flex items-center gap-1">
                <User className="h-3 w-3" />
                {result.author}
              </span>
            )}
            {result.pubDate && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {result.pubDate}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="rounded-xl border border-border/40 bg-card/30 p-6">
        <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
          Summary
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {result.summary}
        </p>
      </section>

      {/* Claim Analysis */}
      <section>
        <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
          Claim Analysis
        </h3>
        <div className="flex flex-col gap-3">
          {result.claims.map((claim, i) => (
            <ClaimCard key={i} claim={claim} />
          ))}
        </div>
      </section>

      {/* Limitations */}
      {result.limitations && (
        <section className="rounded-xl border border-border/40 bg-card/30 p-6">
          <div className="mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
              Limitations
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {result.limitations}
          </p>
        </section>
      )}
    </div>
  );
}
