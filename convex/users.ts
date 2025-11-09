import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  query,
  mutation,
} from "./_generated/server";

type PlanTier = "free" | "plus" | "pro";

const PLAN_CREDIT_ALLOCATIONS: Record<PlanTier, number> = {
  free: 25,
  plus: 150,
  pro: -1, // sentinel for unlimited usage
};

const DEFAULT_PLAN: PlanTier = "free";

function resolvePlan(rawPlan?: unknown): PlanTier {
  if (rawPlan === "plus" || rawPlan === "pro") {
    return rawPlan;
  }
  return DEFAULT_PLAN;
}

function allocationForPlan(plan: PlanTier) {
  return PLAN_CREDIT_ALLOCATIONS[plan] ?? PLAN_CREDIT_ALLOCATIONS[DEFAULT_PLAN];
}

// Public mutation to create user from client (fallback to webhooks)
export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    username: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existingUser) {
      return existingUser;
    }

    // Create new user
    const now = Date.now();
    const plan = DEFAULT_PLAN;
    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      imageUrl: args.imageUrl,
      username: args.username,
      plan,
      credits: allocationForPlan(plan),
      totalCreditsUsed: 0,
      creditsAddedAt: now,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Internal mutation to create or update user from webhook
export const updateOrCreateUser = internalMutation({
  args: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clerkUser: v.any(), // Use v.any() to handle Clerk's UserJSON type
  },
  async handler(ctx, { clerkUser }) {
    // Get primary email address
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const primaryEmail =
      clerkUser.email_addresses.find(
        (email: { verification: { status: string } }) =>
          email.verification.status === "verified"
      ) || clerkUser.email_addresses[0];

    if (!primaryEmail) {
      throw new Error("User has no email address");
    }

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkUser.id))
      .unique();

    const incomingPlan = resolvePlan(
      clerkUser.public_metadata?.plan || clerkUser.private_metadata?.plan
    );

    const userData = {
      clerkId: clerkUser.id,
      email: clerkUser.email_addresses[0]?.email_address || "",
      firstName: clerkUser.first_name || undefined,
      lastName: clerkUser.last_name || undefined,
      imageUrl: clerkUser.image_url || undefined,
      username: clerkUser.username || undefined,
      plan: incomingPlan,
      createdAt: clerkUser.created_at,
      updatedAt: clerkUser.updated_at,
    };

    if (existingUser) {
      const planChanged = existingUser.plan !== incomingPlan;
      const updatedCredits =
        incomingPlan === "pro"
          ? -1
          : planChanged
            ? allocationForPlan(incomingPlan)
            : existingUser.credits;

      return await ctx.db.patch(existingUser._id, {
        ...userData,
        credits: updatedCredits,
        creditsAddedAt: planChanged
          ? Date.now()
          : existingUser.creditsAddedAt ?? Date.now(),
      });
    } else {
      const now = Date.now();
      return await ctx.db.insert("users", {
        ...userData,
        credits: allocationForPlan(incomingPlan),
        totalCreditsUsed: 0,
        creditsAddedAt: now,
      });
    }
  },
});

// Internal mutation to delete user from webhook
export const deleteUser = internalMutation({
  args: { clerkId: v.string() },
  async handler(ctx, { clerkId }) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .unique();

    if (user) {
      await ctx.db.delete(user._id);
    }
  },
});

// Internal query to get user by Clerk ID (used in auth) - from documentation
export const getUser = internalQuery({
  args: { subject: v.string() },
  async handler(ctx, args) {
    return ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.subject))
      .unique();
  },
});

// Internal query to get user by Clerk ID (used in auth)
export const getUserByClerkId = internalQuery({
  args: { clerkId: v.string() },
  async handler(ctx, { clerkId }) {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .unique();
  },
});

// Public query to get current user
export const getCurrentUser = query({
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

    return {
      ...user,
      hasUnlimitedCredits: user.plan === "pro" || user.credits === -1,
    };
  },
});

// Public query to get all users (for admin purposes)
export const getAllUsers = query({
  args: {},
  async handler(ctx) {
    // Only return basic info for privacy
    return await ctx.db
      .query("users")
      .collect()
      .then((users) =>
        users.map((user) => ({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          imageUrl: user.imageUrl,
          createdAt: user.createdAt,
        }))
      );
  },
});

// Public query to get creator comments
export const getCreatorComments = query({
  args: {
    creatorId: v.string(),
    platform: v.string(),
  },
  async handler(ctx, { creatorId, platform }) {
    const comments = await ctx.db
      .query("creatorComments")
      .withIndex("by_creator_platform", (q) =>
        q.eq("creatorId", creatorId).eq("platform", platform)
      )
      .order("desc")
      .collect();

    // Get user information for each comment
    const commentsWithUserInfo = await Promise.all(
      comments.map(async (comment) => {
        const user = await ctx.db.get(comment.userId);
        return {
          _id: comment._id,
          comment: comment.content,
          userName: user?.firstName || user?.username || "Anonymous",
          createdAt: comment.createdAt,
        };
      })
    );

    return commentsWithUserInfo;
  },
});

// Public mutation to add creator comment
export const addCreatorComment = mutation({
  args: {
    creatorId: v.string(),
    platform: v.string(),
    comment: v.string(),
    userId: v.string(), // Clerk user ID
    userName: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the user from the database
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.userId))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const now = Date.now();
    return await ctx.db.insert("creatorComments", {
      creatorId: args.creatorId,
      platform: args.platform,
      userId: user._id,
      content: args.comment,
      createdAt: now,
      updatedAt: now,
    });
  },
});
