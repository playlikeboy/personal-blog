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

const GLOBAL_USERS = [
    {
        name: "Yuki Tanaka",
        username: "yuki_t",
        email: "yuki.tanaka@example.com",
        bio: " capturing the silence of Tokyo nights. 🇯🇵 | Haiku enthusiast.",
        country: "Japan",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256"
    },
    {
        name: "Elena Rossi",
        username: "elena_writes",
        email: "elena.rossi@example.com",
        bio: "Espresso, architecture, and words. Living la dolce vita in Rome. 🇮🇹",
        country: "Italy",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256"
    },
    {
        name: "Kwame Osei",
        username: "kwame_stories",
        email: "kwame.osei@example.com",
        bio: "Telling the untold stories of Accra. 🇬🇭 | African Literature.",
        country: "Ghana",
        avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=256&h=256"
    },
    {
        name: "Sofia Martinez",
        username: "sofia_m",
        email: "sofia.martinez@example.com",
        bio: "Dancing through life in Buenos Aires. 🇦🇷 | Tango & Poetry.",
        country: "Argentina",
        avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=256&h=256"
    },
    {
        name: "Liam O'Connor",
        username: "liam_oc",
        email: "liam.oconnor@example.com",
        bio: "Rain, coffee, and philosophy from Dublin. 🇮🇪",
        country: "Ireland",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256"
    },
    {
        name: "Priya Sharma",
        username: "priya_s",
        email: "priya.sharma@example.com",
        bio: "Coding by day, painting by night. Mumbai based. 🇮🇳",
        country: "India",
        avatar: "https://images.unsplash.com/photo-1672322589078-43d7904ba04c?auto=format&fit=crop&w=256&h=256"
    },
    {
        name: "Hans Mueller",
        username: "hans_m",
        email: "hans.mueller@example.com",
        bio: "Precision and minimalism. Berlin. 🇩🇪",
        country: "Germany",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&h=256"
    },
    {
        name: "Chloe Dubois",
        username: "chloe_d",
        email: "chloe.dubois@example.com",
        bio: "Art lover and dreamer in Paris. 🇫🇷",
        country: "France",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256"
    },
    {
        name: "Lucas Silva",
        username: "lucas_br",
        email: "lucas.silva@example.com",
        bio: "Nature and tech. Amazon rainforest explorer. 🇧🇷",
        country: "Brazil",
        avatar: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=256&h=256"
    },
    {
        name: "Sarah Jenkins",
        username: "sarah_j",
        email: "sarah.jenkins@example.com",
        bio: "NYC hustle with a peaceful soul. 🇺🇸",
        country: "USA",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&h=256"
    }
];

const TOPICS = [
    "Poetry", "Travel", "Philosophy", "Fiction", "Life", "Art", "Culture", "Nature", "Memoirs", "Photography"
];

const CONTENT_GENERATORS = {
    Poetry: (title: string) => [
        { type: "h1", children: [{ text: title }] },
        { type: "p", children: [{ text: "The wind whispers secrets\nThrough the leaves of gold\nA story ancient\nYet to be told." }] },
        { type: "p", children: [{ text: "In the silence of the morning,\nI find my peace,\nA fleeting moment,\nThat will never cease." }] },
        { type: "p", children: [{ text: "Tags: #poetry #verse #morning" }] }
    ],
    Travel: (title: string, country: string) => [
        { type: "h1", children: [{ text: title }] },
        { type: "p", children: [{ text: `Waking up in ${country} feels like stepping into a dream. The colors, the sounds, the smells—everything is amplified.` }] },
        { type: "img", url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1000&q=80", children: [{ text: "" }] },
        { type: "h2", children: [{ text: "The Local Vibe" }] },
        { type: "p", children: [{ text: "Walking through the narrow streets, I met a local artisan who changed my perspective on craft. It's not just about making things; it's about pouring your soul into them." }] },
        { type: "blockquote", children: [{ text: "To travel is to live." }] }
    ],
    Philosophy: (title: string) => [
        { type: "h1", children: [{ text: title }] },
        { type: "p", children: [{ text: "What does it mean to truly exist? Cartesian dualism suggests a separation of mind and body, but modern phenomenology argues otherwise." }] },
        { type: "p", children: [{ text: "We are embodied consciousness. Our experience of the world is shaped by our physical presence within it." }] },
        { type: "h2", children: [{ text: "Reflection" }] },
        { type: "p", children: [{ text: "Take a moment today to simply be. Not to do, but to be." }] }
    ],
    Default: (title: string, topic: string) => [
        { type: "h1", children: [{ text: title }] },
        { type: "p", children: [{ text: `Exploring the depths of ${topic} has been a journey of discovery.` }] },
        { type: "p", children: [{ text: "Every day brings a new lesson, a new challenge, and a new opportunity to grow. It is in these moments that we find our true selves." }] },
        { type: "h2", children: [{ text: "Key Takeaways" }] },
        {
            type: "ul", children: [
                { type: "li", children: [{ type: "p", children: [{ text: "Patience is key." }] }] },
                { type: "li", children: [{ type: "p", children: [{ text: "Consistency beats intensity." }] }] },
                { type: "li", children: [{ type: "p", children: [{ text: "Always stay curious." }] }] }
            ]
        }
    ]
};

async function seedGlobal() {
    console.log("Starting Global Content Seed...");

    // 1. Create Users
    console.log("Creating Users...");
    const createdUsers = [];
    for (const userData of GLOBAL_USERS) {
        // Check if exists
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
            user = { id, ...userData } as any; // Type hack for seeding
        }
        createdUsers.push(user);
    }

    // 2. Create Tags
    console.log("Creating Tags...");
    const tagMap = new Map();
    for (const topic of TOPICS) {
        const slug = slugify(topic);
        let tag = await db.query.tags.findFirst({
            where: eq(tags.slug, slug)
        });

        if (!tag) {
            const id = crypto.randomUUID();
            await db.insert(tags).values({
                id,
                name: topic,
                slug,
                createdAt: new Date()
            });
            tag = { id, name: topic, slug } as any;
        }
        tagMap.set(topic, tag);
    }

    // 3. Create Posts
    console.log("Creating Posts...");
    const postsToInsert = [];
    const relationsToInsert = [];

    for (const user of createdUsers) {
        for (let i = 0; i < 10; i++) {
            const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
            const title = `${topic}: A Personal Reflection #${i + 1}`;
            const slug = slugify(`${user.username}-${title}-${i}`);

            // Generate Content
            let contentNodes;
            if (topic === "Poetry") contentNodes = CONTENT_GENERATORS.Poetry(title);
            else if (topic === "Travel") contentNodes = CONTENT_GENERATORS.Travel(title, user.country || "the world");
            else if (topic === "Philosophy") contentNodes = CONTENT_GENERATORS.Philosophy(title);
            else contentNodes = CONTENT_GENERATORS.Default(title, topic);

            const content = JSON.stringify(contentNodes);
            const excerpt = contentNodes.find(n => n.type === 'p')?.children?.[0]?.text?.slice(0, 150) + "...";

            // Generate Cover Image
            const encodedPrompt = encodeURIComponent(`${topic} ${user.country} artistic minimalist`);
            const coverImage = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=500&model=flux&nologo=true`;

            const postId = crypto.randomUUID();
            const createdAt = new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)); // Random date within last year

            postsToInsert.push({
                id: postId,
                slug,
                title,
                excerpt,
                content,
                coverImage,
                published: true,
                authorId: user.id!,
                readTime: `${Math.floor(Math.random() * 5) + 2} min read`,
                views: Math.floor(Math.random() * 5000),
                likesCount: Math.floor(Math.random() * 500),
                createdAt,
                updatedAt: createdAt
            });

            // Link Tag
            const tag = tagMap.get(topic);
            if (tag) {
                relationsToInsert.push({
                    postId,
                    tagId: tag.id
                });
            }
        }
    }

    // Batch Insert Posts (Splitting to avoid too many vars if necessary, but 100 should be fine)
    // Actually Drizzle/LibSQL might have limits, doing in chunks of 50
    const chunkSize = 50;
    for (let i = 0; i < postsToInsert.length; i += chunkSize) {
        const chunk = postsToInsert.slice(i, i + chunkSize);
        await db.insert(posts).values(chunk);
    }

    // Batch Insert Relations
    for (let i = 0; i < relationsToInsert.length; i += chunkSize) {
        const chunk = relationsToInsert.slice(i, i + chunkSize);
        await db.insert(postsToTags).values(chunk);
    }

    console.log(`Successfully seeded ${postsToInsert.length} posts and ${relationsToInsert.length} tag relations across ${createdUsers.length} users.`);
}

seedGlobal()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
