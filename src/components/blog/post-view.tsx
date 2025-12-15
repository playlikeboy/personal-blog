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
import { PlateView } from "@/components/editor/plate-view";

import useSWR from "swr";

interface PostViewProps {
    post: Post | null;
}

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

    // Parse Content safely
    let plateContent = [];
    try {
        plateContent = typeof post?.content === "string" ? JSON.parse(post.content) : post?.content;
        if (!Array.isArray(plateContent)) plateContent = [];
    } catch {
        plateContent = [];
    }

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
                        {plateContent.length > 0 ? (
                            <PlateView content={plateContent} />
                        ) : (
                            <div className="text-center text-muted-foreground">No content</div>
                        )}
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
