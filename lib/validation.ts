import { z } from "zod";
import { ApiError, ApiErrorCode } from "./api-error";

// URL validation patterns
const INSTAGRAM_URL_PATTERN =
  /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[A-Za-z0-9_-]+/;
const YOUTUBE_URL_PATTERN =
  /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/[A-Za-z0-9_\-?=&/]+/;
const TWITTER_URL_PATTERN =
  /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[A-Za-z0-9_]+\/status\/\d+/;
const TIKTOK_URL_PATTERN =
  /^https?:\/\/(www\.)?tiktok\.com\/@[A-Za-z0-9_.-]+\/video\/\d+/;

// Request schemas
export const transcribeRequestSchema = z
  .object({
    instagramUrl: z.string().url().optional(),
    youtubeUrl: z.string().url().optional(),
    twitterUrl: z.string().url().optional(),
    tiktokUrl: z.string().url().optional(),
    webUrl: z.string().url().optional(),
    contentUrl: z.string().url().optional(),
    // New: allow plain text content ingestion (non-URL)
    contentText: z.string().min(1).optional(),
  })
  .refine(
    (data) =>
      data.instagramUrl ||
      data.youtubeUrl ||
      data.twitterUrl ||
      data.tiktokUrl ||
      data.webUrl ||
      data.contentUrl ||
      data.contentText,
    {
      message: "At least one URL parameter is required",
      path: ["url"],
    }
  );

export type TranscribeRequest = z.infer<typeof transcribeRequestSchema>;

// Platform detection
export type Platform = "instagram" | "youtube" | "twitter" | "tiktok" | "web";
export function detectPlatform(url: string): Platform {
  if (/instagram\.com/.test(url)) return "instagram";
  if (/youtube\.com|youtu\.be/.test(url)) return "youtube";
  if (/(twitter\.com|x\.com)/.test(url)) return "twitter";
  if (/tiktok\.com/.test(url)) return "tiktok";
  return "web";
}

// URL validation
export function validateUrl(url: string, platform?: string): void {
  // Basic URL validation
  try {
    new URL(url);
  } catch {
    throw ApiError.invalidUrl(url, platform);
  }

  // Platform-specific validation
  if (platform === "instagram" && !INSTAGRAM_URL_PATTERN.test(url)) {
    throw ApiError.invalidUrl(url, "Instagram");
  } else if (platform === "youtube" && !YOUTUBE_URL_PATTERN.test(url)) {
    throw ApiError.invalidUrl(url, "YouTube");
  } else if (platform === "twitter" && !TWITTER_URL_PATTERN.test(url)) {
    throw ApiError.invalidUrl(url, "Twitter/X");
  } else if (platform === "tiktok" && !TIKTOK_URL_PATTERN.test(url)) {
    throw ApiError.invalidUrl(url, "TikTok");
  }
}

// URL sanitization
export function sanitizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);

    // Remove tracking parameters
    const trackingParams = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "fbclid",
      "gclid",
      "ref_src",
      "ref_url",
      "_nc_ht",
    ];

    trackingParams.forEach((param) => {
      parsedUrl.searchParams.delete(param);
    });

    return parsedUrl.toString();
  } catch {
    // If URL parsing fails, return original (validation will catch this)
    return url;
  }
}

// Content validation
export function validateContent(
  content: string,
  maxLength: number = 50000
): string {
  if (content.length > maxLength) {
    return content.substring(0, maxLength) + "...";
  }

  // Basic content sanitization (remove potential script tags, etc.)
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .trim();
}

// Request validation middleware
export function validateTranscribeRequest(body: unknown): TranscribeRequest {
  try {
    return transcribeRequestSchema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      throw new ApiError(
        firstError.path.includes("url")
          ? ApiErrorCode.MISSING_URL
          : ApiErrorCode.INVALID_URL,
        firstError.message,
        400,
        true,
        { validationErrors: error.errors }
      );
    }
    throw ApiError.internalError(error as Error);
  }
}

// Response schemas for type safety
export const transcriptionSchema = z.object({
  text: z.string(),
  segments: z.array(z.unknown()),
  language: z.string().optional(),
});

export const metadataSchema = z.object({
  title: z.string(),
  description: z.string(),
  creator: z.string(),
  originalUrl: z.string(),
  platform: z.string(),
});

export const factCheckResultSchema = z.object({
  claim: z.string(),
  status: z.string(),
  confidence: z.number(),
  analysis: z.string().optional(),
  sources: z
    .array(
      z.object({
        title: z.string(),
        url: z.string(),
        source: z.string().optional(),
        relevance: z.number().optional(),
        description: z.string().optional(),
      })
    )
    .optional(),
  error: z.string().optional(),
  flags: z.array(z.string()).optional(),
});

export const factCheckSchema = z.object({
  verdict: z.string().optional(),
  confidence: z.number().min(0).max(100).optional(),
  explanation: z.string().optional(),
  content: z.string().optional(),
  isVerified: z.boolean().optional(),
  sources: z
    .array(
      z.object({
        title: z.string(),
        url: z.string(),
        source: z.string().optional(),
        relevance: z.number().optional(),
        description: z.string().optional(),
      })
    )
    .optional(),
  error: z.string().optional(),
  totalClaims: z.number(),
  checkedClaims: z.number(),
  results: z.array(factCheckResultSchema),
  summary: z.object({
    verifiedTrue: z.number(),
    verifiedFalse: z.number(),
    misleading: z.number(),
    unverifiable: z.number(),
    needsVerification: z.number(),
  }),
});

export const newsDetectionSchema = z.object({
  hasNewsContent: z.boolean(),
  confidence: z.number(),
  newsKeywordsFound: z.array(z.string()),
  potentialClaims: z.array(z.string()),
  needsFactCheck: z.boolean(),
  contentType: z.string(),
});

export const transcribeResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      transcription: transcriptionSchema,
      metadata: metadataSchema,
      factCheck: factCheckSchema.nullable(),
      newsDetection: newsDetectionSchema.nullable(),
      requiresFactCheck: z.boolean(),
      creatorCredibilityRating: z.number().min(0).max(10).nullable(),
    })
    .optional(),
  error: z
    .object({
      code: z.string(),
      message: z.string(),
      context: z.record(z.unknown()).optional(),
    })
    .optional(),
});

export type TranscribeResponse = z.infer<typeof transcribeResponseSchema>;
