import type { EvidenceSource } from "@/lib/types";
import { ExternalLink, ArrowUpRight, ArrowDownRight, Circle, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

const typeConfig = {
  supporting: {
    label: "Supports",
    icon: ArrowUpRight,
    className: "text-emerald-500",
  },
  contradicting: {
    label: "Contradicts",
    icon: ArrowDownRight,
    className: "text-red-500",
  },
  context: {
    label: "Context",
    icon: Circle,
    className: "text-blue-500",
  },
  unknown: {
    label: "Unknown",
    icon: HelpCircle,
    className: "text-muted-foreground",
  },
};

export function EvidenceCard({
  evidence,
  index = 0,
}: {
  evidence: EvidenceSource;
  index?: number;
}) {
  const config = typeConfig[evidence.type] ?? typeConfig.unknown;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="flex gap-3 rounded-md border border-border/30 bg-background/50 p-3"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 text-xs font-medium ${config.className}`}>
            <Icon className="h-3 w-3" />
            {config.label}
          </span>
          {evidence.date && (
            <span className="text-xs text-muted-foreground/60">
              {evidence.date}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs font-medium leading-snug truncate">
          {evidence.title || evidence.source}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
          {evidence.snippet}
        </p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground/50 truncate max-w-[200px]">
            {evidence.source}
          </span>
        </div>
      </div>
      {evidence.url && (
        <a
          href={evidence.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center self-center text-muted-foreground hover:text-foreground transition-colors"
          title="Open source"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </motion.div>
  );
}
