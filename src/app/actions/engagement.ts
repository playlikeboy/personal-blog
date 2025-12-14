"use server";

import { db } from "@/db";
import { likes, posts } from "@/db/schema";
import { stackServerApp } from "@/stack/server";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function toggleLike(postId: string) {
    const user = await stackServerApp.getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    const existingLike = await db.query.likes.findFirst({
        where: and(
            eq(likes.postId, postId),
            eq(likes.userId, user.id)
        )
    });

    if (existingLike) {
        // Unlike
        await db.delete(likes).where(eq(likes.id, existingLike.id));

        // Decrement like count
        await db.update(posts)
            .set({ likesCount: sql`${posts.likesCount} - 1` })
            .where(eq(posts.id, postId));

        return { isLiked: false };
    } else {
        // Like
        await db.insert(likes).values({
            postId,
            userId: user.id
        });

        // Increment like count
        await db.update(posts)
            .set({ likesCount: sql`${posts.likesCount} + 1` })
            .where(eq(posts.id, postId));

        return { isLiked: true };
    }
}

export async function getLikeStatus(postId: string) {
    const user = await stackServerApp.getUser();
    if (!user) return { isLiked: false };

    const existingLike = await db.query.likes.findFirst({
        where: and(
            eq(likes.postId, postId),
            eq(likes.userId, user.id)
        )
    });

    return { isLiked: !!existingLike };
}
