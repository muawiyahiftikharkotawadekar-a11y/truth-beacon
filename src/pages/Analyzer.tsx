import { useState, useCallback } from "react";

const STORAGE_KEY = "truthbeacon_history";

function saveToHistory(result: AnalysisResultType) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const entry = {
      id: crypto.randomUUID(),
      inputType: result.inputType,
      inputContent: result.inputContent,
      title: result.title,
      verdict: result.verdict,
      confidence: result.confidence,
      summary: result.summary,
      fullResult: result,
      createdAt: Date.now(),
    };
    existing.unshift(entry);
    // Keep only last 50 entries
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 50)));
  } catch {
    // Silently fail - history is not critical
  }
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalysisResult } from "@/components/analyzer/AnalysisResult";
import type { AnalysisResult as AnalysisResultType, InputType } from "@/lib/types";
import { DEMO_RESULTS } from "@/lib/demo-data";
import Layout from "@/components/Layout";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import {
  Link2,
  FileText,
  Hash,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

export default function Analyzer() {
  const [inputType, setInputType] = useState<InputType>("url");
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [headlineInput, setHeadlineInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResultType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const validateInput = useCallback(
    (type: InputType, content: string): string | null => {
      const trimmed = content.trim();
      if (!trimmed) {
        if (type === "url") return "Please enter a news article URL.";
        if (type === "text") return "Please paste article text to analyze.";
        return "Please enter a headline to analyze.";
      }
      if (type === "url") {
        try {
          const parsed = new URL(trimmed);
          if (!["http:", "https:"].includes(parsed.protocol)) {
            return "Please enter a valid HTTP or HTTPS URL.";
          }
        } catch {
          return "Please enter a valid news article URL.";
        }
      }
      if (type === "text" && trimmed.length < 20) {
        return "Article text is too short. Please paste more content.";
      }
      if (type === "text" && trimmed.length > 15000) {
        return "Article text is too long. Please limit to 15,000 characters.";
      }
      return null;
    },
    [],
  );

  const getContent = (): string => {
    switch (inputType) {
      case "url":
        return urlInput.trim();
      case "text":
        return textInput.trim();
      case "headline":
        return headlineInput.trim();
    }
  };

  const analyzeAction = useAction(api.actions.analyze.analyzeInput);

  const handleAnalyze = useCallback(async () => {
    const content = getContent();
    const validationError = validateInput(inputType, content);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setResult(null);
    setIsDemo(false);
    setIsAnalyzing(true);

    try {
      const analysisResult = await analyzeAction({
        inputType,
        content,
      });
      const typedResult = analysisResult as AnalysisResultType;
      setResult(typedResult);
      saveToHistory(typedResult);
    } catch (err) {
      console.log("Analysis failed, falling back to demo mode:", err);
      const demoKey = inputType === "url" ? "true" : inputType === "headline" ? "false" : "misleading";
      const demoResult = DEMO_RESULTS[demoKey];
      setResult(demoResult);
      setIsDemo(true);
    } finally {
      setIsAnalyzing(false);
    }
  }, [analyzeAction, inputType, urlInput, textInput, headlineInput, validateInput]);

  const handleTryDemo = (key: string) => {
    setResult(DEMO_RESULTS[key]);
    setIsDemo(true);
    setError(null);
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setIsDemo(false);
  };

  if (result) {
    return (
      <Layout>
        <div className="mx-auto max-w-6xl px-6 py-10">
          <button
            onClick={handleReset}
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            New analysis
          </button>
          <AnalysisResult result={result} isDemo={isDemo} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
    <div className="mx-auto max-w-2xl px-6 py-12 md:py-20">
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-light tracking-tight md:text-3xl">
          Analyze News
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter a URL, paste article text, or enter a headline for AI-assisted verification.
        </p>
      </div>

      <Tabs
        value={inputType}
        onValueChange={(v) => {
          setInputType(v as InputType);
          setError(null);
        }}
      >
        <TabsList className="mx-auto mb-6 grid w-full grid-cols-3">
          <TabsTrigger value="url" className="gap-1.5 text-xs">
            <Link2 className="h-3 w-3" />
            URL
          </TabsTrigger>
          <TabsTrigger value="text" className="gap-1.5 text-xs">
            <FileText className="h-3 w-3" />
            Text
          </TabsTrigger>
          <TabsTrigger value="headline" className="gap-1.5 text-xs">
            <Hash className="h-3 w-3" />
            Headline
          </TabsTrigger>
        </TabsList>

        <div className="rounded-xl border border-border/40 bg-card/30 p-6">
          <TabsContent value="url" className="mt-0 space-y-4">
            <Input
              placeholder="Paste news article URL"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="h-11"
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            />
          </TabsContent>

          <TabsContent value="text" className="mt-0 space-y-4">
            <Textarea
              placeholder="Paste article text here..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="min-h-[200px] resize-y"
            />
          </TabsContent>

          <TabsContent value="headline" className="mt-0 space-y-4">
            <Input
              placeholder="Enter news headline"
              value={headlineInput}
              onChange={(e) => setHeadlineInput(e.target.value)}
              className="h-11"
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            />
            <p className="text-xs text-muted-foreground/70">
              Headline-only analysis may have lower confidence because the
              complete article context is unavailable.
            </p>
          </TabsContent>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-destructive/5 px-3 py-2 text-xs text-destructive">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {error}
            </div>
          )}

          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="mt-6 h-11 w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze"
            )}
          </Button>
        </div>
      </Tabs>

      {/* Demo mode quick access */}
      <div className="mt-8 text-center">
        <p className="mb-3 text-xs text-muted-foreground/60">
          No API key configured? Try a demo:
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { key: "true", label: "True Example" },
            { key: "false", label: "False Example" },
            { key: "misleading", label: "Misleading" },
            { key: "unverified", label: "Unverified" },
          ].map((demo) => (
            <Button
              key={demo.key}
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => handleTryDemo(demo.key)}
            >
              {demo.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
    </Layout>
  );
}
