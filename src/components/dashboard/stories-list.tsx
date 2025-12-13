"use client";

import { useUser } from "@stackframe/stack";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Title, Text, Button } from "rizzui";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { Eye, Heart } from "lucide-react";
import { Post } from "@/lib/posts";

interface StoriesListProps {
    posts: Post[];
}

export function StoriesList({ posts }: StoriesListProps) {
    const user = useUser();

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Text>Please sign in to view your stories.</Text>
            </div>
        );
    }

    // Filter by User ID for robust matching
    const myPosts = posts.filter(post => post.authorId === user.id);

    return (
        <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
            <Header />
            <main className="flex-1 py-12 md:py-20">
                <Container className="max-w-4xl">
                    <div className="flex items-center justify-between mb-8 border-b border-border pb-6">
                        <div>
                            <Title as="h1" className="text-3xl font-bold tracking-tight">My Stories</Title>
                            <Text className="text-muted-foreground mt-1">
                                {myPosts.length} {myPosts.length === 1 ? 'story' : 'stories'} published
                            </Text>
                        </div>
                        <Link href="/write">
                            <Button className="rounded-full">
                                <PencilSquareIcon className="mr-2 h-4 w-4" />
                                Write Story
                            </Button>
                        </Link>
                    </div>

                    {myPosts.length > 0 ? (
                        <div className="space-y-6">
                            {myPosts.map((post) => (
                                <div key={post.slug} className="group flex flex-col md:flex-row items-start md:items-center justify-between p-6 border border-border rounded-xl hover:border-foreground/20 transition-colors bg-card gap-4">
                                    <div className="space-y-2 flex-1">
                                        <Link href={`/posts/${post.slug}`} className="block">
                                            <h3 className="text-xl font-bold transition-colors group-hover:underline decoration-1 underline-offset-4">
                                                {post.title}
                                            </h3>
                                        </Link>
                                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                            <span>{new Date(post.date).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span className="capitalize">{post.tags?.[0] || 'Uncategorized'}</span>
                                            <span>•</span>
                                            <span>{post.readTime}</span>
                                        </div>

                                        {/* Analytics Section */}
                                        <div className="flex items-center gap-4 pt-2">
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                                                <Eye className="w-4 h-4" />
                                                <span>{post.views} views</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                                                <Heart className="w-4 h-4" />
                                                <span>{post.likesCount} likes</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Link href={`/write?slug=${post.slug}`}>
                                        <Button variant="outline" size="sm">Edit</Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-muted/30">
                            <h3 className="text-lg font-medium mb-2">No stories yet</h3>
                            <p className="text-muted-foreground mb-6">Share your ideas with the world.</p>
                            <Link href="/write">
                                <Button>Start Writing</Button>
                            </Link>
                        </div>
                    )}
                </Container>
            </main>
            <Footer />
        </div>
    );
}
