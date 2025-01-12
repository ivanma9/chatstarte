import { assertServerMember, authenticatedQuery } from "./helpers";
import { v } from "convex/values";
// import { AccessToken } from "livekit-server-sdk";

export const getToken = authenticatedQuery({
	args: {
		serverId: v.id("servers"),
	},
	handler: async (ctx, { serverId }) => {
		await assertServerMember(ctx, serverId);
		return null;
		// 	try {
		// 		token = new AccessToken(
		// 			process.env.LIVEKIT_API_KEY,
		// 			process.env.LIVEKIT_API_SECRET,
		// 			{
		// 				identity: ctx.user.username,
		// 				ttl: 60 * 60 * 24,
		// 			}
		// 		);
		// 		token.addGrant({
		// 			room: serverId,
		// 			roomJoin: true,
		// 		});
		// 	} catch (error) {
		// 		console.error("Error building token:", error);
		// 		return null; // or handle it as needed
		// 	}

		// 	return await token.toJwt();
	},
});
