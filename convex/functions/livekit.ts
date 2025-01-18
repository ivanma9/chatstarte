import { assertServerMember, authenticatedQuery } from "./helpers";
import { v } from "convex/values";
import { AccessToken } from "livekit-server-sdk";

export const getToken = authenticatedQuery({
	args: {
		serverId: v.id("servers"),
	},
	handler: async (ctx, { serverId }) => {
		await assertServerMember(ctx, serverId);
		// return null;
		// let token;
		try {
			const apiKey = process.env.LIVEKIT_API_KEY;
			const apiSecret = process.env.LIVEKIT_API_SECRET;
			if (!apiKey || !apiSecret) {
				throw new Error("LIVEKIT_API_KEY or LIVEKIT_API_SECRET is not set");
			}
			console.log("token");
			const token = new AccessToken(apiKey, apiSecret, {
				identity: ctx.user.username,
				ttl: 60 * 60 * 24,
			});
			token.addGrant({
				room: serverId,
				roomJoin: true,
			});
			return await token.toJwt();
		} catch (error) {
			console.error("Error building token:", error);
			return undefined; // or handle it as needed
		}
	},
});
