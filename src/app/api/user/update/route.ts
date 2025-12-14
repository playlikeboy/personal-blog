import { stackServerApp } from "@/stack/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, ne, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const stackUser = await stackServerApp.getUser();
        if (!stackUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json() as { username?: string; bio?: string; website?: string };
        const { username, bio, website } = body;

        // Validation
        if (username && username.length < 3) return NextResponse.json({ error: "Username must be at least 3 characters" }, { status: 400 });

        // Check uniqueness if username changed
        if (username) {
            const existing = await db.query.users.findFirst({
                where: and(eq(users.username, username), ne(users.id, stackUser.id))
            });
            if (existing) return NextResponse.json({ error: "Username already taken" }, { status: 400 });
        }

        await db.update(users)
            .set({
                username: username,
                bio: bio,
                website: website
            })
            .where(eq(users.id, stackUser.id));

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
