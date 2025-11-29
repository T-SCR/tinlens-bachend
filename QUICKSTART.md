# TinLens - Quick Start Guide

## ✅ What I've Done

1. **Enforced Strict Real Mode** - No silent fallbacks; API errors surface immediately
2. **Added EXA_API_KEY validation** - Required when strict mode enabled
3. **Updated Twitter handler** - Throws on failures, tries Firecrawl extraction
4. **Created health check endpoint** - Verifies OpenAI/Exa/Firecrawl connectivity
5. **Created Postman workspace** - Pre-configured collection for testing

## 🚀 What You Need To Do NOW

### 1. Test Locally First (5 minutes)

```bash
# Start the dev server
npm run dev

# In another terminal, run the integration test (Windows)
powershell -ExecutionPolicy Bypass -File ./scripts/test-integrations.ps1

# Or on Mac/Linux
chmod +x ./scripts/test-integrations.sh
./scripts/test-integrations.sh
```

**Expected Output:**
```
✅ Server is running
✅ Health endpoint OK
✅ OpenAI: configured and reachable
✅ Exa: configured and reachable
✅ Firecrawl: configured and reachable
✅ STRICT_REAL_MODE is enabled
```

If any checks fail, fix the API key in `.env.local` before deploying.

### 2. Deploy to Vercel (10 minutes)

**Set environment variables on Vercel:**
Go to: https://vercel.com/your-project/settings/environment-variables

Add these (copy from your `.env.local`):
```
OPENAI_API_KEY=sk-proj-...
EXA_API_KEY=3d578d69-...
FIRECRAWL_API_KEY=fc-f5e31858...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CONVEX_DEPLOYMENT=dev:elated-wildcat-321
NEXT_PUBLIC_CONVEX_URL=https://elated-wildcat-321.convex.cloud
STRICT_REAL_MODE=true
NEXT_PUBLIC_ENABLE_MOCK_ANALYSIS=false
```

**Deploy:**
```bash
# Option 1: CLI (recommended)
npm i -g vercel
vercel --prod

# Option 2: GitHub
# Push to main branch and Vercel auto-deploys
```

### 3. Test with Postman (5 minutes)

I created a Postman workspace for you:
- **Workspace:** TinLens QA
- **Collection:** TinLens API QA

**To use:**
1. Open Postman
2. Select "TinLens Prod" environment
3. Update `{{base_url}}` to your Vercel URL (if different)
4. Run the collection

**Key requests:**
- GET Health - Basic availability
- GET Integrations Health - Verify all APIs connected
- POST Transcribe - Twitter (needs Clerk cookies for auth)
- POST Transcribe - Web (needs Clerk cookies for auth)

**To authenticate:**
- Install Postman Interceptor extension
- Sign in to your deployed app in the browser
- Enable Interceptor in Postman
- Cookies will be captured automatically

### 4. Verify Real Analysis (2 minutes)

Open your deployed app and test:
```
https://your-domain.vercel.app/verify?link=https://x.com/user/status/123
```

**Expected:**
- Verdict (Verified/Misleading/False/Unverified)
- Confidence score 0-100
- 2-5 real sources with URLs
- Tags (platform, content type, etc.)
- Creator credibility rating

**If it fails:**
- Check the X-Request-ID in the response headers
- Share that ID with me for debugging

---

## 🐛 Common Issues

**"Server not running"**
- Run: `npm run dev`

**"OpenAI configured: false"**
- Add OPENAI_API_KEY to `.env.local`
- Restart dev server

**"Exa configured: false"**
- Add EXA_API_KEY to `.env.local`
- Restart dev server

**"401 Unauthenticated" in Postman**
- Expected without cookies
- Install Postman Interceptor and sign in via browser

**Vercel deployment 404**
- Check build logs in Vercel dashboard
- Ensure `npm run build` works locally

**"Awaiting Analysis" in UI**
- Old issue; with STRICT_REAL_MODE=true this will error instead
- Check integrations health endpoint for API issues

---

## 📊 Architecture Recap

Your system flow:
```
User → Next.js Web/Extension/Flutter
  ↓
POST /api/transcribe
  ↓
Platform handler (Twitter/TikTok/Web)
  ↓
1. Extract (TikTok API / Twitter Scraper / Firecrawl)
2. Transcribe (OpenAI Whisper if video)
3. Detect news (OpenAI GPT-4o-mini)
4. Fact-check (Exa search + OpenAI analysis)
5. Calculate creator credibility
  ↓
Save to Convex + Deduct credits
  ↓
Return verdict, confidence, sources, tags
```

**Strict Mode = ON:**
- Missing API key → immediate error (no fallback)
- Exa failure → error (no DuckDuckGo fallback)
- Firecrawl failure → error (no HTML scraping fallback)

---

## ✨ What's Working Now

- ✅ Real Twitter scraping (@the-convocation/twitter-scraper + Firecrawl fallback)
- ✅ Real TikTok metadata extraction (@tobyg74/tiktok-api-dl)
- ✅ Real video transcription (OpenAI Whisper)
- ✅ Real fact-checking (Exa semantic search + GPT-4o-mini analysis)
- ✅ Real web scraping (Firecrawl)
- ✅ Real confidence scoring (multi-factor algorithm)
- ✅ Real creator credibility (historical analysis via Convex)
- ✅ Real share cards (Next.js ImageResponse)
- ✅ Strict mode (no silent fallbacks)

---

## 📞 Support

If you need help:
1. Run the integration test script and share output
2. Share Vercel deployment logs if build fails
3. Share X-Request-ID from failing API requests
4. Share Postman response for failing requests

I'll debug and fix immediately.

---

## 🎯 Success Criteria

Before marking as "done":
- [ ] Local integration test passes (all ✅)
- [ ] Vercel deployment succeeds (no 404)
- [ ] Integrations health shows all APIs reachable
- [ ] Twitter analysis returns real verdict + sources
- [ ] Web analysis returns real verdict + sources
- [ ] Confidence scores are between 0-100
- [ ] Share cards generate without errors
- [ ] Creator profiles show historical data
- [ ] Credits deduct on each verification

---

**Ready? Start with Step 1: `npm run dev` + run the test script!**
