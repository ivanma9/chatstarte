import { Id } from "../_generated/dataModel";
import { query, QueryCtx } from "../_generated/server";
import { assertServerMember, authenticatedMutation } from "./helpers";

import { v } from "convex/values";

const getInvite = async (ctx: QueryCtx, inviteId: Id<"invites">) => {
	const invite = await ctx.db.get(inviteId);
	if (!invite) {
		throw new Error("Invite not found");
	}
	if (invite.expiresAt && invite.expiresAt < Date.now()) {
		throw new Error("Invite expired");
	}
	if (invite.maxUses && invite.uses >= invite.maxUses) {
		throw new Error("Invite has reached its maximum usage");
	}
	return invite;
};

export const get = query({
	args: {
		id: v.id("invites"),
	},
	handler: async (ctx, { id }) => {
		const invite = await getInvite(ctx, id);
		const server = await ctx.db.get(invite.serverId);
		if (!server) {
			throw new Error("Server not found");
		}
		return {
			...invite,
			server,
		};
	},
});

export const create = authenticatedMutation({
	args: {
		serverId: v.id("servers"),
		expiresAt: v.optional(v.number()),
		maxUses: v.optional(v.number()),
	},
	handler: async (ctx, { serverId, expiresAt, maxUses }) => {
		await assertServerMember(ctx, serverId);
		return await ctx.db.insert("invites", {
			serverId,
			expiresAt,
			maxUses,
			uses: 0,
		});
	},
});

export const join = authenticatedMutation({
	args: {
		id: v.id("invites"),
	},
	handler: async (ctx, { id }) => {
		const invite = await getInvite(ctx, id);
		const existingMember = await ctx.db
			.query("serverMembers")
			.withIndex("by_serverId_userId", (q) =>
				q.eq("serverId", invite.serverId).eq("userId", ctx.user._id)
			)
			.unique();
		if (existingMember) {
			return;
		}
		await ctx.db.insert("serverMembers", {
			serverId: invite.serverId,
			userId: ctx.user._id,
		});
		await ctx.db.patch(id, {
			uses: invite.uses + 1,
		});
	},
});
