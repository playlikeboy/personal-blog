"use server";

import { db } from "@/db";
import { tags, postsToTags } from "@/db/schema";
import { eq, like, sql, desc } from "drizzle-orm";

export interface TagResult {
    id: string;
    name: string;
    slug: string;
    count: number;
}

export async function searchTags(query: string): Promise<TagResult[]> {
    if (!query || query.length < 1) return [];

    const results = await db
        .select({
            id: tags.id,
            name: tags.name,
            slug: tags.slug,
            count: sql<number>`count(${postsToTags.postId})`
        })
        .from(tags)
        .leftJoin(postsToTags, eq(tags.id, postsToTags.tagId))
        .where(like(tags.name, `%${query}%`))
        .groupBy(tags.id)
        .orderBy(desc(sql`count`))
        .limit(10);

    return results as TagResult[];
}
