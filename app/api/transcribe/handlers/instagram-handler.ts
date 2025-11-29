import { load } from "cheerio";

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

const INSTAGRAM_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

interface InstagramExtractedContent extends ExtractedContent {
  videoDownloadUrl?: string;
  thumbnailUrl?: string;
  caption?: string;
  hashtags?: string[];
  authorHandle?: string;
  publishedAt?: string;
  type: "video" | "image";
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

function extractHashtags(text?: string): string[] {
  if (!text) return [];
  const matches = text.match(/#\w+/g) || [];
  return matches.map((tag) => tag.toLowerCase());
}

function buildTextTranscription(text: string): TranscriptionResult {
  const fragments = text
    .split(/[\n\.!?]+/)
    .map((fragment) => fragment.trim())
    .filter(Boolean);

  return {
    text,
    segments: fragments.map((sentence, index) => ({
      text: sentence,
      start: index * 2,
      end: index * 2 + 2,
    })),
    language: "en",
  };
}

function decodeEscapedUrl(url: string): string {
  return url.replace(/\\u0026/g, "&");
}

export class InstagramHandler extends BaseHandler {
  constructor() {
    super("instagram");
  }

  private getDefaultTitle(url: string, fallback: string) {
    try {
      return new URL(url).hostname || fallback;
    } catch {
      return fallback;
    }
  }

  private buildFallbackContent(url: string): InstagramExtractedContent {
    return {
      title: this.getDefaultTitle(url, "Instagram Content"),
      description: url,
      creator: "Unknown",
      content: "",
      caption: "",
      metadata: { url },
      type: "image",
    };
  }

  private buildFallbackFactCheck(text: string): FactCheckResult {
    const snippet =
      text.substring(0, 500) + (text.length > 500 ? "..." : "");
    return {
      verdict: "unverified",
      confidence: 0,
      explanation:
        "Unable to complete Instagram fact-check automatically. Please retry later.",
      content: snippet || "No transcription available.",
      sources: [],
      flags: ["fact_check_unavailable"],
    };
  }

  protected async extractContent(
    url: string,
    context: ProcessingContext
  ): Promise<ExtractedContent | null> {
    logger.debug("Fetching Instagram content", {
      requestId: context.requestId,
      platform: this.platform,
      operation: "extract-content",
      metadata: { url },
    });

    let response: Response;
    try {
      response = await fetch(url, {
        headers: {
          "User-Agent": INSTAGRAM_USER_AGENT,
        },
      });
    } catch (error) {
      logger.warn("Failed to fetch Instagram content, using fallback data", {
        requestId: context.requestId,
        platform: this.platform,
        operation: "extract-content",
        metadata: { url, errorMessage: (error as Error)?.message },
      });
      return this.buildFallbackContent(url);
    }

    if (!response.ok) {
      logger.warn("Instagram responded with non-200 status, using fallback data", {
        requestId: context.requestId,
        platform: this.platform,
        operation: "extract-content",
        metadata: { url, status: response.status },
      });
      return this.buildFallbackContent(url);
    }

    const html = await response.text();
    const $ = load(html);

    const videoObject = this.extractVideoObject($);
    const fallbackVideo = this.extractVideoUrlFromHtml(html);

    const title =
      videoObject?.name ||
      $("meta[property='og:title']").attr("content") ||
      "Instagram Content";
    const description =
      videoObject?.description ||
      $("meta[property='og:description']").attr("content") ||
      "";
    const creator =
      videoObject?.author?.name ||
      $("meta[property='og:site_name']").attr("content") ||
      "Unknown Creator";
    const contentUrl =
      videoObject?.contentUrl || fallbackVideo || $("meta[property='og:video']").attr("content");

    const extracted: InstagramExtractedContent = {
      title,
      description,
      creator,
      thumbnailUrl: videoObject?.thumbnailUrl || $("meta[property='og:image']").attr("content"),
      caption: description,
      hashtags: extractHashtags(description),
      authorHandle: videoObject?.author?.url,
      publishedAt: videoObject?.uploadDate,
      type: contentUrl ? "video" : "image",
    };

    if (contentUrl) {
      extracted.videoUrl = contentUrl;
      extracted.videoDownloadUrl = contentUrl;
    }

    return extracted;
  }

  protected async transcribeContent(
    extractedData: ExtractedContent | null,
    context: ProcessingContext
  ): Promise<TranscriptionResult | null> {
    if (!extractedData) {
      return null;
    }

    const instagramData = extractedData as InstagramExtractedContent;
    if (instagramData.videoDownloadUrl) {
      try {
        const transcription = await transcribeVideoDirectly(instagramData.videoDownloadUrl);

        if (!transcription.success || !transcription.data) {
          throw new Error(transcription.error || "Unknown transcription error");
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
        logger.warn("Instagram video transcription failed, falling back to caption text", {
          requestId: context.requestId,
          platform: this.platform,
          operation: "transcribe",
          metadata: { errorMessage: error instanceof Error ? error.message : String(error) },
        });
        if (instagramData.caption) {
          return buildTextTranscription(instagramData.caption);
        }
        return null;
      }
    }

    if (instagramData.caption) {
      return buildTextTranscription(instagramData.caption);
    }

    return null;
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
          toolCallId: "instagram-news-detection",
          messages: [],
        }
      );

      if (detection.success && detection.data) {
        return detection.data;
      }

      return null;
    } catch (error) {
      logger.warn("Instagram news detection failed", {
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
      return null;
    }

    const instagramData = extractedData as InstagramExtractedContent;
    const contextPrompt = `Platform: Instagram
Creator: ${instagramData.creator}
URL: ${context.url}
Published: ${instagramData.publishedAt || "Unknown"}
Hashtags: ${(instagramData.hashtags || []).join(", ") || "None"}
Content Type: ${instagramData.type}`;

    try {
      const factCheck = await researchAndFactCheck.execute(
        {
          transcription: transcription.text,
          title: extractedData.title,
          context: contextPrompt,
        },
        {
          toolCallId: "instagram-fact-check",
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
        "Instagram fact-check failed, returning fallback verdict",
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

    const instagramData = extractedData as InstagramExtractedContent;

    try {
      const rating = await calculateCreatorCredibilityRating.execute(
        {
          factCheckResult: {
            verdict: factCheck.verdict,
            confidence: factCheck.confidence,
            isVerified: factCheck.verdict === "verified",
          },
          contentMetadata: {
            creator: instagramData.creator || "Unknown Creator",
            platform: this.platform,
            title: instagramData.title || "Instagram Content",
            hasTranscription: true,
            contentType: instagramData.type,
          },
          analysisMetrics: {
            hasNewsContent: true,
            needsFactCheck: true,
            contentLength: factCheck.content?.length || transcriptionLength(factCheck.explanation),
          },
        },
        {
          toolCallId: "instagram-credibility-rating",
          messages: [],
        }
      );

      if (rating.success && rating.data) {
        return rating.data.credibilityRating;
      }

      return null;
    } catch (error) {
      logger.warn("Instagram credibility rating failed", {
        requestId: context.requestId,
        platform: this.platform,
        operation: "calculate-credibility",
        metadata: { errorMessage: error instanceof Error ? error.message : String(error) },
      });
      return null;
    }
  }

  private extractVideoObject($: ReturnType<typeof load>) {
    const scripts = $('script[type="application/ld+json"]')
      .map((_, element) => $(element).contents().text())
      .get();

    for (const script of scripts) {
      try {
        const parsed = JSON.parse(script);
        if (Array.isArray(parsed)) {
          const video = parsed.find((item) => item["@type"] === "VideoObject");
          if (video) {
            return video;
          }
        } else if (parsed["@type"] === "VideoObject") {
          return parsed;
        }
      } catch {
        // Ignore JSON parsing errors for unrelated LD+JSON blocks
      }
    }

    return null;
  }

  private extractVideoUrlFromHtml(html: string): string | undefined {
    const match = html.match(/"video_url":"([^"]+)"/);
    if (match?.[1]) {
      return decodeEscapedUrl(match[1]);
    }

    const ogVideo = html.match(/property="og:video" content="([^"]+)"/);
    if (ogVideo?.[1]) {
      return decodeEscapedUrl(ogVideo[1]);
    }

    return undefined;
  }
}

function transcriptionLength(text?: string): number {
  return text ? text.length : 0;
}
