import { getAllPosts, Post } from "@/lib/posts";
import { FeedView } from "@/components/blog/feed-view";

// Expanded hardcoded data for a better visual feed
const DEMO_POSTS: unknown[] = [
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
    },
    {
        slug: "remote-work-culture",
        title: "Building a Thriving Remote Culture",
        excerpt: "Remote work is here to stay. Learn how to foster connection, trust, and productivity in a distributed team environment.",
        coverImage: "https://images.unsplash.com/photo-1593642632823-8f78536788c6?q=80&w=2070&auto=format&fit=crop",
        tags: ["Culture"],
        readTime: "6 min read",
        date: "2024-04-02",
        author: { name: "Jessica Lee", avatar: "" }
    },
    {
        slug: "rust-vs-go",
        title: "Rust vs Go: Picking the Right Tool",
        excerpt: "A comparative analysis of Rust and Go for backend systems. When to prioritize performance safety over developer velocity.",
        coverImage: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2069&auto=format&fit=crop",
        tags: ["Programming"],
        readTime: "8 min read",
        date: "2024-03-28",
        author: { name: "David Kim", avatar: "" }
    },
    {
        slug: "sustainable-tech",
        title: "The Rise of Sustainable Technology",
        excerpt: "How the tech industry is reducing its carbon footprint through green coding practices and energy-efficient infrastructure.",
        coverImage: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop",
        tags: ["Sustainability"],
        readTime: "5 min read",
        date: "2024-03-25",
        author: { name: "Emma Wilson", avatar: "" }
    }
];

export default async function FeedPage() {
    let posts = await getAllPosts();

    // Always combine with demo posts for now to ensure a rich feed for the user
    posts = [...posts, ...(DEMO_POSTS as unknown as Post[])];

    return <FeedView posts={posts} />;
}
