"use client";

import { useEffect, useState } from "react";
import { Heart, Eye } from "lucide-react";
import { Button } from "rizzui";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Title } from "rizzui";
import { Post } from "@/lib/posts";
import ReactMarkdown from "react-markdown";

interface PostViewProps {
    post: Post | null;
}

// Basic Plate JSON Renderer
const PlateRenderer = ({ content }: { content: string }) => {
    try {
        const nodes = JSON.parse(content);
        if (!Array.isArray(nodes)) throw new Error("Invalid content");

        return (
            <div className="space-y-4">
                {nodes.map((node: any, i: number) => (
                    <PlateNode key={i} node={node} />
                ))}
            </div>
        );
    } catch (e) {
        // Fallback to Markdown if not JSON (legacy support)
        return <ReactMarkdown>{content}</ReactMarkdown>;
    }
};

const PlateNode = ({ node }: { node: any }) => {
    const children = node.children?.map((child: any, i: number) => {
        if (child.text !== undefined) {
            let text = <span key={i}>{child.text}</span>;
            if (child.bold) text = <strong key={i}>{child.text}</strong>;
            if (child.italic) text = <em key={i}>{child.text}</em>;
            if (child.underline) text = <u key={i}>{child.text}</u>;
            if (child.strikethrough) text = <s key={i}>{child.text}</s>;
            return text;
        }
        return <PlateNode key={i} node={child} />;
    });

    switch (node.type) {
        // Downshift headings to avoid conflict with main Page Title
        case "h1": return <h2 className="text-3xl font-bold mt-8 mb-4">{children}</h2>;
        case "h2": return <h3 className="text-2xl font-bold mt-6 mb-3">{children}</h3>;
        case "h3": return <h4 className="text-xl font-bold mt-4 mb-2">{children}</h4>;
        case "blockquote": return <blockquote className="border-l-4 border-gray-200 pl-4 italic my-6 text-gray-600 font-serif text-lg">{children}</blockquote>;
        case "ul": return <ul className="list-disc list-outside ml-6 my-4 space-y-2">{children}</ul>;
        case "ol": return <ol className="list-decimal list-outside ml-6 my-4 space-y-2">{children}</ol>;
        case "li": return <li className="pl-1">{children}</li>;
        case "p": return <p className="leading-7 text-gray-800 mb-4">{children}</p>;
        case "img": return <img src={node.url} alt={node.alt || ""} className="rounded-xl w-full my-6 aspect-video object-cover bg-gray-100" />;
        case "a": return <a href={node.url} className="text-blue-600 underline underline-offset-2 hover:text-blue-800">{children}</a>;
        default: return <div className="leading-relaxed">{children}</div>;
    }
}

import useSWR from "swr";

export function PostView({ post }: PostViewProps) {
    // Increment View once
    useEffect(() => {
        if (!post?.slug) return;
        fetch(`/api/posts/${post.slug}/view`, { method: "POST" });
    }, [post?.slug]);

    const likesCount = post?.likesCount || 0;

    // SWR for Likes
    const { data: likeData, mutate } = useSWR(
        post?.slug ? `/api/posts/${post.slug}/like` : null,
        async (url: string) => {
            const res = await fetch(url);
            return res.json() as Promise<{ likesCount: number; isLiked: boolean }>;
        },
        {
            fallbackData: {
                likesCount: likesCount,
                isLiked: false
            },
            revalidateOnFocus: false
        }
    );

    // Keep views static for now or distinct state if we want live updates, but usually views are static on load + 1
    const [views] = useState(post?.views || 0);

    const handleLike = async () => {
        if (!post?.slug || !likeData) return;

        // Optimistic Update
        const newIsLiked = !likeData.isLiked;
        const newCount = newIsLiked ? likeData.likesCount + 1 : likeData.likesCount - 1;

        mutate({ likesCount: newCount, isLiked: newIsLiked }, false);

        try {
            const res = await fetch(`/api/posts/${post.slug}/like`, { method: "POST" });
            if (!res.ok) throw new Error();
            const data = await res.json() as { liked: boolean };

            // Revalidate to ensure sync
            mutate({ likesCount: newCount, isLiked: data.liked }); // Update with server verification if needed, or just revalidate
        } catch (e) {
            // Revert
            mutate(likeData, false);
        }
    };

    const currentLikes = likeData?.likesCount ?? (post?.likesCount || 0);
    const currentIsLiked = likeData?.isLiked ?? false;

    if (!post) {
        return null;
    }

    return (
        <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
            <Header />
            <article className="flex-1 py-20">
                <Container className="max-w-3xl">

                    <div className="space-y-6 mb-16 text-center">
                        <div className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                            {post.tags?.[0] || "Article"}
                        </div>
                        <Title as="h1" className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                            {post.title}
                        </Title>
                        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                            <Link href={`/@${post.author?.username || post.authorId}`} className="hover:text-foreground transition-colors font-medium">
                                {post.author?.name || "Author"}
                            </Link>
                            <span>•</span>
                            <span>{new Date(post.date).toLocaleDateString()}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                <span>{views}</span>
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-lg prose-gray mx-auto prose-headings:font-bold prose-headings:tracking-tight prose-a:text-foreground prose-a:no-underline hover:prose-a:underline prose-img:rounded-none prose-img:grayscale hover:prose-img:grayscale-0 transition-all">
                        <PlateRenderer content={post.content || ""} />
                    </div>

                    {/* Like Section */}
                    <div className="mt-16 pt-8 border-t flex justify-center">
                        <Button
                            variant="outline"
                            className={cn("gap-2 rounded-full", currentIsLiked && "text-red-500 border-red-200 bg-red-50")}
                            onClick={handleLike}
                        >
                            <Heart className={cn("w-5 h-5", currentIsLiked && "fill-current")} />
                            {currentLikes} {currentLikes === 1 ? "Like" : "Likes"}
                        </Button>
                    </div>
                </Container>
            </article>
            <Footer />
        </div>
    );
}
