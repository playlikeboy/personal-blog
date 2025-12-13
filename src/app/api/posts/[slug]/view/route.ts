import { db } from "@/db";
import { posts, postViews } from "@/db/schema";
import { eq, sql, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { stackServerApp } from "@/stack/server";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const user = await stackServerApp.getUser();
    const cookieStore = await cookies();

    // Get or create fingerprint
    let fingerprint = cookieStore.get("fingerprint")?.value;
    let newFingerprint = false;
    if (!fingerprint) {
        fingerprint = crypto.randomUUID();
        newFingerprint = true;
    }

    const post = await db.query.posts.findFirst({
        where: eq(posts.slug, slug),
        columns: { id: true },
    });

    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check for duplicate view
    // If Logged In: Check by User ID
    // If Anonymous: Check by Fingerprint (within last 24h or forever? User said "prevent duplicate". Forever is strict, but okay).

    let hasViewed = false;

    if (user) {
        const existingView = await db.query.postViews.findFirst({
            where: and(
                eq(postViews.postId, post.id),
                eq(postViews.userId, user.id)
            )
        });
        if (existingView) hasViewed = true;
    } else {
        const existingView = await db.query.postViews.findFirst({
            where: and(
                eq(postViews.postId, post.id),
                eq(postViews.fingerprint, fingerprint)
            )
        });
        if (existingView) hasViewed = true;
    }

    if (!hasViewed) {
        // Record View
        await db.insert(postViews).values({
            postId: post.id,
            userId: user?.id,
            fingerprint: fingerprint,
        });

        // Increment Count
        await db.update(posts)
            .set({ views: sql`views + 1` })
            .where(eq(posts.id, post.id));
    }

    const response = NextResponse.json({
        success: true,
        viewed: !hasViewed
    });

    if (newFingerprint) {
        response.cookies.set("fingerprint", fingerprint, {
            path: "/",
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 365, // 1 year
        });
    }

    return response;
}
