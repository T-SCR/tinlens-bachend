import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";

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
import { ProcessingContext } from "./handlers/base-handler";
import { api } from "@/convex/_generated/api";

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

    // Step 2: Extract and sanitize the URL
    const rawUrl =
      validatedRequest.webUrl ||
      validatedRequest.instagramUrl ||
      validatedRequest.youtubeUrl ||
      validatedRequest.contentUrl!;

    const sanitizedUrl = sanitizeUrl(rawUrl);
    const platform = detectPlatform(sanitizedUrl);
    validateUrl(sanitizedUrl, platform);

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

    const convexToken = await getToken({ template: "convex" });
    if (!convexToken) {
      throw ApiError.internalError(
        new Error("Unable to obtain Convex auth token from Clerk.")
      );
    }

    const convex = createConvexClient(convexToken);
    const currentUser = await convex.query(api.users.getCurrentUser, {});

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "USER_NOT_FOUND",
            message: "We could not locate your TinLens account record.",
          },
        },
        { status: 404 }
      );
    }

    const hasUnlimitedCredits =
      currentUser.hasUnlimitedCredits || currentUser.credits === -1;
    const availableCredits = currentUser.credits ?? 0;
    if (!hasUnlimitedCredits && availableCredits < 1) {
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
    };

    // Step 5: Select appropriate handler based on platform
    let handler;
    switch (platform) {
      case "instagram":
        handler = new InstagramHandler();
        break;
      case "youtube":
        handler = new YouTubeHandler();
        break;
      case "web":
        handler = new WebHandler();
        break;
      default:
        throw ApiError.unsupportedPlatform(sanitizedUrl);
    }

    logger.info("Handler selected, starting content processing", {
      requestId,
      operation: "handler-selection",
      platform,
      metadata: { handlerType: handler.constructor.name },
    });

    // Step 6: Process the content using the selected handler
    const result = await handler.process(sanitizedUrl, context);

    if (!hasUnlimitedCredits) {
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
        hasTranscription: !!result.transcription.text,
        hasFactCheck: !!result.factCheck,
        hasCredibilityRating: result.creatorCredibilityRating !== null,
        factCheckVerdict: result.factCheck?.verdict,
        credibilityRating: result.creatorCredibilityRating,
      },
    });

    return NextResponse.json(
      { success: true, data: result },
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
    supportedPlatforms: ["instagram", "youtube", "web"],
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
