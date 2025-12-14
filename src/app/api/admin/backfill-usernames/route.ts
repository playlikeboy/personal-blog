import { db } from "@/db";
import { users } from "@/db/schema";
import { isNull, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const usersWithoutUsername = await db.select().from(users).where(isNull(users.username));

        const results = [];
        for (const user of usersWithoutUsername) {
            const baseUsername = user.email.split('@')[0] || "user";
            const newUsername = `${baseUsername}-${user.id.slice(0, 4)}`; // Ensure uniqueness

            await db.update(users)
                .set({ username: newUsername })
                .where(eq(users.id, user.id));

            results.push({ id: user.id, old: user.username, new: newUsername });
        }

        return NextResponse.json({ success: true, updated: results });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
