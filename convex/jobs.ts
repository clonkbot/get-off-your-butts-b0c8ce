import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

// Get user's job suggestions
export const getSuggestions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("jobSuggestions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(10);
  },
});

// Save a job suggestion
export const saveSuggestion = mutation({
  args: {
    url: v.optional(v.string()),
    title: v.string(),
    description: v.string(),
    scrapedContent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("jobSuggestions", {
      userId,
      url: args.url,
      title: args.title,
      description: args.description,
      scrapedContent: args.scrapedContent,
      timestamp: Date.now(),
    });
  },
});

// Scrape a vibe-coded site using Firecrawl
export const scrapeJobSite = action({
  args: { url: v.string() },
  handler: async (ctx, args) => {
    const firecrawlApiKey = process.env.FIRECRAWL_API_KEY;

    if (!firecrawlApiKey) {
      // Return mock data if no API key
      const mockResult = {
        title: "Job Site Analysis",
        description: `Analyzed ${args.url} - Looks like another tech startup promising "unlimited PTO" and "ping pong tables." Translation: You'll work 60 hours a week. But hey, at least you'd be WORKING instead of being LAZY!`,
        content: "Could not scrape - Firecrawl API key not configured",
      };

      await ctx.runMutation(api.jobs.saveSuggestion, {
        url: args.url,
        title: mockResult.title,
        description: mockResult.description,
        scrapedContent: mockResult.content,
      });

      return mockResult;
    }

    try {
      const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${firecrawlApiKey}`,
        },
        body: JSON.stringify({
          url: args.url,
          formats: ["markdown"],
        }),
      });

      const data = await response.json();
      const content = data.data?.markdown || "Could not extract content";
      const title = data.data?.metadata?.title || "Scraped Job Site";

      const result = {
        title,
        description: `Site scraped successfully. Now stop browsing and APPLY somewhere!`,
        content: content.slice(0, 2000),
      };

      await ctx.runMutation(api.jobs.saveSuggestion, {
        url: args.url,
        title: result.title,
        description: result.description,
        scrapedContent: result.content,
      });

      return result;
    } catch (error) {
      const fallback = {
        title: "Scrape Failed",
        description: "Couldn't scrape that site, but you know what else you're failing at? FINDING A JOB!",
        content: null,
      };

      await ctx.runMutation(api.jobs.saveSuggestion, {
        url: args.url,
        title: fallback.title,
        description: fallback.description,
      });

      return fallback;
    }
  },
});

// Generate job ideas using Grok
export const generateJobIdeas = action({
  args: { interests: v.string() },
  handler: async (ctx, args) => {
    const grokApiKey = process.env.XAI_API_KEY;

    const fallbackJobs = [
      { title: "Professional Couch Tester", description: "Oh wait, you already do this for FREE!", insult: "Get a real job!" },
      { title: "Chief Napping Officer", description: "Fortune 500 companies are NOT hiring for this.", insult: "Wake up and smell the unemployment!" },
      { title: "Remote Excuse Generator", description: "You'd be great at this since you're full of excuses already.", insult: "Stop making excuses, start making money!" },
    ];

    if (!grokApiKey) {
      await ctx.runMutation(api.jobs.saveSuggestion, {
        title: "Job Ideas Generated",
        description: `Based on your interests: "${args.interests}" - Here are some reality checks disguised as job suggestions.`,
      });

      return { jobs: fallbackJobs, roast: "No API key? No problem. No job? BIG PROBLEM! Get moving!" };
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
              content: `You are a sarcastic career advisor. Given user interests, suggest 3 REAL job ideas but deliver them with brutal honesty and humor. Format your response as JSON: { "jobs": [{"title": "...", "description": "...", "insult": "..."}], "roast": "final roast message" }. Keep it funny but actually helpful.`
            },
            {
              role: "user",
              content: `My interests: ${args.interests}`
            }
          ],
          temperature: 0.8,
          max_tokens: 500,
        }),
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      try {
        const parsed = JSON.parse(content);
        await ctx.runMutation(api.jobs.saveSuggestion, {
          title: "AI Job Ideas",
          description: `Generated job ideas based on: "${args.interests}"`,
        });
        return parsed;
      } catch {
        return { jobs: fallbackJobs, roast: content || "Even the AI gave up on you. Figure it out yourself!" };
      }
    } catch (error) {
      return { jobs: fallbackJobs, roast: "API failed but at least IT tried. What's YOUR excuse?" };
    }
  },
});
