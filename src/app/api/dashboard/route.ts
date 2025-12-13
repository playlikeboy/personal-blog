import { stackServerApp } from "@/stack/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await stackServerApp.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userPosts = await db.query.posts.findMany({
            where: eq(posts.authorId, user.id),
            orderBy: [desc(posts.createdAt)],
            with: {
                tags: { with: { tag: true } }
            }
        });

        const stats = {
            stories: userPosts.length,
            views: userPosts.reduce((acc, post) => acc + (post.views || 0), 0),
            likes: userPosts.reduce((acc, post) => acc + (post.likesCount || 0), 0),
            comments: userPosts.reduce((acc, post) => acc + (post.commentsCount || 0), 0),
        };

        return NextResponse.json({ user, posts: userPosts, stats });
    } catch (e: any) {
        console.error("Dashboard API Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
