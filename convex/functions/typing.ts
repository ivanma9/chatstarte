import { v } from "convex/values";
import { internalMutation } from "../_generated/server";
import { authenticatedMutation, authenticatedQuery } from "./helpers";
import { internal } from "../_generated/api";

export const list = authenticatedQuery({
	args: {
		directMessage: v.id("directMessages"),
	},
	handler: async (ctx, { directMessage }) => {
		const typingIndicators = await ctx.db
			.query("typingIndicators")
			.withIndex("by_direct_message", (q) =>
				q.eq("directMessage", directMessage)
			)
			.filter((q) => q.neq(q.field("user"), ctx.user._id))
			.collect();
		return await Promise.all(
			typingIndicators.map(async (indicator) => {
				const user = await ctx.db.get(indicator.user);
				if (!user) throw new Error("User not found");
				return user.username;
			})
		);
	},
});

export const upsert = authenticatedMutation({
	args: {
		directMessage: v.id("directMessages"),
	},
	handler: async (ctx, { directMessage }) => {
		const existing = await ctx.db
			.query("typingIndicators")
			.withIndex("by_user_direct_message", (q) =>
				q.eq("user", ctx.user._id).eq("directMessage", directMessage)
			)
			.unique();
		const expiresAt = Date.now() + 10000;
		if (existing) {
			await ctx.db.patch(existing._id, {
				expiresAt,
			});
		} else {
			await ctx.db.insert("typingIndicators", {
				user: ctx.user._id,
				directMessage,
				expiresAt,
			});
		}
		await ctx.scheduler.runAt(expiresAt, internal.functions.typing.remove, {
			directMessage,
			user: ctx.user._id,
			expiresAt,
		});
	},
});

export const remove = internalMutation({
	args: {
		directMessage: v.id("directMessages"),
		user: v.id("users"),
		expiresAt: v.optional(v.number()),
	},
	handler: async (ctx, { directMessage, user, expiresAt }) => {
		const existing = await ctx.db
			.query("typingIndicators")
			.withIndex("by_user_direct_message", (q) =>
				q.eq("user", user).eq("directMessage", directMessage)
			)
			.unique();
		if (existing && (!expiresAt || existing.expiresAt === expiresAt)) {
			await ctx.db.delete(existing._id);
		}
	},
});
