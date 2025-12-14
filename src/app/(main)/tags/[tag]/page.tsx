import { Container } from "@/components/ui/container";
import { PostCard } from "@/components/blog/post-card";
import { db } from "@/db";
import { posts, tags, postsToTags } from "@/db/schema";
import { eq, desc, and, count, sql } from "drizzle-orm";
import { mapDbPostToPost } from "@/lib/posts";
import { TagFilter } from "@/components/blog/tag-filter";
import { PaginationControl } from "@/components/ui/pagination-control";

interface TagPageProps {
    params: Promise<{
        tag: string;
    }>;
    searchParams: Promise<{
        sort?: string;
        page?: string;
    }>;
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
    const { tag } = await params;
    const { sort = "recommended", page = "1" } = await searchParams;

    // In Drizzle/SQL we match against the slug or name. 
    // Usually routes like /tags/Poem imply 'Poem' is the slug or name.
    const decodedTag = decodeURIComponent(tag);

    const pageNum = parseInt(page, 10);
    const limit = 12; // Posts per page
    const offset = (pageNum - 1) * limit;

    // Determine Order By Clause
    let orderBy: any[] = [];
    switch (sort) {
        case "latest":
            orderBy = [desc(posts.createdAt)];
            break;
        case "popular":
            orderBy = [desc(posts.views), desc(posts.likesCount)];
            break;
        case "recommended":
        default:
            orderBy = [
                desc(posts.staffPick),
                desc(posts.views),
                desc(posts.likesCount)
            ];
            break;
    }

    // 1. Fetch Tag ID first to ensure it exists and get correct ID
    const tagRecord = await db.query.tags.findFirst({
        where: sql`lower(${tags.slug}) = lower(${decodedTag}) or lower(${tags.name}) = lower(${decodedTag})`,
    });

    if (!tagRecord) {
        return (
            <div className="py-12 md:py-20">
                <Container>
                    <div className="py-20 text-center bg-gray-50 rounded-2xl">
                        <h1 className="text-2xl font-bold mb-2">Tag Not Found</h1>
                        <p className="text-gray-500">We couldn&apos;t find a tag named &quot;{decodedTag}&quot;.</p>
                    </div>
                </Container>
            </div>
        );
    }

    // 2. Fetch Posts with Pagination
    const dbPosts = await db.select({
        post: posts,
        // We can fetch related data here or use query builder. 
        // Using query builder is easier for 'with' relations but harder for complex filtering + sort without some joining.
        // But since we need to filter by TAG, we must join.
    })
        .from(posts)
        .innerJoin(postsToTags, eq(posts.id, postsToTags.postId))
        .where(and(
            eq(postsToTags.tagId, tagRecord.id),
            eq(posts.published, true)
        ))
        .orderBy(...orderBy)
        .limit(limit)
        .offset(offset);

    // Drizzle doesn't automatically fetch relations in .select() unless configured differently
    // So we map ids and then fetch full data OR we use a second query.
    // Optimization: fetch full data using the IDs we just got.

    const postIds = dbPosts.map(r => r.post.id);
    let finalPosts: any[] = [];

    if (postIds.length > 0) {
        const fullPosts = await db.query.posts.findMany({
            where: sql`${posts.id} IN ${postIds}`,
            with: {
                author: true,
                tags: {
                    with: {
                        tag: true
                    }
                }
            },
            // We need to maintain the order we retrieved them in. 
            // SQL 'IN' clause doesn't guarantee order. 
            // Application-side sort or FIELD() is needed.
        });

        // Map back to maintain sort order
        finalPosts = postIds.map(id => fullPosts.find(p => p.id === id)).filter(Boolean);
    }

    const mappedPosts = finalPosts.map(mapDbPostToPost);

    // 3. Count Total for Pagination
    const [{ count: totalCount }] = await db
        .select({ count: count() })
        .from(posts)
        .innerJoin(postsToTags, eq(posts.id, postsToTags.postId))
        .where(and(
            eq(postsToTags.tagId, tagRecord.id),
            eq(posts.published, true)
        ));

    const totalPages = Math.ceil(totalCount / limit);

    return (
        <div className="py-12 md:py-20">
            <Container>
                <div className="mb-8">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Tag</p>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl border-b border-gray-100 pb-8 mb-8">
                        #{tagRecord.name}
                    </h1>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <p className="text-gray-500">
                            {totalCount} {totalCount === 1 ? 'post' : 'posts'} found
                        </p>
                        <div className="w-full md:w-auto">
                            <TagFilter />
                        </div>
                    </div>
                </div>

                {mappedPosts.length > 0 ? (
                    <>
                        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                            {mappedPosts.map((post) => (
                                <PostCard key={post.slug} post={post} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <PaginationControl
                            currentPage={pageNum}
                            totalPages={totalPages}
                            queryParams={{ sort }}
                        />
                    </>
                ) : (
                    <div className="py-20 text-center bg-gray-50 rounded-2xl">
                        <p className="text-gray-500">No posts found with this tag.</p>
                    </div>
                )}
            </Container>
        </div>
    );
}
