import { v } from "convex/values";
import { query } from "./_generated/server";

// Generic analyses module (wraps the existing `tiktokAnalyses` table)
// This lets the frontend use platform-agnostic naming while we keep
// the underlying Convex table stable for now.

// Get analyses for the current user
export const getUserAnalyses = query({
  args: {},
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      return [];
    }

    return await ctx.db
      .query("tiktokAnalyses")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

// Get all analyses from all users (enriched with basic user info)
export const getAllAnalyses = query({
  args: {},
  async handler(ctx) {
    const analyses = await ctx.db
      .query("tiktokAnalyses")
      .order("desc")
      .collect();

    return Promise.all(
      analyses.map(async (analysis) => {
        const user = await ctx.db.get(analysis.userId);
        return {
          ...analysis,
          user: user
            ? {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                imageUrl: user.imageUrl,
              }
            : null,
        };
      })
    );
  },
});

// Get a single analysis by ID
export const getAnalysisById = query({
  args: { analysisId: v.id("tiktokAnalyses") },
  async handler(ctx, args) {
    const analysis = await ctx.db.get(args.analysisId);
    return analysis ?? null;
  },
});

// Simple moderation queue: analyses that require fact-checking or
// have low confidence / sensitive verdicts.
export const getModerationQueue = query({
  args: {
    limit: v.optional(v.number()),
  },
  async handler(ctx, args) {
    const limit = args.limit ?? 20;

    const candidates = await ctx.db
      .query("tiktokAnalyses")
      .withIndex("by_created_at", (q) => q)
      .order("desc")
      .take(200);

    const queue = candidates.filter((analysis) => {
      const requiresFactCheck = analysis.requiresFactCheck;
      const verdict = analysis.factCheck?.verdict;
      const confidence = analysis.factCheck?.confidence ?? 0;

      const isSensitiveVerdict =
        verdict === "misleading" || verdict === "unverifiable";
      const isLowConfidence = confidence > 0 && confidence < 60;

      return requiresFactCheck || isSensitiveVerdict || isLowConfidence;
    });

    const sliced = queue.slice(0, limit);

    const withUser = await Promise.all(
      sliced.map(async (analysis) => {
        const user = await ctx.db.get(analysis.userId);
        return {
          ...analysis,
          user: user
            ? {
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
              }
            : null,
        };
      })
    );

    return withUser;
  },
});

// Global analysis statistics (wrapper around the same calculations
// used in tiktokAnalyses.getAllAnalysisStats)
export const getAllAnalysisStats = query({
  args: {},
  async handler(ctx) {
    const allAnalyses = await ctx.db.query("tiktokAnalyses").collect();

    if (allAnalyses.length === 0) {
      return {
        totalAnalyses: 0,
        requiresFactCheck: 0,
        hasNewsContent: 0,
        factCheckSummary: {
          verifiedTrue: 0,
          verifiedFalse: 0,
          misleading: 0,
          unverifiable: 0,
          needsVerification: 0,
        },
      };
    }

    const stats = allAnalyses.reduce(
      (acc, analysis) => {
        if (analysis.requiresFactCheck) {
          acc.requiresFactCheck++;
        }
        if (analysis.newsDetection?.hasNewsContent) {
          acc.hasNewsContent++;
        }
        if (analysis.factCheck?.summary) {
          acc.factCheckSummary.verifiedTrue +=
            analysis.factCheck.summary.verifiedTrue;
          acc.factCheckSummary.verifiedFalse +=
            analysis.factCheck.summary.verifiedFalse;
          acc.factCheckSummary.misleading +=
            analysis.factCheck.summary.misleading;
          acc.factCheckSummary.unverifiable +=
            analysis.factCheck.summary.unverifiable;
          acc.factCheckSummary.needsVerification +=
            analysis.factCheck.summary.needsVerification;
        }
        return acc;
      },
      {
        requiresFactCheck: 0,
        hasNewsContent: 0,
        factCheckSummary: {
          verifiedTrue: 0,
          verifiedFalse: 0,
          misleading: 0,
          unverifiable: 0,
          needsVerification: 0,
        },
      }
    );

    return {
      totalAnalyses: allAnalyses.length,
      ...stats,
    };
  },
});

// Per-user analysis statistics (wrapper around existing logic)
export const getUserAnalysisStats = query({
  args: {},
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      return null;
    }

    const analyses = await ctx.db
      .query("tiktokAnalyses")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const totalAnalyses = analyses.length;
    const requiresFactCheck = analyses.filter((a) => a.requiresFactCheck).length;
    const hasNewsContent = analyses.filter(
      (a) => a.newsDetection?.hasNewsContent
    ).length;

    let totalVerifiedTrue = 0;
    let totalVerifiedFalse = 0;
    let totalMisleading = 0;
    let totalUnverifiable = 0;
    let totalNeedsVerification = 0;

    analyses.forEach((analysis) => {
      if (analysis.factCheck?.summary) {
        totalVerifiedTrue += analysis.factCheck.summary.verifiedTrue;
        totalVerifiedFalse += analysis.factCheck.summary.verifiedFalse;
        totalMisleading += analysis.factCheck.summary.misleading;
        totalUnverifiable += analysis.factCheck.summary.unverifiable;
        totalNeedsVerification +=
          analysis.factCheck.summary.needsVerification;
      }
    });

    return {
      totalAnalyses,
      requiresFactCheck,
      hasNewsContent,
      factCheckSummary: {
        verifiedTrue: totalVerifiedTrue,
        verifiedFalse: totalVerifiedFalse,
        misleading: totalMisleading,
        unverifiable: totalUnverifiable,
        needsVerification: totalNeedsVerification,
      },
    };
  },
});
