import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { FeedView } from "@/components/blog/feed-view";

export const dynamic = 'force-dynamic';

export default async function FeedPage() {
    // Fetch real posts only
    const allPosts = await db.query.posts.findMany({
        where: eq(posts.published, true),
        orderBy: [desc(posts.createdAt)],
        with: {
            author: true,
            tags: {
                with: {
                    tag: true
                }
            }
        }
    });

    // Transform DB result to match Post interface expected by views if needed
    // Assuming simple mapping is handled or types align locally.
    // For now, passing directly.

    return <FeedView posts={allPosts as any[]} />;
}
