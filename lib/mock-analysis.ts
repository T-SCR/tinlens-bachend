import { ContentAnalysisData } from "@/types/analysis";

const MOCK_SOURCES = [
  {
    title: "Reuters",
    url: "https://www.reuters.com/",
    source: "reuters.com",
    relevance: 92,
    description: "Global newswire with on-the-ground fact gathering",
  },
  {
    title: "BBC News",
    url: "https://www.bbc.com/news",
    source: "bbc.com",
    relevance: 88,
    description: "Public service broadcaster with rigorous editorial standards",
  },
  {
    title: "AP News",
    url: "https://apnews.com/",
    source: "apnews.com",
    relevance: 85,
    description: "Associated Press verified newsroom reporting",
  },
] as const;

const MOCK_FACT_CHECK_RESULTS = [
  {
    claim: "Mock claim about current events",
    status: "needs_verification" as const,
    confidence: 88,
    analysis:
      "Simulated assessment indicating the statement should be corroborated with official sources before sharing.",
    sources: MOCK_SOURCES.map((source) => ({
      ...source,
    })),
  },
  {
    claim: "Simulated statement requiring verification",
    status: "needs_verification" as const,
    confidence: 82,
    analysis:
      "Demonstrates how TinLens would gather evidence and highlight possible misinformation tactics.",
    sources: MOCK_SOURCES.slice(0, 2).map((source) => ({
      ...source,
    })),
  },
] as const;

const MOCK_FACT_CHECK_SUMMARY = {
  verifiedTrue: 0,
  verifiedFalse: 0,
  misleading: 0,
  unverifiable: 0,
  needsVerification: MOCK_FACT_CHECK_RESULTS.length,
};

export function buildMockAnalysis(originalUrl: string): ContentAnalysisData {
  const safeUrl =
    originalUrl && originalUrl.startsWith("http")
      ? originalUrl
      : "https://x.com/mock/status/123456789";

  const transcriptionIntro = `This is a mock transcription of the content from ${safeUrl}.

The AI has simulated transcribing the audio/video content. In this mock analysis, we're demonstrating how the system would extract spoken words, identify key claims, and prepare them for fact-checking.`;

  return {
    transcription: {
      text: `${transcriptionIntro}

Key simulated claims found:
· Mock claim about current events
· Simulated statement requiring verification
· Example of content that would trigger fact-checking processes`,
      segments: [
        {
          text: transcriptionIntro,
          startSecond: 0,
          endSecond: 35,
        },
        {
          text:
            "Key simulated claims include potential misinformation about current events and statements that warrant verification.",
          startSecond: 36,
          endSecond: 65,
        },
      ],
      language: "en",
    },
    metadata: {
      title: "Mock Content Analysis - Demo Mode",
      description:
        "This is a simulated analysis showing how TinLens would process real content without using expensive APIs.",
      creator: "MockCreator123",
      originalUrl: safeUrl,
      platform: "web",
    },
    newsDetection: {
      hasNewsContent: true,
      confidence: 0.9,
      newsKeywordsFound: ["geopolitics", "viral video", "fact-check"],
      potentialClaims: MOCK_FACT_CHECK_RESULTS.map((result) => result.claim),
      needsFactCheck: true,
      contentType: "news/factual",
    },
    factCheck: {
      verdict: "needs_verification",
      confidence: 85,
      explanation:
        "Mock content summary: the system has analyzed the provided URL and generated this demo fact-check result to show how real analysis would work.",
      content:
        "Mock Fact-Check Analysis — This is a demonstration of how TinLens would analyze the content. In a real scenario, the system would execute the verification process automatically.",
      isVerified: false,
      totalClaims: MOCK_FACT_CHECK_RESULTS.length,
      checkedClaims: MOCK_FACT_CHECK_RESULTS.length,
      results: MOCK_FACT_CHECK_RESULTS.map((result) => ({
        ...result,
        flags: ["mock_data"],
      })),
      summary: MOCK_FACT_CHECK_SUMMARY,
      sources: MOCK_SOURCES.map((source) => ({ ...source })),
      error: undefined,
      flags: ["mock_demo"],
    },
    requiresFactCheck: true,
    creatorCredibilityRating: 6.8,
  };
}
