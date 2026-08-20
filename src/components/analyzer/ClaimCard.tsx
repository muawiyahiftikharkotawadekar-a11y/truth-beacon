import { VerdictBadge } from "./VerdictBadge";
import { EvidenceCard } from "./EvidenceCard";
import type { ClaimAnalysis } from "@/lib/types";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ClaimCard({ claim, index = 0 }: { claim: ClaimAnalysis; index?: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.1, duration: 0.4, ease: "easeOut" }}
      className="rounded-lg border border-border/50 bg-card/50"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start justify-between gap-4 p-4 text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-snug">
            {claim.claim}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <VerdictBadge verdict={claim.verdict} />
            <span className="text-xs text-muted-foreground tabular-nums">
              {claim.confidence}% confidence
            </span>
          </div>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/30 px-4 pb-4 pt-3">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {claim.explanation}
              </p>

              {claim.evidence && claim.evidence.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
                    Evidence
                  </p>
                  <div className="flex flex-col gap-2">
                    {claim.evidence.map((e, i) => (
                      <EvidenceCard key={i} evidence={e} index={i} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
