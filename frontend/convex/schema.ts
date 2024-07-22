import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
    groups: v.array(v.string()), // Array of group names
  }).index("by_token", ["tokenIdentifier"]),

  messages: defineTable({
    userId: v.id("users"),
    from: v.union(v.literal("user"), v.literal("agent")),
    type: v.union(v.literal("text"), v.literal("audio"), v.literal("image")),
    content: v.string(),
    timestamp: v.number(),
    assignedAgentId: v.union(v.id("agents"), v.null()),
  }),

  agents: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),
});
