import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		domains: ["images.unsplash.com", "randomuser.me"],
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'avatars.githubusercontent.com',
			},
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
			}
		],
	},
	outputFileTracingIncludes: {
		"/*": ["./node_modules/@libsql/**/*", "./content/**/*"],
		"/api/*": ["./node_modules/@libsql/**/*", "./content/**/*"],
	},
	/* config options here */
};

export default nextConfig;

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
