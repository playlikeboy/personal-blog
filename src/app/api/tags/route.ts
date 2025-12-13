import { db } from "@/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const allTags = await db.query.tags.findMany({
            with: {
                posts: true
            }
        });
        const sortedTags = allTags.sort((a, b) => b.posts.length - a.posts.length);
        return NextResponse.json(sortedTags);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
