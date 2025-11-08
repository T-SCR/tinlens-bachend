# 🔑 Complete API Setup Guide for TinLens

## Overview

TinLens uses multiple APIs to power its fact-checking capabilities. This guide walks you through getting ALL required API keys.

---

## 🎯 Required APIs (Must Have)

### 1. **OpenAI API** (AI Analysis & Transcription)

**Cost**: ~$5-20/month for testing, pay-as-you-go  
**Why**: Powers GPT-4 for claim extraction, fact-checking, and Whisper for audio transcription

#### Setup Steps:

1. **Go to**: https://platform.openai.com/signup
2. **Sign up** with email or Google account
3. **Add payment method**: Settings → Billing → Add payment method
4. **Create API key**:
   - Go to: https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Name it: "TinLens Dev"
   - Copy the key (starts with `sk-proj-...`)
   - **⚠️ Save it immediately - you can't see it again!**

5. **Add to `.env.local`**:
```env
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
```

**Usage in TinLens**:
- Claim extraction from videos/text
- Fact-checking analysis
- Audio transcription (Whisper API)
- Content credibility scoring

---

### 2. **Clerk** (Authentication - FREE)

**Cost**: Free for up to 10,000 users  
**Why**: User authentication, sign-up/sign-in

#### Setup Steps:

1. **Go to**: https://clerk.com/
2. **Sign up** for free account
3. **Create application**:
   - Dashboard → "Create Application"
   - Name: "TinLens"
   - Select authentication methods:
     - ✅ Email
     - ✅ Google (recommended)
     - ✅ GitHub (optional)
4. **Get API keys**:
   - Dashboard → API Keys
   - Copy **Publishable Key** (starts with `pk_test_...`)
   - Copy **Secret Key** (starts with `sk_test_...`)

5. **Add to `.env.local`**:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY
CLERK_SECRET_KEY=sk_test_YOUR_KEY
```

**✅ You already have these!**

---

### 3. **Convex** (Real-time Database - FREE)

**Cost**: Free tier (generous limits)  
**Why**: Backend database for storing analyses, user data, trends

#### Setup Steps:

1. **Go to**: https://www.convex.dev/
2. **Sign up** with GitHub
3. **Create project**:
   - Dashboard → "New Project"
   - Team: `mumbai-hacks`
   - Project name: `tinlens`
4. **Get deployment info**:
   - Copy deployment ID (e.g., `dev:elated-wildcat-321`)
   - Copy URL (e.g., `https://elated-wildcat-321.convex.cloud`)

5. **Add to `.env.local`**:
```env
CONVEX_DEPLOYMENT=dev:elated-wildcat-321
NEXT_PUBLIC_CONVEX_URL=https://elated-wildcat-321.convex.cloud
```

**✅ You already have these!**

---

### 4. **Firecrawl** (Web Scraping)

**Cost**: Free tier: 500 credits/month, then $0.01/page  
**Why**: Scrapes content from URLs for fact-checking

#### Setup Steps:

1. **Go to**: https://www.firecrawl.dev/
2. **Sign up** for free account
3. **Get API key**:
   - Dashboard → API Keys
   - Copy key (starts with `fc-...`)

4. **Add to `.env.local`**:
```env
FIRECRAWL_API_KEY=fc-YOUR_KEY_HERE
```

**✅ You already have this!**

---

### 5. **Exa.ai** (Semantic Search)

**Cost**: Free tier: 1,000 searches/month, then $20/month  
**Why**: Advanced semantic web search for finding fact-check sources

#### Setup Steps:

1. **Go to**: https://exa.ai/
2. **Sign up**: Click "Get Started" or "Try for Free"
3. **Verify email** and complete onboarding
4. **Get API key**:
   - Dashboard → API Keys → "Create API Key"
   - Copy the key

5. **Add to `.env.local`**:
```env
EXA_API_KEY=your-exa-api-key-here
```

**How Exa is Used in TinLens**:
- File: `tools/fact-checking/web-research.ts`
- **Step 1**: GPT-4 generates optimal search query for fact-checking
- **Step 2**: Exa searches the web semantically (not just keywords)
- **Step 3**: Exa retrieves full content from top 5 URLs
- **Step 4**: GPT-4 analyzes retrieved content for verification
- **Result**: Confidence score + citations

**Exa API Calls**:
```typescript
// Search for URLs
POST https://api.exa.ai/search
Headers: { "x-api-key": process.env.EXA_API_KEY }
Body: { query: "...", numResults: 10 }

// Get full content
POST https://api.exa.ai/contents
Headers: { "x-api-key": process.env.EXA_API_KEY }
Body: { urls: [...], text: true, summary: true, highlights: true }
```

---

## 🎬 Content Source APIs

### 6. **YouTube Data API v3** (Video Analysis)

**Cost**: FREE (10,000 quota units/day = ~3,000 video requests)  
**Why**: Get video metadata, captions, channel info

#### Setup Steps:

1. **Go to**: https://console.cloud.google.com/
2. **Create project**:
   - Click "Select a project" → "New Project"
   - Name: "TinLens"
   - Click "Create"
3. **Enable YouTube Data API**:
   - Go to: https://console.cloud.google.com/apis/library
   - Search: "YouTube Data API v3"
   - Click it → Click "Enable"
4. **Create API key**:
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click "Create Credentials" → "API Key"
   - Copy the key (e.g., `AIzaSyC...`)
   - **Optional but recommended**: Click "Restrict Key"
     - API restrictions: Select "YouTube Data API v3"
     - Application restrictions: Select "HTTP referrers"
     - Add: `localhost:3000/*` and `*.vercel.app/*`

5. **Add to `.env.local`**:
```env
YOUTUBE_API_KEY=AIzaSyC_YOUR_KEY_HERE
```

**What You Can Get**:
- ✅ Video title, description, channel info
- ✅ View count, like count, publish date
- ✅ Video category, tags
- ❌ Captions/Transcripts (requires video owner OAuth)

**Workaround for Transcripts**:
- Use `youtube-transcript` npm package (scrapes publicly available captions)
- No API key needed for this!

---

### 7. **Instagram oEmbed API** (Post Analysis)

**Cost**: FREE (but limited)  
**Why**: Get basic Instagram post data

#### Setup Steps:

**Good News**: Instagram oEmbed is **public** and doesn't require authentication for basic embeds!

**How to Use**:
```typescript
// Get Instagram post data
const url = 'https://www.instagram.com/p/POST_ID/';
const response = await fetch(
  `https://graph.facebook.com/v18.0/instagram_oembed?url=${encodeURIComponent(url)}&access_token=YOUR_TOKEN`
);
```

**⚠️ Important Limitations**:
- Instagram API requires Facebook App + Access Token for full features
- **For MVP**: We'll use public scraping methods instead (simpler)
- oEmbed gives: thumbnail, author, caption (limited)

**Alternative (Recommended for MVP)**:
- Use the Instagram post URL directly
- Extract post ID from URL
- Use Instagram's public embed endpoint
- No authentication needed!

---

## 📦 Optional APIs (Nice-to-Have)

### 8. **Twitter/X API** (Tweet Analysis)

**Cost**: Basic tier $100/month (was free, now paid)  
**Status**: ⚠️ SKIP FOR MVP - Too expensive

**Alternative**: Use URL scraping or skip Twitter support initially

---

## 🔧 Complete `.env.local` Template

Create this file manually in `checkmate-main/.env.local`:

```env
# ============================================
# TINLENS ENVIRONMENT VARIABLES
# ============================================

# AI & Analysis
OPENAI_API_KEY=sk-proj-YOUR_OPENAI_KEY_HERE
EXA_API_KEY=your-exa-api-key-here

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_a25vd24tZGlub3NhdXItNzkuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_hrwjSRFFElPZklwlnXQrNRgv0OKPZinZc8M33C5TCZ

# Database
CONVEX_DEPLOYMENT=dev:elated-wildcat-321
NEXT_PUBLIC_CONVEX_URL=https://elated-wildcat-321.convex.cloud

# Web Scraping
FIRECRAWL_API_KEY=fc-f5e31858821c4dbcb8d9b8c643ecd528

# Content Sources
YOUTUBE_API_KEY=AIzaSyC_YOUR_YOUTUBE_KEY_HERE

# Optional (for development)
NEXT_PUBLIC_APP_URL=http://localhost:3000
VERCEL_URL=http://localhost:3000
```

---

## 💰 Cost Summary

| API | Free Tier | Estimated Monthly Cost |
|-----|-----------|------------------------|
| **OpenAI** | $5 credit (first time) | $5-20 (pay-as-you-go) |
| **Clerk** | 10,000 users | $0 |
| **Convex** | Generous limits | $0 |
| **Firecrawl** | 500 credits | $0-5 |
| **Exa.ai** | 1,000 searches | $0-20 |
| **YouTube API** | 10,000 quota/day | $0 |
| **Instagram** | Public API | $0 |
| **TOTAL** | - | **$5-45/month** |

**For Mumbai Hacks Demo**: ~$10-15 total cost!

---

## ✅ API Priority Checklist

### **Before You Can Run TinLens**:
- [ ] Get OpenAI API key ← **CRITICAL**
- [ ] Get Exa.ai API key ← **CRITICAL**
- [x] Clerk setup (you have this)
- [x] Convex setup (you have this)
- [x] Firecrawl key (you have this)

### **For Full YouTube Support**:
- [ ] Get YouTube Data API key
- [ ] Install `youtube-transcript` package

### **For Instagram Support** (Optional):
- [ ] Test public oEmbed endpoint
- [ ] Or use scraping (no key needed)

---

## 🧪 Testing Your APIs

Once you have all keys in `.env.local`:

```bash
# Test API connections
npm run dev

# Check in browser console (F12)
# You should see no API key errors
```

**Test Each API**:
1. **OpenAI**: Paste a URL → Should get analysis
2. **Exa**: Check fact-checking sources
3. **Clerk**: Sign up → Should create account
4. **Convex**: Save analysis → Should appear in News page
5. **YouTube**: Paste YouTube URL → Should extract metadata

---

## 🆘 Troubleshooting

### "OpenAI API key not configured"
- Check `.env.local` exists in project root
- Restart dev server: `Ctrl+C` then `npm run dev`
- Verify no typos in `OPENAI_API_KEY=...`

### "Exa API error: 401"
- Your Exa key is invalid or expired
- Generate new key from dashboard

### "Clerk: Unauthorized"
- Check both `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
- Make sure keys match your Clerk app

### "YouTube quota exceeded"
- You hit 10,000 units/day limit
- Wait until next day (resets midnight PST)
- Or create another Google Cloud project

---

## 📚 API Documentation Links

- **OpenAI**: https://platform.openai.com/docs/api-reference
- **Clerk**: https://clerk.com/docs
- **Convex**: https://docs.convex.dev/
- **Firecrawl**: https://docs.firecrawl.dev/
- **Exa.ai**: https://docs.exa.ai/
- **YouTube**: https://developers.google.com/youtube/v3
- **Instagram**: https://developers.facebook.com/docs/instagram/oembed

---

**Next**: Once you have OpenAI and Exa keys, add them to `.env.local` and I'll update the code!
