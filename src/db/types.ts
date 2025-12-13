import { users, posts, tags, categories } from "./schema";
import { type InferSelectModel } from "drizzle-orm";

export type User = InferSelectModel<typeof users>;
export type Post = InferSelectModel<typeof posts>;
export type Tag = InferSelectModel<typeof tags>;
export type Category = InferSelectModel<typeof categories>;

// Derived types for API responses (which might include relations)
export type UserWithPosts = User & { posts: Post[] };
export type PostWithRelations = Post & { author: User; tags: { tag: Tag }[] };
