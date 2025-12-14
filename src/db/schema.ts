import { sql, relations } from "drizzle-orm";
import { text, integer, sqliteTable, index, primaryKey } from "drizzle-orm/sqlite-core";

// ----------------------------------------------------------------------
// Users
// ----------------------------------------------------------------------

// ... existing imports ...

// ----------------------------------------------------------------------
// Users
// ----------------------------------------------------------------------

export const users = sqliteTable("users", {
    id: text("id").primaryKey(), // Stack Auth ID
    email: text("email").unique().notNull(),
    username: text("username").unique(),
    name: text("name"),
    avatar: text("avatar"),
    bio: text("bio"),
    twitter: text("twitter"),
    github: text("github"),
    website: text("website"),
    isBanned: integer("is_banned", { mode: "boolean" }).default(false),
    showFollowersCount: integer("show_followers_count", { mode: "boolean" }).default(false),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

export const usersRelations = relations(users, ({ many }) => ({
    posts: many(posts),
    comments: many(comments),
    likes: many(likes),
    bookmarks: many(bookmarks),
    followers: many(follows, { relationName: "following" }),
    following: many(follows, { relationName: "follower" }),
}));

// ... existing tables ...

// ----------------------------------------------------------------------
// Engagement
// ----------------------------------------------------------------------

// ... existing comments, likes, bookmarks tables ...

export const follows = sqliteTable("follows", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    followerId: text("follower_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
    followingId: text("following_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
}, (table) => ({
    uniqueFollow: index("unique_follow").on(table.followerId, table.followingId),
}));

export const followsRelations = relations(follows, ({ one }) => ({
    follower: one(users, {
        fields: [follows.followerId],
        references: [users.id],
        relationName: "follower",
    }),
    following: one(users, {
        fields: [follows.followingId],
        references: [users.id],
        relationName: "following",
    }),
}));

// ... existing newsletterSubscribers and analytics tables ...


// ----------------------------------------------------------------------
// Categories & Tags
// ----------------------------------------------------------------------

export const categories = sqliteTable("categories", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name").unique().notNull(),
    slug: text("slug").unique().notNull(),
    description: text("description"),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
    posts: many(postsToCategories),
}));

export const tags = sqliteTable("tags", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name").unique().notNull(),
    slug: text("slug").unique().notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

export const tagsRelations = relations(tags, ({ many }) => ({
    posts: many(postsToTags),
}));

// ----------------------------------------------------------------------
// Posts
// ----------------------------------------------------------------------

export const posts = sqliteTable("posts", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    slug: text("slug").unique().notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt"),
    content: text("content").notNull(), // JSON string for Plate.js
    coverImage: text("cover_image"),
    published: integer("published", { mode: "boolean" }).default(false),
    featured: integer("featured", { mode: "boolean" }).default(false),
    staffPick: integer("staff_pick", { mode: "boolean" }).default(false),
    authorId: text("author_id").notNull().references(() => users.id),
    readTime: text("read_time"),
    views: integer("views").default(0),
    likesCount: integer("likes_count").default(0),
    commentsCount: integer("comments_count").default(0),
    // SEO Fields
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),

    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
}, (table) => ({
    authorIdx: index("author_idx").on(table.authorId),
    publishedIdx: index("published_idx").on(table.published),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
    author: one(users, {
        fields: [posts.authorId],
        references: [users.id],
    }),
    categories: many(postsToCategories),
    tags: many(postsToTags),
    comments: many(comments),
    likes: many(likes),
    bookmarks: many(bookmarks),
}));

// Junction Tables

export const postsToCategories = sqliteTable("posts_to_categories", {
    postId: text("post_id").notNull().references(() => posts.id, { onDelete: 'cascade' }),
    categoryId: text("category_id").notNull().references(() => categories.id, { onDelete: 'cascade' }),
}, (t) => ({
    pk: primaryKey({ columns: [t.postId, t.categoryId] }),
}));

export const postsToCategoriesRelations = relations(postsToCategories, ({ one }) => ({
    post: one(posts, {
        fields: [postsToCategories.postId],
        references: [posts.id],
    }),
    category: one(categories, {
        fields: [postsToCategories.categoryId],
        references: [categories.id],
    }),
}));

export const postsToTags = sqliteTable("posts_to_tags", {
    postId: text("post_id").notNull().references(() => posts.id, { onDelete: 'cascade' }),
    tagId: text("tag_id").notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (t) => ({
    pk: primaryKey({ columns: [t.postId, t.tagId] }),
}));

export const postsToTagsRelations = relations(postsToTags, ({ one }) => ({
    post: one(posts, {
        fields: [postsToTags.postId],
        references: [posts.id],
    }),
    tag: one(tags, {
        fields: [postsToTags.tagId],
        references: [tags.id],
    }),
}));

// ----------------------------------------------------------------------
// Engagement
// ----------------------------------------------------------------------

export const comments = sqliteTable("comments", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    content: text("content").notNull(),
    postId: text("post_id").notNull().references(() => posts.id, { onDelete: 'cascade' }),
    authorId: text("author_id").notNull().references(() => users.id),
    parentId: text("parent_id"), // For nested comments
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
}, (table) => ({
    postIdx: index("post_idx").on(table.postId),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
    post: one(posts, {
        fields: [comments.postId],
        references: [posts.id],
    }),
    author: one(users, {
        fields: [comments.authorId],
        references: [users.id],
    }),
    // Self-relation for nested comments could be added here if needed by ORM query patterns
}));

export const likes = sqliteTable("likes", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    postId: text("post_id").notNull().references(() => posts.id, { onDelete: 'cascade' }),
    userId: text("user_id").notNull().references(() => users.id),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
}, (table) => ({
    uniqueLike: index("unique_like").on(table.postId, table.userId),
}));

export const likesRelations = relations(likes, ({ one }) => ({
    post: one(posts, {
        fields: [likes.postId],
        references: [posts.id],
    }),
    user: one(users, {
        fields: [likes.userId],
        references: [users.id],
    }),
}));

export const bookmarks = sqliteTable("bookmarks", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    postId: text("post_id").notNull().references(() => posts.id, { onDelete: 'cascade' }),
    userId: text("user_id").notNull().references(() => users.id),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
}, (table) => ({
    uniqueBookmark: index("unique_bookmark").on(table.postId, table.userId),
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
    post: one(posts, {
        fields: [bookmarks.postId],
        references: [posts.id],
    }),
    user: one(users, {
        fields: [bookmarks.userId],
        references: [users.id],
    }),
}));

// ----------------------------------------------------------------------
// Newsletter
// ----------------------------------------------------------------------

export const newsletterSubscribers = sqliteTable("newsletter_subscribers", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    email: text("email").unique().notNull(),
    isActive: integer("is_active", { mode: "boolean" }).default(true),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

// ----------------------------------------------------------------------
// Analytics
// ----------------------------------------------------------------------

export const postViews = sqliteTable("post_views", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    postId: text("post_id").notNull().references(() => posts.id, { onDelete: 'cascade' }),
    userId: text("user_id"), // Nullable for anonymous users
    fingerprint: text("fingerprint"), // For anonymous tracking (IP/Cookie)
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
}, (table) => ({
    postIdx: index("post_views_post_idx").on(table.postId),
    userIdx: index("post_views_user_idx").on(table.userId),
    fingerprintIdx: index("post_views_fingerprint_idx").on(table.fingerprint),
}));

export const postViewsRelations = relations(postViews, ({ one }) => ({
    post: one(posts, {
        fields: [postViews.postId],
        references: [posts.id],
    }),
    user: one(users, {
        fields: [postViews.userId],
        references: [users.id],
    }),
}));
