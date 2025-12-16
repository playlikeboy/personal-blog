"use client";

import { Container } from "@/components/ui/container";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Title, Text } from "rizzui";
import { useState } from "react";
import { Post } from "@/lib/posts";
import Link from "next/link";
import { PostCard } from "@/components/blog/post-card";

import { PaginationControl } from "@/components/ui/pagination-control";
import { usePostFeed } from "@/hooks/use-post-feed";

interface FeedViewProps {
    posts: Post[];
    currentPage: number;
    totalPages: number;
    title?: string;
    description?: string;
}

// ... imports
import { Select } from "rizzui"; // Check if Select exists in rizzui or use native/custom

// ... FeedViewProps

export function FeedView({ posts, currentPage, totalPages, title = "Your Feed", description = "Curated stories from the Unstory community.", initialSort = "latest" }: FeedViewProps & { initialSort?: "latest" | "popular" | "random" }) {
    const [sort, setSort] = useState<"latest" | "popular" | "random">(initialSort);

    // Reset initialPosts if sort changes? 
    // If user switches sort, initialPosts (which are SSR'd) are invalid for the new sort.
    // We should pass `undefined` as initialPosts to usePostFeed if sort != initialSort.
    // Or just let SWR handle it (if key changes, it fetches).

    const { posts: feedPosts, isLoadingMore, isReachingEnd, setSize, size } = usePostFeed({
        initialPosts: sort === initialSort ? posts : undefined,
        limit: 12,
        sort
    });

    return (
        <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
            <Header />
            <main className="flex-1 py-16 md:py-24">
                <Container className="max-w-3xl">
                    <div className="mb-20 text-center space-y-4">
                        <Title as="h1" className="text-4xl md:text-5xl font-serif font-medium tracking-tight">{title}</Title>
                        <Text className="text-lg text-muted-foreground font-light max-w-lg mx-auto">
                            {description}
                        </Text>

                        {/* Sorting Controls */}
                        <div className="flex justify-center pt-6">
                            <div className="inline-flex p-1 bg-secondary/30 rounded-full">
                                <button
                                    onClick={() => setSort("latest")}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${sort === "latest" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                                >
                                    Latest
                                </button>
                                <button
                                    onClick={() => setSort("popular")}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${sort === "popular" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                                >
                                    Popular
                                </button>
                                <button
                                    onClick={() => setSort("random")}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${sort === "random" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                                >
                                    Random
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-16">
                        {feedPosts.map((post: any, index: number) => (
                            <div key={`${post.slug}-${index}`} className="group block">
                                <Link href={`/posts/${post.slug}`}>
                                    <article className="space-y-4">
                                        <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                                            <span className="text-accent">{post.tags?.[0] || "Story"}</span>
                                            <span>•</span>
                                            <span>{new Date(post.date).toLocaleDateString()}</span>
                                        </div>
                                        <h2 className="text-3xl font-serif font-medium leading-tight group-hover:text-gray-600 transition-colors">
                                            {post.title}
                                        </h2>
                                        <p className="text-muted-foreground text-lg font-light leading-relaxed line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center gap-2 pt-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold">
                                                    {post.author?.name?.[0] || "A"}
                                                </div>
                                                <span className="text-sm font-medium">{post.author?.name}</span>
                                            </div>
                                            <span className="text-gray-300">•</span>
                                            <span className="text-sm text-gray-400">{post.readTime}</span>
                                        </div>
                                    </article>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {posts.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground font-light">
                            No stories found.
                            <Link href="/write" className="underline ml-1">Write the first one.</Link>
                        </div>
                    )}
                    <div className="pt-20 text-center">
                        {!isReachingEnd ? (
                            <button
                                onClick={() => setSize(size + 1)}
                                disabled={isLoadingMore}
                                className="px-8 py-3 bg-secondary/30 hover:bg-secondary/50 text-foreground rounded-full transition-colors disabled:opacity-50"
                            >
                                {isLoadingMore ? "Loading..." : "Load more stories"}
                            </button>
                        ) : (
                            <div className="text-muted-foreground text-sm">You are clean ✨</div>
                        )}
                    </div>
                </Container>
            </main>
        </div>
    );
}
