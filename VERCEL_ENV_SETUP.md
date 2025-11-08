# 🚀 Vercel Environment Variables Setup

## ✅ Your Project is Deployed!

**Preview URL**: https://checkmate-main-f1kwiq24y-bachends-projects.vercel.app

**Project Dashboard**: https://vercel.com/bachends-projects/checkmate-main

---

## ⚠️ Required: Add Environment Variables

The build is failing because environment variables are missing. You need to add them via Vercel Dashboard.

---

## 📋 Step-by-Step Instructions

### 1. Open Your Vercel Dashboard

Go to: https://vercel.com/bachends-projects/checkmate-main/settings/environment-variables

Or:
1. Go to https://vercel.com
2. Click on `checkmate-main` project
3. Click **Settings** tab
4. Click **Environment Variables** in left sidebar

---

### 2. Add Environment Variables One by One

Click **Add New** button for each variable:

---

#### Variable 1: OPENAI_API_KEY

```
Name: OPENAI_API_KEY
Value: [GET FROM https://platform.openai.com/api-keys]
Environment: Production, Preview, Development (Select All)
```

**How to get**:
1. Go to https://platform.openai.com/api-keys
2. Sign up / Login
3. Click "Create new secret key"
4. Add $5 payment method
5. Copy the key (starts with `sk-proj-...`)

---

#### Variable 2: EXA_API_KEY

```
Name: EXA_API_KEY
Value: 3d578d69-7673-412d-92d4-5c350547c615
Environment: Production, Preview, Development (Select All)
```

---

#### Variable 3: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

```
Name: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
Value: pk_test_a25vd24tZGlub3NhdXItNzkuY2xlcmsuYWNjb3VudHMuZGV2JA
Environment: Production, Preview, Development (Select All)
```

---

#### Variable 4: CLERK_SECRET_KEY

```
Name: CLERK_SECRET_KEY
Value: sk_test_hrwjSRFFElPZklwlnXQrNRgv0OKPZinZc8M33C5TCZ
Environment: Production, Preview, Development (Select All)
```

---

#### Variable 5: CONVEX_DEPLOYMENT

```
Name: CONVEX_DEPLOYMENT
Value: dev:elated-wildcat-321
Environment: Production, Preview, Development (Select All)
```

---

#### Variable 6: NEXT_PUBLIC_CONVEX_URL

```
Name: NEXT_PUBLIC_CONVEX_URL
Value: https://elated-wildcat-321.convex.cloud
Environment: Production, Preview, Development (Select All)
```

---

#### Variable 7: FIRECRAWL_API_KEY

```
Name: FIRECRAWL_API_KEY
Value: fc-f5e31858821c4dbcb8d9b8c643ecd528
Environment: Production, Preview, Development (Select All)
```

---

### 3. Redeploy After Adding Variables

After adding all environment variables:

1. Go to **Deployments** tab
2. Click on the latest deployment (the failed one)
3. Click **Redeploy** button
4. Select **Use existing Build Cache** (faster)
5. Click **Redeploy**

**OR** push a new commit:

```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin master
```

---

## 🎯 What Happens Next

1. Vercel will rebuild with environment variables
2. Build should succeed in ~2-3 minutes
3. Your app will be live at: https://checkmate-main-[hash].vercel.app
4. You'll get a production URL

---

## 🔍 Check Build Status

Watch the build logs:
1. Go to https://vercel.com/bachends-projects/checkmate-main
2. Click **Deployments** tab
3. Click on the latest deployment
4. Watch the **Build Logs** section

If you see "✅ Build successful", you're live!

---

## ✅ After Successful Deployment

### Update Clerk Domain

1. Go to https://dashboard.clerk.com/
2. Select your TinLens app
3. Go to **Settings** → **Domains**
4. Add your Vercel production URL
5. Save

### Test Your Live Site

Visit your Vercel URL and test:
- Sign up with new email
- Paste Twitter URL
- Click Analyze
- Check fact-checking works
- Verify Exa sources appear

---

## 💡 Quick Copy-Paste Format

For faster setup, copy this and fill in OpenAI key:

```
OPENAI_API_KEY=[YOUR_KEY_FROM_OPENAI]
EXA_API_KEY=3d578d69-7673-412d-92d4-5c350547c615
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_a25vd24tZGlub3NhdXItNzkuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_hrwjSRFFElPZklwlnXQrNRgv0OKPZinZc8M33C5TCZ
CONVEX_DEPLOYMENT=dev:elated-wildcat-321
NEXT_PUBLIC_CONVEX_URL=https://elated-wildcat-321.convex.cloud
FIRECRAWL_API_KEY=fc-f5e31858821c4dbcb8d9b8c643ecd528
```

---

## 🎉 Summary

- ✅ Code pushed to Vercel
- ✅ Git repository initialized
- ✅ Convex backend running
- ✅ Local dev server running
- ⚠️ Need to add env vars to Vercel
- ⚠️ Need OpenAI API key

**Total time to finish**: 10 minutes

---

**Once env vars are added, your TinLens will be LIVE! 🚀**
