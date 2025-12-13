"use client";

import { Container } from "@/components/ui/container";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Title, Text } from "rizzui";
import { Post } from "@/lib/posts";
import Link from "next/link";
import { PostCard } from "@/components/blog/post-card";

interface FeedViewProps {
    posts: Post[];
}

export function FeedView({ posts }: FeedViewProps) {
    return (
        <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
            <Header />
            <main className="flex-1 py-16 md:py-24">
                <Container className="max-w-3xl">
                    <div className="mb-20 text-center space-y-4">
                        <Title as="h1" className="text-4xl md:text-5xl font-serif font-medium tracking-tight">Your Feed</Title>
                        <Text className="text-lg text-muted-foreground font-light max-w-lg mx-auto">
                            Curated stories from the Unstory community.
                        </Text>
                    </div>

                    <div className="space-y-16">
                        {posts.map((post, index) => (
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
                </Container>
            </main>
            <Footer />
        </div>
    );
}
