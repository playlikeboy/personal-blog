import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { mapDbPostToPost } from "@/lib/posts";
import { Header } from "@/components/layout/header";
import { Container } from "@/components/ui/container";
import { FeedStream } from "@/components/feed/feed-stream";
import { Title } from "rizzui";

export const dynamic = 'force-dynamic';

export default async function FeedPage() {
    // Fetch random posts
    // Note: sql`RANDOM()` works for SQLite/LibSQL
    const dbPosts = await db.query.posts.findMany({
        where: eq(posts.published, true),
        orderBy: sql`RANDOM()`,
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

    return (
        <div className="flex min-h-screen flex-col bg-background font-sans">
            <Header />
            <main className="flex-1 py-20 bg-gray-50/50 dark:bg-black/20">
                <Container>
                    <div className="max-w-xl mx-auto mb-8 pl-2">
                        <Title as="h2" className="text-2xl font-bold font-serif">Home</Title>
                    </div>
                    <FeedStream initialPosts={mappedPosts} />
                </Container>
            </main>
        </div>
    );
}
