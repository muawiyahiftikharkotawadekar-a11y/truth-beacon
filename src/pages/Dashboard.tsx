import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { VerdictBadge } from "@/components/analyzer/VerdictBadge";
import type { AnalysisHistoryEntry, VerdictType, ClaimVerdict } from "@/lib/types";
import {
  LogOut,
  Trash2,
  Clock,
  Check,
  X,
  AlertTriangle,
  HelpCircle,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

const STORAGE_KEY = "truthbeacon_history";

function getHistory(): AnalysisHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}

function deleteEntry(id: string) {
  const history = getHistory().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function getStats(history: AnalysisHistoryEntry[]) {
  return {
    total: history.length,
    TRUE: history.filter((h) => h.verdict === "TRUE").length,
    FALSE: history.filter((h) => h.verdict === "FALSE").length,
    MISLEADING: history.filter((h) => h.verdict === "MISLEADING").length,
    UNVERIFIED: history.filter((h) => h.verdict === "UNVERIFIED").length,
  };
}

function BarChartSimple({
  stats,
}: {
  stats: { TRUE: number; FALSE: number; MISLEADING: number; UNVERIFIED: number };
}) {
  const total =
    stats.TRUE + stats.FALSE + stats.MISLEADING + stats.UNVERIFIED;
  if (total === 0) return null;

  const segments = [
    { key: "TRUE", count: stats.TRUE, color: "bg-emerald-500/60", label: "True" },
    { key: "FALSE", count: stats.FALSE, color: "bg-red-500/60", label: "False" },
    {
      key: "MISLEADING",
      count: stats.MISLEADING,
      color: "bg-amber-500/60",
      label: "Misleading",
    },
    {
      key: "UNVERIFIED",
      count: stats.UNVERIFIED,
      color: "bg-slate-400/60",
      label: "Unverified",
    },
  ];

  return (
    <div className="space-y-3">
      {/* Horizontal stacked bar */}
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted/50">
        {segments.map((seg) =>
          seg.count > 0 ? (
            <div
              key={seg.key}
              className={`${seg.color} h-full transition-all`}
              style={{ width: `${(seg.count / total) * 100}%` }}
              title={`${seg.label}: ${seg.count}`}
            />
          ) : null,
        )}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {segments.map((seg) => (
          <div key={seg.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className={`h-2 w-2 rounded-full ${seg.color}`} />
            {seg.label}: {seg.count}
          </div>
        ))}
      </div>
    </div>
  );
}

const statCards = [
  { key: "TRUE", label: "True", icon: Check, color: "text-emerald-500" },
  { key: "FALSE", label: "False", icon: X, color: "text-red-500" },
  {
    key: "MISLEADING",
    label: "Misleading",
    icon: AlertTriangle,
    color: "text-amber-500",
  },
  {
    key: "UNVERIFIED",
    label: "Unverified",
    icon: HelpCircle,
    color: "text-slate-500",
  },
] as const;

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<AnalysisHistoryEntry[]>([]);
  const [selectedResult, setSelectedResult] = useState<AnalysisHistoryEntry | null>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const stats = getStats(history);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleDelete = (id: string) => {
    deleteEntry(id);
    setHistory(getHistory());
    if (selectedResult?.id === id) setSelectedResult(null);
  };

  const handleClearAll = () => {
    clearHistory();
    setHistory([]);
    setSelectedResult(null);
  };

  if (selectedResult) {
    return (
      <div className="min-h-screen bg-background px-6 py-10 text-foreground">
        <div className="mx-auto max-w-5xl">
          <button
            onClick={() => setSelectedResult(null)}
            className="mb-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to dashboard
          </button>
          <div className="rounded-xl border border-border/40 bg-card/30 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium">
                  {selectedResult.title || "Analysis Result"}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(selectedResult.createdAt).toLocaleString()}
                </p>
              </div>
              <VerdictBadge verdict={selectedResult.verdict} />
            </div>
            <div className="mb-4">
              <p className="text-2xl font-light tabular-nums">
                {selectedResult.confidence}%
              </p>
              <p className="text-xs text-muted-foreground">
                Evidence Confidence
              </p>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {selectedResult.summary}
            </p>
            {selectedResult.fullResult && (
              <div className="mt-6">
                <h3 className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
                  Claims
                </h3>
                <div className="space-y-3">
                  {selectedResult.fullResult.claims?.map(
                    (claim: { claim: string; verdict: string; confidence: number; explanation: string }, i: number) => (
                      <div
                        key={i}
                        className="rounded-lg border border-border/30 p-3"
                      >
                        <p className="text-xs font-medium">{claim.claim}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <VerdictBadge verdict={claim.verdict as ClaimVerdict} />
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {claim.confidence}%
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {claim.explanation}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Dashboard
            </p>
            <h1 className="mt-1 text-3xl font-light tracking-tight">
              Welcome{user?.name ? `, ${user.name}` : ""}
            </h1>
          </div>
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer gap-2 self-start"
            onClick={handleSignOut}
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </header>

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card className="border-border/40 bg-card/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Total</p>
                <BarChart3 className="h-3.5 w-3.5 text-muted-foreground/50" />
              </div>
              <p className="mt-2 text-2xl font-light tabular-nums">
                {stats.total}
              </p>
            </CardContent>
          </Card>
          {statCards.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.key} className="border-border/40 bg-card/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <Icon className={`h-3.5 w-3.5 ${s.color}`} />
                  </div>
                  <p className="mt-2 text-2xl font-light tabular-nums">
                    {stats[s.key]}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Chart */}
        {stats.total > 0 && (
          <Card className="border-border/40 bg-card/30">
            <CardContent className="p-5">
              <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
                Verdict Distribution
              </h3>
              <BarChartSimple stats={stats} />
            </CardContent>
          </Card>
        )}

        {/* History */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
              Recent Analyses
            </h2>
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-xs text-muted-foreground"
                onClick={handleClearAll}
              >
                <Trash2 className="h-3 w-3" />
                Clear all
              </Button>
            )}
          </div>

          {history.length === 0 ? (
            <Card className="border-border/40 bg-card/30">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Clock className="mb-3 h-8 w-8 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  No analyses yet
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => navigate("/analyze")}
                >
                  Start analyzing
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 rounded-lg border border-border/30 bg-card/20 p-3 transition-colors hover:bg-card/40"
                >
                  <button
                    onClick={() => setSelectedResult(entry)}
                    className="flex-1 text-left"
                  >
                    <p className="text-sm font-medium truncate">
                      {entry.title || entry.inputContent.slice(0, 60)}
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <VerdictBadge verdict={entry.verdict as VerdictType} />
                      <span className="tabular-nums">{entry.confidence}%</span>
                      <span>
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="shrink-0 text-muted-foreground/40 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
