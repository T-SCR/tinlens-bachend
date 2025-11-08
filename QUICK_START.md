# ⚡ TinLens Quick Start Guide

## 🚀 30-Minute Setup for Mumbai Hacks Demo

### ✅ Step 1: Folder Rename (2 min)
1. Close VS Code
2. Rename `checkmate-main` → `tinlens-main`
3. Reopen workspace

### ✅ Step 2: Install Dependencies (5 min)
```bash
cd tinlens-main
npm install
```

### ✅ Step 3: Get API Keys (10 min)

**Essential APIs**:

1. **OpenAI** (5 min):
   - Go to: https://platform.openai.com/api-keys
   - Create key → Copy
   - Cost: ~$5-10 for demo

2. **Convex** (2 min):
   - Go to: https://www.convex.dev/
   - Sign up → Create project: "tinlens"
   - Team: "mumbai-hacks"
   - Copy deployment URL

3. **Clerk** (3 min):
   - Go to: https://clerk.com/
   - Create app: "TinLens"
   - Copy publishable + secret keys

### ✅ Step 4: Configure .env.local (3 min)

Create `.env.local` in root:

```env
# AI
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE

# Backend
CONVEX_DEPLOYMENT=dev:your-deployment
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY
CLERK_SECRET_KEY=sk_test_YOUR_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/news

# Optional (for full demo)
FIRECRAWL_API_KEY=fc-YOUR_KEY
EXA_API_KEY=your-exa-key
```

### ✅ Step 5: Start Development (5 min)

```bash
# Terminal 1: Start Convex
npx convex dev

# Terminal 2: Start Next.js
npm run dev
```

Open: http://localhost:3000

### ✅ Step 6: Test Basic Flow (5 min)

1. Sign up → Create account
2. Paste a URL → Click "Analyze"
3. See results → Save analysis
4. View News page → See saved items

---

## 🎨 Logo Replacement (Optional - 30 min)

### Quick Logo Setup:

**Option 1: Use Placeholder** (5 min)
- Keep existing icons for now
- Focus on functionality

**Option 2: AI-Generated Logo** (15 min)
1. Go to: https://www.canva.com or https://www.logoai.com
2. Prompt: "Modern magnifying glass logo with circuit patterns for fact-checking app called TinLens, blue and amber colors"
3. Export sizes: 32×32, 128×128, 512×512, 1024×1024
4. Replace files (see MANUAL_TASKS.md section 2)

**Option 3: Professional Logo** (Later)
- Hire on Fiverr ($20-50, 2-3 days)

---

## 🌐 Deploy to Vercel (15 min)

### Prerequisites:
- GitHub account
- Vercel account (free)

### Steps:

1. **Push to GitHub** (5 min):
```bash
cd tinlens-main
git init
git add .
git commit -m "TinLens initial commit"
git remote add origin https://github.com/sharatchandra/tinlens.git
git push -u origin main
```

2. **Deploy on Vercel** (5 min):
   - Go to: https://vercel.com
   - "Import Project" → Select GitHub repo
   - Framework: Next.js (auto-detected)
   - Add ALL environment variables from `.env.local`
   - Click "Deploy"

3. **Test Live** (5 min):
   - Wait for build (2-3 min)
   - Visit: `https://tinlens.vercel.app`
   - Test sign up, paste URL, view results

---

## 🔌 Browser Extension (10 min)

### Quick Setup:

1. **Test Locally**:
   - Open Chrome: `chrome://extensions/`
   - Enable "Developer mode"
   - "Load unpacked" → Select `tinlens-browser-extension/`
   - Test on any webpage

2. **Update API URL** (if needed):
   - Edit `tinlens-browser-extension/background.js`
   - Change API endpoint to your Vercel URL
   - Reload extension

---

## 📱 Flutter App (20 min)

### Quick Build:

```bash
cd tinlens_wrapper_flutter

# Update URL to your Vercel deployment
# Edit lib/main.dart line 34:
# String _defaultUrl = 'https://tinlens.vercel.app/';

# Build Android APK
flutter build apk --release
```

Output: `build/app/outputs/flutter-apk/app-release.apk`

**Install on Android**:
- Transfer APK to phone
- Enable "Install from unknown sources"
- Install and test

---

## 🎯 Mumbai Hacks Demo Checklist

### Before Demo Day:

**Functionality**:
- [ ] Website deployed and accessible
- [ ] User can sign up/login
- [ ] Paste URL → Get verdict
- [ ] Results show with explanation
- [ ] Hindi language toggle works
- [ ] Mobile responsive
- [ ] Browser extension overlays work (basic)

**Presentation**:
- [ ] Prepare 2-3 sample claims/URLs
- [ ] Screenshot key features
- [ ] Test on mobile device
- [ ] Practice 3-minute pitch
- [ ] Prepare GitHub repo link

**Nice-to-Have** (if time):
- [ ] Custom domain (e.g., tinlens.tech)
- [ ] TinLens logo/branding
- [ ] Demo video (30-60 sec)
- [ ] Slide deck

---

## 🐛 Troubleshooting

### "Module not found" errors:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Convex connection issues:
```bash
npx convex dev --once
# Then restart: npx convex dev
```

### Clerk auth not working:
- Check `.env.local` has ALL Clerk variables
- Restart dev server
- Clear browser cookies

### Build fails on Vercel:
- Check environment variables are set
- Check Node version (18+)
- Look at build logs for specific error

---

## 📊 Performance Tips

### Speed up API responses:
1. Use caching in Convex queries
2. Implement loading states
3. Stream responses with Vercel AI SDK
4. Optimize LLM prompts (shorter = faster)

### Reduce costs:
1. Use GPT-3.5-turbo instead of GPT-4 for non-critical
2. Cache frequently asked claims
3. Implement rate limiting per user
4. Set OpenAI max_tokens limit

---

## 🎓 Learning Resources

**Next.js**: https://nextjs.org/docs  
**Convex**: https://docs.convex.dev/  
**Clerk**: https://clerk.com/docs  
**Tailwind CSS**: https://tailwindcss.com/docs  
**Shadcn/UI**: https://ui.shadcn.com/  

---

## 📞 Help & Support

### During Hackathon:
- Check `FEATURE_GAP_ANALYSIS.md` for what's missing
- See `MANUAL_TASKS.md` for detailed deployment steps
- Review `README.md` for full architecture

### Community:
- Next.js Discord: https://nextjs.org/discord
- Convex Discord: https://discord.com/invite/convex
- Stack Overflow: Tag questions with `nextjs` `convex`

---

## 🏆 Post-Hackathon Roadmap

### Week 1-2: Core Features
- Implement Confidence Score (0-100)
- Add Tags system
- Build Misinformation Trends

### Week 3-4: Polish
- Share card generation
- Context Check (old footage detection)
- Safe Mode for low-confidence

### Month 2: Launch
- Google Play Store submission
- Chrome Web Store submission
- Custom domain + SEO
- Marketing campaign

---

**You're Ready!** 🚀

Start with Step 1-6, get the app running locally, then deploy to Vercel. Everything else is optional polish for the demo. Focus on showing a working end-to-end flow!

**Questions?** Check the detailed guides:
- `MANUAL_TASKS.md` - Complete deployment guide
- `FEATURE_GAP_ANALYSIS.md` - What needs to be built
- `README.md` - Full project documentation
