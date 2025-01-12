import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: new URL(process.env.NEXT_PUBLIC_CONVEX_URL!).hostname,
			},
		],
	},

	webpack(config, { isServer }) {
		if (isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				crypto: false,
				stream: false,
				buffer: false,
				path: false,
			};
		}
		return config;
	},
};

export default nextConfig;
