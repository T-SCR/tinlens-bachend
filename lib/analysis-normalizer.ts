import {
  BaseAnalysisResult,
  FactCheckResult as RawFactCheckResult,
} from "@/app/api/transcribe/handlers/base-handler";
import {
  ContentAnalysisData,
  FactCheckData,
  FactCheckResult,
  FactCheckStatus,
  FactCheckSummary,
  FactCheckSource,
  NewsDetection,
} from "@/types/analysis";

const VERDICT_STATUS_MAP: Record<
  RawFactCheckResult["verdict"],
  FactCheckStatus
> = {
  verified: "verified",
  misleading: "misleading",
  false: "false",
  unverified: "unverifiable",
  satire: "needs_verification",
};

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "that",
  "with",
  "from",
  "this",
  "have",
  "will",
  "your",
  "about",
  "been",
  "into",
  "their",
  "https",
  "http",
  "www",
  "com",
  "news",
  "video",
  "post",
  "reel",
  "article",
  "watch",
]);

function ensureUrlHost(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function normalizeSources(
  rawSources: RawFactCheckResult["sources"] | undefined
): FactCheckSource[] {
  if (!rawSources?.length) {
    return [];
  }

  return rawSources.map((source) => ({
    title: source.title || ensureUrlHost(source.url),
    url: source.url,
    source: ensureUrlHost(source.url),
    relevance: source.credibility,
  }));
}

function summarizeStatus(status: FactCheckStatus): FactCheckSummary {
  return {
    verifiedTrue: status === "verified" ? 1 : 0,
    verifiedFalse: status === "false" ? 1 : 0,
    misleading: status === "misleading" ? 1 : 0,
    unverifiable: status === "unverifiable" ? 1 : 0,
    needsVerification: status === "needs_verification" ? 1 : 0,
  };
}

function extractKeywords(text: string, limit = 6): string[] {
  if (!text) {
    return [];
  }

  const frequencies = new Map<string, number>();
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 4 && !STOP_WORDS.has(token))
    .forEach((token) => {
      frequencies.set(token, (frequencies.get(token) ?? 0) + 1);
    });

  return [...frequencies.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([token]) => token);
}

function buildFactCheckData(
  rawFactCheck: RawFactCheckResult | null,
  fallbackTitle: string
): FactCheckData | null {
  if (!rawFactCheck) {
    return null;
  }

  const status =
    VERDICT_STATUS_MAP[rawFactCheck.verdict] ?? "needs_verification";
  const sources = normalizeSources(rawFactCheck.sources);
  const claim =
    rawFactCheck.content?.trim() && rawFactCheck.content.length > 3
      ? rawFactCheck.content
      : fallbackTitle;

  const normalizedResult: FactCheckResult = {
    claim,
    status,
    confidence: Math.round(rawFactCheck.confidence ?? 0),
    analysis: rawFactCheck.explanation,
    sources,
    flags: rawFactCheck.flags,
  };

  const summary = summarizeStatus(status);

  return {
    verdict: rawFactCheck.verdict,
    confidence: Math.round(rawFactCheck.confidence ?? 0),
    explanation: rawFactCheck.explanation,
    content: rawFactCheck.content,
    isVerified: status === "verified",
    totalClaims: 1,
    checkedClaims: 1,
    results: [normalizedResult],
    summary,
    sources,
    flags: rawFactCheck.flags,
  };
}

function buildNewsDetection(
  baseResult: BaseAnalysisResult,
  factCheck: FactCheckData | null,
  keywordFallback: string[]
): NewsDetection | null {
  if (baseResult.newsDetection) {
    return {
      hasNewsContent: baseResult.newsDetection.hasNewsContent,
      confidence: baseResult.newsDetection.confidence,
      newsKeywordsFound:
        baseResult.newsDetection.newsKeywordsFound.length > 0
          ? baseResult.newsDetection.newsKeywordsFound
          : keywordFallback,
      potentialClaims:
        baseResult.newsDetection.potentialClaims.length > 0
          ? baseResult.newsDetection.potentialClaims
          : factCheck?.results.map((result) => result.claim).slice(0, 3) ??
            keywordFallback,
      needsFactCheck: baseResult.newsDetection.needsFactCheck,
      contentType: baseResult.newsDetection.contentType,
    };
  }

  if (!keywordFallback.length && !factCheck) {
    return null;
  }

  const confidence = factCheck
    ? Math.min(0.95, Math.max(0.25, (factCheck.confidence ?? 60) / 100))
    : 0.45;

  return {
    hasNewsContent: !!factCheck || keywordFallback.length > 0,
    confidence,
    newsKeywordsFound: keywordFallback,
    potentialClaims:
      factCheck?.results.map((result) => result.claim).slice(0, 3) ??
      keywordFallback,
    needsFactCheck: baseResult.requiresFactCheck,
    contentType: baseResult.metadata.platform ?? "web",
  };
}

export function normalizeAnalysisResult(
  baseResult: BaseAnalysisResult
): ContentAnalysisData {
  const keywordText = [
    baseResult.metadata.title,
    baseResult.metadata.description,
    baseResult.factCheck?.content,
  ]
    .filter(Boolean)
    .join(" ");

  const keywords = extractKeywords(keywordText);
  const factCheck = buildFactCheckData(
    baseResult.factCheck,
    baseResult.metadata.title
  );
  const newsDetection = buildNewsDetection(baseResult, factCheck, keywords);

  return {
    transcription: {
      text: baseResult.transcription.text,
      segments: baseResult.transcription.segments.map((segment) => ({
        text: segment.text,
        startSecond: Math.max(0, Math.round(segment.start)),
        endSecond: Math.max(0, Math.round(segment.end)),
      })),
      language: baseResult.transcription.language,
    },
    metadata: {
      title: baseResult.metadata.title,
      description: baseResult.metadata.description,
      creator: baseResult.metadata.creator,
      originalUrl: baseResult.metadata.originalUrl,
      platform: baseResult.metadata.platform,
      contentType: baseResult.metadata.contentType,
      thumbnailUrl: baseResult.metadata.thumbnailUrl,
      hashtags: baseResult.metadata.hashtags,
      creatorHandle: baseResult.metadata.creatorHandle,
      publishedAt: baseResult.metadata.publishedAt,
      durationSeconds: baseResult.metadata.durationSeconds,
      stats: baseResult.metadata.stats,
    },
    newsDetection,
    factCheck,
    requiresFactCheck: baseResult.requiresFactCheck,
    creatorCredibilityRating: baseResult.creatorCredibilityRating,
  };
}
