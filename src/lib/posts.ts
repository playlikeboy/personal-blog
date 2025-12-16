import { db } from "@/db";
import { posts, users } from "@/db/schema";
import { desc, eq, like, or, and, count, sql } from "drizzle-orm";

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

export async function getMostLikedPost(): Promise<Post | undefined> {
    const dbPost = await db.query.posts.findFirst({
        orderBy: [desc(posts.likesCount)],
        with: {
            author: true,
            tags: { with: { tag: true } }
        }
    });

    return dbPost ? mapDbPostToPost(dbPost) : undefined;
}

export async function getPostsByUsername(username: string, limit: number = 4): Promise<Post[]> {
    const user = await db.query.users.findFirst({
        where: eq(users.username, username),
    });

    if (!user) return [];

    const userPosts = await db.query.posts.findMany({
        where: and(
            eq(posts.authorId, user.id),
            eq(posts.published, true)
        ),
        orderBy: [desc(posts.createdAt)],
        limit,
        with: {
            author: true,
            tags: { with: { tag: true } }
        }
    });

    return userPosts.map(mapDbPostToPost);
}

export async function getRecentPosts(limit: number = 6, excludeId?: string): Promise<Post[]> {
    const dbPosts = await db.query.posts.findMany({
        where: eq(posts.published, true),
        orderBy: [desc(posts.createdAt)],
        limit: limit + (excludeId ? 1 : 0),
        with: {
            author: true,
            tags: { with: { tag: true } }
        }
    });

    const mapped = dbPosts.map(mapDbPostToPost);
    return excludeId ? mapped.filter(p => p.id !== excludeId).slice(0, limit) : mapped.slice(0, limit);
}

export async function searchPosts(query: string, page: number = 1, limit: number = 12, sort: 'latest' | 'popular' | 'random' = 'latest'): Promise<{ posts: Post[], totalCount: number }> {
    const offset = (page - 1) * limit;

    // Base conditions
    const searchFilter = query
        ? or(
            like(posts.title, `%${query}%`),
            like(posts.excerpt, `%${query}%`),
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

    // Sort Logic
    let orderBy;
    switch (sort) {
        case 'popular':
            orderBy = [desc(posts.likesCount), desc(posts.createdAt)];
            break;
        case 'random':
            orderBy = [sql`RANDOM()`];
            break;
        case 'latest':
        default:
            orderBy = [desc(posts.createdAt)];
    }

    // Get Data
    const dbPosts = await db.query.posts.findMany({
        where: conditions,
        orderBy: orderBy,
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
