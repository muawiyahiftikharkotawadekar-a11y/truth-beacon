import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, Search, Brain, FileSearch, Scale, AlertTriangle, HelpCircle, Link2 } from "lucide-react";
import { useNavigate } from "react-router";
import Layout from "@/components/Layout";

const STEPS = [
  { icon: FileSearch, label: "Article", description: "Input news content" },
  { icon: Search, label: "Claims", description: "Extract key claims" },
  { icon: Brain, label: "Evidence", description: "Search for evidence" },
  { icon: Scale, label: "Analysis", description: "AI verification" },
  { icon: Shield, label: "Verdict", description: "Final result" },
];

const FEATURES = [
  {
    icon: Link2,
    title: "Multiple Input Modes",
    description: "Paste a URL, article text, or just a headline.",
  },
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Gemini AI analyzes claims against available evidence.",
  },
  {
    icon: Search,
    title: "Evidence Search",
    description: "Automatically searches for supporting and contradicting sources.",
  },
  {
    icon: AlertTriangle,
    title: "Nuanced Verdicts",
    description: "TRUE, FALSE, MISLEADING, or UNVERIFIED — with clear explanations.",
  },
  {
    icon: Shield,
    title: "Source Transparency",
    description: "Every verdict shows the evidence and sources behind it.",
  },
  {
    icon: HelpCircle,
    title: "Honest Limitations",
    description: "Clearly states what the analysis can and cannot determine.",
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex flex-col">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-muted/30 px-3 py-1 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" />
              AI-assisted verification
            </div>
            <h1 className="text-4xl font-light tracking-tight md:text-5xl lg:text-6xl">
              Verify Before
              <br />
              You Believe.
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
              AI-assisted news verification that analyzes claims and available
              evidence. Paste a URL, article text, or headline — get a clear,
              evidence-backed verdict.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="gap-2 px-6"
                onClick={() => navigate("/analyze")}
              >
                Analyze News
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-6"
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                How It Works
              </Button>
            </div>
          </div>
        </section>

        {/* Process flow */}
        <section id="how-it-works" className="px-6 py-16 md:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 text-center">
              <h2 className="text-xl font-light tracking-tight md:text-2xl">
                How It Works
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                From input to verdict in a clear, transparent process.
              </p>
            </div>

            <div className="flex flex-col items-center gap-0">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="flex flex-col items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/40 bg-background">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium">{step.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="my-1 h-6 w-px bg-border/40" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border/30 px-6 py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <h2 className="text-xl font-light tracking-tight md:text-2xl">
                Features
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={i}
                    className="rounded-xl border border-border/30 bg-card/20 p-5"
                  >
                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-muted/50">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <h3 className="text-sm font-medium">{feature.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Verdicts */}
        <section className="border-t border-border/30 px-6 py-16 md:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 text-center">
              <h2 className="text-xl font-light tracking-tight md:text-2xl">
                Verification Verdicts
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Four clear outcomes based on evidence analysis.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  verdict: "TRUE",
                  color: "text-emerald-500",
                  desc: "Claims are strongly supported by available evidence.",
                },
                {
                  verdict: "FALSE",
                  color: "text-red-500",
                  desc: "Reliable evidence directly contradicts the claims.",
                },
                {
                  verdict: "MISLEADING",
                  color: "text-amber-500",
                  desc: "Some facts are correct but presented without important context.",
                },
                {
                  verdict: "UNVERIFIED",
                  color: "text-slate-500",
                  desc: "Insufficient evidence to confidently determine truth.",
                },
              ].map((item) => (
                <div
                  key={item.verdict}
                  className="flex items-start gap-3 rounded-xl border border-border/30 bg-card/20 p-4"
                >
                  <div className={`mt-0.5 text-xs font-medium ${item.color}`}>
                    {item.verdict}
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border/30 px-6 py-16 md:py-20">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="text-xl font-light tracking-tight md:text-2xl">
              Ready to verify?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Test it yourself with a real article or try the demo examples.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="gap-2 px-6"
                onClick={() => navigate("/analyze")}
              >
                Start Analysis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="border-t border-border/30 px-6 py-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs leading-relaxed text-muted-foreground/60">
              AI-assisted verification can make mistakes. Results depend on the
              quality and availability of evidence. This tool is designed for
              educational purposes. Always consult multiple sources for important
              decisions.
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
}
