import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { db } from "@/db";
import { posts, users } from "@/db/schema";
import { eq } from "drizzle-orm";

const app = new Elysia({ prefix: "/api" })
    .use(swagger())
    .get("/", () => "Hello Elysia")
    .get("/posts", async () => {
        return await db.select().from(posts);
    })
    .post("/posts", async ({ body }) => {
        // Basic validation implementation
        // In real app, sync user from Auth
        const { title, content, slug, authorId } = body as any;

        await db.insert(posts).values({
            id: crypto.randomUUID(),
            slug,
            title,
            content: JSON.stringify(content),
            authorId, // This should come from auth context
            createdAt: new Date(),
        });

        return { success: true };
    });

export type App = typeof app;
export default app;
