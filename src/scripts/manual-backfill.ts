
import { db } from "@/db";
import { users } from "@/db/schema";
import { isNull, eq } from "drizzle-orm";

async function backfill() {
    console.log("Starting username backfill...");
    const usersWithoutUsername = await db.select().from(users).where(isNull(users.username));

    console.log(`Found ${usersWithoutUsername.length} users with NULL username.`);

    for (const user of usersWithoutUsername) {
        const baseUsername = user.email.split('@')[0] || "user";
        const newUsername = `${baseUsername}-${user.id.slice(0, 4)}`;

        console.log(`Updating ${user.id} -> ${newUsername}`);
        await db.update(users)
            .set({ username: newUsername })
            .where(eq(users.id, user.id));
    }
    console.log("Backfill complete.");
}

backfill().catch(console.error);
