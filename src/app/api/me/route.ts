import { stackServerApp } from "@/stack/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const stackUser = await stackServerApp.getUser();
        if (!stackUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const dbUser = await db.query.users.findFirst({
            where: eq(users.id, stackUser.id)
        });

        if (!dbUser) {
            return NextResponse.json({ error: "User not found in DB" }, { status: 404 });
        }

        return NextResponse.json({ username: dbUser.username });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
