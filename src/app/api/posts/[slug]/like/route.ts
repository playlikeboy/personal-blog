import { db } from "@/db";
import { likes, posts } from "@/db/schema";
import { stackServerApp } from "@/stack/server";
import { eq, sql, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const user = await stackServerApp.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Get Post ID
    const post = await db.query.posts.findFirst({
        where: eq(posts.slug, slug),
        columns: { id: true },
    });

    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // 2. toggle like
    // Check if already liked
    const existingLike = await db.query.likes.findFirst({
        where: and(eq(likes.postId, post.id), eq(likes.userId, user.id)),
    });

    if (existingLike) {
        // unlike
        await db.delete(likes).where(eq(likes.id, existingLike.id));
        await db.update(posts)
            .set({ likesCount: sql`likes_count - 1` })
            .where(eq(posts.id, post.id));

        return NextResponse.json({ liked: false });
    } else {
        // like
        await db.insert(likes).values({
            postId: post.id,
            userId: user.id,
        });
        await db.update(posts)
            .set({ likesCount: sql`likes_count + 1` })
            .where(eq(posts.id, post.id));

        return NextResponse.json({ liked: true });
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const user = await stackServerApp.getUser();

    // just return count and if liked by current user
    const post = await db.query.posts.findFirst({
        where: eq(posts.slug, slug),
        with: {
            likes: user ? {
                where: eq(likes.userId, user.id),
                limit: 1,
            } : undefined
        }
    });

    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({
        likesCount: post.likesCount,
        isLiked: user && post.likes && post.likes.length > 0
    });
}
