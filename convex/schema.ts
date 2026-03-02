import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // User sessions tracking laziness
  lazinessRecords: defineTable({
    userId: v.id("users"),
    message: v.string(),
    scoldingResponse: v.string(),
    timestamp: v.number(),
  }).index("by_user", ["userId"]).index("by_timestamp", ["timestamp"]),

  // Job suggestions generated for users
  jobSuggestions: defineTable({
    userId: v.id("users"),
    url: v.optional(v.string()),
    title: v.string(),
    description: v.string(),
    scrapedContent: v.optional(v.string()),
    timestamp: v.number(),
  }).index("by_user", ["userId"]),

  // User stats for gamification
  userStats: defineTable({
    userId: v.id("users"),
    totalScolds: v.number(),
    lastActiveAt: v.number(),
    lazyStreak: v.number(),
  }).index("by_user", ["userId"]),
});
