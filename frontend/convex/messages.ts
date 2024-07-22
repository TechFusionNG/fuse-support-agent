import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addMessage = mutation({
  args: {
    userId: v.id("users"),
    from: v.union(v.literal("user"), v.literal("agent")),
    type: v.union(v.literal("text"), v.literal("audio"), v.literal("image")),
    content: v.string(),
    timestamp: v.number(),
    assignedAgentId: v.union(v.id("agents"), v.null()),
  },
  handler: async (ctx, args) => {
    const { userId, from, type, content, timestamp, assignedAgentId } = args;
    const messageId = await ctx.db.insert("messages", { userId, from, type, content, timestamp, assignedAgentId });
    return messageId;
  },
});

export const getMessagesByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const messages = await ctx.db.query("messages")
      .filter(q => q.eq(q.field("userId"), args.userId))
      .collect();
    return messages;
  },
});

export const assignAgent = mutation({
  args: { messageId: v.id("messages"), agentId: v.id("agents") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, { assignedAgentId: args.agentId });
  },
});

export const reassignAgent = mutation({
  args: { messageId: v.id("messages"), newAgentId: v.id("agents") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, { assignedAgentId: args.newAgentId });
  },
});
