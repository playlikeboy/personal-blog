import { db } from "@/db";
import { posts, users } from "@/db/schema";
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
    const dbPosts = await db.query.posts.findMany({
        where: eq(posts.published, true),
        orderBy: [desc(posts.createdAt)],
        limit: limit,
        with: {
            author: true,
            tags: { with: { tag: true } }
        }
    });

    // Filter in-memory if username join is complex (though standard relation filter is better if Author defined)
    // Since 'author' is a relation, we filter after or use where clauses if we join users.
    // Drizzle relations query doesn't support deep where easily on standard findMany without extra config.
    // Let's use filter for simplicity or better, verify if authorId is available.
    // Actually, let's look up the user first or do a raw select if needed.
    // For now, let's fetch and filter since dataset is small, OR perform a better query.
    // Optimized: Filter by author relation if possible.

    // Better Approach: Find user ID first? Or simply filter results.
    // To be efficient, let's assume we can filter on the JS side or improve query later.
    // Given the constraints and typical blog size, getting standard list and filtering is OK, 
    // BUT 'getPostsByUsername' implies direct DB filter.

    // Let's do a proper relational query:
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
    // If we have an excludeId, we might need to fetch limit + 1 just in case
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
