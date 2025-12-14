"use server";

import { db } from "@/db";
import { users, follows } from "@/db/schema";
import { stackServerApp } from "@/stack/server";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function toggleFollow(targetUserId: string) {
    const user = await stackServerApp.getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    if (user.id === targetUserId) {
        throw new Error("Cannot follow yourself");
    }

    const existingFollow = await db.query.follows.findFirst({
        where: and(
            eq(follows.followerId, user.id),
            eq(follows.followingId, targetUserId)
        )
    });

    if (existingFollow) {
        // Unfollow
        await db.delete(follows).where(eq(follows.id, existingFollow.id));
        revalidatePath(`/@${targetUserId}`); // Revalidate profile page
        return { isFollowing: false };
    } else {
        // Follow
        await db.insert(follows).values({
            followerId: user.id,
            followingId: targetUserId,
        });
        revalidatePath(`/@${targetUserId}`);
        return { isFollowing: true };
    }
}

export async function getFollowStatus(targetUserId: string) {
    const user = await stackServerApp.getUser();
    if (!user) return { isFollowing: false, isSelf: false };

    if (user.id === targetUserId) return { isFollowing: false, isSelf: true };

    const existingFollow = await db.query.follows.findFirst({
        where: and(
            eq(follows.followerId, user.id),
            eq(follows.followingId, targetUserId)
        )
    });

    return { isFollowing: !!existingFollow, isSelf: false };
}

export async function updateUserSettings(settings: { showFollowersCount?: boolean }) {
    const user = await stackServerApp.getUser();
    if (!user) throw new Error("Unauthorized");

    await db.update(users)
        .set(settings)
        .where(eq(users.id, user.id));

    revalidatePath("/dashboard");
    revalidatePath(`/@${user.username || user.id}`);
}

export async function getFollowerStats(userId: string) {
    // Check if user allows showing stats
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { showFollowersCount: true }
    });

    if (!user?.showFollowersCount) {
        // If hidden, return null or 0 with a flag
        return { followers: 0, following: 0, hidden: true };
    }

    // Rough counts
    const followers = await db.select({ count: sql<number>`count(*)` })
        .from(follows)
        .where(eq(follows.followingId, userId));

    const following = await db.select({ count: sql<number>`count(*)` })
        .from(follows)
        .where(eq(follows.followerId, userId));

    return {
        followers: followers[0]?.count || 0,
        following: following[0]?.count || 0,
        hidden: false
    };
}
