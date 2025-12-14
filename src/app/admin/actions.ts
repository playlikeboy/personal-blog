"use server";

import { stackServerApp } from "@/stack/server";
import { db } from "@/db";
import { posts, tags, postsToTags, users, categories, newsletterSubscribers } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const ADMIN_EMAIL = "sh20raj@gmail.com";

async function verifyAdmin() {
    const user = await stackServerApp.getUser();
    if (!user || user.primaryEmail !== ADMIN_EMAIL) {
        throw new Error("Unauthorized");
    }
    return user;
}

export async function getAdminData() {
    try {
        await verifyAdmin();

        const allPosts = await db.query.posts.findMany({
            orderBy: [desc(posts.createdAt)],
            with: {
                author: true,
                tags: {
                    with: {
                        tag: true
                    }
                }
            }
        });

        return allPosts;
    } catch (error) {
        console.error("Failed to fetch admin data", error);
        return null;
    }
}

export async function toggleFeatured(postId: string, isFeatured: boolean) {
    try {
        await verifyAdmin();

        await db.update(posts)
            .set({ featured: isFeatured })
            .where(eq(posts.id, postId));

        revalidatePath("/admin");
        revalidatePath("/"); // Homepage potentially shows featured posts
        return { success: true };
    } catch (error) {
        console.error("Failed to toggle featured", error);
        return { success: false, error: "Failed to update featured status" };
    }
}

export async function toggleStaffPick(postId: string, isStaffPick: boolean) {
    try {
        await verifyAdmin();

        // 1. Get or create "Staff Pick" tag
        const staffPickSlug = "staff-pick";
        let staffPickTag = await db.query.tags.findFirst({
            where: eq(tags.slug, staffPickSlug)
        });

        if (!staffPickTag) {
            const [newTag] = await db.insert(tags).values({
                name: "Staff Pick",
                slug: staffPickSlug,
            }).returning();
            staffPickTag = newTag;
        }

        if (isStaffPick) {
            // Add tag if not exists
            const existingLink = await db.query.postsToTags.findFirst({
                where: and(
                    eq(postsToTags.postId, postId),
                    eq(postsToTags.tagId, staffPickTag.id)
                )
            });

            if (!existingLink) {
                await db.insert(postsToTags).values({
                    postId,
                    tagId: staffPickTag.id
                });
            }
        } else {
            // Remove tag
            await db.delete(postsToTags)
                .where(and(
                    eq(postsToTags.postId, postId),
                    eq(postsToTags.tagId, staffPickTag.id)
                ));
        }

        revalidatePath("/admin");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to toggle staff pick", error);
        return { success: false, error: "Failed to update staff pick status" };
    }
}
// ... existing code ...

export async function getDashboardStats() {
    try {
        await verifyAdmin();

        // Efficient counting would use count(), but for now fetching length is simple enough for small scale
        // or we can use db.select({ count: sql<number>`count(*)` }).from(table)

        const postsCount = await db.query.posts.findMany({ columns: { id: true } });
        const usersCount = await db.query.users.findMany({ columns: { id: true } });
        const subsCount = await db.query.newsletterSubscribers.findMany({ columns: { id: true } });
        const viewsCount = await db.query.posts.findMany({ columns: { views: true } });

        const totalViews = viewsCount.reduce((acc, curr) => acc + (curr.views || 0), 0);

        return {
            totalPosts: postsCount.length,
            totalUsers: usersCount.length,
            totalSubscribers: subsCount.length,
            totalViews: totalViews
        };
    } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        return { totalPosts: 0, totalUsers: 0, totalSubscribers: 0, totalViews: 0 };
    }
}

export async function getUsers() {
    try {
        await verifyAdmin();
        return await db.query.users.findMany({ orderBy: [desc(users.createdAt)] });
    } catch (error) {
        return [];
    }
}

export async function getCategories() {
    try {
        await verifyAdmin();
        return await db.query.categories.findMany({
            orderBy: [desc(categories.createdAt)],
            with: { posts: true }
        });
    } catch (error) {
        return [];
    }
}

export async function getTags() {
    try {
        await verifyAdmin();
        return await db.query.tags.findMany({
            orderBy: [desc(tags.createdAt)],
            with: { posts: true }
        });
    } catch (error) {
        return [];
    }
}

export async function getNewsletterSubscribers() {
    try {
        await verifyAdmin();
        return await db.query.newsletterSubscribers.findMany({ orderBy: [desc(newsletterSubscribers.createdAt)] });
    } catch (error) {
        return [];
    }
}
