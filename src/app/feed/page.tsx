import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { mapDbPostToPost } from "@/lib/posts";
import { FeedView } from "@/components/blog/feed-view";

export const dynamic = 'force-dynamic';

export default async function FeedPage() {
    const dbPosts = await db.query.posts.findMany({
        where: eq(posts.published, true),
        orderBy: [desc(posts.createdAt)],
        limit: 20,
        with: {
            author: true,
            tags: {
                with: {
                    tag: true
                }
            }
        }
    });

    const mappedPosts = dbPosts.map(mapDbPostToPost);

    return <FeedView posts={mappedPosts} />;
}
