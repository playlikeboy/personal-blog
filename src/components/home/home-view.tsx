"use client";

import { Container } from "@/components/ui/container";
import { Search } from "@/components/blog/search";
import { Button, Title, Text } from "rizzui";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { User } from "@stackframe/stack";
import { Post } from "@/lib/posts";

interface HomeViewProps {
    user: User | null;
    posts: Post[];
    featuredPost: Post | undefined;
    recentPosts: Post[];
}

export function HomeView({ user, posts, featuredPost, recentPosts }: HomeViewProps) {
    return (
        <div className="flex min-h-screen flex-col bg-background font-sans antialiased text-foreground">
            <main className="flex-1">
                {/* Hero Section */}
                <section className="py-24 md:py-32">
                    <Container className="space-y-8">
                        <div className="inline-flex items-center text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                            Database Schema Live
                        </div>
                        <Title as="h1" className="text-6xl md:text-8xl font-bold tracking-tighter text-foreground leading-[0.9]">
                            Insights for the <br className="hidden md:block" />
                            Modern Engineer
                        </Title>
                        <Text className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed font-light">
                            Deep dives into software architecture, database design, and modern web development.
                            Curated for clarity and impact.
                        </Text>

                        <div className="pt-8">
                            {!user ? (
                                <Link href="/handler/sign-in">
                                    <Button size="lg" variant="outline" className="rounded-none border-foreground text-foreground px-8 h-12 text-base hover:bg-foreground hover:text-background transition-colors">
                                        Start Reading
                                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            ) : (
                                <div className="p-6 border border-border">
                                    <Text className="text-base font-medium">
                                        Welcome back, {user.displayName || "Explorer"}
                                    </Text>
                                    <Text className="text-sm text-muted-foreground mt-1">
                                        You are synced and ready to read.
                                    </Text>
                                </div>
                            )}
                        </div>
                    </Container>
                </section>

                {/* Featured Post */}
                {featuredPost && (
                    <section className="py-20 border-t border-border">
                        <Container>
                            <div className="mb-12">
                                <Title as="h2" className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Featured Story</Title>
                            </div>
                            <Link href={`/posts/${featuredPost.slug}`} className="group grid md:grid-cols-12 gap-8 items-start">
                                <div className="md:col-span-8 aspect-video w-full overflow-hidden bg-muted relative">
                                    {featuredPost.coverImage && (
                                        <img
                                            src={featuredPost.coverImage}
                                            alt={featuredPost.title}
                                            className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700"
                                        />
                                    )}
                                </div>
                                <div className="md:col-span-4 space-y-6">
                                    <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                        {featuredPost.tags?.[0] || "Article"}
                                    </div>
                                    <Title as="h3" className="text-4xl font-bold tracking-tight group-hover:underline decoration-1 underline-offset-4">
                                        {featuredPost.title}
                                    </Title>
                                    <Text className="text-muted-foreground leading-relaxed">
                                        {featuredPost.excerpt}
                                    </Text>
                                    <div className="pt-4 text-sm text-muted-foreground font-medium">
                                        {featuredPost.readTime || "5 min read"}
                                    </div>
                                </div>
                            </Link>
                        </Container>
                    </section>
                )}

                {/* Latest Posts Grid */}
                <section className="py-20 border-t border-border">
                    <Container>
                        <div className="flex items-center justify-between mb-16">
                            <Title as="h2" className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Latest Articles</Title>
                            <Link href="/feed" className="text-sm font-medium hover:underline underline-offset-4">
                                View All
                            </Link>
                        </div>

                        <div className="grid md:grid-cols-3 gap-x-8 gap-y-16">
                            {recentPosts.map((post) => (
                                <Link key={post.slug} href={`/posts/${post.slug}`} className="group space-y-4 block">
                                    <div className="aspect-[3/2] w-full overflow-hidden bg-muted">
                                        {post.coverImage && (
                                            <img
                                                src={post.coverImage}
                                                alt={post.title}
                                                className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700"
                                            />
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            {post.tags?.[0] || "Article"}
                                        </div>
                                        <Title as="h4" className="text-2xl font-bold tracking-tight group-hover:underline decoration-1 underline-offset-4 leading-tight">
                                            {post.title}
                                        </Title>
                                        <Text className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                                            {post.excerpt}
                                        </Text>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="mt-32 pt-16 border-t border-border">
                            <Search posts={posts} />
                        </div>
                    </Container>
                </section>
            </main>
        </div>
    );
}

