import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = "https://minimal.strivio.world";

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/dashboard/", "/handler/"],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
