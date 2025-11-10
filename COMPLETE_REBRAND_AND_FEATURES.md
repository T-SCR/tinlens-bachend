# 🎯 TinLens Complete Rebrand & Feature Implementation Guide

**Team**: Sharat & Hrithvik  
**Project**: Mumbai Hacks  
**Goal**: Transform from CheckMate to TinLens with credits system and full platform support

---

## ✅ COMPLETED CHANGES

### 1. Documentation Cleanup
✅ **Removed all unnecessary docs**:
- Deleted `/docs` directory (contained CheckMate references, old team members)
- Removed all `.md` files except `README.md` and `CLERK_SETUP_INSTRUCTIONS.md`
- Removed all `.txt` guide files

### 2. Database Schema Updated
✅ **Added credits system** to `convex/schema.ts`:
```typescript
users: defineTable({
  // ... existing fields
  credits: v.number(), // Analysis credits
  totalCreditsUsed: v.number(), // Total credits consumed
  creditsAddedAt: v.optional(v.number()), // Last credit top-up
})
```

### 3. Platform Detection Updated
✅ **Added Instagram & YouTube** support in `lib/validation.ts`:
```typescript
export type Platform = "tiktok" | "twitter" | "instagram" | "youtube" | "web";
```

### 4. README Updated
✅ **New branding**:
- TinLens header
- Mumbai Hacks attribution
- Team: Sharat & Hrithvik

---

## 🚧 CHANGES NEEDED (Manual Implementation Required)

### 1. Remove Demo Mode from Hero Section

**File**: `components/hero-section.tsx`

**Remove these lines**:
- Line 57: `const [isMockLoading, setIsMockLoading] = useState(false);`
- Line 58-124: Remove entire `mockResult` state and `handleMockAnalysis` function
- Line 454-470: Remove the entire "Mock Analysis Button" section
- Line 476-481: Remove "Mock Demo Description" section

**Update loading checks**:
Replace all instances of:
```typescript
isLoading || isMockLoading
```
With:
```typescript
isLoading
```

**Result**: Users must use real analysis (costs credits), no free demo.

---

### 2. Implement Credits System

#### A. Create Credits Convex Functions

**File**: `convex/credits.ts` (NEW)

```typescript
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get user credits
export const getUserCredits = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return {
      credits: user?.credits || 0,
      totalCreditsUsed: user?.totalCreditsUsed || 0,
    };
  },
});

// Deduct credits for analysis
export const deductCredits = mutation({
  args: { 
    userId: v.id("users"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");
    
    const newCredits = user.credits - args.amount;
    if (newCredits < 0) {
      throw new Error("Insufficient credits");
    }
    
    await ctx.db.patch(args.userId, {
      credits: newCredits,
      totalCreditsUsed: user.totalCreditsUsed + args.amount,
    });
    
    return { credits: newCredits };
  },
});

// Add credits (for admin/purchase)
export const addCredits = mutation({
  args: {
    userId: v.id("users"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");
    
    await ctx.db.patch(args.userId, {
      credits: user.credits + args.amount,
      creditsAddedAt: Date.now(),
    });
    
    return { credits: user.credits + args.amount };
  },
});
```

#### B. Update User Creation Hook

**File**: `convex/users.ts`

Add default credits when creating users:
```typescript
// In createUser or syncUser function
await ctx.db.insert("users", {
  // ... existing fields
  credits: 10, // Give 10 free credits to start
  totalCreditsUsed: 0,
  creditsAddedAt: Date.now(),
});
```

#### C. Create Credits Display Component

**File**: `components/credits-display.tsx` (NEW)

```typescript
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useConvexAuth } from "convex/react";
import { Badge } from "@/components/ui/badge";
import { Coins } from "lucide-react";

export function CreditsDisplay() {
  const { isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.currentUser);
  
  if (!isAuthenticated || !user) return null;
  
  return (
    <Badge variant="secondary" className="flex items-center gap-2">
      <Coins className="h-4 w-4" />
      <span>{user.credits} credits</span>
    </Badge>
  );
}
```

#### D. Add Credits Check to Hero Section

**File**: `components/hero-section.tsx`

At the start of `handleAnalyze` function:
```typescript
const handleAnalyze = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Check credits FIRST
  if (user && user.credits < 1) {
    toast.error("Insufficient credits. Please purchase more to continue.");
    return;
  }
  
  // ... rest of analysis logic
};
```

After successful analysis:
```typescript
// Deduct 1 credit
if (user) {
  await deductCredits({
    userId: user._id,
    amount: 1,
  });
  toast.success("Analysis complete! 1 credit used.");
}
```

---

### 3. Add Instagram & YouTube Handlers

**Due to complexity**, I recommend using RapidAPI endpoints:

#### Instagram Handler
**API**: Instagram Scraper API (RapidAPI)
**Endpoint**: `https://instagram-scraper-api2.p.rapidapi.com/v1/post_info`

#### YouTube Handler  
**API**: YouTube Data API (RapidAPI)
**Endpoint**: `https://yt-api.p.rapidapi.com/dl`

**Implementation**:
1. Add handlers similar to `twitter-handler.ts` and `tiktok-handler.ts`
2. Update `app/api/transcribe/route.ts` to include:
```typescript
case "instagram":
  handler = new InstagramHandler();
  break;
case "youtube":
  handler = new YouTubeHandler();
  break;
```

---

### 4. Update Header with Credits Display

**File**: `components/ui/header-2.tsx`

Add credits display next to user menu:
```typescript
import { CreditsDisplay } from "@/components/credits-display";

// Inside the header component, after navigation links:
{isAuthenticated && <CreditsDisplay />}
```

---

### 5. Update Content & Copy

#### Hero Section
**File**: `components/hero-section.tsx`

Update text to remove TikTok/Twitter only references:
```typescript
<p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
  {t.heroSubtitle || "Verify content from X/Twitter, YouTube, Instagram, TikTok, and web articles with AI-powered fact-checking"}
</p>
```

Update placeholder:
```typescript
placeholder="Paste any X/Twitter, YouTube, Instagram, TikTok, or article URL"
```

#### How It Works Section
**File**: `components/redesigned-how-it-works.tsx`

Update step 1:
```typescript
<h3 className="text-xl font-semibold mb-2 font-[family-name:var(--font-space-grotesk)]">
  Paste Content URL
</h3>
<p className="text-muted-foreground">
  Paste any public URL from X/Twitter, YouTube, Instagram, TikTok, or web articles into our secure analyzer.
</p>
```

Add platform badges:
```typescript
<div className="flex gap-2 mt-4">
  <Badge>X/Twitter</Badge>
  <Badge>YouTube</Badge>
  <Badge>Instagram</Badge>
  <Badge>TikTok</Badge>
  <Badge>Web</Badge>
</div>
```

---

### 6. Create Credits Purchase Page

**File**: `app/credits/page.tsx` (NEW)

```typescript
"use client";

import { useConvexAuth } from "convex/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, Zap, Crown } from "lucide-react";

export default function CreditsPage() {
  const { isAuthenticated } = useConvexAuth();
  
  if (!isAuthenticated) {
    return <div>Please sign in to purchase credits</div>;
  }
  
  const plans = [
    {
      name: "Starter",
      credits: 50,
      price: "$5",
      icon: Coins,
      popular: false,
    },
    {
      name: "Pro",
      credits: 200,
      price: "$15",
      icon: Zap,
      popular: true,
    },
    {
      name: "Premium",
      credits: 500,
      price: "$30",
      icon: Crown,
      popular: false,
    },
  ];
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Purchase Credits</h1>
        <p className="text-muted-foreground">
          Each analysis costs 1 credit. Choose your plan below.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <Card key={plan.name} className={plan.popular ? "border-primary shadow-lg" : ""}>
              <CardHeader>
                {plan.popular && (
                  <Badge className="mb-2 w-fit">Most Popular</Badge>
                )}
                <Icon className="h-12 w-12 mb-4 text-primary" />
                <CardTitle>{plan.name}</CardTitle>
                <div className="text-3xl font-bold">{plan.price}</div>
                <div className="text-muted-foreground">{plan.credits} credits</div>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                  Purchase
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
```

---

### 7. Update Navigation

**File**: `components/ui/header-2.tsx`

Add credits link:
```typescript
const links = [
  { label: 'Verify', href: '/' },
  { label: 'Trends', href: '/news' },
  { label: 'How it Works', href: '/#how-it-works' },
  { label: 'My Analyses', href: '/analyses' },
  { label: 'Credits', href: '/credits' }, // NEW
];
```

---

## 🎨 CONTENT UPDATES

### Remove All CheckMate References

Run this search and replace in your IDE:
- Search: `CheckMate` (case-insensitive)
- Replace: `TinLens`
- Files: All `.tsx`, `.ts`, `.md` files

### Update Team References

- Replace: Any team member names → `Sharat & Hrithvik`
- Replace: `Imagine Hack` → `Mumbai Hacks`

---

## 🚀 DEPLOYMENT CHECKLIST

### 1. Environment Variables
Add to Vercel:
```env
# For Instagram
RAPIDAPI_KEY=your_rapidapi_key

# Existing
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
CONVEX_DEPLOYMENT=prod:...
```

### 2. Deploy Convex Schema
```bash
npx convex deploy
```

### 3. Deploy to Vercel
```bash
git add -A
git commit -m "Complete TinLens rebrand with credits system"
vercel --prod
```

---

## 📊 TESTING PLAN

### 1. Credits System
- [ ] Sign up new user → Gets 10 free credits
- [ ] Run analysis → Credits deduct by 1
- [ ] Try analysis with 0 credits → Shows error
- [ ] Credits display shows correct count

### 2. Platform Support
- [ ] Twitter/X URL → Works
- [ ] TikTok URL → Works
- [ ] Instagram URL → Detects platform
- [ ] YouTube URL → Detects platform
- [ ] Web article → Works

### 3. UI/UX
- [ ] No demo mode button visible
- [ ] Credits displayed in header
- [ ] How It Works shows all platforms
- [ ] /credits page loads
- [ ] /analyses dashboard works

---

## 🎯 PRIORITY ORDER

1. **HIGH PRIORITY** (Do first):
   - Remove demo mode
   - Add credits deduction to analysis
   - Update content/copy

2. **MEDIUM PRIORITY** (Do next):
   - Create credits display component
   - Create /credits page
   - Add credits to header

3. **LOW PRIORITY** (Do later):
   - Instagram handler (can use existing web handler for now)
   - YouTube handler (can use existing web handler for now)
   - Advanced credits features (history, transactions)

---

## 💡 QUICK WINS

Copy-paste these commands to clean up fast:

```powershell
# Remove all CheckMate references (use in VS Code)
# Find: checkmate (case-insensitive)
# Replace: tinlens

# Find: Imagine Hack
# Replace: Mumbai Hacks

# Find any old team member names
# Replace with: Sharat & Hrithvik
```

---

**This guide contains everything needed to complete the TinLens transformation!**
you