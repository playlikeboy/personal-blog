import { NextResponse } from "next/server";
import { stackServerApp } from "@/stack/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { slugify } from "@/lib/utils";

export async function POST(req: Request) {
    const user = await stackServerApp.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json() as { title?: string; content?: unknown; coverImage?: string };
        const { title, content, coverImage } = body;

        if (!title || !content) {
            return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
        }

        const slug = slugify(title) + "-" + crypto.randomUUID().split("-")[0];

        // Insert post
        const [newPost] = await db.insert(posts).values({
            title,
            content: JSON.stringify(content), // Store Plate.js content as JSON string
            slug,
            coverImage,
            authorId: user.id,
            published: true, // Auto-publish for now, can be changed later
            readTime: "5 min read", // Placeholder, can calculate later
        }).returning();

        return NextResponse.json(newPost);
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
