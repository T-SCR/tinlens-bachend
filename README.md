# 🔍 TinLens - AI-Powered Content Verification Platform

> **Combat misinformation with AI-powered fact-checking**

TinLens analyzes content from X/Twitter, YouTube, Instagram, TikTok, and web articles to verify claims, detect fake news, and assess source credibility.

## 🏆 Built for Mumbai Hacks
**Team**: Sharat & Hrithvik  
**Mission**: Fight misinformation with AI

### The Problem We're Solving

Global crises like pandemics, geopolitical conflicts, or climate events generate a surge of online information, much of it confusing, conflicting, or deliberately false. This overload makes it difficult for citizens to know what to trust and how to act - leading to misinformation-driven harm.

In India, with its vast digital population and linguistic diversity, misinformation spreads rapidly across social media platforms, WhatsApp groups, and regional news channels. These include public confusion, social unrest, and a decline in trust toward media, institutions, and one another.

As digital citizens, we all play a role in upholding the truth. But the scale and speed of today's information environment demand technological solutions that can proactively detect, counter, and educate against misinformation, while preserving freedom of speech and access to information.

**Challenge Statement:**

> Build an AI agent capable of scanning multiple content streams and detecting emerging misinformation trends related to global or local crises. The agent should verify claims using cross-references, and produce accessible, contextual explanations or corrections for diverse audiences.

### Our Solution & Approach

**TinLens** addresses this challenge through a comprehensive AI-powered platform that:

1. **Proactively Detects** misinformation using advanced NLP and content analysis
2. **Verifies Claims** through automated fact-checking with credible sources
3. **Evaluates Creator Credibility** using data-driven scoring algorithms
4. **Empowers Users** with accessible tools for content verification
5. **Builds Community Trust** through crowd-sourced verification mechanisms

Presentation Slides: https://docs.google.com/presentation/d/1O4UOYZKQDwquQh6SQevZTGIWCmyUXNDOnwFYMIg6BFM/edit?usp=sharing

## 👥 Team Members

| Name                                | Role                               | Contributions                                                                                    |
| ----------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Sharat Chandra Reddy Thimmareddy** | Team Leader / Full Stack Developer | Project architecture, AI integration, frontend development, API design, misinformation detection |
| **Hrithvik Reddy Gajjala**          | Developer                          | Backend services, AI model integration, fact-checking pipeline, API optimization, documentation  |

## 🚀 Local Development Setup

Clone the repo and install dependencies:

```bash
git clone https://github.com/sharatchandra/tinlens.git
cd tinlens
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Environment Variables

Create a `.env.local` file in the root of your project and add the following variables:

```env
VERCEL_URL=http://localhost:3000
OPENAI_API_KEY=sk-proj-FAKEKEYFORDEMO0987654321
CONVEX_DEPLOYMENT=dev:your-deployment-id # team: mumbai-hacks, project: tinlens
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_FAKEPUBLISHABLEKEY
CLERK_SECRET_KEY=sk_test_FAKESECRETKEY
NEXT_PUBLIC_CLERK_FRONTEND_API_URL=https://your-clerk-instance.clerk.accounts.dev
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/news
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/news
FIRECRAWL_API_KEY=fc-FAKEKEYFORDEMO0987654321
EXA_API_KEY=your-exa-api-key-here
```

> **Important for production deployments**
>
> - Replace the `pk_test_...` / `sk_test_...` Clerk values with your live publishable and secret keys inside the Vercel dashboard. Shipping a build with development keys triggers the `Clerk has been loaded with development keys` warning and enforces strict usage caps.
> - Add `FIRECRAWL_API_KEY` and `EXA_API_KEY` to the Production environment as well. The app now ships with built-in scraping and DuckDuckGo-based fallbacks so `/api/transcribe` no longer returns `503`, but these keys unlock the high-fidelity Firecrawl + Exa pipeline that powers multi-source fact-checking.

### ✅ Production Deployment Checklist

Before shipping a new build, confirm the following secrets exist inside **Vercel → Settings → Environment Variables** (and mirrors in `.env.local` if you self-host):

1. `OPENAI_API_KEY` – powers Whisper transcription and the verification agent.
2. `FIRECRAWL_API_KEY` – enables high-fidelity scraping for social posts + articles.
3. `EXA_API_KEY` – required for evidence gathering; without it fact-checking falls back to low-confidence scraping.
4. `NEXT_PUBLIC_CONVEX_URL` + `CONVEX_DEPLOYMENT` – must match the Convex deployment you intend to use.
5. Clerk keys (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, sign-in overrides) – production keys remove dev-mode limits.

> Tip: add the same values to the **Preview** environment so staging builds behave exactly like production.

## 🛠️ Technologies Used

### Frontend Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - Modern component library
- **React Hooks** - State management and side effects
- **Flutter** - Cross-platform mobile wrapper for TinLens web app  
  _Codebase: see `tinlens_wrapper_flutter/`_
- **Browser Extension** - Chrome/Edge extension for real-time fact-checking overlay  
  _Codebase: see `tinlens-browser-extension/`_

### Backend & Database

- **Convex** - Real-time backend-as-a-service
- **Clerk** - Authentication and user management
- **PostgreSQL** - Structured data storage (via Convex)
- **Serverless Functions** - Auto-scaling API endpoints

### AI & Machine Learning

- **OpenAI GPT-4** - Large language model for analysis and claim extraction
- **OpenAI Whisper** - Speech-to-text transcription for video/audio content
- **Vercel AI SDK** - AI model integration and streaming
- **Natural Language Processing** - Content analysis, sentiment detection, and stance detection
- **Semantic Embeddings** - Claim clustering and similarity detection

### External APIs & Services

- **Exa Search** - Semantic web search for evidence retrieval
- **Firecrawl** - Web content scraping and extraction
- **Trusted Source Registry** - WHO/ICMR, government advisories, fact-check databases

### Development & Deployment

- **Vercel** - Deployment and hosting
- **Git/GitHub** - Version control
- **ESLint** - Code quality and consistency
- **PostCSS** - CSS processing
- **Flutter** - Used for the mobile wrapper  
  _Codebase: see `@/flutter_wrapper/`_
- **Browser Extension** - Built for Chrome/Edge for in-browser fact-checking  
  _Codebase: see `@/browser_extension/`_

## 🚀 Key Features & Capabilities

### 🔍 Multi-Source Content Ingestion

- **Text/URL Submission**: Paste any text content or web URL for analysis
- **Twitter/X Posts**: Process tweets, threads, and embedded media
- **YouTube Videos**: Extract captions, transcribe audio, analyze video claims
- **WhatsApp/Telegram Bot**: Group submissions for rapid community fact-checking
- **Direct Media Upload**: Analyze videos, images, or audio files directly

### 🤖 Intelligent Claimifier

- **Auto Language Detection**: Automatically detect English, Hindi, and other Indian languages
- **Atomic Claim Extraction**: Convert messy content into clear, checkable statements
- **Sub-claim Handling**: Identify and separate multiple claims within single content
- **Entity & Date Recognition**: Extract names, numbers, dates, and locations for precise verification
- **Context Preservation**: Maintain claim context for accurate fact-checking

### ✅ Semantic Evidence Retrieval & Verification

- **Exa-Style Semantic Search**: Advanced semantic web search for comprehensive evidence gathering
- **Trusted Source Registry**: Prioritize WHO/ICMR, government advisories, reputable fact-checkers
- **Stance Detection (NLI)**: Determine if evidence supports, refutes, or is insufficient
- **Multi-Source Cross-Referencing**: Aggregate evidence from multiple credible sources
- **Contradiction Detection**: Identify conflicting information across sources

### 📊 Verdict & Confidence Scoring

- **Four-Category Verdicts**: True / False / Misleading / Unverifiable
- **Transparent Confidence (0-100)**: Based on source trust, coverage, stance agreement, and freshness
- **Explainable Results**: Plain-language explanations with evidence quotes and citations
- **Myth vs Fact Cards**: Shareable visual summaries in English/Hindi for social media
- **Source Citations**: Full links, timestamps, and attribution for all evidence

### 📈 Trend Detection & Clustering

- **Embedding-Based Clustering**: Group similar claims to identify emerging rumors
- **Top Rumor Themes**: Dashboard showing trending misinformation topics
- **Growth Tracking**: Monitor how fast claims are spreading across platforms
- **Tag System**: Categorize claims by topic, region, and crisis type

### 🌐 Accessibility & Localization

- **Bilingual Output (MVP)**: English and Hindi with easy extensibility to regional languages
- **Mobile-First Design**: Responsive interface across all devices
- **WhatsApp/Telegram Integration**: Reach users where they consume information
- **Inline Replies**: Auto-reply templates with fact-check cards
- **Dark/Light Mode**: User preference customization

### 🔄 Feedback & Continuous Learning

- **User Feedback Loop**: "Helpful/Not helpful" votes to tune source weights
- **Deduplication**: Automatically detect and link recurring myths
- **Human Review Queue**: Flag sensitive topics for expert verification
- **Safety Rails**: "Unverifiable right now" path for incomplete evidence

### 📱 Multi-Platform Access

- **Mobile App Wrapper**: Access TinLens as a native-like app on iOS/Android via Flutter
- **Browser Extension**: Instantly fact-check content while browsing Twitter, YouTube, or news sites
- **WhatsApp/Telegram Bots**: Submit claims directly from messaging apps

## 📱 Usage Instructions & Demo

### Getting Started

1. **Visit the Platform**: Navigate to [https://tinlens.vercel.app/] (placeholder)
2. **Sign Up/Login**: Create account using email or social login
3. **Submit Content**: Paste text/URL, Twitter post, YouTube link, or upload media
4. **Automatic Analysis**: TinLens extracts claims, detects language, and searches for evidence
5. **Review Verdict**: Get True/False/Misleading/Unverifiable verdict with confidence score
6. **Share Results**: Download Myth vs Fact cards in English/Hindi for social sharing
7. **Track Trends**: View emerging misinformation themes in the dashboard


```

**Processing Flow:**

1. URL validation and platform detection
2. Content extraction (Twitter Scraper, or Firecrawl)
3. Transcription (if video content exists)
4. News content detection using AI
5. Fact-checking pipeline execution
6. Creator credibility calculation
7. Result compilation and return


### Security & Performance

#### Authentication & Authorization

- **Clerk Integration**: Secure user authentication with social logins
- **Middleware Protection**: Route-level authentication enforcement
- **API Security**: Request validation and rate limiting

#### Performance Optimizations

- **Streaming Responses**: Real-time analysis result delivery
- **Caching Strategy**: Convex-powered efficient data caching
- **Lazy Loading**: Component-based code splitting
- **Image Optimization**: Next.js automatic image optimization

#### Error Handling

- **Graceful Degradation**: Fallback mechanisms for API failures
- **User Feedback**: Clear error messages and retry mechanisms
- **Logging**: Comprehensive error tracking and monitoring

### Scalability Considerations

#### Horizontal Scaling

- **Serverless Architecture**: Auto-scaling API routes
- **Database Sharding**: Convex handles automatic scaling
- **CDN Integration**: Global content delivery

#### Monitoring & Analytics

- **Performance Metrics**: Real-time application monitoring
- **Usage Analytics**: User behavior and feature adoption tracking
- **Error Tracking**: Automated error detection and alerting

## 🏆 Impact & Future Roadmap

### Addressing the Indian Context

- **Language Support**: Prioritizing English, Hindi, and regional Indian languages (Tamil, Telugu, Bengali, Marathi, etc.)
- **Cultural Sensitivity**: Understanding local misinformation patterns across diverse Indian communities
- **Government Collaboration**: Potential integration with official fact-checking bodies (PIB Fact Check, etc.)
- **Crisis Response**: Rapid response to misinformation during pandemics, elections, and natural disasters
- **Educational Outreach**: Community programs for digital literacy in rural and urban areas
- **WhatsApp/Telegram First**: Focus on platforms where misinformation spreads fastest in India

### Planned Enhancements

- **Advanced Claimifier**: Better handling of mixed-language content and code-switching
- **Voice/Audio Analysis**: Transcribe and fact-check audio messages shared on WhatsApp
- **Image & Video Verification**: Reverse image search and deepfake detection
- **Regional Language Models**: Custom-trained models for Indian languages and dialects
- **News Organization API**: Integration capabilities for Indian newsrooms and fact-checkers
- **Blockchain Verification**: Immutable fact-check records for transparency
- **Community Moderator Tools**: Empower local community leaders to combat misinformation

### Credibility algorithm is put in

FUNCTION calculate_credibility(content):
// 1. Initialize score to a neutral value
score = 5.0

// 2. Apply a significant adjustment based on fact-checking
// This is the most heavily weighted factor.
// (e.g., +3 for "true", -4 for "false")
score += get_fact_check_modifier(content.factCheck)

// 3. Apply moderate adjustments based on content quality
// Considers transcription, news context, and content length.
// (e.g., +0.5 for transcription, -1.5 for unverified news)


score += get_content_quality_modifier(content.metadata)
// 4. Apply minor adjustments based on the source platform
// (e.g., -0.2 for Twitter, +0.1 for TikTok)
score += get_platform_modifier(content.platform)
// 5. Normalize the final score to be within 0-10
final_score = clamp(score, 0, 10)
RETURN final_score
END FUNCTION

Starting with a neutral value of 5.0 and then adjusting it based on several key factors. The most significant changes come from fact-checking results, while smaller adjustments are made for content quality, length, and the social media platform of origin. The final score is always normalized to fit on a 0 to 10 scale.


## 📄 License

MIT License - Open source for educational and research purposes

---

_Built with ❤️ for Mumbai Hacks 2025 - Fighting misinformation through technology_

**"No possible way to escape" - TinLens brings truth to light**
