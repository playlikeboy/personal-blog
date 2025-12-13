import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    // Increment view count
    // We don't track unique views strictly for simplicity (or use session cookie later)

    const post = await db.query.posts.findFirst({
        where: eq(posts.slug, slug),
        columns: { id: true },
    });

    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await db.update(posts)
        .set({ views: sql`views + 1` })
        .where(eq(posts.id, post.id));

    return NextResponse.json({ success: true });
}
