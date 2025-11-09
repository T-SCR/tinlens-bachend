# 🔐 Clerk + Convex JWT Setup Instructions

## ⚠️ CRITICAL: You MUST complete this setup for authentication to work!

The error you're seeing:
```
Uncaught (in promise) e: No JWT template exists with name: convex
```

This means Clerk doesn't have the JWT template configured to work with Convex.

---

## 🚀 STEP-BY-STEP FIX

### 1. Go to Your Clerk Dashboard
👉 https://dashboard.clerk.com/

### 2. Select Your TinLens Application

### 3. Navigate to JWT Templates
- Click **"JWT Templates"** in the left sidebar
- OR go to: https://dashboard.clerk.com/apps/YOUR_APP_ID/jwt-templates

### 4. Create a New Template
- Click **"+ New template"**
- Choose **"Convex"** from the list of templates
- OR click "Blank" and name it **exactly** `convex`

### 5. Configure the Template

If using the Convex preset, it should auto-configure. If creating blank, use these settings:

**Name:** `convex`

**Claims:**
```json
{
  "aud": "convex"
}
```

**Token Lifetime:** 60 seconds (default is fine)

**Save the template**

### 6. Verify Environment Variables

Make sure your `.env.local` has:

```env
# Clerk Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Convex
CONVEX_DEPLOYMENT=dev:...  # or prod:...
NEXT_PUBLIC_CONVEX_URL=https://...
```

### 7. Deploy Convex Auth Config

Run this command to update your Convex deployment:

```bash
npx convex deploy
```

### 8. Restart Your Development Server

```bash
npm run dev
```

---

## ✅ How to Test

1. Go to your local site: http://localhost:3000
2. Click "Sign In"
3. Sign up or log in with Clerk
4. You should be redirected without errors
5. Open browser console - no JWT errors should appear

---

## 🔍 Alternative: Switch to Development Keys

If you're still testing, you can use **Clerk Development Keys** which have fewer restrictions:

1. In Clerk Dashboard → **API Keys**
2. Copy the **Development** keys (they start with `pk_test_` and `sk_test_`)
3. These keys allow JWT templates to work without strict verification

---

## 📝 Additional Resources

- **Clerk + Convex Guide**: https://docs.convex.dev/auth/clerk
- **Clerk JWT Templates**: https://clerk.com/docs/backend-requests/making/jwt-templates
- **Convex Auth Setup**: https://docs.convex.dev/auth/clerk#clerk-setup

---

## 🆘 Still Having Issues?

Check these:

1. **JWT template name is EXACTLY** `convex` (lowercase, no spaces)
2. **Convex deployment is running** - run `npx convex dev` or check dashboard
3. **Environment variables are correct** - restart dev server after changes
4. **Clerk account is in development mode** - not production limits
5. **Browser cache cleared** - hard refresh (Ctrl+Shift+R)

---

## 🎯 Quick Fix Summary

```bash
# 1. Create JWT template in Clerk Dashboard
#    Name: convex
#    Aud: convex

# 2. Deploy to Convex
npx convex deploy

# 3. Restart dev server
npm run dev

# 4. Test sign in
# Should work without errors!
```

---

**Once you complete this setup, all authentication will work properly and the console errors will disappear!**
