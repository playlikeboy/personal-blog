"use client";

import { Container } from "@/components/ui/container";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PostCard } from "@/components/blog/post-card";
import { Title, Text } from "rizzui";
import { Post } from "@/lib/posts";

interface FeedViewProps {
    posts: Post[];
}

export function FeedView({ posts }: FeedViewProps) {
    return (
        <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
            <Header />
            <main className="flex-1 py-20">
                <Container>
                    <div className="mb-16 border-b border-border pb-8">
                        <Title as="h1" className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Your Feed</Title>
                        <Text className="text-xl text-muted-foreground font-light">The latest stories from across the platform.</Text>
                    </div>

                    <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <PostCard key={post.slug} post={post} />
                        ))}
                    </div>
                </Container>
            </main>
            <Footer />
        </div>
    );
}
