import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addUser = mutation({
  args: {
    name: v.string(),
    tokenIdentifier: v.string(),
    groups: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { name, tokenIdentifier, groups } = args;
    const userId = await ctx.db.insert("users", { name, tokenIdentifier, groups });
    return userId;
  },
});

export const getUserByToken = query({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.query("users")
      .filter(q => q.eq(q.field("tokenIdentifier"), args.tokenIdentifier))
      .first();
    return user;
  },
});

export const getAllUsers = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users;
  },
});
