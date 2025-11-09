import { useState } from "react";
import {
  useSaveTikTokAnalysis,
  useSaveTikTokAnalysisWithCredibility,
} from "./use-saved-analyses";
import { useConvexAuth, useQuery } from "convex/react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";

interface TranscriptionData {
  text: string;
  segments: Array<{
    text: string;
    startSecond: number;
    endSecond: number;
  }>;
  language?: string;
}

interface NewsDetection {
  hasNewsContent: boolean;
  confidence: number;
  newsKeywordsFound: string[];
  potentialClaims: string[];
  needsFactCheck: boolean;
  contentType: string;
}

interface FactCheckSource {
  title: string;
  url: string;
  source: string;
  relevance: number;
  description?: string;
}

interface FactCheckResult {
  claim: string;
  status: string;
  confidence: number;
  analysis?: string;
  sources?: FactCheckSource[];
  error?: string;
}

interface FactCheckData {
  totalClaims: number;
  checkedClaims: number;
  results: FactCheckResult[];
  summary: {
    verifiedTrue: number;
    verifiedFalse: number;
    misleading: number;
    unverifiable: number;
    needsVerification: number;
  };
  sources?: FactCheckSource[];
}

interface ContentAnalysisData {
  transcription: TranscriptionData;
  metadata: {
    title: string;
    description: string;
    creator: string;
    originalUrl: string;
    platform?: string;
  };
  newsDetection: NewsDetection | null;
  factCheck: FactCheckData | null;
  requiresFactCheck: boolean;
  creatorCredibilityRating?: number;
}

interface ContentAnalysisResult {
  success: boolean;
  data?: ContentAnalysisData;
  error?: string;
}

export function useContentAnalysis() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const userCredits = useQuery(
    api.credits.getUserCredits,
    isAuthenticated ? {} : undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ContentAnalysisResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const saveAnalysis = useSaveTikTokAnalysis();
  const saveAnalysisWithCredibility = useSaveTikTokAnalysisWithCredibility();

  const analyzeContent = async (
    url: string,
    saveToDb = false
  ): Promise<ContentAnalysisResult> => {
    setIsLoading(true);
    setResult(null);

    const failEarly = (message: string) => {
      const errorResult = { success: false, error: message };
      setResult(errorResult);
      setIsLoading(false);
      return errorResult;
    };

    if (authLoading) {
      const message = "Checking your account. Please try again.";
      toast.info(message);
      return failEarly(message);
    }

    if (!isAuthenticated) {
      const message = "Please sign in to verify content with TinLens.";
      toast.error(message);
      return failEarly(message);
    }

    if (userCredits === undefined) {
      const message = "Syncing your credits. Try again in a moment.";
      toast.info(message);
      return failEarly(message);
    }

    const hasUnlimitedCredits =
      userCredits.hasUnlimitedCredits || userCredits.credits === -1;

    if (!hasUnlimitedCredits && userCredits.credits < 1) {
      const message =
        "You are out of credits. Purchase more to continue verifying.";
      toast.error(message);
      return failEarly(message);
    }

    try {
      try {
        new URL(url);
      } catch {
        throw new Error("Invalid URL format. Please provide a valid URL.");
      }

      const instagramUrlPattern =
        /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\//;
      const youtubeUrlPattern =
        /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//;

      const isInstagram = instagramUrlPattern.test(url);
      const isYouTube = youtubeUrlPattern.test(url);

      const requestBody: {
        instagramUrl?: string;
        youtubeUrl?: string;
        webUrl?: string;
        contentUrl?: string;
      } = {};

      if (isInstagram) {
        requestBody.instagramUrl = url;
      } else if (isYouTube) {
        requestBody.youtubeUrl = url;
      } else if (/^https?:\/\//.test(url)) {
        requestBody.webUrl = url;
      } else {
        requestBody.contentUrl = url;
      }

      const response = await fetch("/api/transcribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message ||
            `Failed to analyze ${isInstagram ? "Instagram" : isYouTube ? "YouTube" : "web"} content`
        );
      }

      const analysis: ContentAnalysisResult = await response.json();

      if (
        saveToDb &&
        isAuthenticated &&
        analysis.success &&
        analysis.data
      ) {
        try {
          setIsSaving(true);

          if (analysis.data.creatorCredibilityRating !== undefined) {
            await saveAnalysisWithCredibility({
              videoUrl: analysis.data.metadata.originalUrl,
              transcription: {
                text: analysis.data.transcription.text,
                duration: undefined,
                language: analysis.data.transcription.language,
              },
              metadata: analysis.data.metadata,
              newsDetection: analysis.data.newsDetection || undefined,
              factCheck: analysis.data.factCheck
                ? {
                    ...analysis.data.factCheck,
                    sources: analysis.data.factCheck.sources?.map((s) => ({
                      title: s.title,
                      url: s.url,
                      source: s.source,
                      relevance: s.relevance,
                    })),
                    results: (analysis.data.factCheck.results || []).map(
                      (item) => ({
                        claim: item.claim,
                        status: item.status,
                        confidence: item.confidence,
                        analysis: item.analysis,
                        sources: item.sources?.map((source) => source.url) || [],
                        error: item.error,
                      })
                    ),
                  }
                : undefined,
              requiresFactCheck: analysis.data.requiresFactCheck,
              creatorCredibilityRating: analysis.data.creatorCredibilityRating,
            });
          } else {
            await saveAnalysis({
              videoUrl: analysis.data.metadata.originalUrl,
              transcription: {
                text: analysis.data.transcription.text,
                duration: undefined,
                language: analysis.data.transcription.language,
              },
              metadata: analysis.data.metadata,
              newsDetection: analysis.data.newsDetection || undefined,
              factCheck: analysis.data.factCheck
                ? {
                    ...analysis.data.factCheck,
                    sources: analysis.data.factCheck.sources?.map((s) => ({
                      title: s.title,
                      url: s.url,
                      source: s.source,
                      relevance: s.relevance,
                    })),
                    results: (analysis.data.factCheck.results || []).map(
                      (item) => ({
                        claim: item.claim,
                        status: item.status,
                        confidence: item.confidence,
                        analysis: item.analysis,
                        sources: item.sources?.map((source) => source.url) || [],
                        error: item.error,
                      })
                    ),
                  }
                : undefined,
              requiresFactCheck: analysis.data.requiresFactCheck,
            });
          }
        } catch (saveError) {
          console.error("Failed to save analysis to database:", saveError);
        } finally {
          setIsSaving(false);
        }
      }

      setResult(analysis);
      return analysis;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return failEarly(message);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setIsLoading(false);
  };

  return {
    analyzeContent,
    isLoading,
    isSaving,
    result,
    reset,
  };
}
