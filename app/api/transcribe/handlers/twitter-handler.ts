import { Scraper, type Tweet } from "@the-convocation/twitter-scraper";

import {
  BaseHandler,
  ExtractedContent,
  FactCheckResult,
  NewsDetectionResult,
  ProcessingContext,
  TranscriptionResult,
} from "./base-handler";
import { detectNewsContent, researchAndFactCheck } from "../../../../tools/fact-checking";
import { calculateCreatorCredibilityRating } from "../../../../tools/content-analysis";
import { logger } from "../../../../lib/logger";
import { isStrictRealMode } from "../../../../lib/config";
import { ApiError } from "../../../../lib/api-error";
import { scrapeWebContent } from "../../../../tools/helpers";

const twitterScraper = new Scraper();

interface TwitterExtractedContent extends ExtractedContent {
  tweetId: string;
  content: string;
  authorHandle: string;
  authorDisplayName: string;
  publishedAt?: string;
  stats?: {
    likes?: number;
    replies?: number;
    retweets?: number;
    views?: number;
  };
  hashtags?: string[];
  mediaUrls?: string[];
  type: "text";
}

interface FactCheckToolPayload {
  overallStatus?: FactCheckResult["verdict"];
  confidence?: number;
  reasoning?: string;
  sources?: Array<{
    title: string;
    url: string;
    source?: string;
    relevance?: number;
  }>;
  webSearchAnalysis?: {
    summary?: string;
  };
}

function extractTweetId(url: string): string | null {
  const match = url.match(/status\/(\d+)/i);
  return match ? match[1] : null;
}

function buildTranscriptionFromTweet(tweet: TwitterExtractedContent): TranscriptionResult {
  const segments = tweet.content
    .split(/[\n\.!?]+/)
    .map((fragment) => fragment.trim())
    .filter(Boolean)
    .map((sentence, index) => ({
      text: sentence,
      start: index * 2,
      end: index * 2 + 2,
    }));

  return {
    text: tweet.content,
    segments,
    language: "en",
  };
}

export class TwitterHandler extends BaseHandler {
  constructor() {
    super("twitter");
  }

  private getDefaultTitle(url: string) {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace(/^www\./, "") || "Twitter Content";
    } catch {
      return "Twitter Content";
    }
  }

  private buildFallbackContent(url: string): TwitterExtractedContent {
    const tweetId = extractTweetId(url) ?? "unknown";
    return {
      tweetId,
      title: this.getDefaultTitle(url),
      description: url,
      creator: "Unknown",
      authorHandle: "unknown",
      authorDisplayName: "Unknown",
      content: url,
      type: "text",
    };
  }

  private buildFallbackFactCheck(text: string): FactCheckResult {
    const snippet =
      text.substring(0, 500) + (text.length > 500 ? "..." : "");
    return {
      verdict: "unverified",
      confidence: 0,
      explanation:
        "Automated fact-checking for this tweet is temporarily unavailable.",
      content: snippet || "No tweet text available.",
      sources: [],
      flags: ["fact_check_unavailable"],
    };
  }

  protected async extractContent(
    url: string,
    context: ProcessingContext
  ): Promise<ExtractedContent | null> {
    const tweetId = extractTweetId(url);
    if (!tweetId) {
      logger.warn("Unable to extract tweet ID", {
        requestId: context.requestId,
        platform: this.platform,
        operation: "extract-content",
        metadata: { url },
      });
      if (isStrictRealMode) {
        throw ApiError.webScrapeFailed(url, new Error("tweet id not found"));
      }
      return this.buildFallbackContent(url);
    }

    logger.debug("Fetching tweet data", {
      requestId: context.requestId,
      platform: this.platform,
      operation: "extract-content",
      metadata: { tweetId },
    });

    let tweet: Tweet | null = null;
    try {
      tweet = await twitterScraper.getTweet(tweetId);
    } catch (error) {
      logger.warn("Twitter scraper failed", {
        requestId: context.requestId,
        platform: this.platform,
        operation: "extract-content",
        metadata: { tweetId, errorMessage: (error as Error)?.message },
      });

      // Try Firecrawl as a real fallback scraper
      try {
        const scraped = await scrapeWebContent(url);
        const text = scraped.success ? scraped.data?.content ?? "" : "";
        if (text.trim().length > 0) {
          const title = scraped.data?.title || this.getDefaultTitle(url);
          const description = scraped.data?.description || url;
          const hashtags = Array.from(new Set((text.match(/#\w+/g) || []).map((t) => t.slice(1).toLowerCase())));
          const extracted: TwitterExtractedContent = {
            tweetId,
            title: title.slice(0, 80),
            description,
            creator: "Unknown",
            authorHandle: "unknown",
            authorDisplayName: "Unknown",
            content: text.slice(0, 1000),
            publishedAt: undefined,
            videoUrl: undefined,
            thumbnailUrl: undefined,
            hashtags,
            stats: {},
            mediaUrls: [],
            type: "text",
          };
          return extracted;
        }
      } catch (fcError) {
        logger.warn("Firecrawl fallback failed", {
          requestId: context.requestId,
          platform: this.platform,
          operation: "extract-content",
          metadata: { tweetId, errorMessage: (fcError as Error)?.message },
        });
      }

      if (isStrictRealMode) {
        throw ApiError.webScrapeFailed(url, error as Error);
      }
      return this.buildFallbackContent(url);
    }

    if (!tweet || !tweet.text) {
      logger.warn("Tweet missing or empty", {
        requestId: context.requestId,
        platform: this.platform,
        operation: "extract-content",
        metadata: { url, tweetId },
      });
      if (isStrictRealMode) {
        throw ApiError.webScrapeFailed(url, new Error("tweet missing or empty"));
      }
      return this.buildFallbackContent(url);
    }

    const authorHandle = tweet.username || tweet.userId || "unknown";
    const authorDisplayName = tweet.name || authorHandle;
    const content = tweet.text;
    const hashtags = tweet.hashtags?.map((tag) => tag.toLowerCase());

    const extracted: TwitterExtractedContent = {
      tweetId,
      title: content.slice(0, 80),
      description: content,
      creator: authorDisplayName,
      authorHandle,
      authorDisplayName,
      content,
      publishedAt: tweet.timeParsed?.toISOString(),
      videoUrl: undefined,
      thumbnailUrl: tweet.photos?.[0]?.url,
      hashtags,
      stats: {
        likes: tweet.likes,
        replies: tweet.replies,
        retweets: tweet.retweets,
        views: tweet.views,
      },
      mediaUrls: tweet.photos?.map((photo) => photo.url),
      type: "text",
    };

    return extracted;
  }

  protected async transcribeContent(
    extractedData: ExtractedContent | null
  ): Promise<TranscriptionResult | null> {
    if (!extractedData) {
      return null;
    }

    const twitterData = extractedData as TwitterExtractedContent;
    return buildTranscriptionFromTweet(twitterData);
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
          toolCallId: "twitter-news-detection",
          messages: [],
        }
      );

      if (detection.success && detection.data) {
        return detection.data;
      }

      return null;
    } catch (error) {
      logger.warn("Twitter news detection failed", {
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
      if (isStrictRealMode) {
        throw ApiError.factCheckFailed(new Error("missing transcription or metadata"));
      }
      const fallbackText =
        (transcription?.text || (extractedData?.description ?? extractedData?.title ?? "") || context.url || "") as string;
      return this.buildFallbackFactCheck(fallbackText);
    }

    const twitterData = extractedData as TwitterExtractedContent;
    const contextPrompt = `Platform: Twitter/X
Creator: ${twitterData.authorDisplayName} (@${twitterData.authorHandle})
Tweet URL: https://twitter.com/${twitterData.authorHandle}/status/${twitterData.tweetId}
Posted: ${twitterData.publishedAt || "Unknown"}
Stats: Likes ${twitterData.stats?.likes ?? 0}, Retweets ${twitterData.stats?.retweets ?? 0}, Replies ${twitterData.stats?.replies ?? 0}
Hashtags: ${(twitterData.hashtags || []).join(", ") || "None"}
Media: ${(twitterData.mediaUrls || []).length || 0} attachment(s)`;

    try {
      const factCheck = await researchAndFactCheck.execute(
        {
          transcription: transcription.text,
          title: extractedData.title,
          context: contextPrompt,
        },
        {
          toolCallId: "twitter-fact-check",
          messages: [],
        }
      );

      if (!factCheck.success || !factCheck.data) {
        if (isStrictRealMode) {
          throw ApiError.factCheckFailed(new Error("fact-check tool returned no data"));
        }
        return this.buildFallbackFactCheck(transcription.text);
      }

      const payload = factCheck.data as FactCheckToolPayload;
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
        "Twitter fact-check failed",
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

    const twitterData = extractedData as TwitterExtractedContent;

    try {
      const result = await calculateCreatorCredibilityRating.execute(
        {
          factCheckResult: {
            verdict: factCheck.verdict,
            confidence: factCheck.confidence,
            isVerified: factCheck.verdict === "verified",
          },
          contentMetadata: {
            creator: twitterData.authorHandle,
            platform: this.platform,
            title: extractedData.title || "Tweet",
            hasTranscription: true,
            contentType: "text",
          },
          analysisMetrics: {
            hasNewsContent: true,
            needsFactCheck: true,
            contentLength: transcriptionLength(factCheck.content),
          },
        },
        {
          toolCallId: "twitter-credibility-rating",
          messages: [],
        }
      );

      if (result.success && result.data) {
        return result.data.credibilityRating;
      }

      return null;
    } catch (error) {
      logger.warn("Twitter credibility rating failed", {
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
