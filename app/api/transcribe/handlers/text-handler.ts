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

function buildFallbackFactCheck(text: string): FactCheckResult {
  const snippet = text.substring(0, 500) + (text.length > 500 ? "..." : "");
  return {
    verdict: "unverified",
    confidence: 0,
    explanation: "Automated fact-checking is temporarily unavailable.",
    content: snippet || "No text available.",
    sources: [],
    flags: ["fact_check_unavailable"],
  };
}

function buildTranscriptionFromText(text: string): TranscriptionResult {
  const segments = text
    .split(/[\n\.!?]+/)
    .map((fragment) => fragment.trim())
    .filter(Boolean)
    .map((sentence, index) => ({
      text: sentence,
      start: index * 2,
      end: index * 2 + 2,
    }));

  return {
    text,
    segments,
    language: "en",
  };
}

export class TextHandler extends BaseHandler {
  constructor() {
    super("web");
  }

  protected async extractContent(
    url: string,
    context: ProcessingContext
  ): Promise<ExtractedContent | null> {
    const raw = (context.rawContent || "").trim();
    const title = raw.length > 0 ? raw.slice(0, 80) : "User Text";

    const extracted: ExtractedContent = {
      title,
      description: raw.slice(0, 160),
      creator: "User",
      type: "text",
    };

    return extracted;
  }

  protected async transcribeContent(
    extractedData: ExtractedContent | null,
    context: ProcessingContext
  ): Promise<TranscriptionResult | null> {
    const raw = (context.rawContent || "").trim();
    if (!raw) return null;
    return buildTranscriptionFromText(raw);
  }

  protected async detectNews(
    transcription: TranscriptionResult | null,
    extractedData: ExtractedContent | null,
    context: ProcessingContext
  ): Promise<NewsDetectionResult | null> {
    const text = transcription?.text || context.rawContent || "";
    if (!text) return null;

    try {
      const detection = await detectNewsContent.execute(
        {
          transcription: text,
          title: extractedData?.title,
        },
        { toolCallId: "text-news-detection", messages: [] }
      );
      return detection.success && detection.data ? detection.data : null;
    } catch (error) {
      logger.warn("Text news detection failed", {
        requestId: context.requestId,
        platform: this.platform,
        operation: "news-detection",
        metadata: { errorMessage: (error as Error)?.message },
      });
      return null;
    }
  }

  protected async performFactCheck(
    transcription: TranscriptionResult | null,
    extractedData: ExtractedContent | null,
    context: ProcessingContext
  ): Promise<FactCheckResult | null> {
    const text = transcription?.text || context.rawContent || "";
    if (!text) return null;

    try {
      const fc = await researchAndFactCheck.execute(
        {
          transcription: text,
          title: extractedData?.title,
          context: "Plain text submission",
        },
        { toolCallId: "text-fact-check", messages: [] }
      );

      if (!fc.success || !fc.data) return buildFallbackFactCheck(text);

      const payload = fc.data as {
        overallStatus?: FactCheckResult["verdict"]; // using compatible union
        confidence?: number;
        reasoning?: string;
        sources?: Array<{ title: string; url: string; credibility: number }>;
        webSearchAnalysis?: { summary?: string };
      };

      return {
        verdict: payload.overallStatus || "unverified",
        confidence: Math.round((payload.confidence || 0.5) * 100),
        explanation: payload.reasoning || payload.webSearchAnalysis?.summary || "",
        content: text.slice(0, 500),
        sources: (payload.sources || []).map((s) => ({
          title: s.title,
          url: s.url,
          credibility: s.credibility ?? 0.5,
        })),
        flags: [],
      };
    } catch (error) {
      logger.warn("Text fact-check failed", {
        requestId: context.requestId,
        platform: this.platform,
        operation: "fact-check",
        metadata: { errorMessage: (error as Error)?.message },
      });
      return buildFallbackFactCheck(text);
    }
  }

  protected async calculateCredibility(
    factCheck: FactCheckResult | null,
    extractedData: ExtractedContent | null,
    context: ProcessingContext
  ): Promise<number | null> {
    if (!factCheck) return null;
    try {
      const result = await calculateCreatorCredibilityRating.execute(
        {
          factCheckResult: {
            verdict: factCheck.verdict,
            confidence: factCheck.confidence,
            isVerified: factCheck.verdict === "verified",
          },
          contentMetadata: {
            creator: "user",
            platform: this.platform,
            title: extractedData?.title || "Text",
            hasTranscription: true,
            contentType: "text",
          },
          analysisMetrics: {
            hasNewsContent: true,
            needsFactCheck: !!factCheck,
            contentLength: (context.rawContent || "").length,
          },
        },
        { toolCallId: "text-credibility-rating", messages: [] }
      );
      if (result.success && result.data) return result.data.credibilityRating;
      return null;
    } catch (error) {
      logger.warn("Text credibility rating failed", {
        requestId: context.requestId,
        platform: this.platform,
        operation: "calculate-credibility",
        metadata: { errorMessage: (error as Error)?.message },
      });
      return null;
    }
  }
}
