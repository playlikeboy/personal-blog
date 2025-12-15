
import { Metadata } from "next";
import { getRecentPosts } from "@/lib/posts";
import { SitemapView } from "@/components/sitemap/sitemap-view";

export const metadata: Metadata = {
    title: "Directory",
    description: "Navigate the Unstory platform. Explore topics, stories, and authors.",
};

// Implement getTopTags if it doesn't exist, or use direct DB call here if needed.
// For now assuming we can fetch tags.
import { db } from "@/db";
import { tags, postsToTags } from "@/db/schema";
import { desc, count, eq } from "drizzle-orm";

async function getPopularTags(limit = 20) {
    const topTags = await db
        .select({
            name: tags.name,
            slug: tags.slug,
            count: count(postsToTags.postId),
        })
        .from(tags)
        .leftJoin(postsToTags, eq(tags.id, postsToTags.tagId))
        .groupBy(tags.id)
        .orderBy(desc(count(postsToTags.postId)))
        .limit(limit);

    return topTags.map(t => ({ name: t.name, slug: t.slug, count: t.count }));
}

export default async function SitemapPage() {
    const popularTags = await getPopularTags();
    const recentPosts = await getRecentPosts(6);

    return (
        <SitemapView tags={popularTags} recentPosts={recentPosts} />
    );
}
