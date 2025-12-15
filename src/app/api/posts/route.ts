import { NextResponse } from "next/server";
import { stackServerApp } from "@/stack/server";
import { db } from "@/db";
import { posts, tags as tagsTable, postsToTags } from "@/db/schema";
import { slugify } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { searchPosts } from "@/lib/posts";

export async function POST(req: Request) {
    const user = await stackServerApp.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json() as {
            title?: string;
            content?: unknown;
            coverImage?: string;
            excerpt?: string;
            tags?: string[];
        };
        const { title, content, coverImage, excerpt, tags } = body;

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
            excerpt,
            authorId: user.id,
            published: true, // Auto-publish for now
            readTime: "5 min read", // Placeholder
        }).returning();

        // Handle Tags
        if (tags && Array.isArray(tags) && tags.length > 0) {
            for (const tagName of tags) {
                const normalizedTag = tagName.trim();
                if (!normalizedTag) continue;

                // Check if tag exists
                let tag = await db.query.tags.findFirst({
                    where: eq(tagsTable.name, normalizedTag)
                });

                if (!tag) {
                    // Create tag
                    const [createdTag] = await db.insert(tagsTable).values({
                        name: normalizedTag,
                        slug: slugify(normalizedTag),
                    }).returning();
                    tag = createdTag;
                }

                // Link tag to post
                await db.insert(postsToTags).values({
                    postId: newPost.id,
                    tagId: tag.id,
                });
            }
        }

        return NextResponse.json(newPost);
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const q = searchParams.get("q") || "";

    // Reuse existing logic from lib/posts
    const { posts, totalCount } = await searchPosts(q, page, limit);

    return NextResponse.json({ posts, totalCount });
}
