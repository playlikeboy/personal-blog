import { db } from "../src/db";
import { users, posts } from "../src/db/schema";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const USER_ID = "a77d9149-b5fd-4fa4-886c-bc55aa091be1"; // User ID from logs

async function seed() {
    console.log("Seeding database...");

    // 1. Ensure User (Fix FK error)
    console.log("Ensuring user exists:", USER_ID);
    await db.insert(users).values({
        id: USER_ID,
        email: "shaswatraj@example.com",
        name: "Shaswat Raj", // Placeholder
        avatar: "",
    }).onConflictDoNothing();

    // 2. Create Posts
    const samplePosts = [
        {
            slug: "bas-tumhari-ki-kami-h-ab-2885d540",
            title: "Bas tumhari ki kami h ab",
            content: JSON.stringify([{ type: "p", children: [{ text: "This is a restored post placeholder." }] }]),
            authorId: USER_ID,
            published: true,
            readTime: "3 min read",
            views: 154,
            likesCount: 12,
        },
        {
            slug: "things-that-gone-well-52e01544",
            title: "Things that gone well",
            content: JSON.stringify([{ type: "h1", children: [{ text: "Things that gone well" }] }, { type: "p", children: [{ text: "A list of successes." }] }]),
            authorId: USER_ID,
            published: true,
            readTime: "5 min read",
            views: 89,
            likesCount: 8,
        },
        {
            slug: "getting-started-with-nextjs",
            title: "Getting Started with Next.js",
            content: JSON.stringify([{ type: "p", children: [{ text: "Next.js is a React framework for production." }] }]),
            authorId: USER_ID,
            published: true,
            readTime: "4 min read",
            views: 342,
            likesCount: 45,
        }
    ];

    for (const post of samplePosts) {
        console.log("Inserting post:", post.title);
        await db.insert(posts).values(post).onConflictDoNothing();
    }

    console.log("Seeded successfully.");
    process.exit(0);
}

seed().catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
});
