import { getAllPosts } from "@/lib/posts";
import { FeedView } from "@/components/blog/feed-view";

// Hardcoded data as requested by user
const DEMO_POSTS = [
    {
        slug: "minimalism-in-design",
        title: "The Art of Minimalism in Modern Web Design",
        excerpt: "How less can truly be more when building digital products. A deep dive into negative space, typography, and functional purity.",
        coverImage: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2067&auto=format&fit=crop",
        tags: ["Design"],
        readTime: "5 min read",
        date: "2024-04-12",
        author: { name: "Alex Doe", avatar: "" }
    },
    {
        slug: "future-of-ai",
        title: "The Future of AI in Software Engineering",
        excerpt: "Will AI replace engineers? No, but engineers who use AI will replace those who don't. Exploring the symbiotic relationship.",
        coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
        tags: ["Tech"],
        readTime: "7 min read",
        date: "2024-04-10",
        author: { name: "Sarah Smith", avatar: "" }
    },
    {
        slug: "database-scaling",
        title: "Scaling Databases for Millions of Users",
        excerpt: "Practical strategies for horizontal scaling, sharding, and caching. Lessons learned from high-traffic systems.",
        coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=2121&auto=format&fit=crop",
        tags: ["Engineering"],
        readTime: "10 min read",
        date: "2024-04-05",
        author: { name: "Mike Chen", avatar: "" }
    }
];

export default async function FeedPage() {
    let posts = await getAllPosts();

    // If no posts found (file system issue), use hardcoded data
    if (posts.length === 0) {
        posts = DEMO_POSTS as any;
    }

    return <FeedView posts={posts} />;
}
