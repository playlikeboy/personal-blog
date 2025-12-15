import { db } from "../src/db";
import { users, posts, tags, postsToTags } from "../src/db/schema";
import { eq } from "drizzle-orm";
import { slugify } from "../src/lib/utils";

// Load env vars
const TURSO_DB_URL = process.env.TURSO_DB_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_DB_URL || !TURSO_AUTH_TOKEN) {
    console.error("Missing TURSO env vars");
    process.exit(1);
}

const CREATIVE_USERS = [
    {
        name: "Aarya Singh",
        username: "aarya_poet",
        email: "aarya.singh@example.com",
        bio: "Weaving emotions into words. 🇮🇳 | Shayri & Ghazals.",
        country: "India",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256"
    },
    {
        name: "Elara Vance",
        username: "elara_v",
        email: "elara.vance@example.com",
        bio: "Short stories from the edge of the world. 🇬🇧",
        country: "UK",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256"
    },
    {
        name: "Rohan Das",
        username: "rohan_pens",
        email: "rohan.das@example.com",
        bio: "Searching for meaning in the mundane. 🇮🇳",
        country: "India",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&h=256"
    }
];

const CONTENT_TYPES = {
    Poem: (title: string) => [
        { type: "h1", children: [{ text: title }] },
        { type: "p", children: [{ text: "The sky bleeds crimson,\nA warning to the night,\nThat stars are watching,\nWith their cold, pale light." }] },
        { type: "p", children: [{ text: "I stand alone,\nOn this edge of time,\nWondering if the world,\nIs truly mine." }] },
        { type: "img", url: "https://image.pollinations.ai/prompt/crimson%20sky%20stars%20night%20emotional%20art?width=800&height=500&model=flux&nologo=true", children: [{ text: "" }] }
    ],
    Shayri: (title: string) => [
        { type: "h1", children: [{ text: title }] },
        { type: "p", children: [{ text: "Woh kehte hain ki ham muskurate bahut hain,\nUnhe kya khabar ham gham chhupate bahut hain." }] },
        { type: "p", children: [{ text: "Surat dekh kar dhokha na khana aye dost,\nAksar shaant samandar gehre bahut hote hain." }] },
        { type: "blockquote", children: [{ text: "Translation: \nThey say I smile too much,\nLittle do they know how much grief I hide.\nDon't be deceived by the surface, my friend,\nOften quiet oceans are the deepest." }] }
    ],
    ShortStory: (title: string) => [
        { type: "h1", children: [{ text: title }] },
        { type: "p", children: [{ text: "The train rattled on the tracks, a rhythmic lullaby that put everyone to sleep except Maya. She held the letter tightly in her hands, the ink smudged where her tears had fallen." }] },
        { type: "p", children: [{ text: "Passersby were just blurs of color—red coats, yellow umbrellas, gray lives. She wondered if any of them were running away too." }] },
        { type: "h2", children: [{ text: "The Departure" }] },
        { type: "p", children: [{ text: "It hadn't been an easy decision. Leaving meant leaving a part of herself behind. But staying? Staying meant losing herself completely." }] }
    ]
};

const CREATIVE_POSTS = [
    { title: "Crimson Night", type: "Poem", tags: ["Poetry", "Night", "Emotion"] },
    { title: "Dard-e-Dil", type: "Shayri", tags: ["Shayri", "Urdu", "Love"] },
    { title: "The Last Train", type: "ShortStory", tags: ["Fiction", "Life", "Journey"] },
    { title: "Silence Speaks", type: "Poem", tags: ["Poetry", "Silence"] },
    { title: "Adhoora Khwab", type: "Shayri", tags: ["Shayri", "Dreams"] },
    { title: "The Old Bookstore", type: "ShortStory", tags: ["Fiction", "Books", "Nostalgia"] },
    { title: "Winter's Breath", type: "Poem", tags: ["Poetry", "Nature", "Winter"] },
    { title: "Zindagi", type: "Shayri", tags: ["Shayri", "Life", "Philosophy"] },
    { title: "Echoes of Yesterday", type: "ShortStory", tags: ["Fiction", "Memory"] },
    { title: "Hope", type: "Poem", tags: ["Poetry", "Hope"] },
    { title: "Broken Glass", type: "ShortStory", tags: ["Fiction", "Drama"] },
    { title: "Barsaat", type: "Shayri", tags: ["Shayri", "Rain", "Romance"] },
    { title: "The Stranger", type: "ShortStory", tags: ["Fiction", "Mystery"] },
    { title: "Fading Light", type: "Poem", tags: ["Poetry", "Time"] },
    { title: "Tera Zikr", type: "Shayri", tags: ["Shayri", "Love"] },
    { title: "Coffee Shop Chronicles", type: "ShortStory", tags: ["Fiction", "SliceOfLife"] },
    { title: "Ocean's Song", type: "Poem", tags: ["Poetry", "Nature"] },
    { title: "Musafir", type: "Shayri", tags: ["Shayri", "Travel"] },
    { title: "The Lost Key", type: "ShortStory", tags: ["Fiction", "Mystery"] },
    { title: "Dawn", type: "Poem", tags: ["Poetry", "Morning"] }
];

async function seedCreative() {
    console.log("Starting Creative Content Seed...");

    // 1. Create/Get Users
    const userMap = [];
    for (const userData of CREATIVE_USERS) {
        let user = await db.query.users.findFirst({
            where: eq(users.email, userData.email)
        });

        if (!user) {
            const id = crypto.randomUUID();
            await db.insert(users).values({
                id,
                ...userData,
                isBanned: false,
                showFollowersCount: true,
                createdAt: new Date()
            });
            user = { id, ...userData } as any;
        }
        userMap.push(user);
    }

    // 2. Create Posts
    console.log("Creating 20+ Creative Posts...");
    const postsToInsert = [];
    const relationsToInsert = [];
    const tagCache = new Map();

    for (let i = 0; i < CREATIVE_POSTS.length; i++) {
        const postData = CREATIVE_POSTS[i];
        const user = userMap[i % userMap.length]; // Rotate users

        const title = postData.title;
        const slug = slugify(`${user.username}-${title}-${i}`);

        const contentNodes = CONTENT_TYPES[postData.type as keyof typeof CONTENT_TYPES](title);
        const content = JSON.stringify(contentNodes);
        const excerpt = contentNodes.find(n => n.type === 'p')?.children?.[0]?.text?.slice(0, 150) + "...";

        const encodedPrompt = encodeURIComponent(`${postData.title} ${postData.type} artistic emotional`);
        const coverImage = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=500&model=flux&nologo=true`;

        const postId = crypto.randomUUID();
        const createdAt = new Date();

        postsToInsert.push({
            id: postId,
            slug,
            title,
            excerpt,
            content,
            coverImage,
            published: true,
            authorId: user.id!,
            readTime: "3 min read",
            views: Math.floor(Math.random() * 500),
            likesCount: Math.floor(Math.random() * 100),
            createdAt,
            updatedAt: createdAt
        });

        // Tags
        for (const tagName of postData.tags) {
            let tagId = tagCache.get(tagName);
            if (!tagId) {
                const slug = slugify(tagName);
                let tag = await db.query.tags.findFirst({
                    where: eq(tags.slug, slug)
                });
                if (!tag) {
                    tagId = crypto.randomUUID();
                    await db.insert(tags).values({ id: tagId, name: tagName, slug, createdAt: new Date() });
                } else {
                    tagId = tag.id;
                }
                tagCache.set(tagName, tagId);
            }
            relationsToInsert.push({ postId, tagId });
        }
    }

    // Batch Insert
    await db.insert(posts).values(postsToInsert);
    // Insert Tags individually to avoid conflicts or batch if sure unique
    // Drizzle doesn't support 'ignore' easily in batch without specialized query, so simple loop or batch is fine if logic is sound
    // relationsToInsert is fine
    for (const rel of relationsToInsert) {
        try {
            await db.insert(postsToTags).values(rel);
        } catch (e) {
            // Ignore duplicate PKs if any
        }
    }

    console.log(`Successfully seeded ${postsToInsert.length} creative works.`);
}

seedCreative()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
