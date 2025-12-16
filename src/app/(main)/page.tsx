import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc, eq, count } from "drizzle-orm";
import { mapDbPostToPost, searchPosts } from "@/lib/posts";
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

    // Default to Popular feed for Homepage
    const { posts: dbPosts, totalCount } = await searchPosts("", pageNum, limit, "popular");
    const totalPages = Math.ceil(totalCount / limit);

    return (
        <FeedView
            posts={dbPosts}
            currentPage={pageNum}
            totalPages={totalPages}
            title="Unstory"
            description="A space for words, thoughts, and the people behind them."
            initialSort="popular"
        />
    );
}
