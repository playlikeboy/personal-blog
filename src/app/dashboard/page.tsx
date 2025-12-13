import { stackServerApp } from "@/stack/server";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { posts, likes, comments } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const user = await stackServerApp.getUser();

    if (!user) {
        redirect("/handler/sign-in");
    }

    // Fetch User's Stories
    const userPosts = await db.query.posts.findMany({
        where: eq(posts.authorId, user.id),
        orderBy: [desc(posts.createdAt)],
        with: {
            tags: {
                with: {
                    tag: true
                }
            }
        }
    });

    // Calculate Stats
    const stats = {
        stories: userPosts.length,
        views: userPosts.reduce((acc, post) => acc + (post.views || 0), 0),
        likes: userPosts.reduce((acc, post) => acc + (post.likesCount || 0), 0),
        // Simplification: Not querying comments count aggregate yet to save time, using sum if available or 0
        comments: userPosts.reduce((acc, post) => acc + (post.commentsCount || 0), 0),
    };

    return <DashboardView user={user} posts={userPosts as any[]} stats={stats} />;
}
