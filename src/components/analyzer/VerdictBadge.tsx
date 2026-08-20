import { cn } from "@/lib/utils";
import type { VerdictType, ClaimVerdict } from "@/lib/types";
import { Check, X, AlertTriangle, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

const verdictConfig: Record<
  string,
  { label: string; icon: React.ElementType; className: string }
> = {
  TRUE: {
    label: "TRUE",
    icon: Check,
    className: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  FALSE: {
    label: "FALSE",
    icon: X,
    className: "bg-red-500/10 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  },
  MISLEADING: {
    label: "MISLEADING",
    icon: AlertTriangle,
    className: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  },
  UNVERIFIED: {
    label: "UNVERIFIED",
    icon: HelpCircle,
    className: "bg-slate-500/10 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400",
  },
  PARTIALLY_TRUE: {
    label: "PARTIAL",
    icon: AlertTriangle,
    className: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  },
  OPINION: {
    label: "OPINION",
    icon: HelpCircle,
    className: "bg-slate-500/10 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400",
  },
  SATIRE: {
    label: "SATIRE",
    icon: HelpCircle,
    className: "bg-slate-500/10 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400",
  },
};

export function VerdictBadge({
  verdict,
  size = "default",
}: {
  verdict: VerdictType | ClaimVerdict;
  size?: "default" | "large";
}) {
  const config = verdictConfig[verdict] ?? verdictConfig.UNVERIFIED;
  const Icon = config.icon;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium border border-transparent",
        config.className,
        size === "large"
          ? "px-4 py-1.5 text-sm"
          : "px-2.5 py-0.5 text-xs",
      )}
    >
      <Icon className={size === "large" ? "h-4 w-4" : "h-3 w-3"} />
      {config.label}
    </motion.span>
  );
}

export function VerdictDisplay({
  verdict,
  confidence,
}: {
  verdict: VerdictType;
  confidence: number;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
      >
        <VerdictBadge verdict={verdict} size="large" />
      </motion.div>
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.div
          className="text-3xl font-light tracking-tight tabular-nums"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {confidence}%
        </motion.div>
        <p className="mt-1 text-xs text-muted-foreground">
          Evidence Confidence
        </p>
      </motion.div>
      <motion.p
        className="max-w-md text-center text-xs leading-relaxed text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        This score represents the strength and consistency of the available
        evidence. It is not a guarantee of truth.
      </motion.p>
    </div>
  );
}
