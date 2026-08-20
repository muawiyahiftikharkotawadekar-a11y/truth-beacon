import { cn } from "@/lib/utils";
import type { VerdictType, ClaimVerdict } from "@/lib/types";
import { Check, X, AlertTriangle, HelpCircle } from "lucide-react";

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
    <span
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
    </span>
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
      <VerdictBadge verdict={verdict} size="large" />
      <div className="text-center">
        <div className="text-3xl font-light tracking-tight tabular-nums">
          {confidence}%
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Evidence Confidence
        </p>
      </div>
      <p className="max-w-md text-center text-xs leading-relaxed text-muted-foreground">
        This score represents the strength and consistency of the available
        evidence. It is not a guarantee of truth.
      </p>
    </div>
  );
}
