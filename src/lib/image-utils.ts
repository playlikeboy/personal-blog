import { Post } from "@/db/types"; // Or wherever Post is defined

export function getPostImage(post: { title: string; coverImage?: string | null; tags?: string[] | null }): string {
    if (post.coverImage) return post.coverImage;

    // Fallback to Pollinations.ai
    const title = encodeURIComponent(post.title);
    const category = encodeURIComponent(post.tags?.[0] || "writing");
    return `https://image.pollinations.ai/prompt/create%20poster%20image%20for%20poem%20title%20-%20"${title}"%20-%20category%20=%20${category}`;
}
