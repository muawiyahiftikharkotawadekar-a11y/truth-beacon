import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const save = mutation({
  args: {
    inputType: v.string(),
    inputContent: v.string(),
    title: v.optional(v.string()),
    verdict: v.string(),
    confidence: v.number(),
    summary: v.string(),
    fullResult: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    return await ctx.db.insert("analyses", {
      userId: userId ?? undefined,
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("analyses")
      .withIndex("by_created")
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("analyses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const remove = mutation({
  args: { id: v.id("analyses") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return;
    const analyses = await ctx.db
      .query("analyses")
      .collect();
    for (const a of analyses) {
      if (a.userId === String(userId)) {
        await ctx.db.delete(a._id);
      }
    }
  },
});

export const stats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { total: 0, TRUE: 0, FALSE: 0, MISLEADING: 0, UNVERIFIED: 0 };
    const analyses = await ctx.db.query("analyses").collect();
    const userAnalyses = analyses.filter((a) => a.userId === String(userId));
    return {
      total: userAnalyses.length,
      TRUE: userAnalyses.filter((a) => a.verdict === "TRUE").length,
      FALSE: userAnalyses.filter((a) => a.verdict === "FALSE").length,
      MISLEADING: userAnalyses.filter((a) => a.verdict === "MISLEADING").length,
      UNVERIFIED: userAnalyses.filter((a) => a.verdict === "UNVERIFIED").length,
    };
  },
});
