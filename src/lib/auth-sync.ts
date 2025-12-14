import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { User } from "@stackframe/stack";

export async function syncUserWithStack(stackUser: User) {
    if (!stackUser || !stackUser.id) return;

    try {
        const existingUser = await db.query.users.findFirst({
            where: eq(users.id, stackUser.id),
        });

        if (!existingUser) {
            console.log(`[AuthSync] Syncing new user: ${stackUser.id}`);
            await db.insert(users).values({
                id: stackUser.id,
                email: stackUser.primaryEmail || "",
                name: stackUser.displayName || "Anonymous",
                avatar: stackUser.profileImageUrl || "",
                username: (stackUser.primaryEmail?.split('@')[0] || "user") + "-" + stackUser.id.slice(0, 4),
            });
        } else {
            // Optional: Update existing user if details changed
            // For now, we only ensure existence.
        }
    } catch (error) {
        console.error("[AuthSync] Failed to sync user:", error);
    }
}
