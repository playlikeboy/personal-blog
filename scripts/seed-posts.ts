import { db } from "../src/db";
import { posts, users } from "../src/db/schema";
import { eq } from "drizzle-orm";
import { slugify } from "../src/lib/utils";

// Load env vars
const TURSO_DB_URL = process.env.TURSO_DB_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_DB_URL || !TURSO_AUTH_TOKEN) {
    console.error("Missing TURSO env vars");
    process.exit(1);
}

const AUTHOR_USERNAME = "sh20raj";

const SAMPLE_CONTENT = (title: string, topic: string) => [
    {
        type: "h1",
        children: [{ text: title }]
    },
    {
        type: "p",
        children: [{ text: `In the rapidly evolving world of ${topic}, we often find ourselves at a crossroads.` }]
    },
    {
        type: "p",
        children: [{ text: "Consider for a moment the implications of recent developments. The synergy between classic principles and modern innovation is creating a paradigm shift that we cannot ignore. It's not just about efficiency; it's about redefining what's possible." }]
    },
    {
        type: "h2",
        children: [{ text: "The Core Problem" }]
    },
    {
        type: "p",
        children: [{ text: "One of the biggest challenges developers and creators face is the disconnect between tools and intent. 'We shape our tools and thereafter our tools shape us,' as Marshall McLuhan famously said. This is more relevant effectively today than ever before." }]
    },
    {
        type: "blockquote",
        children: [{ text: "True innovation comes from constraints, but only if those constraints allow for creative freedom within them." }]
    },
    {
        type: "p",
        children: [{ text: "I've spent the last few weeks digging deep into this, experimenting with new patterns and architectures. The results were surprising. Not only did performance improve, but the developer experience—the joy of coding—returned in full force." }]
    },
    {
        type: "h2",
        children: [{ text: "A New Approach" }]
    },
    {
        type: "ul",
        children: [
            { type: "li", children: [{ type: "p", children: [{ text: "Simplify dependencies" }] }] },
            { type: "li", children: [{ type: "p", children: [{ text: "Focus on primitives" }] }] },
            { type: "li", children: [{ type: "p", children: [{ text: "Iterate rapidly" }] }] },
        ]
    },
    {
        type: "p",
        children: [{ text: "By adopting this mindset, we can build more robust, scalable, and maintainable systems. It's a journey, not a destination, but the path is becoming clearer every day." }]
    },
    {
        type: "code_block",
        children: [{ text: "console.log('Hello, future!');" }]
    },
    {
        type: "p",
        children: [{ text: "Let's keep pushing the boundaries." }]
    }
];

const POST_TEMPLATES = [
    {
        title: "The Future of React Server Components",
        topic: "Web Development",
        image: "https://image.pollinations.ai/prompt/futuristic%20react%20server%20components%20concept%20web%20development%20clean%20minimal%20tech?width=1200&height=630&model=flux",
        excerpt: "Why RSCs are changing the way we build web apps forever."
    },
    {
        title: "Mastering TypeScript Generics",
        topic: "Coding",
        image: "https://image.pollinations.ai/prompt/complex%20typescript%20code%20generics%20abstract%20visualization%20blue%20neon?width=1200&height=630&model=flux",
        excerpt: "A deep dive into advanced TypeScript patterns that will save you hours."
    },
    {
        title: "Designing for Dark Mode First",
        topic: "UI/UX Design",
        image: "https://image.pollinations.ai/prompt/dark%20mode%20user%20interface%20design%20sleek%20modern%20app%20concept?width=1200&height=630&model=flux",
        excerpt: "Why starting with dark mode can lead to better color systems."
    },
    {
        title: "The Rise of Edge Computing",
        topic: "Cloud Infrastructure",
        image: "https://image.pollinations.ai/prompt/edge%20computing%20global%20network%20visualization%20data%20flow?width=1200&height=630&model=flux",
        excerpt: "Moving logic closer to the user is no longer optional for high-performance apps."
    },
    {
        title: "Minimalism in Digital Workspaces",
        topic: "Productivity",
        image: "https://image.pollinations.ai/prompt/minimalist%20clean%20white%20desk%20setup%20macbook%20plant%20workspace?width=1200&height=630&model=flux",
        excerpt: "How decluttering your digital environment boosts focus and creativity."
    },
    {
        title: "Understanding Database Indexing",
        topic: "Backend Engineering",
        image: "https://image.pollinations.ai/prompt/database%20indexing%20structure%20b-tree%20visualization%20technical?width=1200&height=630&model=flux",
        excerpt: "Stop slow queries in their tracks with proper indexing strategies."
    },
    {
        title: "The Art of Code Review",
        topic: "Software Engineering",
        image: "https://image.pollinations.ai/prompt/collaborative%20coding%20team%20code%20review%20screen%20discussion?width=1200&height=630&model=flux",
        excerpt: "How to give and receive feedback that actually improves code quality."
    },
    {
        title: "Building Accessible Web Apps",
        topic: "Accessibility",
        image: "https://image.pollinations.ai/prompt/web%20accessibility%20inclusive%20design%20interface%20concept?width=1200&height=630&model=flux",
        excerpt: "Accessibility is not a feature, it's a requirement. Here's how to do it right."
    },
    {
        title: "State Management in 2025",
        topic: "Frontend Development",
        image: "https://image.pollinations.ai/prompt/state%20management%20flow%20redux%20signals%20react%20diagram?width=1200&height=630&model=flux",
        excerpt: "Navigating the complexities of modern state management libraries."
    },
    {
        title: "AI in Creative Workflows",
        topic: "Artificial Intelligence",
        image: "https://image.pollinations.ai/prompt/artificial%20intelligence%20creative%20workflow%20brain%20artistic?width=1200&height=630&model=flux",
        excerpt: "How AI is augmenting human creativity rather than replacing it."
    },
    {
        title: "The Psychology of User Onboarding",
        topic: "Product Management",
        image: "https://image.pollinations.ai/prompt/user%20onboarding%20journey%20path%20welcome%20friendly%20ui?width=1200&height=630&model=flux",
        excerpt: "Reducing friction in the first 5 minutes of your user's journey."
    }
];

async function seed() {
    console.log(`Finding user: ${AUTHOR_USERNAME}...`);

    // Find User
    const user = await db.query.users.findFirst({
        where: eq(users.username, AUTHOR_USERNAME)
    });

    if (!user) {
        console.error(`User @${AUTHOR_USERNAME} not found! Please create the user first.`);
        return;
    }

    console.log(`Found user ID: ${user.id}. Creating posts...`);

    const postsToInsert = POST_TEMPLATES.map((template, index) => {
        const slug = slugify(template.title) + "-" + crypto.randomUUID().split("-")[0];
        return {
            title: template.title,
            content: JSON.stringify(SAMPLE_CONTENT(template.title, template.topic)),
            slug,
            coverImage: template.image,
            excerpt: template.excerpt,
            authorId: user.id,
            published: true,
            readTime: `${Math.floor(Math.random() * 5) + 3} min read`,
            createdAt: new Date(Date.now() - index * 86400000), // Backdate each by 1 day
            views: Math.floor(Math.random() * 1000) + 100,
            likesCount: Math.floor(Math.random() * 200) + 10,
        };
    });

    // Insert Posts
    await db.insert(posts).values(postsToInsert);

    console.log(`Successfully seeded ${postsToInsert.length} posts for @${AUTHOR_USERNAME}.`);
}

seed()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
