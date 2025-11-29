import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";

export const runtime = "nodejs";

import {
  validateTranscribeRequest,
  detectPlatform,
  sanitizeUrl,
  validateUrl,
} from "../../../lib/validation";
import { ApiError } from "../../../lib/api-error";
import { logger } from "../../../lib/logger";
import { checkOperationRateLimit } from "../../../lib/rate-limiter";
import { InstagramHandler } from "./handlers/instagram-handler";
import { YouTubeHandler } from "./handlers/youtube-handler";
import { WebHandler } from "./handlers/web-handler";
import { TwitterHandler } from "./handlers/twitter-handler";
import { TikTokHandler } from "./handlers/tiktok-handler";
import { ProcessingContext } from "./handlers/base-handler";
import { api } from "@/convex/_generated/api";
import { normalizeAnalysisResult } from "@/lib/analysis-normalizer";
import { TextHandler } from "./handlers/text-handler";

function createConvexClient(token: string) {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured");
  }
  const client = new ConvexHttpClient(url);
  client.setAuth(token);
  return client;
}

/**
 * Content Analysis API Endpoint
 *
 * This endpoint analyzes social media and web content for fact-checking and credibility assessment.
 *
 * **Supported Platforms:**
 * - Instagram Reels/Posts: Extracts metadata, scrapes captions, and runs fact-checks
 * - YouTube videos: Extracts metadata, captions, and runs fact-checks
 * - Web articles: Scrapes content, fact-checks articles and blog posts
 *
 * **Features:**
 * - ✅ Multi-platform content analysis
 * - ✅ AI-powered transcription for video content
 * - ✅ Automated fact-checking with source verification
 * - ✅ Creator credibility scoring (0-10 scale)
 * - ✅ Rate limiting and error handling
 * - ✅ Comprehensive logging and monitoring
 *
 * **Request Format:**
 * ```json
 * {
 *   "instagramUrl": "https://www.instagram.com/reel/ABC123/", // OR
 *   "youtubeUrl": "https://youtu.be/xyz789",                   // OR
 *   "webUrl": "https://example.com/article",                   // OR
 *   "contentUrl": "https://any-public-url"
 * }
 * ```
 *
 * **Response Format:**
 * ```json
 * {
 *   "success": true,
 *   "data": {
 *     "transcription": { "text": "...", "segments": [...], "language": "en" },
 *     "metadata": { "title": "...", "creator": "...", "platform": "..." },
 *     "factCheck": { "verdict": "verified", "confidence": 85, "explanation": "..." },
 *     "requiresFactCheck": true,
 *     "creatorCredibilityRating": 7.5
 *   }
 * }
 * ```
 *
 * @param request - HTTP request with URL to analyze
 * @returns Analysis results with fact-check and credibility data
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();

  logger.info("Content analysis request started", {
    requestId,
    operation: "transcribe",
    metadata: {
      method: request.method,
      userAgent: request.headers.get("user-agent")?.slice(0, 100),
    },
  });

  try {
    // Step 1: Validate request body
    const body = await request.json();
    const validatedRequest = validateTranscribeRequest(body);

    logger.debug("Request validated successfully", {
      requestId,
      operation: "validate-request",
      metadata: {
        hasInstagramUrl: !!validatedRequest.instagramUrl,
        hasYouTubeUrl: !!validatedRequest.youtubeUrl,
        hasWebUrl: !!validatedRequest.webUrl,
        hasContentUrl: !!validatedRequest.contentUrl,
      },
    });

    // Step 2: Handle plain text ingestion or extract and sanitize the URL
    const isTextOnly = !!validatedRequest.contentText && !(
      validatedRequest.webUrl ||
      validatedRequest.instagramUrl ||
      validatedRequest.youtubeUrl ||
      validatedRequest.twitterUrl ||
      validatedRequest.tiktokUrl ||
      validatedRequest.contentUrl
    );

    let sanitizedUrl = "";
    let platform: ReturnType<typeof detectPlatform> | "text" = "web";

    if (isTextOnly) {
      // Synthetic URL for persistence and downstream typing
      sanitizedUrl = "text:submission";
      platform = "web";
    } else {
      const rawUrl =
        validatedRequest.webUrl ||
        validatedRequest.instagramUrl ||
        validatedRequest.youtubeUrl ||
        validatedRequest.twitterUrl ||
        validatedRequest.tiktokUrl ||
        validatedRequest.contentUrl!;

      sanitizedUrl = sanitizeUrl(rawUrl);
      platform = detectPlatform(sanitizedUrl);
      validateUrl(sanitizedUrl, platform);
    }

    logger.info("Platform detected and URL sanitized", {
      requestId,
      operation: "platform-detection",
      platform,
      metadata: { sanitizedUrl },
    });

    // Step 3: Check rate limits for this operation
    const rateLimitResult = checkOperationRateLimit(request, "transcribe");
    if (!rateLimitResult.allowed) {
      logger.warn("Rate limit exceeded", {
        requestId,
        operation: "rate-limit-check",
        platform,
        metadata: {
          remaining: rateLimitResult.remaining,
          resetTime: rateLimitResult.resetTime,
        },
      });

      return NextResponse.json(
        ApiError.rateLimited(rateLimitResult.retryAfter).toJSON(),
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": new Date(
              rateLimitResult.resetTime
            ).toISOString(),
            "Retry-After": rateLimitResult.retryAfter?.toString() || "60",
          },
        }
      );
    }

    const { userId, getToken } = await auth();
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHENTICATED",
            message: "Sign in to verify content and manage credits.",
          },
        },
        { status: 401 }
      );
    }

    // Initialize Convex (optional) – continue without it if token missing
    let convex: ConvexHttpClient | null = null;
    let hasUnlimitedCredits = true;
    let availableCredits = -1;
    try {
      const convexToken = await getToken({ template: "convex" });
      if (convexToken) {
        convex = createConvexClient(convexToken);
        const currentUser = await convex.query(api.users.getCurrentUser, {});
        if (currentUser) {
          hasUnlimitedCredits =
            currentUser.hasUnlimitedCredits || currentUser.credits === -1;
          availableCredits = currentUser.credits ?? 0;
        } else {
          logger.warn("Convex user not found; proceeding without credit enforcement", {
            requestId,
            operation: "convex-user-lookup",
            platform,
          });
        }
      } else {
        logger.warn("Missing Convex token from Clerk; proceeding without Convex", {
          requestId,
          operation: "convex-init",
          platform,
        });
      }
    } catch (convexInitError) {
      logger.warn("Convex initialization failed; proceeding without Convex", {
        requestId,
        operation: "convex-init",
        platform,
        metadata: {
          errorMessage:
            convexInitError instanceof Error
              ? convexInitError.message
              : String(convexInitError),
        },
      });
    }

    // Enforce credits only when Convex is available and user data is loaded
    if (convex && !hasUnlimitedCredits && availableCredits < 1) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INSUFFICIENT_CREDITS",
            message:
              "You are out of credits. Purchase more to continue verifying content.",
          },
        },
        { status: 402 }
      );
    }

    // Step 4: Create processing context
    const context: ProcessingContext = {
      requestId,
      userId,
      platform,
      url: sanitizedUrl,
      startTime,
      rawContent: isTextOnly ? validatedRequest.contentText : undefined,
    };

    // Step 5: Select appropriate handler based on platform
    let handler;
    if (isTextOnly) {
      handler = new TextHandler();
    } else {
      switch (platform) {
        case "instagram":
          handler = new InstagramHandler();
          break;
        case "youtube":
          handler = new YouTubeHandler();
          break;
        case "twitter":
          handler = new TwitterHandler();
          break;
        case "tiktok":
          handler = new TikTokHandler();
          break;
        case "web":
          handler = new WebHandler();
          break;
        default:
          throw ApiError.unsupportedPlatform(sanitizedUrl);
      }
    }

    logger.info("Handler selected, starting content processing", {
      requestId,
      operation: "handler-selection",
      platform,
      metadata: { handlerType: handler.constructor.name },
    });

    // Step 6: Process the content using the selected handler
    const result = await handler.process(sanitizedUrl, context);
    const enrichedResult = normalizeAnalysisResult(result);

    const convexMetadata = {
      title: enrichedResult.metadata.title,
      description: enrichedResult.metadata.description,
      creator: enrichedResult.metadata.creator,
      originalUrl: enrichedResult.metadata.originalUrl,
      platform: enrichedResult.metadata.platform,
      contentType: enrichedResult.metadata.contentType,
    } as const;

    const sanitizedConvexMetadata = Object.fromEntries(
      Object.entries(convexMetadata).filter(([, value]) => value !== undefined && value !== null)
    ) as typeof convexMetadata;

    // Persist analysis so history/counts update even if client doesn't save
    if (convex) {
      try {
        await convex.mutation(
          api.tiktokAnalyses.saveTikTokAnalysisWithCredibility,
          {
            videoUrl: sanitizedUrl,
            transcription: enrichedResult.transcription.text
              ? {
                  text: enrichedResult.transcription.text,
                  language: enrichedResult.transcription.language,
                }
              : undefined,
            metadata: sanitizedConvexMetadata,
            newsDetection: enrichedResult.newsDetection ?? undefined,
            factCheck: enrichedResult.factCheck
              ? {
                  verdict: enrichedResult.factCheck.verdict,
                  confidence: enrichedResult.factCheck.confidence,
                  explanation: enrichedResult.factCheck.explanation,
                  content: enrichedResult.factCheck.content,
                  isVerified: enrichedResult.factCheck.isVerified,
                  sources: (enrichedResult.factCheck.sources || []).map(
                    (source) => ({
                      title: source.title,
                      url: source.url,
                      source: source.source,
                      relevance: source.relevance,
                    })
                  ),
                  error: enrichedResult.factCheck.error,
                  totalClaims: enrichedResult.factCheck.totalClaims,
                  checkedClaims: enrichedResult.factCheck.checkedClaims,
                  results: enrichedResult.factCheck.results.map((item) => ({
                    claim: item.claim,
                    status: item.status,
                    confidence: item.confidence,
                    analysis: item.analysis,
                    sources: (item.sources || []).map((source) => source.url),
                    error: item.error,
                  })),
                  summary: enrichedResult.factCheck.summary,
                }
              : undefined,
            requiresFactCheck: enrichedResult.requiresFactCheck,
            creatorCredibilityRating:
              typeof enrichedResult.creatorCredibilityRating === "number"
                ? enrichedResult.creatorCredibilityRating
                : undefined,
          }
        );
      } catch (persistError) {
        logger.warn("Failed to persist analysis to Convex", {
          requestId,
          operation: "persist-analysis",
          platform,
          metadata: {
            errorMessage:
              persistError instanceof Error
                ? persistError.message
                : String(persistError),
          },
        });
      }
    } else {
      logger.warn("Skipping persistence: Convex unavailable", {
        requestId,
        operation: "persist-analysis",
        platform,
      });
    }

    if (convex && !hasUnlimitedCredits) {
      try {
        await convex.mutation(api.credits.deductCredits, { amount: 1 });
      } catch (creditError) {
        logger.error(
          "Failed to deduct credits after successful analysis",
          {
            requestId,
            operation: "credit-deduction",
            metadata: { userId, platform },
          },
          creditError as Error
        );
      }
    }

    // Step 7: Log success and return results
    const duration = Date.now() - startTime;
    logger.info("Content analysis completed successfully", {
      requestId,
      operation: "transcribe",
      platform,
      duration,
      metadata: {
        hasTranscription: !!enrichedResult.transcription.text,
        hasFactCheck: !!enrichedResult.factCheck,
        hasCredibilityRating:
          enrichedResult.creatorCredibilityRating !== null &&
          enrichedResult.creatorCredibilityRating !== undefined,
        factCheckVerdict: enrichedResult.factCheck?.verdict,
        credibilityRating: enrichedResult.creatorCredibilityRating,
      },
    });

    return NextResponse.json(
      { success: true, data: enrichedResult },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Request-ID": requestId,
          "X-Processing-Time": duration.toString(),
          "X-Platform": platform,
        },
      }
    );
  } catch (error) {
    const duration = Date.now() - startTime;

    // Handle known API errors
    if (error instanceof ApiError) {
      logger.warn("API error occurred", {
        requestId,
        operation: "transcribe",
        duration,
        metadata: {
          errorCode: error.code,
          statusCode: error.statusCode,
          errorMessage: error.message,
        },
      });

      return NextResponse.json(error.toJSON(), {
        status: error.statusCode,
        headers: {
          "Content-Type": "application/json",
          "X-Request-ID": requestId,
          "X-Error-Code": error.code,
        },
      });
    }

    // Handle unexpected errors
    logger.error("Unexpected error in content analysis", {
      requestId,
      operation: "transcribe",
      duration,
      metadata: {
        errorName: error instanceof Error ? error.name : "Unknown",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      },
    });

    const internalError = ApiError.internalError(error as Error);
    return NextResponse.json(internalError.toJSON(), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "X-Request-ID": requestId,
        "X-Error-Code": internalError.code,
      },
    });
  }
}

/**
 * Health check endpoint
 * Returns the API status and basic configuration
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: "healthy",
    service: "content-analysis-api",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    supportedPlatforms: ["instagram", "youtube", "twitter", "tiktok", "web"],
    features: [
      "video-transcription",
      "fact-checking",
      "credibility-analysis",
      "rate-limiting",
      "structured-logging",
    ],
  });
}

/**
 * OPTIONS handler for CORS preflight requests
 */
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-User-ID",
      "Access-Control-Max-Age": "86400",
    },
  });
}
