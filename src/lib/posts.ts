import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export interface Post {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    coverImage: string;
    date: string;
    author: {
        name: string;
        avatar: string;
    };
    authorId: string; // Expose Author ID for filtering
    readTime: string;
    tags: string[];
    content?: string;
    views: number;
    likesCount: number;
}

export async function getAllPosts(): Promise<Post[]> {
    const dbPosts = await db.query.posts.findMany({
        with: {
            author: true,
            tags: {
                with: {
                    tag: true,
                }
            }
        },
        orderBy: [desc(posts.createdAt)],
    });

    return dbPosts.map(mapDbPostToPost);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
    const dbPost = await db.query.posts.findFirst({
        where: eq(posts.slug, slug),
        with: {
            author: true,
            tags: {
                with: {
                    tag: true,
                }
            }
        },
    });

    if (!dbPost) return undefined;

    return mapDbPostToPost(dbPost);
}

function mapDbPostToPost(dbPost: any): Post {
    return {
        id: dbPost.id,
        slug: dbPost.slug,
        title: dbPost.title,
        excerpt: dbPost.excerpt || "",
        coverImage: dbPost.coverImage || "",
        date: dbPost.createdAt ? new Date(dbPost.createdAt).toISOString() : new Date().toISOString(),
        author: {
            name: dbPost.author?.name || "Unknown",
            avatar: dbPost.author?.avatar || "",
        },
        authorId: dbPost.authorId,
        readTime: dbPost.readTime || "5 min read",
        tags: dbPost.tags?.map((t: any) => t.tag.name) || [],
        content: dbPost.content || "",
        views: dbPost.views || 0,
        likesCount: dbPost.likesCount || 0,
    };
}
