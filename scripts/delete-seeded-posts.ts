import { db } from "../src/db";
import { posts, users } from "../src/db/schema";
import { eq, inArray, and } from "drizzle-orm";

// Load env vars
const TURSO_DB_URL = process.env.TURSO_DB_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_DB_URL || !TURSO_AUTH_TOKEN) {
    console.error("Missing TURSO env vars");
    process.exit(1);
}

const AUTHOR_USERNAME = "sh20raj";

const POST_TITLES = [
    "The Future of React Server Components",
    "Mastering TypeScript Generics",
    "Designing for Dark Mode First",
    "The Rise of Edge Computing",
    "Minimalism in Digital Workspaces",
    "Understanding Database Indexing",
    "The Art of Code Review",
    "Building Accessible Web Apps",
    "State Management in 2025",
    "AI in Creative Workflows",
    "The Psychology of User Onboarding"
];

async function unseed() {
    console.log(`Finding user: ${AUTHOR_USERNAME}...`);

    const user = await db.query.users.findFirst({
        where: eq(users.username, AUTHOR_USERNAME)
    });

    if (!user) {
        console.error(`User @${AUTHOR_USERNAME} not found.`);
        return;
    }

    console.log(`Deleting ${POST_TITLES.length} seeded posts for user ${user.id}...`);

    // Delete posts matching title and author
    const deleted = await db.delete(posts)
        .where(
            and(
                eq(posts.authorId, user.id),
                inArray(posts.title, POST_TITLES)
            )
        )
        .returning();

    console.log(`Successfully deleted ${deleted.length} posts.`);
}

unseed()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
