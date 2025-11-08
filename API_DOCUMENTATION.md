# 📡 TinLens API Documentation

## Overview

TinLens provides a comprehensive content analysis API that supports multiple platforms and uses advanced AI for fact-checking.

---

## 🔑 API Keys Configuration

### Required APIs

| Service | Status | Purpose |
|---------|--------|---------|
| **OpenAI** | ⚠️ Need to get | GPT-4 for claim extraction, Whisper for transcription |
| **Exa.ai** | ✅ Configured | Semantic search: `3d578d69-7673-412d-92d4-5c350547c615` |
| **Clerk** | ✅ Configured | User authentication |
| **Convex** | ✅ Configured | Real-time database |
| **Firecrawl** | ✅ Configured | Web scraping |

### Environment Variables

```env
# AI & Analysis
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
EXA_API_KEY=3d578d69-7673-412d-92d4-5c350547c615

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_a25vd24tZGlub3NhdXItNzkuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_hrwjSRFFElPZklwlnXQrNRgv0OKPZinZc8M33C5TCZ

# Database
CONVEX_DEPLOYMENT=dev:elated-wildcat-321
NEXT_PUBLIC_CONVEX_URL=https://elated-wildcat-321.convex.cloud

# Web Scraping
FIRECRAWL_API_KEY=fc-f5e31858821c4dbcb8d9b8c643ecd528
```

---

## 🌐 API Endpoints

### Main Analysis Endpoint

**POST** `/api/transcribe`

Analyzes content from multiple platforms and returns fact-check results.

#### Request Body

```typescript
{
  // Twitter/X
  twitterUrl?: string;  // "https://twitter.com/user/status/123" or "https://x.com/user/status/123"
  
  // TikTok
  tiktokUrl?: string;   // "https://tiktok.com/@user/video/123"
  
  // Web articles
  webUrl?: string;      // "https://example.com/article"
  
  // Direct video
  videoUrl?: string;    // "https://example.com/video.mp4"
}
```

#### Response

```typescript
{
  success: boolean;
  data: {
    transcription: {
      text: string;
      segments: Array<{
        start: number;
        end: number;
        text: string;
      }>;
      language?: string;
    };
    metadata: {
      title: string;
      description: string;
      creator: string;
      originalUrl: string;
      platform: string;
    };
    factCheck: {
      verdict: "verified" | "misleading" | "false" | "unverified" | "satire";
      confidence: number; // 0-100
      explanation: string;
      content: string;
      sources: Array<{
        url: string;
        title: string;
        credibility: number;
      }>;
      flags: string[];
    } | null;
    requiresFactCheck: boolean;
    creatorCredibilityRating: number | null; // 0-10
  };
}
```

#### Example Request

```bash
curl -X POST https://tinlens.vercel.app/api/transcribe \
  -H "Content-Type: application/json" \
  -d '{
    "twitterUrl": "https://twitter.com/elonmusk/status/1234567890"
  }'
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "transcription": {
      "text": "Just announced: New AI breakthrough...",
      "segments": [],
      "language": "en"
    },
    "metadata": {
      "title": "Just announced: New AI breakthrough...",
      "description": "Just announced: New AI breakthrough...",
      "creator": "elonmusk",
      "originalUrl": "https://twitter.com/elonmusk/status/1234567890",
      "platform": "twitter"
    },
    "factCheck": {
      "verdict": "verified",
      "confidence": 85,
      "explanation": "This claim has been verified by multiple sources...",
      "content": "Just announced: New AI breakthrough...",
      "sources": [
        {
          "url": "https://techcrunch.com/article",
          "title": "AI Breakthrough Confirmed",
          "credibility": 0.9
        }
      ],
      "flags": []
    },
    "requiresFactCheck": true,
    "creatorCredibilityRating": 7.5
  }
}
```

---

## 🔍 Platform Support

### 1. Twitter/X Analysis

**Package**: `@the-convocation/twitter-scraper` (v0.17.1)

**Capabilities**:
- ✅ Extract tweet text
- ✅ Extract video URLs
- ✅ Transcribe video content
- ✅ Fact-check claims
- ✅ Calculate creator credibility

**Supported URLs**:
- `https://twitter.com/username/status/1234567890`
- `https://x.com/username/status/1234567890`
- `https://mobile.twitter.com/username/status/1234567890`

**Implementation**:
```typescript
// File: app/api/transcribe/handlers/twitter-handler.ts
import { Scraper } from "@the-convocation/twitter-scraper";

const scraper = new Scraper();
const tweet = await scraper.getTweet(tweetId);
```

**Features**:
- Real-time tweet fetching
- Video extraction and transcription
- Multi-media support
- Credibility scoring

---

### 2. TikTok Analysis

**Package**: `@tobyg74/tiktok-api-dl` (v1.3.2)

**Capabilities**:
- ✅ Download video
- ✅ Extract metadata
- ✅ Transcribe audio
- ✅ Fact-check content

**Supported URLs**:
- `https://www.tiktok.com/@username/video/1234567890`
- `https://vm.tiktok.com/SHORTCODE`
- `https://vt.tiktok.com/SHORTCODE`

---

### 3. Web Article Analysis

**Package**: `@mendable/firecrawl-js` (v1.26.0)

**Capabilities**:
- ✅ Scrape article content
- ✅ Extract main text
- ✅ Fact-check claims
- ✅ Source verification

**Supported URLs**:
- Any HTTP/HTTPS URL
- News websites
- Blog posts
- Documentation sites

---

## 🧠 AI Services

### 1. OpenAI Integration

**Models Used**:
- **GPT-4-turbo**: Claim extraction, fact-checking analysis
- **Whisper-1**: Audio transcription

**Usage**:
```typescript
// Claim extraction
const claims = await openai.chat.completions.create({
  model: "gpt-4-turbo",
  messages: [{ role: "user", content: "Extract claims from: ..." }]
});

// Transcription
const transcription = await openai.audio.transcriptions.create({
  file: audioFile,
  model: "whisper-1"
});
```

**Files**:
- `tools/fact-checking/claim-extraction.ts`
- `tools/transcription/whisper.ts`
- `tools/fact-checking/verification-analysis.ts`

---

### 2. Exa.ai Semantic Search

**API Key**: `3d578d69-7673-412d-92d4-5c350547c615`

**Quota**: 1,000 searches/month (free tier)

**Implementation Location**: `tools/fact-checking/web-research.ts`

**How It Works**:

```typescript
// Step 1: GPT-4 generates optimal search query
const searchQuery = await generateText({
  model: openai("gpt-4o-mini"),
  prompt: "Create search query for fact-checking: ${claim}"
});

// Step 2: Exa searches web semantically
const searchResponse = await fetch("https://api.exa.ai/search", {
  method: "POST",
  headers: {
    "x-api-key": process.env.EXA_API_KEY,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    query: searchQuery,
    numResults: 10
  })
});

// Step 3: Exa retrieves full content from top URLs
const contentsResponse = await fetch("https://api.exa.ai/contents", {
  method: "POST",
  headers: {
    "x-api-key": process.env.EXA_API_KEY,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    urls: topUrls,
    text: true,
    summary: true,
    highlights: true
  })
});

// Step 4: GPT-4 analyzes retrieved content
const verdict = await analyzeEvidence(content);
```

**Key Features**:
- **Semantic Search**: Understands intent, not just keywords
- **Content Retrieval**: Gets full page text + summaries
- **Smart Filtering**: Top 5 most relevant sources
- **Credibility Scoring**: Evaluates source trustworthiness

**API Endpoints Used**:
- `POST https://api.exa.ai/search` - Semantic web search
- `POST https://api.exa.ai/contents` - Retrieve full content

**Response Structure**:
```typescript
// Search response
{
  results: [
    {
      url: string;
      title: string;
      score: number;
    }
  ]
}

// Contents response
{
  results: [
    {
      url: string;
      title: string;
      text: string;
      summary: string;
      highlights: string[];
    }
  ]
}
```

---

### 3. Clerk Authentication

**Configured Keys**:
- Publishable: `pk_test_a25vd24tZGlub3NhdXItNzkuY2xlcmsuYWNjb3VudHMuZGV2JA`
- Secret: `sk_test_hrwjSRFFElPZklwlnXQrNRgv0OKPZinZc8M33C5TCZ`

**Features**:
- Email/password authentication
- Social login (Google, GitHub)
- Session management
- User profiles

**Middleware**: `middleware.ts`

```typescript
export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});
```

---

### 4. Convex Database

**Configured**:
- Deployment: `dev:elated-wildcat-321`
- URL: `https://elated-wildcat-321.convex.cloud`

**Schema** (`convex/schema.ts`):
- `analyses` - Saved fact-check results
- `users` - User profiles
- `sources` - Credible/non-credible source tracking

**Real-time Features**:
- Live analysis updates
- News feed with latest analyses
- Creator credibility tracking

---

### 5. Firecrawl Web Scraping

**API Key**: `fc-f5e31858821c4dbcb8d9b8c643ecd528`

**Usage**:
```typescript
const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const content = await firecrawl.scrapeUrl(url);
```

**Capabilities**:
- JavaScript rendering
- Content extraction
- Metadata parsing
- Rate limiting

---

## 📊 Analysis Pipeline

### Complete Flow

```
User Input (URL)
    ↓
1. Platform Detection
    ↓
2. Content Extraction
    - Twitter: @the-convocation/twitter-scraper
    - TikTok: @tobyg74/tiktok-api-dl
    - Web: Firecrawl
    ↓
3. Transcription (if video)
    - OpenAI Whisper-1
    ↓
4. Claim Extraction
    - GPT-4-turbo
    ↓
5. Fact-Checking
    - GPT-4 creates search query
    - Exa.ai semantic search
    - Exa.ai content retrieval
    - GPT-4 analyzes evidence
    ↓
6. Credibility Rating
    - GPT-4 calculates score (0-10)
    ↓
7. Save to Convex
    ↓
8. Return Results
```

---

## 🔐 Rate Limits

| Service | Limit | Handling |
|---------|-------|----------|
| **OpenAI** | Per-token usage | Exponential backoff |
| **Exa.ai** | 1,000 searches/month | Cache results |
| **Clerk** | 10,000 users (free) | - |
| **Convex** | Generous free tier | - |
| **Firecrawl** | 500 credits/month | Queue system |
| **TinLens API** | 100 req/min | Built-in rate limiter |

**Rate Limiter**: `lib/rate-limiter.ts`

```typescript
const rateLimitResult = checkOperationRateLimit(request, "transcribe");
if (!rateLimitResult.allowed) {
  return 429 - Too Many Requests
}
```

---

## 🛠️ Error Handling

### Error Codes

```typescript
// lib/api-error.ts

class ApiError extends Error {
  // Platform errors
  UNSUPPORTED_PLATFORM
  INVALID_URL
  
  // Extraction errors
  TIKTOK_FETCH_FAILED
  TWITTER_FETCH_FAILED
  WEB_SCRAPE_FAILED
  
  // Processing errors
  TRANSCRIPTION_FAILED
  FACT_CHECK_FAILED
  
  // System errors
  RATE_LIMITED
  INTERNAL_ERROR
  MISSING_API_KEY
}
```

### Example Error Response

```json
{
  "success": false,
  "error": {
    "code": "TWITTER_FETCH_FAILED",
    "message": "Failed to fetch tweet: Tweet not found or private",
    "statusCode": 404,
    "details": {
      "tweetId": "1234567890",
      "timestamp": "2024-11-08T17:00:00Z"
    }
  }
}
```

---

## 📈 Monitoring & Logging

### Logging System

**Package**: Custom logger (`lib/logger.ts`)

**Levels**:
- `debug` - Detailed operation logs
- `info` - Important events
- `warn` - Warning conditions
- `error` - Error conditions

**Context**:
- Request ID
- Platform
- Operation
- Duration
- Metadata

**Example**:
```typescript
logger.info("Content analysis completed", {
  requestId: "abc-123",
  operation: "transcribe",
  platform: "twitter",
  duration: 2500,
  metadata: {
    verdict: "verified",
    confidence: 85
  }
});
```

---

## 🧪 Testing

### Test URLs

**Twitter**:
```bash
curl -X POST https://tinlens.vercel.app/api/transcribe \
  -H "Content-Type: application/json" \
  -d '{"twitterUrl": "https://twitter.com/username/status/123"}'
```

**TikTok**:
```bash
curl -X POST https://tinlens.vercel.app/api/transcribe \
  -H "Content-Type: application/json" \
  -d '{"tiktokUrl": "https://tiktok.com/@user/video/123"}'
```

**Web**:
```bash
curl -X POST https://tinlens.vercel.app/api/transcribe \
  -H "Content-Type: application/json" \
  -d '{"webUrl": "https://www.bbc.com/news/article"}'
```

---

## 📚 Code References

### Key Files

| File | Purpose |
|------|---------|
| `app/api/transcribe/route.ts` | Main API endpoint |
| `app/api/transcribe/handlers/twitter-handler.ts` | Twitter analysis |
| `app/api/transcribe/handlers/tiktok-handler.ts` | TikTok analysis |
| `app/api/transcribe/handlers/web-handler.ts` | Web scraping |
| `tools/fact-checking/web-research.ts` | Exa.ai integration |
| `tools/fact-checking/claim-extraction.ts` | GPT-4 claim extraction |
| `lib/validation.ts` | URL validation & platform detection |
| `middleware.ts` | Clerk authentication |

---

## 🚀 Deployment

### Vercel Configuration

**Build Command**: `npm run build`

**Output Directory**: `.next`

**Environment Variables**: See section above

**Required Env Vars for Vercel**:
```
OPENAI_API_KEY
EXA_API_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
CONVEX_DEPLOYMENT
NEXT_PUBLIC_CONVEX_URL
FIRECRAWL_API_KEY
```

---

## 💡 Best Practices

1. **Caching**: Cache Exa results to save API calls
2. **Error Handling**: Always return user-friendly messages
3. **Logging**: Use request IDs for tracking
4. **Rate Limiting**: Respect API quotas
5. **Security**: Never expose API keys in client code
6. **Monitoring**: Track OpenAI token usage

---

## 📞 Support

- **Exa.ai Dashboard**: https://exa.ai/dashboard
- **OpenAI Usage**: https://platform.openai.com/usage
- **Clerk Dashboard**: https://dashboard.clerk.com/
- **Convex Dashboard**: https://dashboard.convex.dev/
- **Vercel Logs**: https://vercel.com/dashboard

---

**API Documentation Version**: 1.0.0  
**Last Updated**: November 8, 2024
