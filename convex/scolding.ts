import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

// Get user's scolding history
export const getHistory = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("lazinessRecords")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(20);
  },
});

// Save a scolding record
export const saveRecord = mutation({
  args: {
    message: v.string(),
    scoldingResponse: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Update user stats
    const existingStats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingStats) {
      await ctx.db.patch(existingStats._id, {
        totalScolds: existingStats.totalScolds + 1,
        lastActiveAt: Date.now(),
        lazyStreak: existingStats.lazyStreak + 1,
      });
    } else {
      await ctx.db.insert("userStats", {
        userId,
        totalScolds: 1,
        lastActiveAt: Date.now(),
        lazyStreak: 1,
      });
    }

    return await ctx.db.insert("lazinessRecords", {
      userId,
      message: args.message,
      scoldingResponse: args.scoldingResponse,
      timestamp: Date.now(),
    });
  },
});

// Get user stats
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

// Generate a scolding using Grok API
export const generateScolding = action({
  args: { userMessage: v.string() },
  handler: async (ctx, args) => {
    const grokApiKey = process.env.XAI_API_KEY;

    if (!grokApiKey) {
      // Fallback scoldings if no API key
      const fallbackScolds = [
        "Oh, so you're too lazy to even TRY? Your couch is probably more productive than you. At least it supports something!",
        "Let me guess, clicking that button was your workout for the day? Get off your butt and DO something!",
        "I've seen sloths with more ambition. Even they eventually reach the next branch. What's YOUR excuse?",
        "Wow, another day of doing absolutely nothing meaningful? Your future self is already disappointed.",
        "You came here for motivation? How about: THE WORLD ISN'T GOING TO WAIT FOR YOU TO FEEL READY!",
        "Your potential is crying in a corner while you're here asking an AI to yell at you. PATHETIC!",
        "Even a broken clock is right twice a day. You? You're not even trying to tell time!",
        "Congratulations! You've mastered the art of procrastination. Too bad that's not a marketable skill!",
      ];
      const randomScold = fallbackScolds[Math.floor(Math.random() * fallbackScolds.length)];

      await ctx.runMutation(api.scolding.saveRecord, {
        message: args.userMessage,
        scoldingResponse: randomScold,
      });

      return randomScold;
    }

    try {
      const response = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${grokApiKey}`,
        },
        body: JSON.stringify({
          model: "grok-3-latest",
          messages: [
            {
              role: "system",
              content: `You are a brutally honest life coach who roasts lazy people into action. Your job is to SCOLD the user in a funny but harsh way for being lazy. Keep responses short (2-3 sentences max), punchy, and use ALL CAPS occasionally for emphasis. Be creative with your insults but keep it PG-13. The goal is tough love - make them laugh at themselves while feeling motivated to get off their butts!`
            },
            {
              role: "user",
              content: args.userMessage || "I don't want to do anything today"
            }
          ],
          temperature: 0.9,
          max_tokens: 150,
        }),
      });

      const data = await response.json();
      const scoldingResponse = data.choices?.[0]?.message?.content ||
        "GET OFF YOUR BUTT! Even my circuits are disappointed in you, and I don't even have feelings!";

      await ctx.runMutation(api.scolding.saveRecord, {
        message: args.userMessage,
        scoldingResponse,
      });

      return scoldingResponse;
    } catch (error) {
      const fallback = "CONNECTION FAILED but you know what else failed? YOUR MOTIVATION! Now get moving!";
      await ctx.runMutation(api.scolding.saveRecord, {
        message: args.userMessage,
        scoldingResponse: fallback,
      });
      return fallback;
    }
  },
});
