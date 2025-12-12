import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		domains: ["images.unsplash.com","randomuser.me"],
	},
	/* config options here */
};

export default nextConfig;

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
