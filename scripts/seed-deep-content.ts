
import { db } from "@/db";
import { posts, users, tags as tagsTable, postsToTags } from "@/db/schema";
import { eq } from "drizzle-orm";
import { slugify } from "@/lib/utils";

function getRandomRefDate() {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 365));
    return date;
}

const DEEP_TOPICS = [
    {
        title: "The Echo of Silence",
        excerpt: "In the quietest moments, we hear the loudest truths about ourselves.",
        content: `True silence is rare in our modern world. We fill our lives with noise—notifications, traffic, conversation, music—anything to avoid the quiet. But it is in the silence that we meet ourselves. The echo of silence is not empty; it is full of the things we are afraid to say, the feelings we are afraid to feel. It is limbic resonance with our own soul.

        When we stop running from the silence, we begin to hear the whispers of our own intuition. It tells us where we are out of alignment, where we have betrayed our own hearts. It is uncomfortable, yes. But it is also the only path to true authenticity. To sit with oneself, without distraction, is perhaps the most courageous act of all.

        We must learn to befriend the silence. To see it not as a void to be filled, but as a canvas upon which our true self can be painted. In the silence, we find the answers that have evaded us in the noise. We find peace. We find clarity. We find home.`,
        tags: ["Philosophy", "Mindfulness", "Self"]
    },
    {
        title: "Limbic Resonance: The Chemistry of Connection",
        excerpt: "We are not solitary creatures. Our brains are designed to harmonize with others.",
        content: `Limbic resonance is the symphony of shared emotion. It is why a mother's lullaby calms a child, why a lover's touch soothes pain. We are open loops, relying on connections with others to regulate our own physiology. To deny this is to deny our humanity. We are wired for love, for empathy, for the deep, unspoken language of the heart.

        This biological imperative for connection transcends mere sentimentality. It is a survival mechanism, forged over millennia. When we are truly seen and heard by another, our nervous systems sync up. Our heart rates slow, our stress hormones drop. We are literally safer together. Isolation is not just lonely; it is physically toxic.

        In a world that prizes independence, we often forget this truth. We build walls to protect ourselves, not realizing that these walls also block the very nourishment we need to thrive. Vulnerability is the gate to limbic resonance. It is the courage to let someone else in, to let them regulate us, and to do the same for them.`,
        tags: ["Psychology", "Love", "Science"]
    },
    {
        title: "Shadows at Noon",
        excerpt: "Even in the brightest light, we carry our shadows. Do not run from them.",
        content: `We spend so much time curating our light—our best angles, our achievements, our smiles. But the shadow is always there. It is the repository of our grief, our jealousy, our fear. True integration requires us to invite the shadow to the table. To acknowledge that we are capable of both great kindness and great cruelty. Only then are we whole.

        The shadow is not evil; it is simply the parts of ourselves we have rejected. It holds our unexpressed creativity, our repressed power, our deepest desires. When we ignore it, it grows denser, heavier. It leaks out in passive aggression, in sudden outbursts, in self-sabotage. But when we face it, we reclaim that energy.

        Carl Jung said, "One does not become enlightened by imagining figures of light, but by making the darkness conscious." This work is not easy. It requires radical honesty and profound self-compassion. But the reward is a life lived fully, without the exhaustion of constantly hiding half of who we are.`,
        tags: ["Psychology", "Jung", "Growth"]
    },
    {
        title: "The Art of Letting Go",
        excerpt: "Holding on is safe. Letting go is freedom. The paradox of attachment.",
        content: `We clench our fists around people, memories, and identities, terrified that if we let go, we will disappear. But the opposite is true. Letting go is not losing; it is making space. It is the autumn leaf falling to feed the soil for spring. It is an act of trust in the universe, a belief that what is meant for us will stay, and what leaves was only a lesson.

        Attachment is the root of suffering, the Buddhists say. But we are human, and to love is to attach. The art lies in loving freely, without possession. In appreciating the flower without picking it. Letting go is a daily practice. It is exhaling the past so we can inhale the present.

        Sometimes, letting go means walking away from a person who no longer grows with us. Sometimes, it means releasing a dream that no longer fits. And sometimes, it simply means forgiving ourselves for not knowing then what we know now. It is the ultimate act of self-love.`,
        tags: ["Life", "Growth", "Spirituality"]
    },
    {
        title: "Nostalgia for a Future Pattern",
        excerpt: "Sometimes we miss a place we have never been.",
        content: `There is a German word, *Sehnsucht*, describing a longing for something indefinable. It is a home we can't remember, a future we can't quite see. It pulls us forward, this invisible thread. It is the artist's muse, the explorer's compass. We are all walking towards a horizon that recedes as we approach, fueled by a beautiful, aching hope.

        This longing is the engine of creation. It drives us to paint, to write, to build, to love. We are trying to bridge the gap between the world as it is and the world as we feel it could be. It is a holy dissatisfaction. Do not numb it. Do not ignore it. Follow it. It is the call of your destiny.

        Perhaps we are remembering a state of unity we lost when we were born into these separate bodies. Or perhaps we are sensing the potential of what we are becoming. Either way, the longing is proof that there is more to this existence than meets the eye. It is the heartbeat of the soul.`,
        tags: ["Poetry", "Emotion", "Art"]
    },
    {
        title: "Digital Ghost Towns",
        excerpt: "The internet never forgets, but it also never truly remembers.",
        content: `Scroll through an old forum, a dead social network. It is a graveyard of thoughts. Profiles of people who might be dead, or simply different. We leave fragments of ourselves everywhere, digital horcruxes. Are we diluting our souls? Or are we creating a constellation of existence that transcends our physical bodies? We are ghosts in the machine.

        These digital footprints are static, frozen in time. They do not age, they do not grow. They are snapshots of who we were at a specific moment. But we are rivers, constantly flowing, constantly changing. To define ourselves by our digital past is to trap ourselves in a cage of our own making.

        We must remember that we are more than data. We are flesh and blood, breath and bone. The internet is a tool, a mirror, a playground. But it is not life. Life is the smell of rain, the warmth of a hand, the taste of bread. Let us not get lost in the simulation.`,
        tags: ["Technology", "Society", "Reflection"]
    },
    {
        title: "The Architecture of a Tear",
        excerpt: "Sorrow and joy look identical under a microscope.",
        content: `Did you know that emotional tears have a different chemical composition than reflex tears? They carry stress hormones out of the body. Crying is not weakness; it is a biological reset. It is the body's way of speaking when words fail. To weep is to wash the windows of the soul, allowing the light to enter once again.

        We are taught to suppress our tears, to "be strong." But true strength is the ability to feel deeply and to let those feelings flow through us. Tears are a testament to our capacity for feeling. They honor the pain, the joy, the grief, the love. They are the holy water of the human experience.

        So let them fall. Let them water the soil of your being. For after the rain comes the rainbow. After the sorrow comes the peace. And in the vulnerability of weeping, we often find our deepest connection to others and to ourselves.`,
        tags: ["Science", "Emotion", "Health"]
    },
    {
        title: "Entropy and the Coffee Cup",
        excerpt: "The universe tends towards disorder. Why do we fight so hard for control?",
        content: `A coffee cup breaks. It never un-breaks. This is the arrow of time. Entropy increases. Yet, we build, we organize, we love. We create temporary pockets of order in a chaotic universe. It is a rebellion against the inevitable. It is the ultimate act of defiance: to create meaning in a world that guarantees none.

        We build sandcastles at the edge of the tide, knowing they will wash away. We plant gardens that will wither in winter. We fall in love knowing that hearts can break. Why? Because the beauty is in the building, not the lasting. The meaning is in the effort, not the outcome.

        Embrace the chaos. Embrace the impermanence. It is what gives life its sweetness. Because everything ends, everything matters. Every moment is a precious, fleeting gift. Hold it lightly, but hold it close.`,
        tags: ["Philosophy", "Physics", "Existentialism"]
    },
    {
        title: "Skin Hunger",
        excerpt: "In an age of connectivity, we are starving for touch.",
        content: `We can text anyone, anywhere. But we cannot feel their hand. 'Skin hunger' is a real physiological state. We need touch to lower cortisol, to boost oxytocin. We are mammals. We need warmth. No amount of likes or comments can replace the simple, grounding weight of a hug. Step away from the screen. Hold someone's hand.

        Touch is our first language. Before we could speak, we could feel. It is how we learned we were safe, how we learned we were loved. In our digital isolation, we are forgetting this primal tongue. We are becoming disembodied brains in jars, connected by fiber optics but separated by skin.

        Reach out. Hug your friends. Cuddle your pets. Get a massage. Dance. Reconnect with your body and with the bodies of others. Reclaim your mammalian heritage. We are not meant to be alone.`,
        tags: ["Health", "Society", "Connection"]
    },
    {
        title: "The Library of Unlived Lives",
        excerpt: "We are all a collection of the choices we didn't make.",
        content: `For every 'yes', there is a 'no'. For every path taken, a thousand branch off into darkness. Do not mourn the unlived lives. They are not lost; they are the negative space that defines the sculpture of your reality. You are here, now, in this breath. That is the only story that is being written. Make it a good one.

        It is easy to get lost in the "what ifs." To romanticize the road not taken. But that road is a fantasy. It does not exist. The only reality is the one under your feet. The choices you made led you here, to this exact moment, reading these words. There is a perfection in that, if you choose to see it.

        Honor the unlived lives by living this one fully. By being present. By engaging with what is, rather than what could have been. You are exactly where you are meant to be.`,
        tags: ["Life", "Choices", "Destiny"]
    }
];

const COVERS = [
    "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=2940&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?q=80&w=2940&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=2899&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2931&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2940&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=2899&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=2940&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1495423253816-527ce7a7b855?q=80&w=2940&auto=format&fit=crop"
];

async function seed() {
    console.log("🌱 Seeding Deep Content...");

    // 1. Get all users
    const allUsers = await db.query.users.findMany();
    if (allUsers.length === 0) {
        console.error("No users found. Run global seed first.");
        process.exit(1);
    }
    console.log(`Found ${allUsers.length} users to credit.`);

    // 2. Loop to create 50+ posts
    for (let i = 0; i < 55; i++) {
        const topic = DEEP_TOPICS[Math.floor(Math.random() * DEEP_TOPICS.length)];
        const user = allUsers[Math.floor(Math.random() * allUsers.length)];
        const cover = COVERS[Math.floor(Math.random() * COVERS.length)];

        // Variation in title to allow duplicates
        const title = i % 3 === 0 ? topic.title : `${topic.title} - Part ${Math.floor(Math.random() * 10) + 1}`;
        const slug = slugify(title) + "-" + crypto.randomUUID().split('-')[0];

        // Rich Content Simulation (Plate.js structure)
        const content = topic.content.split('\n\n').map(paragraph => ({
            type: "p",
            children: [{ text: paragraph.trim() }]
        })).concat([
            {
                type: "blockquote",
                children: [{ text: topic.excerpt }]
            },
            {
                type: "p",
                children: [{ text: "Consider this deeply. How does it reflect in your own life? The resonance is there if you listen." }]
            }
        ]);

        // Insert Post
        const [post] = await db.insert(posts).values({
            slug,
            title,
            excerpt: topic.excerpt,
            content: JSON.stringify(content),
            coverImage: cover,
            authorId: user.id,
            published: true,
            featured: Math.random() > 0.8, // 20% featured
            readTime: `${Math.floor(Math.random() * 5) + 3} min read`,
            views: Math.floor(Math.random() * 5000) + 100,
            likesCount: Math.floor(Math.random() * 1000) + 10,
            createdAt: getRandomRefDate(), // Random date in past
        }).returning();

        // Handle Tags
        for (const tagName of topic.tags) {
            let tag = await db.query.tags.findFirst({
                where: eq(tagsTable.name, tagName)
            });

            if (!tag) {
                const [newTag] = await db.insert(tagsTable).values({
                    name: tagName,
                    slug: slugify(tagName),
                }).returning();
                tag = newTag;
            }

            await db.insert(postsToTags).values({
                postId: post.id,
                tagId: tag.id,
            });
        }

        console.log(`Created: "${title}" by ${user.displayName}`);
    }

    console.log("✅ Done! Added 55 deep stories.");
    process.exit(0);
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
