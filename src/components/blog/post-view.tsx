"use client";

import { useEffect, useState } from "react";
import { Heart, Eye } from "lucide-react";
import { Button } from "rizzui";
import { useRouter } from "next/navigation";
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
        case "h1": return <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>;
        case "h2": return <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>;
        case "h3": return <h3 className="text-xl font-bold mt-4 mb-2">{children}</h3>;
        case "blockquote": return <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">{children}</blockquote>;
        case "ul": return <ul className="list-disc list-inside my-4 space-y-1">{children}</ul>;
        case "ol": return <ol className="list-decimal list-inside my-4 space-y-1">{children}</ol>;
        case "li": return <li>{children}</li>;
        case "p": return <p className="leading-relaxed text-gray-700">{children}</p>;
        case "a": return <a href={node.url} className="text-blue-600 hover:underline">{children}</a>;
        default: return <div className="leading-relaxed">{children}</div>;
    }
}

export function PostView({ post }: PostViewProps) {
    const [likes, setLikes] = useState(post?.likesCount || 0);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [views, setViews] = useState(post?.views || 0);
    const [isLoadingLike, setIsLoadingLike] = useState(false);

    useEffect(() => {
        if (!post?.slug) return;

        // Increment View
        fetch(`/api/posts/${post.slug}/view`, { method: "POST" });

        // Fetch Like Status/Count (fresh)
        fetch(`/api/posts/${post.slug}/like`)
            .then(res => res.json())
            .then(data => {
                if (data.likesCount !== undefined) setLikes(data.likesCount);
                if (data.isLiked !== undefined) setIsLiked(data.isLiked);
            });
    }, [post?.slug]);

    const handleLike = async () => {
        if (!post?.slug || isLoadingLike) return;
        setIsLoadingLike(true);

        // Optimistic
        const prevLiked = isLiked;
        const prevCount = likes;
        setIsLiked(!prevLiked);
        setLikes(prev => prevLiked ? prev - 1 : prev + 1);

        try {
            const res = await fetch(`/api/posts/${post.slug}/like`, { method: "POST" });
            if (!res.ok) throw new Error();
            const data = await res.json();
            if (data.liked !== undefined) setIsLiked(data.liked);
        } catch (e) {
            // Revert
            setIsLiked(prevLiked);
            setLikes(prevCount);
        } finally {
            setIsLoadingLike(false);
        }
    };

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
                            <span>{post.author?.name || "Author"}</span>
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
                            className={cn("gap-2 rounded-full", isLiked && "text-red-500 border-red-200 bg-red-50")}
                            onClick={handleLike}
                            isLoading={isLoadingLike}
                        >
                            <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
                            {likes} {likes === 1 ? "Like" : "Likes"}
                        </Button>
                    </div>
                </Container>
            </article>
            <Footer />
        </div>
    );
}
