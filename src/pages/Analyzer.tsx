import { useState, useCallback, useEffect } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import { validateInput } from "@/lib/validate";
import { saveToHistory } from "@/lib/history";
import {
  Link2,
  FileText,
  Hash,
  AlertCircle,
  ArrowLeft,
  Search,
  Brain,
  Scale,
  Shield,
} from "lucide-react";

const ANALYSIS_STEPS = [
  { icon: FileText, label: "Extracting article" },
  { icon: Search, label: "Searching for evidence" },
  { icon: Brain, label: "Analyzing claims" },
  { icon: Scale, label: "Verifying facts" },
  { icon: Shield, label: "Generating verdict" },
];

function AnalysisLoading() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-md px-6 py-20 text-center"
    >
      {/* Pulsing shield icon */}
      <motion.div
        className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-border/40 bg-muted/30"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <Shield className="h-7 w-7 text-muted-foreground" strokeWidth={1.5} />
      </motion.div>

      <h2 className="text-lg font-light tracking-tight">Analyzing</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        This may take a moment...
      </p>

      {/* Step indicators */}
      <div className="mt-8 space-y-3">
        {ANALYSIS_STEPS.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === activeStep;
          const isDone = i < activeStep;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              className="flex items-center gap-3"
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-all duration-500 ${
                  isActive
                    ? "border-foreground/20 bg-foreground/5"
                    : isDone
                      ? "border-border/30 bg-muted/30"
                      : "border-border/20 bg-transparent"
                }`}
              >
                {isDone ? (
                  <motion.svg
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3 }}
                    className="h-3.5 w-3.5 text-muted-foreground"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <motion.path
                      d="M5 13l4 4L19 7"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                  </motion.svg>
                ) : (
                  <Icon
                    className={`h-3.5 w-3.5 transition-colors duration-500 ${
                      isActive ? "text-foreground" : "text-muted-foreground/40"
                    }`}
                  />
                )}
              </div>
              <span
                className={`text-xs transition-colors duration-500 ${
                  isActive
                    ? "text-foreground font-medium"
                    : isDone
                      ? "text-muted-foreground"
                      : "text-muted-foreground/40"
                }`}
              >
                {step.label}
              </span>
              {isActive && (
                <motion.div
                  className="ml-auto"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <div className="flex gap-1">
                    <div className="h-1 w-1 rounded-full bg-foreground/60" />
                    <div className="h-1 w-1 rounded-full bg-foreground/40" />
                    <div className="h-1 w-1 rounded-full bg-foreground/20" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-8 h-0.5 w-full overflow-hidden rounded-full bg-muted/50">
        <motion.div
          className="h-full bg-foreground/20"
          initial={{ width: "0%" }}
          animate={{ width: `${((activeStep + 1) / ANALYSIS_STEPS.length) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

export default function Analyzer() {
  const [inputType, setInputType] = useState<InputType>("url");
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [headlineInput, setHeadlineInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResultType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);



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
      const analysisResult = await analyzeAction({ inputType, content });
      const typedResult = analysisResult as AnalysisResultType;
      setResult(typedResult);
      saveToHistory(typedResult);
    } catch (err) {
      console.log("Analysis failed, falling back to demo mode:", err);
      const demoKey =
        inputType === "url"
          ? "true"
          : inputType === "headline"
            ? "false"
            : "misleading";
      const demoResult = DEMO_RESULTS[demoKey];
      setResult(demoResult);
      setIsDemo(true);
    } finally {
      setIsAnalyzing(false);
    }
  }, [analyzeAction, inputType, urlInput, textInput, headlineInput]);

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

  return (
    <Layout>
      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          <AnalysisLoading key="loading" />
        ) : result ? (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-auto max-w-6xl px-6 py-10"
          >
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              onClick={handleReset}
              className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              New analysis
            </motion.button>
            <AnalysisResult result={result} isDemo={isDemo} />
          </motion.div>
        ) : (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="mx-auto max-w-2xl px-6 py-12 md:py-20"
          >
            <div className="mb-10 text-center">
              <h1 className="text-2xl font-light tracking-tight md:text-3xl">
                Analyze News
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter a URL, paste article text, or enter a headline for
                AI-assisted verification.
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
                    Headline-only analysis may have lower confidence because
                    the complete article context is unavailable.
                  </p>
                </TabsContent>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 flex items-start gap-2 rounded-lg bg-destructive/5 px-3 py-2 text-xs text-destructive">
                        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        {error}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="mt-6 h-11 w-full"
                >
                  Analyze
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
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
