import { VerdictDisplay } from "./VerdictBadge";
import { ClaimCard } from "./ClaimCard";
import type { AnalysisResult as AnalysisResultType } from "@/lib/types";
import { FileText, Globe, Clock, User, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

function FadeInSection({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: "easeOut" as const }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnalysisResult({
  result,
  isDemo,
}: {
  result: AnalysisResultType;
  isDemo?: boolean;
}) {
  return (
    <motion.div
      className="mx-auto w-full max-w-3xl space-y-8 pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Demo banner */}
      {isDemo && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          className="rounded-lg border border-dashed border-amber-500/30 bg-amber-500/5 px-4 py-3 text-center text-xs text-amber-600 dark:text-amber-400"
        >
          Demo Mode — This is a sample result for demonstration purposes.
        </motion.div>
      )}

      {/* Verdict section */}
      <FadeInSection delay={0}>
        <section className="rounded-xl border border-border/40 bg-card/30 px-6 py-2">
          <div className="py-2 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
            Verification Result
          </div>
          <VerdictDisplay
            verdict={result.verdict}
            confidence={result.confidence}
          />
        </section>
      </FadeInSection>

      {/* Article info */}
      <FadeInSection delay={0.12}>
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
      </FadeInSection>

      {/* Summary */}
      <FadeInSection delay={0.24}>
        <section className="rounded-xl border border-border/40 bg-card/30 p-6">
          <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
            Summary
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {result.summary}
          </p>
        </section>
      </FadeInSection>

      {/* Claim Analysis */}
      <FadeInSection delay={0.36}>
        <div>
          <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
            Claim Analysis
          </h3>
          <div className="flex flex-col gap-3">
            {result.claims.map((claim, i) => (
              <ClaimCard key={i} claim={claim} index={i} />
            ))}
          </div>
        </div>
      </FadeInSection>

      {/* Limitations */}
      {result.limitations && (
        <FadeInSection delay={0.48}>
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
        </FadeInSection>
      )}
    </motion.div>
  );
}
