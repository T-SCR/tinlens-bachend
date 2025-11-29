import { useState } from "react";
import {
  useSaveTikTokAnalysis,
  useSaveTikTokAnalysisWithCredibility,
} from "./use-saved-analyses";
import { useConvexAuth, useQuery } from "convex/react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import type { ContentAnalysisData } from "@/types/analysis";
import { buildMockAnalysis } from "@/lib/mock-analysis";

const MOCK_ANALYSIS_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_MOCK_ANALYSIS === "true";

interface ContentAnalysisResult {
  success: boolean;
  data?: ContentAnalysisData;
  error?: string;
  isMock?: boolean;
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
      // Auth state is still initializing on the client, but the API will
      // validate the session via cookies. Continue instead of failing early.
      toast.info("Checking your account… starting analysis");
    }

    if (!isAuthenticated) {
      if (MOCK_ANALYSIS_ENABLED) {
        const mockResult: ContentAnalysisResult = {
          success: true,
          data: buildMockAnalysis(url),
          isMock: true,
        };
        setResult(mockResult);
        setIsLoading(false);
        toast.info("Showing TinLens demo analysis. Sign in to run full verifications.");
        return mockResult;
      }

      const message = "Please sign in to verify content with TinLens.";
      toast.error(message);
      return failEarly(message);
    }

    if (userCredits === undefined) {
      toast.info("Syncing your credits. Please wait...");
    }

    const hasUnlimitedCredits = userCredits
      ? userCredits.hasUnlimitedCredits || userCredits.credits === -1
      : true;

    if (
      userCredits &&
      !hasUnlimitedCredits &&
      userCredits.credits < 1
    ) {
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
      const twitterUrlPattern =
        /^https?:\/\/(www\.)?(twitter\.com|x\.com)\//;
      const tiktokUrlPattern =
        /^https?:\/\/(www\.)?tiktok\.com\//;

      const isInstagram = instagramUrlPattern.test(url);
      const isYouTube = youtubeUrlPattern.test(url);
      const isTwitter = twitterUrlPattern.test(url);
      const isTikTok = tiktokUrlPattern.test(url);

      const requestBody: {
        instagramUrl?: string;
        youtubeUrl?: string;
        twitterUrl?: string;
        tiktokUrl?: string;
        webUrl?: string;
        contentUrl?: string;
        contentText?: string;
      } = {};

      if (isInstagram) {
        requestBody.instagramUrl = url;
      } else if (isYouTube) {
        requestBody.youtubeUrl = url;
      } else if (isTwitter) {
        requestBody.twitterUrl = url;
      } else if (isTikTok) {
        requestBody.tiktokUrl = url;
      } else if (/^https?:\/\//.test(url)) {
        requestBody.webUrl = url;
      } else {
        // Plain text ingestion
        requestBody.contentText = url;
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
            `Failed to analyze ${
              isInstagram
                ? "Instagram"
                : isYouTube
                ? "YouTube"
                : isTwitter
                ? "Twitter/X"
                : isTikTok
                ? "TikTok"
                : "web"
            } content`
        );
      }

      const analysis: ContentAnalysisResult = await response.json();

      if (
        saveToDb &&
        isAuthenticated &&
        analysis.success &&
        analysis.data &&
        !analysis.isMock
      ) {
        try {
          setIsSaving(true);

          const normalizedCredibility =
            typeof analysis.data.creatorCredibilityRating === "number"
              ? analysis.data.creatorCredibilityRating
              : undefined;

          // Sanitize metadata to only fields accepted by Convex validator
          const sanitizedMetadata = {
            title: analysis.data.metadata.title,
            description: analysis.data.metadata.description,
            creator: analysis.data.metadata.creator,
            originalUrl: analysis.data.metadata.originalUrl,
            platform: analysis.data.metadata.platform,
            contentType: analysis.data.metadata.contentType,
          } as const;

          if (normalizedCredibility !== undefined) {
            await saveAnalysisWithCredibility({
              videoUrl: analysis.data.metadata.originalUrl,
              transcription: {
                text: analysis.data.transcription.text,
                duration: undefined,
                language: analysis.data.transcription.language,
              },
              metadata: sanitizedMetadata,
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
              creatorCredibilityRating: normalizedCredibility,
            });
          } else {
            await saveAnalysis({
              videoUrl: analysis.data.metadata.originalUrl,
              transcription: {
                text: analysis.data.transcription.text,
                duration: undefined,
                language: analysis.data.transcription.language,
              },
              metadata: sanitizedMetadata,
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
      if (MOCK_ANALYSIS_ENABLED) {
        const mockResult: ContentAnalysisResult = {
          success: true,
          data: buildMockAnalysis(url),
          isMock: true,
        };
        setResult(mockResult);
        toast.info("AI API unavailable. Displaying mock analysis instead.");
        return mockResult;
      }

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
