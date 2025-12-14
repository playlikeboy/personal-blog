import { db } from "@/db";
import { users, posts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ username: string }> }
) {
    try {
        const { username } = await params;
        const decodedUsername = decodeURIComponent(username);

        // 1. Fetch User
        const user = await db.query.users.findFirst({
            where: eq(users.username, decodedUsername)
        }) || await db.query.users.findFirst({
            where: eq(users.id, decodedUsername)
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // 2. Fetch Posts
        const userPosts = await db.query.posts.findMany({
            where: eq(posts.authorId, user.id),
            orderBy: [desc(posts.createdAt)],
            with: {
                author: true,
                tags: { with: { tag: true } }
            }
        });

        const mappedPosts = userPosts.map(p => ({
            ...p,
            tags: p.tags.map(t => t.tag.name),
            id: p.id,
            slug: p.slug,
            title: p.title,
            excerpt: p.excerpt || "",
            coverImage: p.coverImage || "",
            date: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
            author: p.author || { name: "Unknown", avatar: "" },
            authorId: p.authorId,
            readTime: p.readTime || "5 min read",
            content: p.content || "",
            views: p.views || 0,
            likesCount: p.likesCount || 0,
            commentsCount: p.commentsCount || 0,
            published: p.published || false,
            createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
            updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString(),
        }));

        return NextResponse.json({ user, posts: mappedPosts });

    } catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
