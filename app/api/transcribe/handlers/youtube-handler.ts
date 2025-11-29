import ytdl from "ytdl-core";

import {
  BaseHandler,
  ExtractedContent,
  FactCheckResult,
  NewsDetectionResult,
  ProcessingContext,
  TranscriptionResult,
} from "./base-handler";
import { transcribeVideoDirectly } from "../../../../tools/helpers";
import { detectNewsContent, researchAndFactCheck } from "../../../../tools/fact-checking";
import { calculateCreatorCredibilityRating } from "../../../../tools/content-analysis";
import { logger } from "../../../../lib/logger";
import { ApiError } from "../../../../lib/api-error";

interface YouTubeExtractedContent extends ExtractedContent {
  videoDownloadUrl: string;
  thumbnailUrl?: string;
  channelId?: string;
  publishedAt?: string;
  durationSeconds?: number;
  stats?: {
    views?: number;
    likes?: number;
    comments?: number;
  };
  keywords?: string[];
  type: "video";
}

interface RawSegment {
  start?: number;
  end?: number;
  startSecond?: number;
  endSecond?: number;
  text?: string;
}

interface FactCheckPayload {
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
}

export class YouTubeHandler extends BaseHandler {
  constructor() {
    super("youtube");
  }

  private getDefaultTitle(url: string) {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace(/^www\./, "") || "YouTube Content";
    } catch {
      return "YouTube Content";
    }
  }

  private buildFallbackContent(url: string): YouTubeExtractedContent {
    return {
      title: this.getDefaultTitle(url),
      description: url,
      creator: "Unknown channel",
      videoUrl: "",
      videoDownloadUrl: "",
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
        "Automated fact-checking for this video is temporarily unavailable.",
      content: snippet || "No transcription available.",
      sources: [],
      flags: ["fact_check_unavailable"],
    };
  }

  protected async extractContent(
    url: string,
    context: ProcessingContext
  ): Promise<ExtractedContent | null> {
    if (!ytdl.validateURL(url)) {
      throw ApiError.invalidUrl(url, "YouTube");
    }

    logger.debug("Fetching YouTube metadata", {
      requestId: context.requestId,
      platform: this.platform,
      operation: "extract-content",
    });

    let info;
    try {
      info = await ytdl.getInfo(url);
    } catch (error) {
      logger.warn(
        "Failed to load YouTube metadata, using fallback content",
        {
          requestId: context.requestId,
          platform: this.platform,
          operation: "extract-content",
          metadata: { url, errorMessage: (error as Error)?.message },
        }
      );
      return this.buildFallbackContent(url);
    }

    const details = info.videoDetails;
    const audioFormat = ytdl.chooseFormat(info.formats, {
      quality: "highestaudio",
      filter: "audioonly",
    });

    if (!audioFormat?.url) {
      logger.warn("Unable to obtain downloadable audio stream, using fallback content", {
        requestId: context.requestId,
        platform: this.platform,
        operation: "extract-content",
        metadata: { url },
      });
      return this.buildFallbackContent(url);
    }

    const extracted: YouTubeExtractedContent = {
      title: details.title || "YouTube Video",
      description: details.description || "",
      creator: details.author?.name || details.ownerChannelName || "Unknown channel",
      videoUrl: audioFormat.url,
      videoDownloadUrl: audioFormat.url,
      thumbnailUrl: details.thumbnails?.[details.thumbnails.length - 1]?.url,
      duration: Number(details.lengthSeconds) || undefined,
      durationSeconds: Number(details.lengthSeconds) || undefined,
      publishedAt: details.publishDate,
      channelId: details.channelId,
      stats: {
        views: Number(details.viewCount) || undefined,
        likes: Number(details.likes) || undefined,
      },
      keywords: details.keywords,
      type: "video",
    };

    return extracted;
  }

  protected async transcribeContent(
    extractedData: ExtractedContent | null,
    context: ProcessingContext
  ): Promise<TranscriptionResult | null> {
    if (!extractedData) {
      return null;
    }

    const youtubeData = extractedData as YouTubeExtractedContent;
    if (!youtubeData.videoDownloadUrl) {
      return null;
    }

    try {
      const transcription = await transcribeVideoDirectly(youtubeData.videoDownloadUrl);

      if (!transcription.success || !transcription.data) {
        throw new Error(transcription.error || "Unknown transcription failure");
      }

      const segments = (transcription.data.segments || []).map((segment: RawSegment) => ({
        start: segment.start ?? segment.startSecond ?? 0,
        end: segment.end ?? segment.endSecond ?? 0,
        text: segment.text || "",
      }));

      return {
        text: transcription.data.text,
        segments,
        language: transcription.data.language,
      };
    } catch (error) {
      logger.warn(
        "YouTube transcription failed, continuing without audio",
        {
          requestId: context.requestId,
          platform: this.platform,
          operation: "transcribe",
          metadata: { errorMessage: (error as Error)?.message },
        }
      );
      return null;
    }
  }

  protected async detectNews(
    transcription: TranscriptionResult | null,
    extractedData: ExtractedContent | null,
    context: ProcessingContext
  ): Promise<NewsDetectionResult | null> {
    if (!transcription?.text) {
      return null;
    }

    try {
      const detection = await detectNewsContent.execute(
        {
          transcription: transcription.text,
          title: extractedData?.title,
        },
        {
          toolCallId: "youtube-news-detection",
          messages: [],
        }
      );

      if (detection.success && detection.data) {
        return detection.data;
      }

      return null;
    } catch (error) {
      logger.warn("YouTube news detection failed", {
        requestId: context.requestId,
        platform: this.platform,
        operation: "news-detection",
        metadata: { errorMessage: error instanceof Error ? error.message : String(error) },
      });
      return null;
    }
  }

  protected async performFactCheck(
    transcription: TranscriptionResult | null,
    extractedData: ExtractedContent | null,
    context: ProcessingContext
  ): Promise<FactCheckResult | null> {
    if (!transcription?.text || !extractedData) {
      const fallbackText =
        (transcription?.text || (extractedData?.description ?? extractedData?.title ?? "") || context.url || "") as string;
      return this.buildFallbackFactCheck(fallbackText);
    }

    const metadata = extractedData as YouTubeExtractedContent;
    const contextPrompt = `Platform: YouTube
Channel: ${metadata.creator}
URL: ${context.url}
Duration: ${metadata.durationSeconds ? `${metadata.durationSeconds}s` : "Unknown"}
Published: ${metadata.publishedAt || "Unknown"}
Views: ${metadata.stats?.views ?? "Unknown"}
Keywords: ${(metadata.keywords || []).slice(0, 10).join(", ") || "None"}`;

    try {
      const factCheck = await researchAndFactCheck.execute(
        {
          transcription: transcription.text,
          title: metadata.title,
          context: contextPrompt,
        },
        {
          toolCallId: "youtube-fact-check",
          messages: [],
        }
      );

      if (!factCheck.success || !factCheck.data) {
        return this.buildFallbackFactCheck(transcription.text);
      }

      const payload = factCheck.data as FactCheckPayload;
      return {
        verdict: payload.overallStatus || "unverified",
        confidence: Math.round((payload.confidence || 0.5) * 100),
        explanation:
          payload.reasoning || payload.webSearchAnalysis?.summary || "No explanation provided",
        content: transcription.text.slice(0, 500),
        sources: (payload.sources || []).map((source) => ({
          title: source.title,
          url: source.url,
          credibility: source.relevance ?? 0.5,
        })),
        flags: [],
      };
    } catch (error) {
      logger.warn(
        "YouTube fact-check failed, returning fallback verdict",
        {
          requestId: context.requestId,
          platform: this.platform,
          operation: "fact-check",
          metadata: { errorMessage: (error as Error)?.message },
        }
      );
      return this.buildFallbackFactCheck(transcription.text);
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

    const metadata = extractedData as YouTubeExtractedContent;

    try {
      const rating = await calculateCreatorCredibilityRating.execute(
        {
          factCheckResult: {
            verdict: factCheck.verdict,
            confidence: factCheck.confidence,
            isVerified: factCheck.verdict === "verified",
          },
          contentMetadata: {
            creator: metadata.creator || "Unknown channel",
            platform: this.platform,
            title: metadata.title || "YouTube Video",
            hasTranscription: true,
            contentType: "video",
          },
          analysisMetrics: {
            hasNewsContent: true,
            needsFactCheck: true,
            contentLength: transcriptionLength(factCheck.content),
          },
        },
        {
          toolCallId: "youtube-credibility-rating",
          messages: [],
        }
      );

      if (rating.success && rating.data) {
        return rating.data.credibilityRating;
      }

      return null;
    } catch (error) {
      logger.warn("YouTube credibility rating failed", {
        requestId: context.requestId,
        platform: this.platform,
        operation: "calculate-credibility",
        metadata: { errorMessage: error instanceof Error ? error.message : String(error) },
      });
      return null;
    }
  }
}

function transcriptionLength(text?: string): number {
  return text ? text.length : 0;
}
