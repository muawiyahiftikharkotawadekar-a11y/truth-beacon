import Layout from "@/components/Layout";
import {
  FileText,
  Search,
  Globe,
  Scale,
  Brain,
  Shield,
  AlertCircle,
} from "lucide-react";

const PIPELINE = [
  {
    step: 1,
    icon: FileText,
    title: "Article / Input",
    description:
      "You provide a news article URL, paste the article text, or enter a headline. If a URL is provided, the system attempts to extract the article content automatically.",
  },
  {
    step: 2,
    icon: Brain,
    title: "Claim Extraction",
    description:
      "The AI model identifies the most important factual claims in the article — up to 5 key assertions that can be fact-checked. Opinions, predictions, and speculation are separated from verifiable facts.",
  },
  {
    step: 3,
    icon: Search,
    title: "Evidence Search",
    description:
      "For each claim, the system searches for relevant information from established sources — looking for both supporting and contradicting evidence.",
  },
  {
    step: 4,
    icon: Globe,
    title: "Evidence Comparison",
    description:
      "Collected sources are classified as supporting, contradicting, or providing context. Source credibility and publication dates are considered.",
  },
  {
    step: 5,
    icon: Scale,
    title: "AI Analysis",
    description:
      "The AI model compares each claim against the gathered evidence, identifies contradictions, considers publication dates, and distinguishes fact from opinion.",
  },
  {
    step: 6,
    icon: Shield,
    title: "Final Verdict",
    description:
      "A clear verdict is produced with an evidence confidence score, detailed explanation, claim-by-claim analysis, and all sources for transparency.",
  },
];

const LIMITATIONS = [
  "AI cannot guarantee absolute truth — it reasons from available evidence.",
  "Breaking news may not have enough independent evidence yet for verification.",
  "Some websites block automatic article extraction.",
  "Search results can occasionally contain unreliable information.",
  "Satire can be difficult to distinguish from genuine reporting.",
  "Opinion is different from factual reporting — opinions are labeled as such.",
  "Results are only as reliable as the available evidence at the time of analysis.",
];

export default function HowItWorks() {
  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-6 py-12 md:py-20">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-2xl font-light tracking-tight md:text-3xl">
            How It Works
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            A transparent look at the verification pipeline — from input to
            verdict.
          </p>
        </div>

        {/* Pipeline */}
        <div className="space-y-0">
          {PIPELINE.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="relative flex gap-5">
                {/* Vertical line */}
                <div className="flex flex-col items-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/40 bg-background">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  {item.step < PIPELINE.length && (
                    <div className="w-px flex-1 bg-border/30" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-10 pt-1">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/50">
                    Step {item.step}
                  </p>
                  <h3 className="mt-1 text-sm font-medium">{item.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Limitations */}
        <section className="mt-12 rounded-xl border border-border/40 bg-card/30 p-6">
          <div className="mb-4 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-medium">Limitations</h2>
          </div>
          <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
            This tool has important limitations that should be understood:
          </p>
          <ul className="space-y-2">
            {LIMITATIONS.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"
              >
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Disclaimer */}
        <div className="mt-8 rounded-lg border border-border/30 bg-muted/20 px-4 py-3 text-center">
          <p className="text-xs text-muted-foreground/70">
            <strong>Disclaimer:</strong> AI-assisted verification can make
            mistakes. Results depend on the quality and availability of evidence.
            Always cross-reference with multiple trusted sources.
          </p>
        </div>
      </div>
    </Layout>
  );
}
