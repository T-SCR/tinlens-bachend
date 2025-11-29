# TinLens Deployment Guide

## Step 1: Local Testing (First!)

Before deploying to Vercel, test locally to ensure all APIs are connected:

```bash
# Install dependencies
npm install

# Copy your environment variables (already in .env.local)
# Make sure these are set:
# - OPENAI_API_KEY
# - EXA_API_KEY
# - FIRECRAWL_API_KEY
# - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# - CLERK_SECRET_KEY
# - CONVEX_DEPLOYMENT
# - NEXT_PUBLIC_CONVEX_URL
# - STRICT_REAL_MODE=true

# Start development server
npm run dev
```

### Test locally (open in browser or curl):
- Health check: `http://localhost:3000/api/transcribe` (GET)
- Integrations health: `http://localhost:3000/api/health/integrations?probe=true` (GET)

### Expected response from health integrations:
```json
{
  "status": "ok",
  "timestamp": "2025-11-13T...",
  "strictRealMode": true,
  "probe": true,
  "integrations": {
    "openai": { "configured": true, "reachable": true },
    "exa": { "configured": true, "reachable": true },
    "firecrawl": { "configured": true, "reachable": true }
  }
}
```

If any integration shows `"configured": false` or `"reachable": false`, fix the API key before deploying.

---

## Step 2: Vercel Deployment

### A. Set Environment Variables on Vercel

Go to your Vercel project dashboard → Settings → Environment Variables, and add:

**Required for all environments (Production, Preview, Development):**

```env
# AI & Analysis
OPENAI_API_KEY=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
EXA_API_KEY=3d578d69-7673-412d-92d4-5c350547c615

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_a25vd24tZGlub3NhdXItNzkuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_hrwjSRFFElPZklwlnXQrNRgv0OKPZinZc8M33C5TCZ

# Database
CONVEX_DEPLOYMENT=dev:elated-wildcat-321
NEXT_PUBLIC_CONVEX_URL=https://elated-wildcat-321.convex.cloud

# Web Scraping
FIRECRAWL_API_KEY=fc-f5e31858821c4dbcb8d9b8c643ecd528

# Feature Flags
STRICT_REAL_MODE=true
NEXT_PUBLIC_ENABLE_MOCK_ANALYSIS=false
```

**Important:**
- Select "Production", "Preview", and "Development" for each variable
- Do NOT include quotes around values
- Ensure no trailing spaces

### B. Deploy to Vercel

**Option 1: Via Vercel CLI (recommended)**
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel --prod
```

**Option 2: Via GitHub**
- Push code to GitHub
- Connect repo in Vercel dashboard
- Vercel auto-deploys on push to main

### C. Verify Deployment

After deployment completes, test these URLs (replace with your domain):

```bash
# Health check
curl https://your-domain.vercel.app/api/transcribe

# Integrations health
curl https://your-domain.vercel.app/api/health/integrations?probe=true
```

---

## Step 3: Postman Testing

### Collection: TinLens API QA
I've created a Postman workspace with pre-configured requests:
- Workspace: **TinLens QA**
- Collection: **TinLens API QA**
- Environments: **TinLens Local** & **TinLens Prod**

### Test Requests:
1. **GET Health** - Basic availability check
2. **GET Integrations Health** - Verify OpenAI/Exa/Firecrawl connectivity
3. **POST Transcribe - Twitter** - Test Twitter analysis
4. **POST Transcribe - Web** - Test web article analysis
5. **GET Share Image** - Test share card generation

### Running Tests:

**Without Authentication (will get 401):**
- Run the collection; transcribe requests will return 401 as expected
- Health endpoints will work without auth

**With Authentication:**
- Install Postman Interceptor extension
- Sign in to your app in the browser
- Enable Interceptor in Postman
- Cookies will be captured automatically
- Re-run transcribe requests; should return 200 with analysis

### Expected Responses:

**Success (200):**
```json
{
  "success": true,
  "data": {
    "transcription": { "text": "...", "segments": [...] },
    "metadata": { "title": "...", "platform": "twitter", ... },
    "factCheck": {
      "verdict": "misleading",
      "confidence": 72,
      "sources": [...]
    },
    "creatorCredibilityRating": 6.5
  }
}
```

**Auth Required (401):**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHENTICATED",
    "message": "Sign in to verify content and manage credits."
  }
}
```

**API Error (with strict mode):**
```json
{
  "success": false,
  "error": {
    "code": "FACT_CHECK_FAILED",
    "message": "EXA_API_KEY is required in STRICT_REAL_MODE"
  }
}
```

---

## Step 4: Troubleshooting

### 404 Errors
- **Cause:** App not deployed or build failed
- **Fix:** Check Vercel deployment logs; ensure `npm run build` succeeds locally

### "configured": false in health check
- **Cause:** Missing environment variable
- **Fix:** Add the missing key in Vercel settings; redeploy

### "reachable": false in health check
- **Cause:** Invalid API key or network issue
- **Fix:** Verify API key is correct; check API provider status

### Transcribe returns "Awaiting Analysis" (null factCheck)
- **Cause:** Exa API failing silently (pre-strict mode)
- **Fix:** With `STRICT_REAL_MODE=true`, this will error instead

### Share card endpoint errors
- **Cause:** Edge runtime JSX issue (already fixed)
- **Fix:** Ensure using React.createElement, not JSX

---

## Step 5: Production Checklist

Before marking as "production-ready":

- [ ] All integrations health shows `configured: true, reachable: true`
- [ ] `STRICT_REAL_MODE=true` is set
- [ ] `NEXT_PUBLIC_ENABLE_MOCK_ANALYSIS=false` is set
- [ ] Twitter analysis returns real verdict + sources
- [ ] Web article analysis returns real verdict + sources
- [ ] Share cards generate without errors
- [ ] Creator profiles link from Verify page
- [ ] History page shows saved analyses
- [ ] Credits deduct on each verification

---

## API Rate Limits

Be aware of rate limits:
- **OpenAI:** 3 RPM (Whisper), 500 RPM (GPT-4o-mini) on free tier
- **Exa:** 1000 requests/month on free tier
- **Firecrawl:** 500 requests/month on free tier

Monitor usage at:
- OpenAI: https://platform.openai.com/usage
- Exa: https://dashboard.exa.ai/usage
- Firecrawl: https://www.firecrawl.dev/dashboard

---

## Next Steps After Deployment

Once deployed and verified:
1. Run the Postman collection and share results
2. Test a few real URLs (Twitter, articles) and verify verdicts
3. Check X-Request-ID header if any request fails
4. Share the failing request ID for debugging

---

## Support

If you encounter issues:
1. Check deployment logs in Vercel dashboard
2. Run `npm run build` locally to catch build errors
3. Test health endpoints first before transcribe
4. Share error response + X-Request-ID for debugging
