import { db } from "@/db";
import { posts, users, tags, postsToTags } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { stackServerApp } from "@/stack/server";

export async function GET(req: Request, props: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await props.params;
        const post = await db.query.posts.findFirst({
            where: eq(posts.slug, slug),
            with: {
                tags: {
                    with: {
                        tag: true
                    }
                }
            }
        });

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PUT(req: Request, props: { params: Promise<{ slug: string }> }) {
    try {
        const stackUser = await stackServerApp.getUser();
        if (!stackUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { slug } = await props.params;
        const body = await req.json() as {
            title?: string;
            content?: any;
            excerpt?: string;
            coverImage?: string;
            published?: boolean;
        };
        const { title, content, excerpt, coverImage, published } = body;

        // Verify ownership
        const existingPost = await db.query.posts.findFirst({
            where: eq(posts.slug, slug),
        });

        if (!existingPost) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Technically checking existingPost.authorId === stackUser.id matches DB user ID
        // Simplified check:
        if (existingPost.authorId !== stackUser.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await db.update(posts)
            .set({
                title,
                content: JSON.stringify(content),
                excerpt,
                coverImage,
                published,
                updatedAt: new Date()
            })
            .where(eq(posts.id, existingPost.id));

        return NextResponse.json({ success: true, slug: existingPost.slug });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
