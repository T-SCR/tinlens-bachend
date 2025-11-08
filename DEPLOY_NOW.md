# 🚀 DEPLOY TINLENS TO VERCEL NOW!

## ✅ What's Already Working

Your TinLens has:
- ✅ Twitter/X analysis (fully implemented!)
- ✅ TikTok analysis
- ✅ Web article analysis
- ✅ Exa API key: `3d578d69-7673-412d-92d4-5c350547c615`
- ✅ Clerk authentication
- ✅ Convex database
- ✅ Firecrawl web scraping
- ✅ All dependencies installed

---

## ⚡ STEP 1: Add Your Exa Key to `.env.local` (30 seconds)

Since `.env.local` is open in your editor, **replace line 1** with:

```env
# AI & Analysis
OPENAI_API_KEY=sk-proj-YOUR_OPENAI_KEY_HERE
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

**Save it** (`Ctrl+S`)

---

## ⚡ STEP 2: Get OpenAI Key (5 minutes)

1. Go to: https://platform.openai.com/api-keys
2. Sign up → Add payment ($5)
3. Create new key
4. Copy it (starts with `sk-proj-...`)
5. Replace `YOUR_OPENAI_KEY_HERE` in `.env.local`

---

## ⚡ STEP 3: Test Locally (3 minutes)

Open PowerShell and run:

```powershell
cd c:\Users\tscr\Downloads\tinlens\checkmate-main

# Install any missing packages
npm install

# Terminal 1: Start Convex
npx convex dev
```

**Open NEW terminal** and run:

```powershell
cd c:\Users\tscr\Downloads\tinlens\checkmate-main

# Terminal 2: Start Next.js
npm run dev
```

Open: http://localhost:3000

**Test**:
1. Sign up
2. Paste Twitter URL: `https://twitter.com/elonmusk/status/1234567890`
3. Click "Analyze"
4. Should see analysis!

---

## ⚡ STEP 4: Deploy to Vercel (10 minutes)

### A. Push to GitHub

```powershell
cd c:\Users\tscr\Downloads\tinlens\checkmate-main

git init
git add .
git commit -m "TinLens with Twitter, TikTok, Web analysis - Mumbai Hacks"
git remote add origin https://github.com/sharatchandra/tinlens.git
git branch -M main
git push -u origin main
```

If you don't have a repo yet, create one:
1. Go to: https://github.com/new
2. Name: `tinlens`
3. Create repository
4. Copy the remote URL
5. Use that in the commands above

---

### B. Deploy on Vercel

1. **Go to**: https://vercel.com
2. **Sign in** with GitHub
3. **New Project** → Import `sharatchandra/tinlens`
4. **Configure**:
   - Framework: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. **Environment Variables** - Add these ONE BY ONE:

Click "Environment Variables" → Add each:

```
Name: OPENAI_API_KEY
Value: sk-proj-YOUR_ACTUAL_KEY_HERE
Environment: Production
```

```
Name: EXA_API_KEY
Value: 3d578d69-7673-412d-92d4-5c350547c615
Environment: Production
```

```
Name: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
Value: pk_test_a25vd24tZGlub3NhdXItNzkuY2xlcmsuYWNjb3VudHMuZGV2JA
Environment: Production
```

```
Name: CLERK_SECRET_KEY
Value: sk_test_hrwjSRFFElPZklwlnXQrNRgv0OKPZinZc8M33C5TCZ
Environment: Production
```

```
Name: CONVEX_DEPLOYMENT
Value: dev:elated-wildcat-321
Environment: Production
```

```
Name: NEXT_PUBLIC_CONVEX_URL
Value: https://elated-wildcat-321.convex.cloud
Environment: Production
```

```
Name: FIRECRAWL_API_KEY
Value: fc-f5e31858821c4dbcb8d9b8c643ecd528
Environment: Production
```

6. **Click "Deploy"**

Wait 2-3 minutes...

**🎉 YOUR SITE IS LIVE!**

URL: `https://tinlens.vercel.app` (or similar)

---

## ⚡ STEP 5: Configure Production Services (5 minutes)

### A. Update Clerk

1. Go to: https://dashboard.clerk.com/
2. Select your TinLens app
3. Settings → Domains
4. Add your Vercel URL (e.g., `tinlens.vercel.app`)
5. Save

### B. Update Convex (if needed)

1. Go to: https://dashboard.convex.dev/
2. Select your project
3. Settings → Deployments
4. Verify production deployment is active
5. If you created a new prod deployment, update Vercel env vars

---

## ⚡ STEP 6: Test Live Site (2 minutes)

1. Open your Vercel URL
2. Sign up with new email
3. Test **Twitter** URL: `https://twitter.com/any-user/status/123`
4. Test **TikTok** URL: `https://tiktok.com/@user/video/123`
5. Test **Web** URL: `https://www.bbc.com/news/article`
6. Check fact-checking works
7. Verify Exa search returns sources

---

## 🎯 What Your TinLens Can Do NOW

### ✅ Supported Platforms:

1. **Twitter/X** (using @the-convocation/twitter-scraper)
   - Extracts tweet text
   - Transcribes video if present
   - Fact-checks claims
   - Calculates credibility

2. **TikTok**
   - Downloads video
   - Transcribes audio
   - Fact-checks content
   - Credibility rating

3. **Any Web URL**
   - Scrapes article content
   - Fact-checks claims
   - Source verification

### ✅ Features Working:

- AI-powered fact-checking (GPT-4)
- Exa semantic search for evidence
- Citations with sources
- Bilingual UI (English/Hindi)
- User authentication (Clerk)
- Save analyses (Convex)
- News feed
- Creator credibility scoring

---

## 📊 Quick Test URLs

Use these to demo:

**Twitter**:
```
https://twitter.com/elonmusk/status/1234567890123456789
https://x.com/username/status/1234567890123456789
```

**TikTok**:
```
https://www.tiktok.com/@user/video/1234567890123456789
```

**Web**:
```
https://www.bbc.com/news/technology-12345678
https://techcrunch.com/2024/article-title
```

---

## 🐛 Troubleshooting

### Build fails on Vercel

**Check**:
1. All env vars are set correctly (no typos)
2. OpenAI key is valid (starts with `sk-proj-`)
3. Build logs for specific error

**Fix**: Redeploy after fixing env vars

### Twitter scraping fails

**Reason**: Twitter API changes frequently

**Solution**: The package is actively maintained, should work

### Exa API not working

**Check**: Key is `3d578d69-7673-412d-92d4-5c350547c615`

**Verify**: Check Exa dashboard for usage/quota

### Clerk auth issues

**Fix**: Ensure production domain is added in Clerk dashboard

---

## 💡 Pro Tips

1. **Monitor costs**: Check OpenAI usage dashboard
2. **Rate limits**: Vercel free tier has limits
3. **Logs**: Check Vercel deployment logs for errors
4. **Test thoroughly**: Try edge cases before demo

---

## 📱 Mobile/Extension (Later)

After Mumbai Hacks, you can deploy:

1. **Browser Extension**:
   - Update manifest with prod URL
   - Test locally
   - Submit to Chrome Web Store

2. **Flutter App**:
   - Update API URL in `main.dart`
   - Build APK
   - Submit to Play Store

---

## ✅ Final Checklist

- [ ] Exa API key added to `.env.local`
- [ ] OpenAI API key obtained
- [ ] Local testing successful
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] All env vars added to Vercel
- [ ] Deployed successfully
- [ ] Clerk domain configured
- [ ] Live site tested (Twitter, TikTok, Web)
- [ ] All features working

---

## 🎉 You're Ready!

**Your TinLens is now live with**:
- Twitter/X analysis ✅
- TikTok analysis ✅
- Web article analysis ✅
- Exa semantic search ✅
- GPT-4 fact-checking ✅
- Bilingual UI ✅
- Full authentication ✅

**Demo URL**: `https://your-tinlens.vercel.app`

**GitHub**: `https://github.com/sharatchandra/tinlens`

---

**Now go crush Mumbai Hacks! 🚀🇮🇳**
