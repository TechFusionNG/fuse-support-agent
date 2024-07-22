import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addAgent = mutation({
  args: {
    name: v.string(),
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    const { name, tokenIdentifier } = args;
    const agentId = await ctx.db.insert("agents", { name, tokenIdentifier });
    return agentId;
  },
});

export const getAgentByToken = query({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    const agent = await ctx.db.query("agents")
      .filter(q => q.eq(q.field("tokenIdentifier"), args.tokenIdentifier))
      .first();
    return agent;
  },
});
