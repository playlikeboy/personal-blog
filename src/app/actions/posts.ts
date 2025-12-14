"use server";

import { db } from "@/db";
import { posts } from "@/db/schema";
import { stackServerApp } from "@/stack/server";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deletePost(slug: string) {
    const user = await stackServerApp.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    // Verify ownership
    const post = await db.query.posts.findFirst({
        where: eq(posts.slug, slug),
        columns: {
            authorId: true,
            id: true,
        },
    });

    if (!post) {
        throw new Error("Post not found");
    }

    if (post.authorId !== user.id) {
        throw new Error("Unauthorized: You do not own this post");
    }

    // Delete post (Cascading delete will handle potential relations if configured, 
    // but Drizzle standard behavior usually requires onDelete cascade in schema, which we have for some but not all.
    // Let's check schema. postsToTags has onDelete cascade. Comments has onDelete cascade. Likes has cascade.
    // So simple delete is fine.)

    await db.delete(posts).where(eq(posts.id, post.id));

    revalidatePath("/dashboard");
    revalidatePath("/");
    revalidatePath(`/u/${(user as any).username || user.id}`);
}
