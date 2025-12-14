import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc, eq, like, or, and, count } from "drizzle-orm";

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
        username: string;
    };
    authorId: string; // Expose Author ID for filtering
    readTime: string;
    tags: string[];
    content?: string;
    views: number;
    likesCount: number;
    commentsCount: number;
    published: boolean;
    featured: boolean;
    createdAt: string;
    updatedAt: string;
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

export async function searchPosts(query: string, page: number = 1, limit: number = 12): Promise<{ posts: Post[], totalCount: number }> {
    const offset = (page - 1) * limit;

    // Base conditions
    const searchFilter = query
        ? or(
            like(posts.title, `%${query}%`),
            like(posts.excerpt, `%${query}%`),
            // Note: Searching content/JSON might be noisy but we can Include it if needed
            // like(posts.content, `%${query}%`)
        )
        : undefined;

    const conditions = and(
        eq(posts.published, true),
        searchFilter
    );

    // Get Total Count
    const [{ count: total }] = await db
        .select({ count: count() })
        .from(posts)
        .where(conditions);

    // Get Data
    const dbPosts = await db.query.posts.findMany({
        where: conditions,
        orderBy: [desc(posts.createdAt)],
        limit,
        offset,
        with: {
            author: true,
            tags: {
                with: {
                    tag: true
                }
            }
        }
    });

    return {
        posts: dbPosts.map(mapDbPostToPost),
        totalCount: total
    };
}

export function mapDbPostToPost(dbPost: any): Post {
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
            username: dbPost.author?.username || "",
        },
        authorId: dbPost.authorId,
        readTime: dbPost.readTime || "5 min read",
        tags: dbPost.tags?.map((t: any) => t.tag.name) || [],
        content: dbPost.content || "",
        views: dbPost.views || 0,
        likesCount: dbPost.likesCount || 0,
        commentsCount: dbPost.commentsCount || 0,
        published: dbPost.published || false,
        featured: dbPost.featured || false,
        createdAt: dbPost.createdAt ? new Date(dbPost.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: dbPost.updatedAt ? new Date(dbPost.updatedAt).toISOString() : new Date().toISOString(),
    };
}
