import { getAllPosts } from "@/lib/posts";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://unstory.live";

    // Fetch all posts
    const posts = await getAllPosts();

    // Static Routes
    const routes = [
        "",
        "/search",
        "/feed",
        "/about",
        "/write",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: route === "" ? 1 : 0.8,
    }));

    // Post Routes
    const postRoutes = posts.map((post) => ({
        url: `${baseUrl}/posts/${post.slug}`,
        lastModified: new Date(post.updatedAt || post.createdAt || Date.now()),
        changeFrequency: "weekly" as const,
        priority: 0.7,
    }));

    return [...routes, ...postRoutes];
}
