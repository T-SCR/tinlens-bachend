# TinLens 🔍

_AI-Powered Misinformation Detection & Fact-Checking Platform_

> No possible way to escape. Combating digital misinformation in India through advanced AI, NLP, and crowd-sourced verification

---

## 🏆 Mumbai Hacks Challenge & Our Approach

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

## 👥 Team Members

| Name                                | Role                               | Contributions                                                                                    |
| ----------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Sharat Chandra Reddy Thimmareddy** | Team Leader / Full Stack Developer | Project architecture, AI integration, frontend development, API design, misinformation detection |
| **Hrithvik Reddy Gajjala**          | Backend + AI Developer             | Backend services, AI model integration, fact-checking pipeline, API optimization, documentation  |

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

## 📚 Developer Documentation

For new developers joining the project, comprehensive documentation is available:

### 🚀 Quick Start

- **[Developer Onboarding Guide](./docs/DEVELOPER_ONBOARDING.md)** - Complete setup and getting started guide

### 📖 Core Documentation

- **[Architecture Guide](./docs/ARCHITECTURE_GUIDE.md)** - System design and technology overview
- **[Database Guide](./docs/DATABASE_GUIDE.md)** - Convex schema, operations, and patterns
- **[Hooks Guide](./docs/HOOKS_GUIDE.md)** - Custom React hooks for data management
- **[API Guide](./docs/API_GUIDE.md)** - API endpoints and interfaces

### 🔧 Existing Guides

- **[Refactoring Guide](./docs/REFACTORING_GUIDE.md)** - Code improvement guidelines
- **[RSC Refactoring Guide](./docs/RSC_REFACTORING_GUIDE.md)** - React Server Components migration

**New developers should start with the [Developer Onboarding Guide](./docs/DEVELOPER_ONBOARDING.md) for a complete setup walkthrough.**

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
- **TikTok API** (`@tobyg74/tiktok-api-dl`) - Video content extraction
- **Twitter/X API** (`@the-convocation/twitter-scraper`) - Social media analysis
- **YouTube API** - Video captions and metadata extraction
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

1. **Visit the Platform**: Navigate to [tinlens.demo.com] (placeholder)
2. **Sign Up/Login**: Create account using email or social login
3. **Submit Content**: Paste text/URL, Twitter post, YouTube link, or upload media
4. **Automatic Analysis**: TinLens extracts claims, detects language, and searches for evidence
5. **Review Verdict**: Get True/False/Misleading/Unverifiable verdict with confidence score
6. **Share Results**: Download Myth vs Fact cards in English/Hindi for social sharing
7. **Track Trends**: View emerging misinformation themes in the dashboard

### Demo Screenshots

> **Note**: Screenshots are from a live demo of the platform.

#### 1. Landing Page & Hero Section

![Landing Page](readme/assests/sc-1.png)

- Clean, modern landing page with a clear value proposition.
- Explains the platform's mission to combat misinformation.
- Clear call-to-action buttons to get started.

#### 2. Browser Extension

![Analysis Interface](readme/assests/sc-2.png)

#### 3. Fact-Check Results Dashboard

![Fact-Check Dashboard](readme/assests/sc-3.png)

- Comprehensive results display with an overall credibility score.
- Detailed fact-check breakdown with sources and explanations.
- Links to creator credibility profiles.

#### 4. Detailed Analysis View

![Detailed Analysis](readme/assests/sc-4.png)

- In-depth view with full transcription, sentiment analysis, and identified claims.
- Allows users to scrutinize the evidence and analysis process.

#### 5. Creator Credibility Profile

![Creator Credibility](readme/assests/sc-6.png)

- Historical credibility trends for content creators.
- Analysis of past content and community feedback.

#### 6. Saved Analyses & History

![Saved Analyses](readme/assests/sc-5.png)

## 🏗️ Technical Architecture

### System Overview

Checkmate follows a modern full-stack architecture with the following components:
![Architecture Diagram](readme/assests/sc-7.jpeg)

### Database Schema (Convex)

Our data model consists of four main entities:

#### `users`

- Synchronized from Clerk authentication
- Stores user profile information and preferences

#### `contentCreators`

- Tracks credibility metrics for content creators across platforms
- Maintains credibility ratings (0-10 scale) based on analysis history
- Supports multi-platform creator identification

#### `tiktokAnalyses`

- Stores comprehensive analysis results for each processed content
- Links to users and content creators
- Contains transcription, metadata, news detection, and fact-check results

#### `creatorComments`

- Enables community feedback on creator credibility
- Supports crowd-sourced verification efforts

### AI/ML Tools Architecture (`@/tools`)

The `@/tools` directory contains the core AI-powered functionality, organized into modular components:

#### `helpers.ts` - Core Utilities

```typescript
// Video transcription using OpenAI Whisper
export async function transcribeVideoDirectly(videoUrl: string);

// Web content scraping using Firecrawl
export async function scrapeWebContent(url: string);
```

#### `tiktok-analysis.ts` - Platform-Specific Analysis

- **`analyzeTikTokVideo`**: Extracts metadata, download links, and video content from TikTok URLs
- **`transcribeTikTokVideo`**: Converts TikTok audio to text using OpenAI Whisper
- **`compareTikTokVideos`**: Analyzes multiple videos for trends and patterns

Key technologies:

- `@tobyg74/tiktok-api-dl` for TikTok video extraction
- OpenAI Whisper via `ai` SDK for speech-to-text
- Real-time video processing and analysis

#### `content-analysis.ts` - Content Intelligence

- **`analyzeContentSentiment`**: NLP-powered sentiment analysis and theme extraction
- **`extractHashtagsAndMentions`**: Social media element extraction using regex patterns
- **`generateContentInsights`**: AI-driven recommendations and quality scoring
- **`generateVideoSummary`**: Automated content summarization

Advanced features:

- Multi-dimensional sentiment analysis
- Viral potential prediction algorithms
- Accessibility compliance checking
- Engagement metric calculations

#### `fact-checking.ts` - Misinformation Detection

- **`detectNewsContent`**: Identifies content requiring fact-checking using NLP
- **`researchAndFactCheck`**: Cross-references claims with credible sources
- **`analyzeCreatorCredibility`**: Calculates creator trustworthiness scores

Sophisticated algorithms:

- Domain credibility evaluation using LLM reasoning
- Multi-source claim verification
- Confidence scoring with uncertainty quantification
- Automated source reliability assessment

#### `index.ts` - Tool Orchestration

Exports organized tool collections:

```typescript
export const allTiktokAnalysisTools = [...];
export const allFactCheckingTools = [...];
export const allTools = [...]; // Combined toolkit
```

### Data Flow & Processing Pipeline

1. **Content Ingestion**

   ```
   User Input (URL) → Platform Detection → Content Extraction
   ```

2. **Multi-Modal Analysis**

   ```
   Video/Audio → Whisper Transcription → Text Analysis
   Text Content → NLP Processing → Claim Extraction
   ```

3. **Fact-Checking Pipeline**

   ```
   Claims → Web Research → Source Verification → Credibility Scoring
   ```

4. **Result Synthesis**
   ```
   Individual Results → Comprehensive Analysis → User Dashboard
   ```

### API Architecture

#### `/api/transcribe` - Main Analysis Endpoint

Handles multi-platform content analysis:

```typescript
// Request types supported
interface RequestBody {
  tiktokUrl?: string; // TikTok video URLs
  twitterUrl?: string; // Twitter/X post URLs
  webUrl?: string; // General web content
  videoUrl?: string; // Direct video URLs
}

// Response structure
interface AnalysisResult {
  transcription: TranscriptionData;
  metadata: ContentMetadata;
  newsDetection: NewsDetectionResult;
  factCheck: FactCheckData;
  creatorCredibilityRating: number;
}
```

**Processing Flow:**

1. URL validation and platform detection
2. Content extraction (TikTok API, Twitter Scraper, or Firecrawl)
3. Transcription (if video content exists)
4. News content detection using AI
5. Fact-checking pipeline execution
6. Creator credibility calculation
7. Result compilation and return

### Frontend Architecture

#### Custom Hooks (`lib/hooks/`)

- **`use-tiktok-analysis.ts`**: Main analysis orchestration hook
- **`use-saved-analyses.ts`**: Database interaction for saved analyses
- **`use-credible-sources.ts`**: Credible source management
- **`use-all-analyses.ts`**: Comprehensive analysis data fetching

#### Component Structure

```
components/
├── ui/                    # Shadcn/UI base components
├── analysis-renderer.tsx  # Display analysis results
├── creator-credibility-display.tsx  # Credibility scoring UI
├── language-provider.tsx  # I18n support
└── theme-provider.tsx     # Dark/light mode
```

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
- **SMS Gateway**: Reach users without internet via USSD/SMS-based fact-checking

## 📄 License

MIT License - Open source for educational and research purposes

---

_Built with ❤️ for Mumbai Hacks 2025 - Fighting misinformation through technology_

**"No possible way to escape" - TinLens brings truth to light**
