import TikTokAPI from "@tobyg74/tiktok-api-dl";
import type { TiktokAPIResponse } from "@tobyg74/tiktok-api-dl/lib/types/downloader/tiktokApiDownloader";

import {
  BaseHandler,
  ExtractedContent,
  FactCheckResult,
  NewsDetectionResult,
  ProcessingContext,
  TranscriptionResult,
} from "./base-handler";
import { logger } from "../../../../lib/logger";
import { isStrictRealMode } from "../../../../lib/config";
import { ApiError } from "../../../../lib/api-error";
import { transcribeVideoDirectly } from "../../../../tools/helpers";
import {
  detectNewsContent,
  researchAndFactCheck,
} from "../../../../tools/fact-checking";
import { calculateCreatorCredibilityRating } from "../../../../tools/content-analysis";

interface TikTokStatistics {
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
}

interface TikTokExtractedContent extends ExtractedContent {
  videoDownloadUrl?: string;
  thumbnailUrl?: string;
  hashtags?: string[];
  stats?: TikTokStatistics;
  caption?: string;
  type: "video";
}

type FactCheckToolResponse = {
  overallStatus?: FactCheckResult["verdict"];
  confidence?: number;
  reasoning?: string;
  sources?: Array<{
    title: string;
    url: string;
    source?: string;
    relevance?: number;
  }>;
  webSearchAnalysis?: { summary?: string };
};

const parseCount = (value?: string | number | null): number | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }
  const normalized = Number(value.replace(/,/g, ""));
  return Number.isFinite(normalized) ? normalized : undefined;
};

type WhisperSegment = {
  start?: number;
  end?: number;
  startSecond?: number;
  endSecond?: number;
  text?: string;
};

export class TikTokHandler extends BaseHandler {
  constructor() {
    super("tiktok");
  }

  private getDefaultTitle(url: string, fallback: string) {
    try {
      return new URL(url).hostname || fallback;
    } catch {
      return fallback;
    }
  }

  private buildFallbackContent(url: string): TikTokExtractedContent {
    return {
      title: this.getDefaultTitle(url, "TikTok Content"),
      description: url,
      creator: "Unknown",
      content: "",
      caption: "",
      metadata: { url },
      type: "video",
    };
  }

  private buildFallbackFactCheck(text: string): FactCheckResult {
    const snippet =
      text.substring(0, 500) + (text.length > 500 ? "..." : "");
    return {
      verdict: "unverified",
      confidence: 0,
      explanation:
        "Automated fact-checking is temporarily unavailable. Please retry later or verify manually.",
      content: snippet || "No transcription available.",
      sources: [],
      flags: ["fact_check_unavailable"],
    };
  }

  protected async extractContent(
    url: string,
    context: ProcessingContext
  ): Promise<ExtractedContent | null> {
    logger.debug("Extracting TikTok metadata", {
      requestId: context.requestId,
      platform: this.platform,
      operation: "extract-content",
      metadata: { url },
    });

    try {
      const response = (await TikTokAPI.Downloader(url, {
        version: "v1",
      })) as TiktokAPIResponse;

      if (response.status !== "success" || !response.result) {
        logger.warn("TikTok API returned empty result", {
          requestId: context.requestId,
          platform: this.platform,
          operation: "extract-content",
          metadata: { url, status: response.status, message: response.message },
        });
        if (isStrictRealMode) {
          throw ApiError.webScrapeFailed(url, new Error(response.message || "empty result"));
        }
        return this.buildFallbackContent(url);
      }

      const item = response.result;
      const downloadUrl =
        item.video?.downloadAddr?.[0] ||
        item.video?.playAddr?.[0] ||
        item.videoHD ||
        item.videoSD ||
        item.direct;

      const extracted: TikTokExtractedContent = {
        title: item.desc || `TikTok Video ${item.id || ""}`.trim(),
        description: item.desc || "",
        creator:
          item.author?.nickname ||
          item.author?.signature ||
          item.author?.region ||
          "Unknown Creator",
        videoUrl: downloadUrl,
        videoDownloadUrl: downloadUrl,
        thumbnailUrl: item.video?.cover?.[0] || item.video?.originCover?.[0],
        duration: item.video?.duration,
        viewCount: parseCount(item.statistics?.playCount),
        likeCount: parseCount(item.statistics?.likeCount),
        shareCount: parseCount(item.statistics?.shareCount),
        publishedAt: item.createTime
          ? new Date(item.createTime * 1000).toISOString()
          : undefined,
        hashtags: item.hashtag?.filter(Boolean) as string[] | undefined,
        caption: item.desc,
        stats: {
          views: parseCount(item.statistics?.playCount),
          likes: parseCount(item.statistics?.likeCount),
          comments: parseCount(item.statistics?.commentCount),
          shares: parseCount(item.statistics?.shareCount),
        },
        type: "video",
      };

      return extracted;
    } catch (error) {
      logger.warn(
        "TikTok extraction failed",
        {
          requestId: context.requestId,
          platform: this.platform,
          operation: "extract-content",
          metadata: { url, errorMessage: (error as Error)?.message },
        }
      );
      if (isStrictRealMode) {
        throw ApiError.webScrapeFailed(url, error as Error);
      }
      return this.buildFallbackContent(url);
    }
  }

  protected async transcribeContent(
    extractedData: ExtractedContent | null,
    context: ProcessingContext
  ): Promise<TranscriptionResult | null> {
    if (!extractedData) {
      return null;
    }

    const tiktokData = extractedData as TikTokExtractedContent;
    if (!tiktokData.videoDownloadUrl) {
      logger.warn("No downloadable video URL found for TikTok content", {
        requestId: context.requestId,
        platform: this.platform,
        operation: "transcribe",
      });
      return null;
    }

    try {
      const transcriptionResult = await transcribeVideoDirectly(
        tiktokData.videoDownloadUrl
      );

      if (!transcriptionResult.success || !transcriptionResult.data) {
        throw new Error(
          transcriptionResult.error || "Unknown transcription failure"
        );
      }

      const segments = (transcriptionResult.data.segments || []) as WhisperSegment[];

      return {
        text: transcriptionResult.data.text,
        segments: segments.map((segment) => ({
          start: segment.start ?? segment.startSecond ?? 0,
          end: segment.end ?? segment.endSecond ?? 0,
          text: segment.text ?? "",
        })),
        language: transcriptionResult.data.language,
      };
    } catch (error) {
      logger.warn(
        "TikTok transcription failed",
        {
          requestId: context.requestId,
          platform: this.platform,
          operation: "transcribe",
          metadata: { errorMessage: (error as Error)?.message },
        }
      );

      if (isStrictRealMode) {
        throw ApiError.transcriptionFailed(error as Error);
      }
      return null;
    }
  }

  protected async detectNews(
    transcription: TranscriptionResult | null,
    extractedData: ExtractedContent | null,
    context: ProcessingContext
  ): Promise<NewsDetectionResult | null> {
    const textForDetection =
      transcription?.text || (extractedData as TikTokExtractedContent)?.caption;

    if (!textForDetection) {
      return null;
    }

    try {
      const detection = await detectNewsContent.execute(
        {
          transcription: textForDetection,
          title: extractedData?.title,
        },
        {
          toolCallId: "tiktok-news-detection",
          messages: [],
        }
      );

      if (detection.success && detection.data) {
        return {
          hasNewsContent: detection.data.hasNewsContent,
          confidence: detection.data.confidence,
          newsKeywordsFound: detection.data.newsKeywordsFound,
          potentialClaims: detection.data.potentialClaims,
          needsFactCheck: detection.data.needsFactCheck,
          contentType: detection.data.contentType,
        };
      }

      logger.warn("News detection returned no data for TikTok content", {
        requestId: context.requestId,
        platform: this.platform,
        operation: "news-detection",
      });

      return null;
    } catch (error) {
      logger.warn("News detection failed for TikTok content", {
        requestId: context.requestId,
        platform: this.platform,
        operation: "news-detection",
        metadata: {
          errorMessage:
            error instanceof Error ? error.message : String(error),
        },
      });

      return null;
    }
  }

  protected async performFactCheck(
    transcription: TranscriptionResult | null,
    extractedData: ExtractedContent | null,
    context: ProcessingContext
  ): Promise<FactCheckResult | null> {
    if (!extractedData) {
      return null;
    }

    const tiktokData = extractedData as TikTokExtractedContent;
    const textToVerify =
      transcription?.text?.trim() || tiktokData.caption?.trim();

    if (!textToVerify) {
      logger.debug("Skipping TikTok fact-check - nothing to verify", {
        requestId: context.requestId,
        platform: this.platform,
        operation: "fact-check",
      });
      return null;
    }

    try {
      const contextPrompt = `Platform: TikTok
Creator: ${tiktokData.creator}
Caption: ${tiktokData.caption || "N/A"}
Hashtags: ${(tiktokData.hashtags || []).slice(0, 8).join(", ") || "None"}
Views: ${tiktokData.stats?.views ?? "Unknown"}
Likes: ${tiktokData.stats?.likes ?? "Unknown"}
Original URL: ${context.url}`;

      const factCheck = await researchAndFactCheck.execute(
        {
          transcription: textToVerify,
          title: tiktokData.title,
          context: contextPrompt,
        },
        {
          toolCallId: "tiktok-fact-check",
          messages: [],
        }
      );

      if (!factCheck.success || !factCheck.data) {
        logger.warn("TikTok fact-check returned no data", {
          requestId: context.requestId,
          platform: this.platform,
          operation: "fact-check",
        });
        return this.buildFallbackFactCheck(textToVerify);
      }

      const resultData = factCheck.data as FactCheckToolResponse;
      const verdict: FactCheckResult["verdict"] =
        resultData.overallStatus || "unverified";

      return {
        verdict,
        confidence: Math.round((resultData.confidence || 0.5) * 100),
        explanation:
          resultData.reasoning ||
          resultData.webSearchAnalysis?.summary ||
          "No analysis available",
        content:
          textToVerify.substring(0, 500) +
          (textToVerify.length > 500 ? "..." : ""),
        sources: (resultData.sources || []).map((source) => ({
          title: source.title,
          url: source.url,
          credibility: source.relevance ?? 0.5,
        })),
        flags: [],
      };
    } catch (error) {
      logger.warn(
        "TikTok fact-check failed",
        {
          requestId: context.requestId,
          platform: this.platform,
          operation: "fact-check",
          metadata: { errorMessage: (error as Error)?.message },
        }
      );

      if (isStrictRealMode) {
        throw ApiError.factCheckFailed(error as Error);
      }
      return this.buildFallbackFactCheck(textToVerify);
    }
  }

  protected async calculateCredibility(
    factCheck: FactCheckResult | null,
    extractedData: ExtractedContent | null,
    context: ProcessingContext
  ): Promise<number | null> {
    if (!factCheck || !extractedData) {
      return null;
    }

    const tiktokData = extractedData as TikTokExtractedContent;

    try {
      const credibilityResult = await calculateCreatorCredibilityRating.execute(
        {
          factCheckResult: {
            verdict: factCheck.verdict,
            confidence: factCheck.confidence,
            isVerified: factCheck.verdict === "verified",
          },
          contentMetadata: {
            creator: tiktokData.creator || "Unknown",
            platform: this.platform,
            title: tiktokData.title || "TikTok Content",
            hasTranscription: true,
            contentType: "video",
          },
          analysisMetrics: {
            hasNewsContent: true,
            needsFactCheck: true,
            contentLength: factCheck.content?.length ?? 0,
          },
        },
        {
          toolCallId: "tiktok-credibility-rating",
          messages: [],
        }
      );

      if (credibilityResult.success && credibilityResult.data) {
        return credibilityResult.data.credibilityRating;
      }

      logger.warn("Credibility rating tool returned no data", {
        requestId: context.requestId,
        platform: this.platform,
        operation: "calculate-credibility",
      });

      return null;
    } catch (error) {
      logger.warn("Credibility rating failed for TikTok creator", {
        requestId: context.requestId,
        platform: this.platform,
        operation: "calculate-credibility",
        metadata: {
          errorMessage:
            error instanceof Error ? error.message : String(error),
        },
      });

      return null;
    }
  }
}
