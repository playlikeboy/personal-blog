import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc, eq, count } from "drizzle-orm";
import { mapDbPostToPost } from "@/lib/posts";
import { FeedView } from "@/components/blog/feed-view";

export const dynamic = 'force-dynamic';

interface HomePageProps {
    searchParams: Promise<{
        page?: string;
    }>;
}

export default async function Home({ searchParams }: HomePageProps) {
    const { page = "1" } = await searchParams;
    const pageNum = parseInt(page, 10);
    const limit = 12;
    const offset = (pageNum - 1) * limit;

    const conditions = eq(posts.published, true);

    // Get Total Count
    const [{ count: total }] = await db
        .select({ count: count() })
        .from(posts)
        .where(conditions);

    const totalPages = Math.ceil(total / limit);

    const dbPosts = await db.query.posts.findMany({
        where: conditions,
        orderBy: [desc(posts.createdAt)],
        limit,
        offset,
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

    return (
        <FeedView
            posts={mappedPosts}
            currentPage={pageNum}
            totalPages={totalPages}
            title="Unstory"
            description="A space for words, thoughts, and the people behind them."
        />
    );
}
