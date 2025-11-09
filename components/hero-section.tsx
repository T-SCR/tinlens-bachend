"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShinyButton } from "@/components/ui/shiny-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PlayIcon,
  LoaderIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ShieldCheckIcon,
  ExternalLinkIcon,
  AlertTriangleIcon,
  XCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BookmarkIcon,
  Megaphone,
} from "lucide-react";
import { useContentAnalysis } from "@/lib/hooks/use-content-analysis";
import { useSaveTikTokAnalysisWithCredibility } from "@/lib/hooks/use-saved-analyses";
import { useConvexAuth } from "convex/react";
import { toast } from "sonner";
import { AnalysisRenderer } from "@/components/analysis-renderer";
import { useLanguage } from "@/components/language-provider";
import Link from "next/link";
import { TextRotate } from "@/components/ui/text-rotate";
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";

interface HeroSectionProps {
  initialUrl?: string;
}

interface FactCheckResult {
  verdict: string;
  confidence: number;
  explanation: string;
  sources: Array<{
    title: string;
    url: string;
    source: string;
    relevance?: number;
  }>;
  content: string;
  isVerified: boolean;
  error?: string;
}

export function HeroSection({ initialUrl = "" }: HeroSectionProps) {
  const [url, setUrl] = useState(initialUrl);
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { analyzeContent, isLoading, result, reset } = useContentAnalysis();
  const { isAuthenticated } = useConvexAuth();
  const saveTikTokAnalysisWithCredibility =
    useSaveTikTokAnalysisWithCredibility();
  const router = useRouter();
  const { t } = useLanguage();

  const getPlatformLabel = (platform?: string) => {
    switch (platform) {
      case "instagram":
        return "Instagram";
      case "youtube":
        return "YouTube";
      case "web":
        return "Web";
      default:
        return platform
          ? platform.charAt(0).toUpperCase() + platform.slice(1)
          : "Web";
    }
  };

  const getContentTypeLabel = (platform?: string) =>
    !platform || platform === "web" ? "Article / Web" : "Video Content";

  useEffect(() => {
    setUrl(initialUrl);
  }, [initialUrl]);

  useEffect(() => {
    if (result) {
      if (result.success) {
        toast.success(t.analysisComplete);
      } else if (result.error) {
        toast.error(result.error);
      }
    }
  }, [result, t]);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      toast.error(t.enterUrl);
      return;
    }

    // Update URL with query parameter
    const params = new URLSearchParams();
    params.set("link", url.trim());
    router.replace(`?${params.toString()}`);

    toast.info(t.analysisStarted);
    await analyzeContent(url.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleAnalyze();
  };

  const handleReset = () => {
    setUrl("");
    setIsAnalysisExpanded(false);
    setIsSaved(false);
    reset();
  };

  const handleSaveAnalysis = async () => {
    if (!result?.success || !result.data || !isAuthenticated) {
      toast.error(t.cannotSave);
      return;
    }

    // Check if already saved by the automatic save in the analysis hook
    // This prevents duplicate saves
    if (isSaved) {
      toast.info(t.alreadySaved);
      return;
    }

    setIsSaving(true);
    try {
      // Prepare the data for saving, mapping to schema format
      const saveData = {
        videoUrl: result.data.metadata.originalUrl,
        transcription: result.data.transcription
          ? {
              text: result.data.transcription.text,
              language: result.data.transcription.language,
              // Note: duration not available from API yet, will be undefined
            }
          : undefined,
        metadata: result.data.metadata
          ? {
              title: result.data.metadata.title,
              description: result.data.metadata.description,
              creator: result.data.metadata.creator,
              originalUrl: result.data.metadata.originalUrl,
              platform: result.data.metadata.platform,
            }
          : undefined,
        newsDetection: result.data.newsDetection
          ? {
              hasNewsContent: result.data.newsDetection.hasNewsContent,
              confidence: result.data.newsDetection.confidence,
              newsKeywordsFound: result.data.newsDetection.newsKeywordsFound,
              potentialClaims: result.data.newsDetection.potentialClaims,
              needsFactCheck: result.data.newsDetection.needsFactCheck,
              contentType: result.data.newsDetection.contentType,
            }
          : undefined,
        factCheck: result.data.factCheck
          ? {
              // Map from FactCheckResult to schema format
              verdict: (result.data.factCheck as unknown as FactCheckResult)
                .verdict,
              confidence: (result.data.factCheck as unknown as FactCheckResult)
                .confidence,
              explanation: (result.data.factCheck as unknown as FactCheckResult)
                .explanation,
              content: (result.data.factCheck as unknown as FactCheckResult)
                .content,
              isVerified: (result.data.factCheck as unknown as FactCheckResult)
                .isVerified,
              sources: (
                result.data.factCheck as unknown as FactCheckResult
              ).sources?.map((source) => ({
                title: source.title,
                url: source.url,
                source: source.source,
                relevance: source.relevance,
              })),
              error: (result.data.factCheck as unknown as FactCheckResult)
                .error,
            }
          : undefined,
        requiresFactCheck: result.data.requiresFactCheck,
        // Use creator credibility rating if available, or default to neutral rating
        creatorCredibilityRating: result.data.creatorCredibilityRating || 5.0,
      };

      // Use enhanced save function to properly handle content creators
      await saveTikTokAnalysisWithCredibility(saveData);

      setIsSaved(true);
      toast.success(t.analysisSaved);
    } catch (error) {
      console.error("Failed to save analysis:", error);
      toast.error(t.failedToSave);
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "true":
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case "false":
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
      case "misleading":
        return <AlertTriangleIcon className="h-4 w-4 text-yellow-500" />;
      case "unverifiable":
        return <AlertCircleIcon className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircleIcon className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "true":
        return (
          <Badge className="bg-green-100 text-green-800">Verified True</Badge>
        );
      case "false":
        return <Badge className="bg-red-100 text-red-800">False</Badge>;
      case "misleading":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Misleading</Badge>
        );
      case "unverifiable":
        return (
          <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            Unverifiable
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            Needs Verification
          </Badge>
        );
    }
  };

  return (
    <section className="relative w-full min-h-screen py-24 px-4 overflow-hidden">
      {/* Animated Background */}
      <AnimatedGradientBackground
        startingGap={120}
        Breathing={true}
        gradientColors={[
          "#0A0A0A",
          "#2E8FFF",
          "#00C2FF",
          "#2E8FFF",
          "#0A0A0A"
        ]}
        gradientStops={[0, 40, 50, 60, 100]}
        breathingRange={8}
        animationSpeed={0.015}
        topOffset={20}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">
            AI-Powered Fact Checking
          </Badge>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-sm text-primary">
            <Megaphone className="h-4 w-4" />
            <span>Launch promo: all new signups unlock TinLens Pro (unlimited) for free.</span>
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl flex flex-wrap items-center justify-center gap-4">
            <span>Detect</span>
            <TextRotate
              texts={["Misinformation", "Fake News", "Deepfakes", "Propaganda"]}
              mainClassName="text-primary inline-flex"
              rotationInterval={2500}
              staggerDuration={0.025}
              staggerFrom="last"
            />
            <span>with AI</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            {t.heroSubtitle}
          </p>
          <div className="mx-auto max-w-2xl space-y-4">
          <div className="flex gap-3 items-center justify-center">
            <Input
              placeholder={t.urlPlaceholder}
              className="flex-1 h-12 text-base min-w-0"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter' && !isLoading && url.trim()) {
                  e.preventDefault();
                  const fakeEvent = new Event('submit') as unknown as React.FormEvent<HTMLFormElement>;
                  handleSubmit(fakeEvent);
                }
              }}
            />
            <ShinyButton
              onClick={() => {
                const fakeEvent = new Event('submit') as unknown as React.FormEvent<HTMLFormElement>;
                handleSubmit(fakeEvent);
              }}
              className="px-6 h-12 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <LoaderIcon className="h-4 w-4 mr-2 animate-spin inline-block" />
                  {t.analyzing}
                </>
              ) : (
                <>
                  <PlayIcon className="h-4 w-4 mr-2 inline-block" />
                  {t.analyzeButton}
                </>
              )}
            </ShinyButton>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Use any live Instagram Reel, YouTube video, or public article link. TinLens runs the full verification—no demo or synthetic responses.
          </p>
        </div>
        {/* Results */}
        {(result) && (
          <div className="mx-auto max-w-4xl mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {result?.success ? t.analysisComplete : "Analysis Failed"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(result?.success && result.data) ? (
                  (() => {
                    // Determine which data source to use
                    const currentData = result.data;
                    if (!currentData) return null;

                    return (
                      <div className="space-y-6 text-left">
                        {/* Video Metadata */}
                        <div className="border-b pb-4">
                          <h3 className="font-semibold text-lg mb-2">
                            {currentData.metadata.title}
                          </h3>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Creator: {currentData.metadata.creator}</p>
                            <p>
                              Platform:{" "}
                              {currentData.metadata.platform || "Unknown"}
                            </p>
                            <p>
                              Original URL: {currentData.metadata.originalUrl}
                            </p>
                            {currentData.metadata.description &&
                              currentData.metadata.description !==
                                currentData.metadata.title && (
                                <p>
                                  Description:{" "}
                                  {currentData.metadata.description}
                                </p>
                              )}
                          </div>
                        </div>

                        {/* Transcription */}
                        {currentData.transcription &&
                          currentData.transcription.text &&
                          currentData.transcription.text.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="font-medium flex items-center gap-2">
                                <ShieldCheckIcon className="h-4 w-4" />
                                Transcription
                              </h4>
                              <div className="p-4 bg-muted rounded-lg">
                                <div className="text-sm leading-relaxed">
                                  <AnalysisRenderer
                                    content={currentData.transcription.text}
                                  />
                                </div>
                                {currentData.transcription.language && (
                                  <p className="text-xs text-muted-foreground mt-3">
                                    Language:{" "}
                                    {currentData.transcription.language}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                        {/* Platform Analysis */}
                        <div className="space-y-3">
                          <h4 className="font-medium flex items-center gap-2">
                            <AlertCircleIcon className="h-4 w-4" />
                            Platform Analysis
                          </h4>
                          <div className="p-4 bg-muted rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Source Platform:</span>
                              <Badge variant="secondary">
                                {getPlatformLabel(currentData.metadata.platform)}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Content Type:</span>
                              <Badge variant="outline">
                                {getContentTypeLabel(
                                  currentData.metadata.platform
                                )}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">
                                Fact-Check Required:
                              </span>
                              <Badge
                                variant={
                                  currentData.requiresFactCheck
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {currentData.requiresFactCheck ? "Yes" : "No"}
                              </Badge>
                            </div>
                            {currentData.factCheck && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm">
                                  Verification Status:
                                </span>
                                <Badge
                                  variant={
                                    (
                                      currentData.factCheck as unknown as FactCheckResult
                                    ).isVerified
                                      ? "default"
                                      : "outline"
                                  }
                                >
                                  {(
                                    currentData.factCheck as unknown as FactCheckResult
                                  ).isVerified
                                    ? "Verified"
                                    : "Pending"}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* News Detection */}
                        {currentData.newsDetection && (
                          <div className="space-y-3">
                            <h4 className="font-medium flex items-center gap-2">
                              <AlertCircleIcon className="h-4 w-4" />
                              Content Analysis
                            </h4>
                            <div className="p-4 bg-muted rounded-lg space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Content Type:</span>
                                <Badge
                                  variant={
                                    currentData.newsDetection.contentType ===
                                    "news_factual"
                                      ? "destructive"
                                      : "secondary"
                                  }
                                >
                                  {currentData.newsDetection.contentType ===
                                  "news_factual"
                                    ? "News/Factual"
                                    : "Entertainment"}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">
                                  Requires Fact-Check:
                                </span>
                                <Badge
                                  variant={
                                    currentData.requiresFactCheck
                                      ? "destructive"
                                      : "secondary"
                                  }
                                >
                                  {currentData.requiresFactCheck ? "Yes" : "No"}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Confidence:</span>
                                <span className="text-sm font-medium">
                                  {Math.round(
                                    currentData.newsDetection.confidence * 100
                                  )}
                                  %
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Fact-Check Results */}
                        {currentData.factCheck && (
                          <div className="space-y-4">
                            <h4 className="font-medium flex items-center gap-2">
                              <ShieldCheckIcon className="h-4 w-4" />
                              Fact-Check Results
                            </h4>

                            {/* Overall Verification Status */}
                            <Card
                              className={`border-l-4 ${
                                (
                                  currentData.factCheck as unknown as FactCheckResult
                                ).verdict === "true"
                                  ? "border-l-green-500"
                                  : (
                                        currentData.factCheck as unknown as FactCheckResult
                                      ).verdict === "false"
                                    ? "border-l-red-500"
                                    : (
                                          currentData.factCheck as unknown as FactCheckResult
                                        ).verdict === "misleading"
                                      ? "border-l-yellow-500"
                                      : "border-l-gray-500"
                              }`}
                            >
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                      <h5 className="font-medium text-sm mb-2">
                                        Overall Verification Status
                                      </h5>
                                      <div className="text-sm text-muted-foreground">
                                        {(
                                          currentData.factCheck as unknown as FactCheckResult
                                        ).content && (
                                          <AnalysisRenderer
                                            content={
                                              (
                                                currentData.factCheck as unknown as FactCheckResult
                                              ).content
                                            }
                                          />
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                      {getStatusIcon(
                                        (
                                          currentData.factCheck as unknown as FactCheckResult
                                        ).verdict
                                      )}
                                      {getStatusBadge(
                                        (
                                          currentData.factCheck as unknown as FactCheckResult
                                        ).verdict
                                      )}
                                    </div>
                                  </div>

                                  {(
                                    currentData.factCheck as unknown as FactCheckResult
                                  ).explanation && (
                                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                                      <p className="font-medium mb-3 text-base">
                                        Analysis:
                                      </p>
                                      <div>
                                        {(() => {
                                          const explanation = (
                                            currentData.factCheck as unknown as FactCheckResult
                                          ).explanation;
                                          const shouldTruncate =
                                            explanation.length > 500;

                                          const contentToShow =
                                            shouldTruncate &&
                                            !isAnalysisExpanded
                                              ? explanation.substring(0, 500) +
                                                "..."
                                              : explanation;

                                          return (
                                            <AnalysisRenderer
                                              content={contentToShow}
                                            />
                                          );
                                        })()}
                                      </div>
                                      {(() => {
                                        const explanation = (
                                          currentData.factCheck as unknown as FactCheckResult
                                        ).explanation;

                                        if (explanation.length <= 500)
                                          return null;

                                        return (
                                          <button
                                            onClick={() =>
                                              setIsAnalysisExpanded(
                                                !isAnalysisExpanded
                                              )
                                            }
                                            className="mt-4 text-primary hover:text-primary/80 font-medium transition-colors text-sm flex items-center gap-1"
                                          >
                                            {isAnalysisExpanded ? (
                                              <>
                                                <ChevronUpIcon className="h-4 w-4" />
                                                Show less
                                              </>
                                            ) : (
                                              <>
                                                <ChevronDownIcon className="h-4 w-4" />
                                                Show more
                                              </>
                                            )}
                                          </button>
                                        );
                                      })()}
                                    </div>
                                  )}

                                  {(
                                    currentData.factCheck as unknown as FactCheckResult
                                  ).sources &&
                                    (
                                      currentData.factCheck as unknown as FactCheckResult
                                    ).sources.length > 0 && (
                                      <div>
                                        <p className="text-xs font-medium mb-2">
                                          Sources (
                                          {
                                            (
                                              currentData.factCheck as unknown as FactCheckResult
                                            ).sources.length
                                          }{" "}
                                          found):
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                          {(
                                            currentData.factCheck as unknown as FactCheckResult
                                          ).sources
                                            .slice(0, 5)
                                            .map((source, sourceIndex) => (
                                              <Button
                                                key={sourceIndex}
                                                size="sm"
                                                variant="outline"
                                                asChild
                                              >
                                                <a
                                                  href={source.url}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="text-xs"
                                                >
                                                  {source.source}
                                                  <ExternalLinkIcon className="h-3 w-3 ml-1" />
                                                </a>
                                              </Button>
                                            ))}
                                        </div>
                                      </div>
                                    )}

                                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>
                                      Confidence:{" "}
                                      {
                                        (
                                          currentData.factCheck as unknown as FactCheckResult
                                        ).confidence
                                      }
                                      %
                                    </span>
                                    <span>
                                      Verified:{" "}
                                      {(
                                        currentData.factCheck as unknown as FactCheckResult
                                      ).isVerified
                                        ? "Yes"
                                        : "No"}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="pt-4 border-t">
                          <div className="flex gap-3 flex-wrap">
                            {/* Save Button - Only show for authenticated users */}
                            {isAuthenticated && (
                              <Button
                                onClick={handleSaveAnalysis}
                                disabled={isSaving || isSaved}
                                className="flex items-center gap-2"
                              >
                                {isSaving ? (
                                  <LoaderIcon className="h-4 w-4 animate-spin" />
                                ) : (
                                  <BookmarkIcon className="h-4 w-4" />
                                )}
                                {isSaved
                                  ? t.saved
                                  : isSaving
                                    ? t.saving
                                    : t.saveAnalysis}
                              </Button>
                            )}

                            <Button variant="outline" onClick={handleReset}>
                              {t.reset}
                            </Button>
                          </div>

                          {/* Login prompt for non-authenticated users */}
                          {!isAuthenticated && (
                            <p className="text-sm text-muted-foreground mt-2">
                              <Link
                                href="/sign-in"
                                className="text-primary hover:underline"
                              >
                                Sign in
                              </Link>{" "}
                              to save your analysis results
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="text-left">
                    <p className="text-red-500 mb-4">{result?.error}</p>
                    <Button variant="outline" onClick={handleReset}>
                      {t.tryAgain}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      </div>
    </section>
  );
}

export default HeroSection;

