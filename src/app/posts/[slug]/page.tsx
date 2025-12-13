import { notFound } from "next/navigation";
import { getPostBySlug, Post } from "@/lib/posts";
import { PostView } from "@/components/blog/post-view";
import { Metadata } from "next";

interface PostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Minimal fallback data for the hardcoded route if fetch fails
const FALLBACK_POST = {
    slug: "minimalism-in-design",
    title: "The Art of Minimalism in Modern Web Design",
    excerpt: "Minimalism isn't just about removing things; it's about removing the unnecessary to let the meaningful stand out.",
    content: `...`, // Content truncated for brevity in fallback
    coverImage: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2067&auto=format&fit=crop",
    tags: ["Design"],
    readTime: "5 min read",
    date: "2024-04-12",
    author: { name: "Alex Doe", avatar: "" }
};

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const { slug } = await params;
    let post = await getPostBySlug(slug);

    // Fallback logic for metadata too if needed, or just let it be empty/default
    if (!post && slug === "minimalism-in-design") {
        post = FALLBACK_POST as unknown as Post;
    }

    if (!post) {
        return {
            title: "Post Not Found",
        };
    }

    const ogImage = post.coverImage || "https://minimal.strivio.world/og-default.jpg"; // Replace with actual default

    return {
        title: post.title,
        description: post.excerpt || `Read ${post.title} on Minimal.`,
        openGraph: {
            title: post.title,
            description: post.excerpt || `Read ${post.title} on Minimal.`,
            type: "article",
            publishedTime: post.date ? new Date(post.date).toISOString() : undefined,
            authors: [post.author?.name || "Minimal Author"],
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt || `Read ${post.title} on Minimal.`,
            images: [ogImage],
        },
    };
}

export default async function PostPage({ params }: PostPageProps) {
    const { slug } = await params;
    let post = await getPostBySlug(slug);

    if (!post) {
        if (slug === "minimalism-in-design") {
            post = FALLBACK_POST as unknown as Post;
        } else {
            notFound();
        }
    }

    // JSON-LD Structured Data
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        image: post.coverImage ? [post.coverImage] : [],
        datePublished: post.date ? new Date(post.date).toISOString() : undefined,
        author: {
            "@type": "Person",
            name: post.author?.name || "Author",
        },
        publisher: {
            "@type": "Organization",
            name: "Minimal",
            logo: {
                "@type": "ImageObject",
                url: "https://minimal.strivio.world/logo.png" // Placeholder
            }
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://minimal.strivio.world/posts/${post.slug}`
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PostView post={post || null} />
        </>
    );
}
