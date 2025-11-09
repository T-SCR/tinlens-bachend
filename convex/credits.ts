import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserCredits = query({
  args: {},
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { credits: 0, totalCreditsUsed: 0 };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    const plan = user?.plan ?? "free";
    const credits = user?.credits ?? 0;
    return {
      credits,
      totalCreditsUsed: user?.totalCreditsUsed ?? 0,
      plan,
      hasUnlimitedCredits: plan === "pro" || credits < 0,
    };
  },
});

export const deductCredits = mutation({
  args: { amount: v.number() },
  async handler(ctx, args) {
    if (args.amount <= 0) {
      throw new Error("Amount must be greater than zero");
    }

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const plan = user.plan ?? "free";
    const credits = user.credits ?? 0;

    if (plan === "pro" || credits < 0) {
      return { credits: -1 };
    }

    if (credits < args.amount) {
      throw new Error("Insufficient credits");
    }

    const newCredits = credits - args.amount;
    await ctx.db.patch(user._id, {
      credits: newCredits,
      totalCreditsUsed: (user.totalCreditsUsed ?? 0) + args.amount,
      updatedAt: Date.now(),
    });

    return { credits: newCredits };
  },
});

export const addCredits = mutation({
  args: {
    amount: v.number(),
    userId: v.optional(v.id("users")),
  },
  async handler(ctx, args) {
    if (args.amount <= 0) {
      throw new Error("Amount must be greater than zero");
    }

    let targetUserId = args.userId;
    let userRecord = null;

    if (targetUserId) {
      userRecord = await ctx.db.get(targetUserId);
      if (!userRecord) {
        throw new Error("User not found");
      }
    } else {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error("Not authenticated");
      }

      userRecord = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
        .unique();

      if (!userRecord) {
        throw new Error("User not found");
      }
      targetUserId = userRecord._id;
    }

    const plan = userRecord.plan ?? "free";
    const credits = userRecord.credits ?? 0;

    if (plan === "pro" || credits < 0) {
      return { credits: -1 };
    }

    const updatedCredits = credits + args.amount;
    await ctx.db.patch(targetUserId!, {
      credits: updatedCredits,
      creditsAddedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { credits: updatedCredits };
  },
});
