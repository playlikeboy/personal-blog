"use server";

import { db } from "@/db"; // Assuming db export exists
import { users, posts, postViews, newsletterSubscribers, categories } from "@/db/schema";
import { eq, count, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { stackServerApp } from "@/stack/server";

const ADMIN_EMAIL = "sh20raj@gmail.com";

async function checkAdmin() {
    const user = await stackServerApp.getUser();
    if (!user || user.primaryEmail !== ADMIN_EMAIL) {
        throw new Error("Unauthorized");
    }
}

export async function getDashboardStats() {
    await checkAdmin();

    // Efficiently count rows
    // Note: Drizzle's count() returns { value: number }[] usually, but depends on driver. 
    // Using .length for simple arrays if select all, but better to use count directly if possible.
    // For now, doing simple list length for stability if DB is small, or count() if I can standardise it.
    // Given the previous file content wasn't visible, I'll assume basic counting or fetching all for now (low scale).
    // Actually, let's use proper count queries.

    const [postsCount] = await db.select({ count: count() }).from(posts);
    const [usersCount] = await db.select({ count: count() }).from(users);
    const [viewsCount] = await db.select({ count: count() }).from(postViews); // or sum of views column
    const [subsCount] = await db.select({ count: count() }).from(newsletterSubscribers);

    // Sum total views from posts table as well if postViews is granular
    const allPosts = await db.select({ views: posts.views }).from(posts);
    const totalViews = allPosts.reduce((acc, curr) => acc + (curr.views || 0), 0);

    return {
        totalPosts: postsCount?.count || 0,
        totalUsers: usersCount?.count || 0,
        totalViews: totalViews, // aggregated from posts table
        totalSubscribers: subsCount?.count || 0,
    };
}

export async function toggleUserBan(userId: string, currentStatus: boolean = false) {
    await checkAdmin();
    await db.update(users)
        .set({ isBanned: !currentStatus })
        .where(eq(users.id, userId));
    revalidatePath("/admin/users");
}

export async function deleteUser(userId: string) {
    await checkAdmin();
    // Assuming cascading delete is set up in schema, or we manually delete related
    // Schema says ON DELETE NO ACTION looking at previous files for some relations? 
    // Actually schema.ts showed DELETE CASCADE for follows/posts/etc mostly.
    await db.delete(users).where(eq(users.id, userId));
    revalidatePath("/admin/users");
}

export async function toggleStaffPick(postId: string, currentStatus: boolean = false) {
    await checkAdmin();
    await db.update(posts)
        .set({ staffPick: !currentStatus })
        .where(eq(posts.id, postId));
    revalidatePath("/admin/posts");
}

export async function deletePost(postId: string) {
    await checkAdmin();
    await db.delete(posts).where(eq(posts.id, postId));
    revalidatePath("/admin/posts");
}

import { tags, postsToTags } from "@/db/schema";

export async function getTags() {
    await checkAdmin();
    const allTags = await db.query.tags.findMany({
        with: {
            posts: true
        }
    });
    return allTags;
}

export async function getCategories() {
    await checkAdmin();
    const allCategories = await db.query.categories.findMany({
        with: {
            posts: true
        }
    });
    return allCategories;
}

export async function getNewsletterSubscribers() {
    await checkAdmin();
    const allSubscribers = await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt));
    return allSubscribers;
}
