import { notFound } from "next/navigation";
import { getPostBySlug, Post } from "@/lib/posts";
import { PostView } from "@/components/blog/post-view";

interface PostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Minimal fallback data for the hardcoded route if fetch fails
const FALLBACK_POST = {
    slug: "minimalism-in-design",
    title: "The Art of Minimalism in Modern Web Design",
    content: `
        Minimalism isn't just about removing things; it's about removing the unnecessary to let the meaningful stand out.In a world of digital noise, clarity is a superpower.

        When we strip away the non - essential, we're left with the core message. This isn't just an aesthetic choice; it's a functional one. Users are bombarded with information every second. A minimalist interface respects their attention and guides them effortlessly to what matters.

        ## The Power of Negative Space

        White space is not empty space.It is an active design element that creates structure, hierarchy, and rhythm.It gives content room to breathe and allows the user's eye to rest. By increasing margins and padding, we can create a sense of luxury and calm.

    > "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away." - Antoine de Saint - Exupéry

        ## Typography as Interface

        In a minimalist design, typography often carries the weight of the interface.Without heavy borders, shadows, or background colors to define structure, type hierarchy becomes critical.Variable font weights, dramatic scale contrasts, and careful leading allow text to serve as both content and container.
    `,
    coverImage: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2067&auto=format&fit=crop",
    tags: ["Design"],
    readTime: "5 min read",
    date: "2024-04-12",
    author: { name: "Alex Doe", avatar: "" }
};

export default async function PostPage({ params }: PostPageProps) {
    const { slug } = await params;
    let post = await getPostBySlug(slug);

    if (!post) {
        // Fallback for demo purposes if the file system fetch fails
        if (slug === "minimalism-in-design") {
            post = FALLBACK_POST as unknown as Post;
        } else {
            notFound();
        }
    }

    return <PostView post={post || null} />;
}
