# 🎯 TinLens Manual Tasks & Deployment Guide

## 📁 1. FOLDER RENAMING (DO THIS FIRST!)

### ✅ Already Renamed:
- `checkmate-browser-extension` → `tinlens-browser-extension` ✅
- `checkmate_wrapper_flutter` → `tinlens_wrapper_flutter` ✅

### ⚠️ MANUAL ACTION REQUIRED:
1. **Close this VS Code workspace**
2. **Rename folder**: `checkmate-main` → `tinlens-main`
3. **Reopen the workspace**

---

## 🎨 2. LOGO & BRANDING ASSETS

### 📍 Where to Place Your TinLens Logos:

#### **Web App** (Next.js)
```
app/favicon.ico                    → Replace with 16×16, 32×32, 48×48 ICO
public/logo.svg                    → Add TinLens logo (scalable)
public/logo-192.png                → Add 192×192 PWA icon
public/logo-512.png                → Add 512×512 PWA icon
public/og-image.png                → Add 1200×630 Open Graph image
```

#### **Browser Extension**
```
tinlens-browser-extension/
  ├── icon_32.png                  → Replace 32×32 icon
  └── icon_128.png                 → Replace 128×128 icon
```

#### **Flutter Mobile App**
```
tinlens_wrapper_flutter/assets/icon/
  └── icon_128.png                 → Replace base icon (512×512 recommended)

Then run: flutter pub run flutter_launcher_icons
```

This will auto-generate all Android/iOS icon sizes:
- Android: `android/app/src/main/res/mipmap-*/`
- iOS: `ios/Runner/Assets.xcassets/AppIcon.appiconset/`

---

## 🛠️ 3. CONFIGURATION UPDATES

### A. Environment Variables (.env.local)

**Create this file** in the root directory:

```env
# Deployment
VERCEL_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=https://tinlens.vercel.app

# Convex (Real-time database)
CONVEX_DEPLOYMENT=dev:your-deployment-id
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY
CLERK_SECRET_KEY=sk_test_YOUR_KEY
NEXT_PUBLIC_CLERK_FRONTEND_API_URL=https://your-clerk-instance.clerk.accounts.dev
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/news
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/news

# AI APIs
OPENAI_API_KEY=sk-proj-YOUR_KEY

# Content Scraping & Retrieval
FIRECRAWL_API_KEY=fc-YOUR_KEY        # Web scraping
EXA_API_KEY=your-exa-api-key         # Semantic search

# Optional: Social Media
TWITTER_BEARER_TOKEN=your-token       # Twitter/X API
YOUTUBE_API_KEY=your-key              # YouTube API
```

### B. Convex Setup

1. **Install Convex CLI**:
   ```bash
   npm install -g convex
   ```

2. **Initialize Convex**:
   ```bash
   cd tinlens-main
   npx convex dev
   ```

3. **Follow prompts**:
   - Team: `mumbai-hacks`
   - Project: `tinlens`
   - Copy deployment URL to `.env.local`

### C. Clerk Authentication Setup

1. **Sign up**: https://clerk.com
2. **Create application**: "TinLens"
3. **Copy API keys** to `.env.local`
4. **Configure domains**:
   - Development: `http://localhost:3000`
   - Production: `https://tinlens.vercel.app`

---

## 📦 4. DEPLOYMENT GUIDE

### 🌐 **Website (Next.js on Vercel)**

#### Prerequisites:
- GitHub account
- Vercel account (free tier OK)

#### Steps:

1. **Push to GitHub**:
   ```bash
   cd tinlens-main
   git init
   git add .
   git commit -m "Initial TinLens rebranding"
   git remote add origin https://github.com/sharatchandra/tinlens.git
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to https://vercel.com
   - Click "Import Project"
   - Select your GitHub repo: `sharatchandra/tinlens`
   - **Framework**: Next.js (auto-detected)
   - **Root Directory**: `./` (or `tinlens-main` if you pushed the parent folder)
   - **Environment Variables**: Add ALL variables from `.env.local`
   - Click "Deploy"

3. **Custom Domain** (optional):
   - In Vercel dashboard → Settings → Domains
   - Add: `tinlens.vercel.app` or your custom domain

4. **Update URLs**:
   ```bash
   # Update Flutter app
   tinlens_wrapper_flutter/lib/main.dart
   # Change: _defaultUrl = 'https://tinlens.vercel.app/'
   ```

---

### 🔌 **Browser Extension (Chrome/Edge)**

#### Steps:

1. **Build Extension** (if needed):
   ```bash
   cd tinlens-browser-extension
   # No build needed for current setup (vanilla JS)
   ```

2. **Test Locally**:
   - Chrome: `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select `tinlens-browser-extension` folder

3. **Publish to Chrome Web Store**:
   - Create developer account: https://chrome.google.com/webstore/devconsole
   - Pay $5 one-time fee
   - **Prepare assets**:
     - Extension icons (already have: 32×32, 128×128)
     - Screenshots (1280×800 or 640×400)
     - Promo images:
       - Small: 440×280
       - Large: 1400×560
   - **Create new item**:
     - Upload ZIP of `tinlens-browser-extension/`
     - Fill in description (use README text)
     - Category: Productivity
     - Privacy policy URL
     - Submit for review (1-3 days)

4. **Publish to Edge Add-ons**:
   - Register: https://partner.microsoft.com/en-us/dashboard/microsoftedge
   - Similar process, reuse Chrome assets

---

### 📱 **Mobile App (Flutter)**

#### Prerequisites:
```bash
flutter doctor  # Check Flutter installation
```

#### Android APK (for testing):

```bash
cd tinlens_wrapper_flutter
flutter build apk --release
```

Output: `build/app/outputs/flutter-apk/app-release.apk`

#### Android App Bundle (for Play Store):

```bash
flutter build appbundle --release
```

Output: `build/app/outputs/bundle/release/app-release.aab`

#### iOS (requires macOS + Xcode):

```bash
flutter build ios --release
```

#### Publish to Google Play Store:

1. **Create Developer Account**: https://play.google.com/console
   - $25 one-time fee

2. **Prepare Assets**:
   - App icon: 512×512 (already done via `flutter_launcher_icons`)
   - Feature graphic: 1024×500
   - Screenshots: 2-8 images (phone, tablet)
   - Privacy policy URL

3. **Upload**:
   - Create new application: "TinLens"
   - Upload `app-release.aab`
   - Fill in store listing (use README)
   - Set content rating, pricing (free), countries
   - Submit for review (1-7 days)

#### Publish to Apple App Store:

1. **Requirements**:
   - Apple Developer account ($99/year)
   - macOS + Xcode

2. **Steps**:
   - Open `ios/Runner.xcworkspace` in Xcode
   - Archive → Upload to App Store Connect
   - Create app listing, fill metadata
   - Submit for review (1-3 days)

---

## 🚀 5. QUICK DEPLOYMENT CHECKLIST

### Before Deploying:

- [ ] Close workspace, rename `checkmate-main` → `tinlens-main`, reopen
- [ ] Replace ALL logo files (see section 2)
- [ ] Create `.env.local` with all API keys
- [ ] Run `npm install` to ensure dependencies
- [ ] Test locally: `npm run dev` → http://localhost:3000
- [ ] Convex setup: `npx convex dev`
- [ ] Clerk setup completed

### Deployment Order:

1. **Website First** (Vercel) ← Start here!
   - Push to GitHub
   - Deploy on Vercel
   - Test live URL

2. **Browser Extension** (Chrome/Edge)
   - Update `background.js` with live API URL if needed
   - Test locally
   - Submit to stores

3. **Mobile App** (Google Play/App Store)
   - Update `main.dart` with live URL
   - Build APK/AAB
   - Submit to stores

---

## 🎨 6. LOGO DESIGN RECOMMENDATIONS

### TinLens Logo Suggestions:
- **Icon**: Magnifying glass (🔍) with circuits/AI patterns inside
- **Colors**: 
  - Primary: Deep blue (#1e40af) - trust, technology
  - Accent: Amber (#f59e0b) - attention, verification
  - Success: Green (#10b981) - truth
  - Danger: Red (#ef4444) - false
- **Typography**: Modern sans-serif (Inter, Poppins, or Space Grotesk)
- **Tagline**: "No possible way to escape" or "Truth at a glance"

### Where to Create Logos:
- **Free**: Canva, Figma (free tier)
- **AI-generated**: DALL-E, Midjourney
- **Professional**: Fiverr ($20-100)

---

## 📊 7. API KEYS YOU NEED

### Essential (MVP):
- ✅ **OpenAI API** ($5-20/month): https://platform.openai.com/api-keys
- ✅ **Convex** (free tier): https://www.convex.dev/
- ✅ **Clerk** (free tier): https://clerk.com/
- ✅ **Exa Search** ($): https://exa.ai/ (semantic search)
- ✅ **Firecrawl** ($): https://firecrawl.dev/ (web scraping)

### Optional:
- **Twitter/X API** (paid): Social media analysis
- **YouTube Data API** (free quota): Video analysis
- **TikTok API** (limited): Video scraping

---

## 🔍 8. TESTING CHECKLIST

### Before Mumbai Hacks Demo:

- [ ] Website loads at live URL
- [ ] User can sign up/login (Clerk)
- [ ] Paste URL → Get verdict + score
- [ ] Confidence score shows with tooltip
- [ ] Tags display correctly
- [ ] Share card generation works
- [ ] Hindi translations display
- [ ] Mobile responsive design
- [ ] Browser extension overlays work
- [ ] Flutter app loads web view

### Performance Targets:
- [ ] Time-to-verdict < 30s (90th percentile ≤ 45s)
- [ ] Confidence score formula implemented
- [ ] At least 2-5 citations shown
- [ ] Safe Mode triggers at confidence < 50

---

## 📞 SUPPORT CONTACTS

- **Vercel Support**: https://vercel.com/support
- **Convex Docs**: https://docs.convex.dev/
- **Clerk Support**: https://clerk.com/support
- **Chrome Web Store**: https://support.google.com/chrome_webstore/

---

**Next Steps**: Complete items in order listed. Start with logos, then environment setup, then Vercel deployment! 🚀
