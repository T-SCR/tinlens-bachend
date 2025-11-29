import { experimental_transcribe } from "ai";
import { openai } from "@ai-sdk/openai";
import FirecrawlApp from "@mendable/firecrawl-js";
import { load } from "cheerio";
import { logger } from "../lib/logger";
import { isStrictRealMode } from "../lib/config";

const FALLBACK_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const MAX_CONTENT_LENGTH = 20000;

interface ScrapedMetadata {
  url: string;
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string;
  language?: string;
}

interface ScrapeContentData {
  title: string;
  content: string;
  author: string;
  description: string;
  metadata: ScrapedMetadata;
}

interface ScrapeContentResult {
  success: boolean;
  data?: ScrapeContentData;
  error?: string;
}

async function fallbackScrapeWebContent(url: string): Promise<ScrapeContentResult> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": FALLBACK_USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Fallback scraping failed (HTTP ${response.status})`,
      };
    }

    const html = await response.text();
    const $ = load(html);

    $("script, style, noscript").remove();

    const getMeta = (selectors: string[]) => {
      for (const selector of selectors) {
        const value = $(selector).attr("content");
        if (value && value.trim()) {
          return value.trim();
        }
      }
      return "";
    };

    const title =
      getMeta(['meta[property="og:title"]', 'meta[name="twitter:title"]']) ||
      $("title").text().trim() ||
      "Web Content";
    const description =
      getMeta([
        'meta[name="description"]',
        'meta[property="og:description"]',
        'meta[name="twitter:description"]',
      ]) || "";
    const author =
      getMeta([
        'meta[name="author"]',
        'meta[property="article:author"]',
        'meta[property="og:site_name"]',
      ]) || "Unknown";

    const articleSelectors = [
      "article",
      "main",
      '[role="main"]',
      ".article-body",
      ".article-content",
      ".post-content",
      ".entry-content",
      "#content",
      ".content",
    ];

    let content = "";
    for (const selector of articleSelectors) {
      const text = $(selector).text().trim();
      if (text.length > content.length) {
        content = text;
      }
    }

    if (!content) {
      content = $("body").text().trim();
    }

    const normalizedContent = content.replace(/\s+/g, " ").trim();
    const truncatedContent =
      normalizedContent.length > MAX_CONTENT_LENGTH
        ? normalizedContent.substring(0, MAX_CONTENT_LENGTH)
        : normalizedContent;

    const publishedTime =
      getMeta([
        'meta[property="article:published_time"]',
        'meta[name="pubdate"]',
        'meta[name="date"]',
      ]) || undefined;
    const modifiedTime =
      getMeta([
        'meta[property="article:modified_time"]',
        'meta[name="lastmod"]',
      ]) || undefined;
    const keywords =
      getMeta([
        'meta[name="keywords"]',
        'meta[name="news_keywords"]',
      ]) || undefined;
    const language =
      $("html").attr("lang") ||
      getMeta(['meta[property="og:locale"]']) ||
      undefined;

    if (!truncatedContent) {
      return {
        success: false,
        error: "Unable to extract readable content from page",
      };
    }

    return {
      success: true,
      data: {
        title,
        content: truncatedContent,
        author,
        description,
        metadata: {
          url,
          publishedTime,
          modifiedTime,
          keywords,
          language,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Scraping failed",
    };
  }
}

/**
 * Helper function to transcribe a video directly from a given URL using OpenAI Whisper.
 * @param {string} videoUrl - The direct URL of the video to transcribe.
 * @returns {Promise<{ success: boolean; data?: { text: string; segments: any[]; language: string }; error?: string }>} Transcription result object.
 */
export async function transcribeVideoDirectly(videoUrl: string) {
  try {
    if (!videoUrl) {
      return {
        success: false,
        error: "Video URL is required",
      };
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return {
        success: false,
        error: "OpenAI API key not configured",
      };
    }

    // Download the video content
    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
      return {
        success: false,
        error: "Failed to fetch video",
      };
    }

    // Get the video as an array buffer
    const videoArrayBuffer = await videoResponse.arrayBuffer();
    const videoBuffer = Buffer.from(videoArrayBuffer);

    // Use AI SDK's experimental transcribe function
    const transcription = await experimental_transcribe({
      model: openai.transcription("whisper-1"),
      audio: videoBuffer,
    });

    // Return the transcription results
    return {
      success: true,
      data: {
        text: transcription.text,
        segments: transcription.segments || [],
        language: transcription.language,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Transcription failed",
    };
  }
}

/**
 * Helper function to scrape web content using Firecrawl for non-TikTok/Twitter URLs.
 * @param {string} url - The URL to scrape.
 * @returns {Promise<{ success: boolean; data?: { title: string; content: string; author?: string; description?: string }; error?: string }>} Scraping result object.
 */
export async function scrapeWebContent(url: string) {
  if (!url) {
    return {
      success: false,
      error: "URL is required",
    };
  }

  const firecrawlKey = process.env.FIRECRAWL_API_KEY;

  if (isStrictRealMode && !firecrawlKey) {
    logger.warn("STRICT_REAL_MODE is enabled but FIRECRAWL_API_KEY is missing", {
      operation: "scrapeWebContent",
      metadata: { url },
    });
    return {
      success: false,
      error: "FIRECRAWL_API_KEY is required in STRICT_REAL_MODE",
    };
  }

  if (firecrawlKey) {
    try {
      const app = new FirecrawlApp({ apiKey: firecrawlKey });
      const scrapeResult = await app.scrapeUrl(url, {
        formats: ["markdown", "html"],
        includeTags: ["title", "meta", "article", "main", "content"],
        excludeTags: ["nav", "footer", "sidebar", "advertisement"],
        waitFor: 1000,
      });

      if (scrapeResult.success) {
        type FirecrawlScrapeResult = {
          data?: {
            metadata?: Record<string, unknown>;
            markdown?: string;
            html?: string;
          };
          metadata?: Record<string, unknown>;
          markdown?: string;
          html?: string;
        };

        const firecrawlData = scrapeResult as unknown as FirecrawlScrapeResult;
        const data: {
          metadata?: Record<string, unknown>;
          markdown?: string;
          html?: string;
        } =
          firecrawlData.data ?? {
            metadata: firecrawlData.metadata,
            markdown: firecrawlData.markdown,
            html: firecrawlData.html,
          };

        const rawMetadata = (data.metadata ?? {}) as Record<string, unknown>;
        const markdown = typeof data.markdown === "string" ? data.markdown : undefined;
        const html = typeof data.html === "string" ? data.html : undefined;
        const getString = (value: unknown): string | undefined =>
          typeof value === "string" && value.trim().length > 0
            ? value.trim()
            : undefined;

        const title =
          getString(rawMetadata.title) ||
          getString(rawMetadata.ogTitle) ||
          "Untitled Content";
        const description =
          getString(rawMetadata.description) ||
          getString(rawMetadata.ogDescription) ||
          "";
        const author =
          getString(rawMetadata.author) ||
          getString(rawMetadata.ogSiteName) ||
          "Unknown";
        const content = markdown || html || "";

        if (content.trim().length > 0) {
          return {
            success: true,
            data: {
              title,
              content,
              author,
              description,
              metadata: {
                url: getString(rawMetadata.sourceURL) || url,
                publishedTime: getString(rawMetadata.publishedTime),
                modifiedTime: getString(rawMetadata.modifiedTime),
                keywords: getString(rawMetadata.keywords),
                language: getString(rawMetadata.language),
              },
            },
          };
        }
      }

      if (isStrictRealMode) {
        logger.warn("Firecrawl scrape returned empty content in STRICT_REAL_MODE", {
          operation: "scrapeWebContent",
          metadata: { url },
        });
        return {
          success: false,
          error: "Firecrawl returned empty content",
        };
      }

      logger.warn("Firecrawl scrape returned empty content, using fallback", {
        operation: "scrapeWebContent",
        metadata: { url },
      });
    } catch (error) {
      if (isStrictRealMode) {
        logger.warn("Firecrawl scraping failed in STRICT_REAL_MODE", {
          operation: "scrapeWebContent",
          metadata: { url, error: error instanceof Error ? error.message : String(error) },
        });
        return {
          success: false,
          error: error instanceof Error ? error.message : "Firecrawl failed",
        };
      } else {
        logger.warn("Firecrawl scraping failed, using fallback extraction", {
          operation: "scrapeWebContent",
          metadata: { url, error: error instanceof Error ? error.message : String(error) },
        });
      }
    }
  } else {
    if (!isStrictRealMode) {
      logger.warn("Firecrawl API key missing, using fallback extraction", {
        operation: "scrapeWebContent",
        metadata: { url },
      });
    }
  }

  return isStrictRealMode
    ? { success: false, error: "Scrape fallback disabled in STRICT_REAL_MODE" }
    : fallbackScrapeWebContent(url);
}
