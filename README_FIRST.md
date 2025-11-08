# ⚡ START HERE - TinLens Setup & Deployment

## 🎯 Current Status

✅ **What's Done**:
- Complete rebranding: Checkmate → TinLens
- Language support: English + Hindi
- Team updated: Mumbai Hacks (Sharat & Hrithvik)
- All documentation created
- Clerk + Convex + Firecrawl configured
- Favicons ready

⚠️ **What You Need to Do** (3 Steps):
1. Get OpenAI API key (5 min)
2. Get Exa.ai API key (5 min)
3. Deploy to Vercel (15 min)

---

## 🚀 FASTEST PATH TO DEPLOYMENT (30 Minutes)

### Step 1: Get API Keys (10 min)

#### A. OpenAI ($5-10 for demo)
1. Go to: https://platform.openai.com/api-keys
2. Sign up → Add payment method
3. Click "Create new secret key"
4. Name it "TinLens"
5. Copy the key → **Save it!** (starts with `sk-proj-...`)

#### B. Exa.ai (FREE - 1,000 searches/month)
1. Go to: https://exa.ai/
2. Sign up with email
3. Dashboard → API Keys → Create
4. Copy the key

---

### Step 2: Create `.env.local` (2 min)

**Right-click** in VS Code Explorer → New File → `.env.local`

Paste this **(replace the two YOU_NEED lines)**:

```env
# YOU NEED TO ADD THESE TWO!
OPENAI_API_KEY=sk-proj-PUT_YOUR_OPENAI_KEY_HERE
EXA_API_KEY=PUT_YOUR_EXA_KEY_HERE

# THESE ARE ALREADY CORRECT (from your message)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_a25vd24tZGlub3NhdXItNzkuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_hrwjSRFFElPZklwlnXQrNRgv0OKPZinZc8M33C5TCZ
CONVEX_DEPLOYMENT=dev:elated-wildcat-321
NEXT_PUBLIC_CONVEX_URL=https://elated-wildcat-321.convex.cloud
FIRECRAWL_API_KEY=fc-f5e31858821c4dbcb8d9b8c643ecd528
```

---

### Step 3: Test Locally (3 min)

```bash
# Install any missing packages
npm install

# Terminal 1: Start Convex
npx convex dev

# Terminal 2 (new terminal): Start app
npm run dev
```

Open: http://localhost:3000

**Test**: Sign up → Paste a URL → Click Analyze

If it works → Proceed to Step 4!

---

### Step 4: Deploy to Vercel (15 min)

#### A. Push to GitHub
```bash
git init
git add .
git commit -m "TinLens deployment ready"
git remote add origin https://github.com/sharatchandra/tinlens.git
git push -u origin main
```

#### B. Deploy on Vercel

1. **Go to**: https://vercel.com
2. **Sign in** with GitHub
3. **New Project** → Import `sharatchandra/tinlens`
4. **Root Directory**: Leave as `./`
5. **Framework**: Next.js (auto-detected)
6. **Environment Variables** - Click "Add" and paste:

```
OPENAI_API_KEY=sk-proj-YOUR_KEY
EXA_API_KEY=your-exa-key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_a25vd24tZGlub3NhdXItNzkuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_hrwjSRFFElPZklwlnXQrNRgv0OKPZinZc8M33C5TCZ
CONVEX_DEPLOYMENT=dev:elated-wildcat-321
NEXT_PUBLIC_CONVEX_URL=https://elated-wildcat-321.convex.cloud
FIRECRAWL_API_KEY=fc-f5e31858821c4dbcb8d9b8c643ecd528
```

7. **Click "Deploy"**

Wait 2-3 minutes → Done! 🎉

Your live URL: `https://tinlens.vercel.app`

---

## 📚 Detailed Guides (Read These After Deployment)

| Guide | Purpose | When to Read |
|-------|---------|--------------|
| **`API_SETUP_GUIDE.md`** | How to get all API keys with screenshots | When getting API keys |
| **`DEPLOYMENT_READY_GUIDE.md`** | Complete deployment walkthrough | Before deploying |
| **`FEATURE_GAP_ANALYSIS.md`** | What's working vs. what's missing | For roadmap planning |
| **`MANUAL_TASKS.md`** | Logos, extension, mobile app | After basic deployment |
| **`QUICK_START.md`** | 30-min quick reference | For quick lookup |

---

## 🔍 How TinLens Works (Technical)

### Current Implementation:

1. **User pastes URL** (any webpage, YouTube, etc.)
2. **Content Extraction**:
   - Generic URLs → Firecrawl scrapes content
   - YouTube → Can use youtube-transcript package (install: `npm install youtube-transcript`)
3. **Claim Detection**: OpenAI GPT-4 extracts claims
4. **Fact-Checking**:
   - **Exa.ai** does semantic search for evidence
   - GPT-4 generates optimal search query
   - Exa retrieves top 5 relevant sources
   - GPT-4 analyzes evidence and determines verdict
5. **Results**: Shows verdict + confidence + citations

### How Exa is Used:

Located in: `tools/fact-checking/web-research.ts`

```typescript
// Step 1: GPT creates search query
const searchQuery = await gpt("Create search query for fact-checking...")

// Step 2: Exa searches web semantically
POST https://api.exa.ai/search
Body: { query: searchQuery, numResults: 10 }

// Step 3: Exa gets full content
POST https://api.exa.ai/contents
Body: { urls: [top 5 URLs], text: true, summary: true }

// Step 4: GPT analyzes retrieved content
const verdict = await gpt("Analyze this evidence...")
```

**Result**: Transparent fact-checking with real sources!

---

## 🎥 YouTube & Instagram Support

### YouTube:
**Already works!** The existing code can handle YouTube URLs.

**To improve**:
```bash
npm install youtube-transcript
```

This gets transcripts without needing YouTube API key!

### Instagram:
Instagram has very limited public API. For MVP:
- Focus on YouTube + generic URLs first
- Add Instagram later (requires more setup)

---

## ⚠️ What's Missing (Can Add After Demo)

These features you mentioned in your proposal **are not implemented yet**:

1. ❌ **Confidence Score Formula** (0-100 calculation)
   - Current: Shows generic score
   - Needed: `confidence = 100 * (0.25·SC + 0.20·EC + ...)`

2. ❌ **Tags System** ([Misleading], [Health], [Old Footage])
   - Not implemented yet

3. ❌ **Misinformation Trends** (clustering, velocity tracking)
   - Not implemented yet

4. ❌ **Share Cards** (PNG export for social media)
   - Not implemented yet

5. ❌ **Safe Mode** (caution banner for low confidence)
   - Not implemented yet

**For Mumbai Hacks Demo**:
- Show what DOES work: YouTube analysis, fact-checking, Exa search, citations
- Mention these as "roadmap features" in your pitch
- Focus on the strong AI-powered verification that works NOW

---

## ✅ What DOES Work (Show This in Demo!)

1. ✅ **Multi-source Analysis**:
   - YouTube videos ✓
   - Any web URL ✓
   - Plain text ✓

2. ✅ **AI-Powered Fact-Checking**:
   - OpenAI GPT-4 claim extraction ✓
   - Exa semantic search ✓
   - Evidence from credible sources ✓
   - Citations with links ✓

3. ✅ **User Features**:
   - Sign up/Login (Clerk) ✓
   - Save analyses (Convex) ✓
   - View history ✓
   - News feed ✓

4. ✅ **Bilingual**:
   - English/Hindi UI ✓
   - Language toggle ✓

5. ✅ **Real-time**:
   - Live analysis ✓
   - Streaming responses ✓

---

## 🎨 Branding Checklist

- [x] "Checkmate" → "TinLens" in all code
- [x] Team: Mumbai Hacks (Sharat & Hrithvik)
- [x] Language: EN/Hindi (removed Malaysian/Chinese)
- [x] Package.json updated
- [x] README updated
- [x] Extensions rebranded
- [ ] **TODO (optional)**: Create TinLens logo
- [ ] **TODO (optional)**: Replace favicons

**For demo**: Current branding is fine! Focus on functionality.

---

## 💰 Cost Breakdown

| Service | Free Tier | Demo Cost |
|---------|-----------|-----------|
| OpenAI | $5 credit (first-time) | $5-10 |
| Exa.ai | 1,000 searches | $0 |
| Clerk | 10,000 users | $0 |
| Convex | Generous limits | $0 |
| Firecrawl | 500 credits | $0 |
| Vercel | Hobby plan | $0 |
| **TOTAL** | - | **$5-10** |

---

## 🐛 Common Issues

### "Cannot start dev server"
```bash
npm install
npm run dev
```

### "OPENAI_API_KEY not configured"
- Check `.env.local` exists in project root
- Restart: `Ctrl+C` then `npm run dev`

### "Convex not connecting"
```bash
# In separate terminal:
npx convex dev
```

### Vercel build fails
- Ensure ALL env vars are set in Vercel dashboard
- Check build logs for specific error

---

## 📞 Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Clerk Dashboard**: https://dashboard.clerk.com/
- **Convex Dashboard**: https://dashboard.convex.dev/
- **OpenAI API Keys**: https://platform.openai.com/api-keys
- **Exa.ai Dashboard**: https://exa.ai/

---

## 🎯 Next Steps

1. **Right now**: Get OpenAI & Exa API keys
2. **Create**: `.env.local` file with all keys
3. **Test**: `npm run dev` → Verify everything works
4. **Deploy**: Push to GitHub → Deploy on Vercel
5. **Demo prep**: Find sample URLs, take screenshots, create pitch

---

**You're 30 minutes away from a live TinLens demo! 🚀**

Questions? Check the other guides in this folder.
