import { v } from "convex/values";
import { authenticatedQuery } from "./helpers";
import { QueryCtx } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";

export const list = authenticatedQuery({
	handler: async (ctx) => {
		const directMessages = await ctx.db
			.query("directMessageMembers")
			.withIndex("by_user", (q) => q.eq("user", ctx.user._id))
			.collect();
		return await Promise.all(
			directMessages.map((dm) => getDirectMessage(ctx, dm.directMessage))
		);
	},
});

export const get = authenticatedQuery({
	args: {
		id: v.id("directMessages"),
	},
	handler: async (ctx, { id }) => {
		const member = await ctx.db
			.query("directMessageMembers")
			.withIndex("by_direct_message_user", (q) =>
				q.eq("directMessage", id).eq("user", ctx.user._id)
			)
			.first();
		if (!member) {
			throw new Error("You are not a member of this direct message");
		}

		return await getDirectMessage(ctx, id);
	},
});

const getDirectMessage = async (
	ctx: QueryCtx & { user: Doc<"users"> },
	id: Id<"directMessages">
) => {
	const dm = await ctx.db.get(id);
	if (!dm) {
		throw new Error("Direct message does not exist");
	}
	const otherMember = await ctx.db
		.query("directMessageMembers")
		.withIndex("by_direct_message", (q) => q.eq("directMessage", id))
		.filter((q) => q.neq(q.field("user"), ctx.user._id))
		.first();
	if (!otherMember) {
		throw new Error("Direct message has no other members");
	}
	const otherUser = await ctx.db.get(otherMember.user);
	if (!otherUser) {
		throw new Error("Other member does not exist");
	}

	return {
		...dm,
		otherUser,
	};
};
