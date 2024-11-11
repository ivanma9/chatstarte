import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
export default defineSchema({
	users: defineTable({
		username: v.string(),
		image: v.string(),
		clerkId: v.string(),
	}).index("by_clerk_id", ["clerkId"]),

	friends: defineTable({
		user1: v.id("users"),
		user2: v.id("users"),
		status: v.union(
			v.literal("accepted"),
			v.literal("rejected"),
			v.literal("pending")
		),
	})
		.index("by_user1status", ["user1", "status"])
		.index("by_user2status", ["user2", "status"]),

	messages: defineTable({
		sender: v.string(),
		content: v.string(),
	}),
});
