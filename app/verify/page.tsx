"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Globe,
  Loader2,
  ShieldAlert,
  Sparkles,
  Tag,
  TrendingUp,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { AIInputWithFile } from "@/components/ui/ai-input-with-file";
import { TextShimmerWave } from "@/components/ui/text-shimmer-wave";
import { useContentAnalysis } from "@/lib/hooks/use-content-analysis";
import type { ContentAnalysisData, FactCheckData } from "@/types/analysis";
import { buildMockAnalysis } from "@/lib/mock-analysis";
import { cn } from "@/lib/utils";
import {
  calculateSentimentScore,
  determineOverallSentiment,
  extractEmotions,
  calculateSentimentConfidence,
} from "@/tools/content-analysis/helpers/sentiment";

const CONFIDENCE_BANDS = [
  {
    min: 90,
    label: "Highly Reliable",
    badgeClass: "bg-emerald-500/15 text-emerald-500",
    barClass: "bg-emerald-500",
  },
  {
    min: 70,
    label: "Likely Reliable",
    badgeClass: "bg-sky-500/15 text-sky-500",
    barClass: "bg-sky-500",
  },
  {
    min: 50,
    label: "Unclear",
    badgeClass: "bg-amber-500/15 text-amber-500",
    barClass: "bg-amber-500",
  },
  {
    min: 30,
    label: "Doubtful",
    badgeClass: "bg-orange-500/15 text-orange-500",
    barClass: "bg-orange-500",
  },
  {
    min: 0,
    label: "Unreliable",
    badgeClass: "bg-red-500/15 text-red-500",
    barClass: "bg-red-500",
  },
];

const SAFE_MODE_THRESHOLD = 50;

type FactCheckResultItem = FactCheckData["results"][number];
type FactCheckSourceItem = NonNullable<FactCheckData["sources"]>[number];

const clamp = (value: number) => Math.max(5, Math.min(100, Math.round(value)));

function getConfidenceScore(factCheck?: FactCheckData | null | undefined) {
  if (!factCheck?.results?.length) {
    return null;
  }
  const confidences = factCheck.results
    .map((result: FactCheckResultItem) => result.confidence)
    .filter((value): value is number => typeof value === "number");
  if (!confidences.length) {
    return null;
  }
  return clamp(
    confidences.reduce((sum: number, value: number) => sum + value, 0) /
      confidences.length
  );
}

function getConfidenceBand(score: number | null) {
  if (score === null) {
    return null;
  }
  return (
    CONFIDENCE_BANDS.find((band) => score >= band.min) ?? CONFIDENCE_BANDS.at(-1)
  );
}

function deriveVerdict(
  factCheck?: FactCheckData | null | undefined,
  requiresFactCheck?: boolean
) {
  if (!factCheck?.summary) {
    return requiresFactCheck ? "Needs Verification" : "Awaiting Analysis";
  }

  const summary = factCheck.summary;
  const verdictMap: Array<{ key: keyof typeof summary; label: string }> = [
    { key: "verifiedTrue", label: "True" },
    { key: "verifiedFalse", label: "False" },
    { key: "misleading", label: "Misleading" },
    { key: "unverifiable", label: "Unverifiable" },
    { key: "needsVerification", label: "Needs Verification" },
  ];

  const sorted = verdictMap.sort(
    (a, b) => (summary[b.key] ?? 0) - (summary[a.key] ?? 0)
  );

  return sorted[0].label;
}

function formatDomain(url?: string) {
  if (!url) {
    return "Unknown Source";
  }
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return "Custom Upload";
  }
}

function deriveTags(
  data: ContentAnalysisData | null | undefined,
  verdict?: string
) {
  if (!data) {
    return [];
  }

  const tags = [
    { label: "Veracity", value: verdict ?? "Pending" },
    { label: "Platform", value: data.metadata.platform ?? "Unknown" },
    { label: "Domain", value: formatDomain(data.metadata.originalUrl) },
    {
      label: "Status",
      value: data.requiresFactCheck ? "Needs Review" : "Fact-Checked",
    },
    {
      label: "Content Type",
      value: data.newsDetection?.contentType ?? "Mixed Media",
    },
  ];

  return tags;
}

function deriveSubScores(
  data: ContentAnalysisData | null | undefined,
  confidenceScore: number | null = null
) {
  const base = confidenceScore ?? 62;
  const creatorScore = data?.creatorCredibilityRating
    ? clamp((data.creatorCredibilityRating / 10) * 100)
    : clamp(base + 6);

  return [
    { label: "SC", hint: "Source Credibility", value: creatorScore },
    { label: "EC", hint: "Evidence Corroboration", value: clamp(base + 4) },
    { label: "SA", hint: "Sentiment Analysis", value: clamp(base) },
    { label: "SF", hint: "Source Freshness", value: clamp(base - 3) },
    { label: "FR", hint: "Factual Records", value: clamp(base - 6) },
    { label: "MA", hint: "Media Authenticity", value: clamp(base + 2) },
  ];
}

function getHistoryStats(data: ContentAnalysisData | null | undefined) {
  const summary = data?.factCheck?.summary;
  return [
    { label: "True", value: summary?.verifiedTrue ?? 0, color: "text-emerald-500" },
    { label: "False", value: summary?.verifiedFalse ?? 0, color: "text-red-500" },
    { label: "Misleading", value: summary?.misleading ?? 0, color: "text-amber-500" },
    { label: "Unverifiable", value: summary?.unverifiable ?? 0, color: "text-slate-500" },
  ];
}

function formatSources(data: ContentAnalysisData | null | undefined) {
  const sources = data?.factCheck?.sources ?? [];
  return sources.slice(0, 4).map((source: FactCheckSourceItem) => ({
    title: source.title,
    url: source.url,
    verified: (source.relevance ?? 0) >= 70,
  }));
}

function formatPotentialClaims(data: ContentAnalysisData | null | undefined) {
  return data?.newsDetection?.potentialClaims?.slice(0, 3) ?? [];
}

function formatCreatorScore(rating?: number | null) {
  if (typeof rating !== "number") {
    return null;
  }
   return clamp((rating / 10) * 100);
}

function VerifyPageContent() {
  const searchParams = useSearchParams();
  const linkParam = searchParams?.get("link");
  const lastLinkRef = useRef<string | null>(null);
  const [mockResult, setMockResult] = useState<{ success: boolean; data: ContentAnalysisData; isMock: boolean } | null>(null);
  const [inputUrl, setInputUrl] = useState("");

  const { analyzeContent, isLoading, result, isSaving, reset } = useContentAnalysis();

  useEffect(() => {
    if (linkParam && linkParam !== lastLinkRef.current) {
      lastLinkRef.current = linkParam;
      setInputUrl(linkParam);
      analyzeContent(linkParam, true);
    }
  }, [linkParam, analyzeContent]);

  const handleMockDemo = () => {
    const demoUrl = inputUrl.trim() || "https://x.com/madeinmumbai_/status/1941127480385106107";
    setMockResult({
      success: true,
      data: buildMockAnalysis(demoUrl),
      isMock: true,
    });
    toast.success("Mock Demo loaded! This shows how a real analysis looks.");
  };

  const handleReset = () => {
    setMockResult(null);
    reset();
    setInputUrl("");
  };

  const activeResult = mockResult || result;
  const analysis: ContentAnalysisData | null = activeResult?.success && activeResult.data ? activeResult.data : null;
  const isMockDemo = mockResult !== null;
  const confidenceScore = useMemo(
    () => getConfidenceScore(analysis?.factCheck),
    [analysis]
  );
  const confidenceBand = useMemo(
    () => getConfidenceBand(confidenceScore),
    [confidenceScore]
  );
  const verdictLabel = useMemo(
    () => deriveVerdict(analysis?.factCheck, analysis?.requiresFactCheck),
    [analysis]
  );
  const tags = useMemo(() => deriveTags(analysis, verdictLabel), [analysis, verdictLabel]);
  const subScores = useMemo(() => deriveSubScores(analysis, confidenceScore), [analysis, confidenceScore]);
  const historyStats = useMemo(() => getHistoryStats(analysis), [analysis]);
  const sources = useMemo(() => formatSources(analysis), [analysis]);
  const potentialClaims = useMemo(() => formatPotentialClaims(analysis), [analysis]);
  const creatorScore = useMemo(() => formatCreatorScore(analysis?.creatorCredibilityRating), [analysis]);

  const overallScore = useMemo(() => {
    if (confidenceScore === null && creatorScore == null) return null;
    if (confidenceScore !== null && creatorScore != null) {
      return clamp((confidenceScore + creatorScore) / 2);
    }
    return clamp(confidenceScore ?? creatorScore ?? 0);
  }, [confidenceScore, creatorScore]);

  const overallBand = useMemo(() => getConfidenceBand(overallScore), [overallScore]);

  const sentiment = useMemo(() => {
    const text = analysis?.transcription?.text || "";
    if (!text.trim()) return null;
    const score = calculateSentimentScore(text);
    const overall = determineOverallSentiment(score);
    const emotions = extractEmotions(text);
    const confidence = calculateSentimentConfidence(score);
    return { overall, emotions, scorePct: clamp(Math.round((score + 1) * 50)), confidencePct: clamp(Math.round(confidence * 100)) };
  }, [analysis]);

  const safeMode = confidenceScore !== null && confidenceScore < SAFE_MODE_THRESHOLD;

  const handleAnalyze = async (value: string, file?: File) => {
    if (file) {
      toast.info("Image verification is rolling out soon. Paste a link for now.");
      return;
    }

    const url = value.trim();
    if (!url) {
      toast.error("Paste a URL or handle to verify.");
      return;
    }

    setInputUrl(url);
    setMockResult(null);

    try {
      await analyzeContent(url, true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-8 pb-10">
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="border-primary/40 text-primary">
                Verify Content
              </Badge>
              {isSaving && (
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving analysis
                </span>
              )}
            </div>
            <CardTitle className="text-3xl font-semibold">
              Instant fact-checks with provenance trails
            </CardTitle>
            <CardDescription>
              Paste a social post, video, or web article link to run TinLens checks: transcription, sentiment, fact-check, creator profile, and share-ready verdicts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AIInputWithFile onSubmit={handleAnalyze} />
            
            {/* AI Credits Notice */}
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                    AI Semantic Analysis Temporarily Unavailable
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Our OpenAI credits are currently depleted. Real-time analysis will resume soon. 
                    In the meantime, try our <strong>Mock Demo</strong> below to see how TinLens works!
                  </p>
                </div>
              </div>
            </div>
            
            {/* Mock Demo Button */}
            <div className="flex justify-center">
              <Button
                variant="default"
                className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg"
                onClick={handleMockDemo}
              >
                <Wand2 className="h-4 w-4" />
                Try Mock Demo (Free!) - See How It Works
              </Button>
            </div>
            
            <p className="text-center text-sm text-muted-foreground">
              Click Mock Demo to see realistic fact-check scenarios (rotates through 5 different examples)
            </p>
            
            {isMockDemo && (
              <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-3 text-center">
                <p className="text-sm text-purple-400">
                  💡 The mock demo simulates the full analysis process with realistic data—perfect for testing without API costs!
                </p>
              </div>
            )}
            
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Supports reels, shorts, live URLs, and transcripts
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                Auto-extracts claims, sources, and creator memory
              </span>
              <Link href="/credits" className="text-primary underline-offset-4 hover:underline">
                Need more credits?
              </Link>
            </div>
          </CardContent>
        </Card>

        {isLoading && (
          <Card className="border-dashed border-primary/40 bg-primary/5">
            <CardContent className="py-10">
              <div className="flex flex-col items-center gap-3 text-center">
                <TextShimmerWave className="text-lg font-medium" duration={0.9}>
                  Running multi-network fact-check pipelines…
                </TextShimmerWave>
                <p className="text-xs text-muted-foreground">
                  Verifying creator history, crunching transcripts, querying fact-check corpora, and matching official advisories.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {!analysis && !isLoading && (!activeResult || !activeResult.success) && (
          <Card className="border-dashed border-muted-foreground/30">
            <CardContent className="py-10 text-center space-y-3">
              <Sparkles className="mx-auto h-8 w-8 text-primary" />
              <h3 className="text-lg font-semibold">No analysis yet</h3>
              <p className="text-sm text-muted-foreground">
                Drop a link above or try the Mock Demo to see how TinLens works.
              </p>
            </CardContent>
          </Card>
        )}

        {result && !result.success && result.error && !isMockDemo && (
          <Card className="border-red-500/30 bg-red-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-500">
                <AlertCircle className="h-5 w-5" />
                Verification failed
              </CardTitle>
              <CardDescription>{result.error}</CardDescription>
            </CardHeader>
          </Card>
        )}

        {analysis && activeResult?.success && (
          <div className="space-y-6">
            {/* Mock Demo Header */}
            {isMockDemo && (
              <Card className="border-purple-500/30 bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-transparent">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      <span className="flex items-center gap-2">
                        <Wand2 className="h-4 w-4 text-purple-500" />
                        <span className="font-medium">Mock Analysis Complete</span>
                      </span>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleReset}>
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <section className="grid gap-6 xl:grid-cols-3">
              <Card className="xl:col-span-2 border-primary/20">
                <CardHeader className="gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="secondary" className="text-xs">
                      Overall verdict
                    </Badge>
                    <Badge className={cn("text-xs", confidenceBand?.badgeClass)}>
                      {verdictLabel}
                    </Badge>
                    {isMockDemo && (
                      <Badge variant="outline" className="text-xs border-purple-500/50 text-purple-500">
                        Demo Mode
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl font-semibold">
                    {analysis.metadata.title || "Content analysis"}
                  </CardTitle>
                  <CardDescription>
                    {analysis.metadata.description?.slice(0, 180) || "Comprehensive breakdown including transcription, high-risk signals, creator memory, and corroborated sources."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-4">
                    <div>
                      <p className="text-xs uppercase text-muted-foreground">Confidence</p>
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold">
                          {confidenceScore !== null ? `${confidenceScore}%` : "--"}
                        </span>
                        {confidenceBand && (
                          <Badge className={cn("text-xs", confidenceBand.badgeClass)}>
                            {confidenceBand.label}
                          </Badge>
                        )}
                      </div>
                      <Progress value={confidenceScore ?? 0} className="mt-2 h-2" />
                    </div>
                    <div>
                      <p className="text-xs uppercase text-muted-foreground">Overall credibility</p>
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold">
                          {overallScore !== null ? `${overallScore}%` : "--"}
                        </span>
                        {overallBand && (
                          <Badge className={cn("text-xs", overallBand.badgeClass)}>
                            {overallBand.label}
                          </Badge>
                        )}
                      </div>
                      <Progress value={overallScore ?? 0} className="mt-2 h-2" />
                    </div>
                    <div>
                      <p className="text-xs uppercase text-muted-foreground">Source</p>
                      <p className="font-medium">{formatDomain(analysis.metadata.originalUrl)}</p>
                      <p className="text-xs text-muted-foreground">
                        {analysis.metadata.platform ?? "Multi-platform"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-muted-foreground">Creator</p>
                      <p className="font-medium">{analysis.metadata.creator || "Unknown creator"}</p>
                      <p className="text-xs text-muted-foreground">
                        Creator memory live-sync enabled
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 md:grid-cols-3">
                    {subScores.map((score) => (
                      <div key={score.label}>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{score.hint}</span>
                          <span>{score.value}%</span>
                        </div>
                        <Progress value={score.value} className="mt-2 h-1.5" />
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs uppercase text-muted-foreground">Conclusion and summary</p>
                      <div className="mt-2 rounded-lg border border-border/60 bg-muted/40 p-3 text-sm text-muted-foreground">
                        {analysis.factCheck?.explanation || analysis.factCheck?.content || "No analysis available."}
                      </div>
                    </div>

                    {sources.length > 0 && (
                      <div>
                        <p className="text-xs uppercase text-muted-foreground">Sources</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {sources.slice(0, 4).map((source) => (
                            <Badge key={source.url} variant="secondary" className="text-xs">
                              {formatDomain(source.url)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Verified:</span>
                      <Badge variant={analysis.factCheck?.isVerified ? "secondary" : "outline"} className="text-xs">
                        {analysis.factCheck?.isVerified ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag.label} variant="outline" className="text-xs">
                        <span className="text-muted-foreground mr-1">{tag.label}:</span>
                        {tag.value}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                {sentiment && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-sky-500" />
                        Sentiment & signals
                      </CardTitle>
                      <CardDescription>
                        Overall tone and emotional signals detected
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Overall</span>
                        <Badge variant="secondary" className="capitalize">{sentiment.overall}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Confidence</span>
                        <span className="font-medium">{sentiment.confidencePct}%</span>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Emotions</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {sentiment.emotions.map((e) => (
                            <Badge key={e} variant="outline" className="text-xs capitalize">{e}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {safeMode && (
                  <Card className="border-amber-500/40 bg-amber-500/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-amber-600">
                        <ShieldAlert className="h-5 w-5" />
                        Safe mode enabled
                      </CardTitle>
                      <CardDescription>
                        Low confidence or conflicting evidence detected. Use official advisories before publishing.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-amber-900/80">
                      <p>Confidence dipped below {SAFE_MODE_THRESHOLD}%. Download share cards marked as &ldquo;Caution&rdquo; only.</p>
                      <Button variant="outline" size="sm" className="w-full border-amber-500/60 text-amber-600">
                        View official resources
                      </Button>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Creator credibility
                    </CardTitle>
                    <CardDescription>
                      Historical reliability + community feedback
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-semibold">
                          {typeof analysis.creatorCredibilityRating === "number"
                            ? `${analysis.creatorCredibilityRating.toFixed(1)} / 10`
                            : "--"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          TinLens memory index
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {formatDomain(analysis.metadata.originalUrl)}
                      </Badge>
                    </div>
                    <Progress value={creatorScore ?? 0} className="h-2" />
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-center gap-2 text-sm"
                    >
                      <Link href={`/creator/${encodeURIComponent(analysis.metadata.creator || "unknown")}?platform=${encodeURIComponent(analysis.metadata.platform ?? "web")}`}>
                        View creator profile
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="h-5 w-5 text-purple-500" />
                      Context check
                    </CardTitle>
                    <CardDescription>
                      Recycled clips & similarity matches
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Recycled content</span>
                      <Badge variant={analysis.newsDetection?.needsFactCheck ? "destructive" : "secondary"}>
                        {analysis.newsDetection?.needsFactCheck ? "Flagged" : "Not detected"}
                      </Badge>
                    </div>
                    {potentialClaims.length > 0 ? (
                      <div className="space-y-2">
                        {potentialClaims.map((claim) => (
                          <p key={claim} className="text-muted-foreground text-xs">
                            • {claim}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        No recycled segments matched in the last 30 days.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <Card className="border-border/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    Claim breakdown
                  </CardTitle>
                  <CardDescription>
                    Each extracted claim with verdict, confidence, and sources
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysis.factCheck?.results?.length ? (
                    analysis.factCheck.results.slice(0, 4).map((claim, index) => (
                      <div key={index} className="rounded-lg border border-border/60 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {claim.status || "Needs review"}
                          </Badge>
                          {typeof claim.confidence === "number" && (
                            <span className="text-sm font-semibold">
                              {claim.confidence}%
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {claim.claim || "Claim text unavailable"}
                        </p>
                        {claim.sources && claim.sources.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {claim.sources.slice(0, 2).map((source) => (
                              <Badge key={source.url} variant="secondary" className="text-xs">
                                {formatDomain(source.url || source.source)}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No explicit claims detected in this analysis.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Transcript snapshot
                  </CardTitle>
                  <CardDescription>
                    Full transcription stored with timestamps and language metadata
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[280px] overflow-y-auto rounded-xl border border-border/60 bg-muted/40 p-4 text-sm text-muted-foreground">
                    {analysis.transcription?.text || "Transcript unavailable for this item."}
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Credible sources
                  </CardTitle>
                  <CardDescription>
                    Citations powering this verdict
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sources.length ? (
                    sources.map((source) => (
                      <div key={source.url} className="rounded-lg border border-border/60 px-3 py-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Badge variant={source.verified ? "secondary" : "outline"} className="text-xs">
                            {source.verified ? "Verified" : "Supporting"}
                          </Badge>
                          <span className="font-medium">{source.title}</span>
                        </div>
                        <Link
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary flex items-center gap-1 mt-1"
                        >
                          {formatDomain(source.url)}
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No external sources provided.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-sky-500" />
                    Memory + history
                  </CardTitle>
                  <CardDescription>
                    Past credibility snapshots for this topic
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {historyStats.map((stat) => (
                      <div key={stat.label} className="rounded-lg border border-border/60 px-3 py-2">
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                        <p className={cn("text-xl font-semibold", stat.color)}>
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    TinLens retains 180 days of creator activity and verified claims to spot repeat misinformation.
                  </p>
                </CardContent>
              </Card>
            </section>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
            <p className="text-muted-foreground">Loading verification...</p>
          </div>
        </div>
      }
    >
      <VerifyPageContent />
    </Suspense>
  );
}
