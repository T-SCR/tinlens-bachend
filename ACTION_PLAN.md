# ✅ TinLens Action Plan - Do These in Order

## 🎯 Mission: Get TinLens Live in 30 Minutes

---

## ☑️ STEP 1: Get API Keys (10 minutes)

### A. OpenAI API Key
**Link**: https://platform.openai.com/api-keys

1. ☐ Sign up / Login
2. ☐ Add payment method (Settings → Billing)
3. ☐ Click "Create new secret key"
4. ☐ Name it: "TinLens Mumbai Hacks"
5. ☐ **COPY AND SAVE** the key (starts with `sk-proj-...`)
6. ☐ Paste it into Notepad temporarily

**Cost**: $5-10 for entire demo

---

### B. Exa.ai API Key  
**Link**: https://exa.ai/

1. ☐ Sign up with email
2. ☐ Verify email
3. ☐ Dashboard → API Keys → "Create API Key"
4. ☐ **COPY AND SAVE** the key
5. ☐ Paste it into Notepad temporarily

**Cost**: FREE (1,000 searches/month)

---

## ☑️ STEP 2: Create `.env.local` (2 minutes)

1. ☐ In VS Code, **right-click** in file explorer
2. ☐ Click "New File"
3. ☐ Name it: `.env.local`
4. ☐ Paste this content:

```env
# ADD YOUR KEYS HERE (from Step 1)
OPENAI_API_KEY=sk-proj-PUT_YOUR_OPENAI_KEY_HERE
EXA_API_KEY=PUT_YOUR_EXA_KEY_HERE

# THESE ARE ALREADY CORRECT
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_a25vd24tZGlub3NhdXItNzkuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_hrwjSRFFElPZklwlnXQrNRgv0OKPZinZc8M33C5TCZ
CONVEX_DEPLOYMENT=dev:elated-wildcat-321
NEXT_PUBLIC_CONVEX_URL=https://elated-wildcat-321.convex.cloud
FIRECRAWL_API_KEY=fc-f5e31858821c4dbcb8d9b8c643ecd528
```

5. ☐ Replace `PUT_YOUR_OPENAI_KEY_HERE` with your actual OpenAI key
6. ☐ Replace `PUT_YOUR_EXA_KEY_HERE` with your actual Exa key
7. ☐ Save the file (`Ctrl+S`)

---

## ☑️ STEP 3: Test Locally (5 minutes)

### Open PowerShell/Terminal:

```powershell
# Navigate to project
cd c:\Users\tscr\Downloads\tinlens\checkmate-main

# Install dependencies
npm install
```

### Start Convex (Terminal 1):
```powershell
npx convex dev
```
☐ Wait for "Convex functions ready"

### Start Next.js (Terminal 2 - NEW TERMINAL):
```powershell
npm run dev
```
☐ Wait for "Local: http://localhost:3000"

### Test the App:
1. ☐ Open browser: http://localhost:3000
2. ☐ Click "Sign Up"
3. ☐ Create account with email
4. ☐ Paste a YouTube URL (e.g., https://youtube.com/watch?v=dQw4w9WgXcQ)
5. ☐ Click "Analyze Content"
6. ☐ Wait for results (should show analysis!)

**If this works → proceed to Step 4!**  
**If errors → check console, verify `.env.local` keys**

---

## ☑️ STEP 4: Deploy to Vercel (15 minutes)

### A. Push to GitHub

```powershell
# In checkmate-main directory
git init
git add .
git commit -m "TinLens ready for Mumbai Hacks"
git remote add origin https://github.com/sharatchandra/tinlens.git
git branch -M main
git push -u origin main
```

☐ Enter GitHub username/password if prompted  
☐ Verify code is on GitHub

---

### B. Deploy on Vercel

1. ☐ Go to: https://vercel.com
2. ☐ Sign in with GitHub
3. ☐ Click "Add New..." → "Project"
4. ☐ Find "sharatchandra/tinlens" → Click "Import"
5. ☐ **Root Directory**: Leave as `./`
6. ☐ **Framework**: Next.js (should auto-detect)
7. ☐ Click "Environment Variables" section
8. ☐ Add these **ONE BY ONE**:

| Name | Value |
|------|-------|
| `OPENAI_API_KEY` | `sk-proj-YOUR_KEY` |
| `EXA_API_KEY` | `your-exa-key` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_test_a25vd24tZGlub3NhdXItNzkuY2xlcmsuYWNjb3VudHMuZGV2JA` |
| `CLERK_SECRET_KEY` | `sk_test_hrwjSRFFElPZklwlnXQrNRgv0OKPZinZc8M33C5TCZ` |
| `CONVEX_DEPLOYMENT` | `dev:elated-wildcat-321` |
| `NEXT_PUBLIC_CONVEX_URL` | `https://elated-wildcat-321.convex.cloud` |
| `FIRECRAWL_API_KEY` | `fc-f5e31858821c4dbcb8d9b8c643ecd528` |

9. ☐ Click "Deploy"
10. ☐ Wait 2-3 minutes for build
11. ☐ **Success!** Click "Visit" to see your live site

Your URL: `https://tinlens.vercel.app` (or similar)

---

## ☑️ STEP 5: Configure Production (5 minutes)

### Update Clerk for Production:

1. ☐ Go to: https://dashboard.clerk.com/
2. ☐ Select "TinLens" app
3. ☐ Settings → Domains
4. ☐ Add domain: `tinlens.vercel.app` (or your actual Vercel URL)
5. ☐ Save

### Update Convex for Production:

1. ☐ Go to: https://dashboard.convex.dev/
2. ☐ Select "tinlens" project
3. ☐ Settings → Deployments
4. ☐ Create "Production" deployment (or use existing dev for now)
5. ☐ **Optional**: Update Vercel env vars if you created new prod deployment

---

## ☑️ STEP 6: Test Live Site (3 minutes)

1. ☐ Open your Vercel URL: `https://tinlens.vercel.app`
2. ☐ Sign up with a different email (test prod environment)
3. ☐ Paste YouTube URL
4. ☐ Click "Analyze"
5. ☐ Verify results show up
6. ☐ Check News page loads
7. ☐ Test Hindi language toggle

**If everything works → YOU'RE LIVE! 🎉**

---

## ☑️ STEP 7: Prepare Demo (30 minutes)

### Find Demo Content:
1. ☐ Find 2-3 YouTube videos with claims:
   - Example: Health claim video
   - Example: News video
   - Example: Viral video with misinformation

2. ☐ Test each URL on your live site
3. ☐ Screenshot the best results
4. ☐ Save screenshots for presentation

### Create Slide Deck:
1. ☐ **Slide 1**: Title - "TinLens: No Possible Way to Escape"
2. ☐ **Slide 2**: Problem - Misinformation in India
3. ☐ **Slide 3**: Solution - AI-powered fact-checking
4. ☐ **Slide 4**: Demo - Live analysis (use screenshots)
5. ☐ **Slide 5**: Technology Stack:
   - OpenAI GPT-4 (claim extraction)
   - Exa.ai (semantic search)
   - Convex (real-time database)
   - Clerk (authentication)
   - Firecrawl (web scraping)
6. ☐ **Slide 6**: Key Features:
   - Multi-source analysis (YouTube, URLs, text)
   - Exa semantic search for evidence
   - Citations with sources
   - Bilingual (EN/Hindi)
   - Confidence scoring
7. ☐ **Slide 7**: Roadmap:
   - Misinformation Trends (clustering)
   - Tags system
   - Share cards
   - WhatsApp/Telegram bots
8. ☐ **Slide 8**: Impact - Fighting misinformation at scale

### Practice Demo:
1. ☐ Open TinLens live site
2. ☐ Have YouTube URL ready
3. ☐ Paste → Analyze → Show results
4. ☐ Highlight: Verdict, Evidence, Citations
5. ☐ Toggle to Hindi
6. ☐ Show News feed
7. ☐ **Total time**: 3 minutes

---

## ✅ FINAL CHECKLIST

Before Mumbai Hacks:

### Deployment:
- [ ] OpenAI API key working
- [ ] Exa.ai API key working
- [ ] Site live on Vercel
- [ ] Clerk authentication working
- [ ] Convex database working
- [ ] Can analyze YouTube URLs
- [ ] Can analyze generic URLs
- [ ] Hindi translation toggle works

### Demo Prep:
- [ ] 2-3 sample URLs tested
- [ ] Screenshots taken
- [ ] Slide deck created (8 slides)
- [ ] Demo practiced (3 min)
- [ ] GitHub repo link ready
- [ ] Vercel URL bookmarked

### Optional (if time):
- [ ] Create TinLens logo
- [ ] Update favicons
- [ ] Add YouTube API key for better metadata
- [ ] Test Instagram URLs

---

## 🎯 Demo Day Script

### Opening (30 sec):
"Hi! I'm [Name] from Mumbai Hacks. India faces a massive misinformation problem - false claims spread through WhatsApp, YouTube, and social media affect millions. We built **TinLens** - an AI-powered fact-checking platform that verifies content in seconds."

### Problem (30 sec):
"During COVID, we saw how quickly false health information spread. Election misinformation impacts democracy. People don't know what to trust. We need automated, scalable fact-checking."

### Solution (30 sec):
"TinLens uses advanced AI - GPT-4 extracts claims, Exa.ai searches for evidence using semantic search (not just keywords), and our system provides verdicts with citations from credible sources. All in English and Hindi."

### Live Demo (60 sec):
1. Open TinLens
2. Paste YouTube URL with a claim
3. Show "Analyzing..." 
4. Results appear: Verdict + Evidence + Citations
5. Toggle to Hindi
6. "This is live, analyzing real content right now"

### Technical Stack (20 sec):
"Built with OpenAI GPT-4, Exa semantic search, Convex real-time database, deployed on Vercel. Open source on GitHub."

### Roadmap (20 sec):
"Next: Misinformation trend detection, WhatsApp bot integration, regional language support for all of India."

**Total: 3 minutes ⏱️**

---

## 💡 Tips for Success

1. **Keep it simple**: Focus on YouTube analysis demo
2. **Show real results**: Use actual fact-checking live
3. **Highlight AI**: Mention GPT-4 and Exa semantic search
4. **Emphasize India**: Hindi support, India-specific problem
5. **Be honest**: Mention features that are roadmap vs. live

---

## 🆘 Emergency Contacts

- **Vercel Status**: https://www.vercel-status.com/
- **Clerk Status**: https://status.clerk.com/
- **OpenAI Status**: https://status.openai.com/

If something breaks during demo:
1. Use screenshots as backup
2. Explain the concept
3. Show code/architecture instead
4. Emphasize the AI innovation

---

## 🎉 You're Ready!

Follow these steps in order → You'll have a live, working TinLens demo ready for Mumbai Hacks!

**Estimated Total Time**: 1-2 hours  
**Cost**: $5-10

Good luck! 🚀🇮🇳
