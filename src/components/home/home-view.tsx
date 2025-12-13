"use client";

import { Container } from "@/components/ui/container";
import { Button, Title, Text } from "rizzui";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useUser } from "@stackframe/stack";
import { Post } from "@/lib/posts";
import NextImage from "next/image";

interface HomeViewProps {
    posts: Post[];
    featuredPost: Post | undefined;
    recentPosts: Post[];
}

export function HomeView({ posts, featuredPost, recentPosts }: HomeViewProps) {
    const user = useUser();

    return (
        <div className="flex min-h-screen flex-col bg-background font-sans antialiased text-foreground selection:bg-accent selection:text-white">
            <main className="flex-1">
                {/* Hero Section */}
                <section className="py-24 md:py-48 relative overflow-hidden bg-secondary/30">
                    <Container className="relative z-10 max-w-4xl mx-auto text-center space-y-10">
                        <Title as="h1" className="text-6xl md:text-8xl font-serif font-medium tracking-tight text-foreground leading-[1.05]">
                            Write your story. <br />
                            <span className="italic text-gray-600">Share your voice.</span>
                        </Title>
                        <Text className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light font-sans">
                            A story-first, emotion-driven platform. <br />
                            No distractions, just your words and the people who connect with them.
                        </Text>

                        <div className="pt-8 flex items-center justify-center gap-4">
                            {!user ? (
                                <Link href="/handler/sign-in">
                                    <Button size="lg" className="rounded-full px-8 h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-gray-200/50">
                                        Start Writing
                                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/write">
                                    <Button size="lg" className="rounded-full px-8 h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-gray-200/50">
                                        Write a Story
                                    </Button>
                                </Link>
                            )}
                            <Link href="/about">
                                <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base border-gray-300 hover:bg-white hover:text-black">
                                    Our Vision
                                </Button>
                            </Link>
                        </div>
                    </Container>
                </section>

                {/* Latest Stories */}
                <section className="py-24 bg-white">
                    <Container>
                        <div className="flex items-center justify-between mb-16 border-b border-gray-100 pb-6">
                            <Title as="h2" className="text-3xl font-serif font-medium tracking-tight">Recent Stories</Title>
                            <Link href="/search" className="text-sm font-medium text-gray-500 hover:text-black transition-colors flex items-center gap-1 group font-sans">
                                Explore all
                                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid md:grid-cols-3 gap-x-8 gap-y-16">
                            {recentPosts.map((post) => (
                                <Link key={post.slug} href={`/posts/${post.slug}`} className="group block space-y-5">
                                    <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-50 relative">
                                        {post.coverImage ? (
                                            <NextImage
                                                src={post.coverImage}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-secondary/20 text-gray-300 font-serif italic text-2xl">
                                                Unstory
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-accent">
                                            {post.tags?.[0] || 'Story'}
                                        </div>
                                        <Title as="h4" className="text-2xl font-serif font-medium tracking-tight leading-snug group-hover:text-gray-600 transition-colors">
                                            {post.title}
                                        </Title>
                                        <Text className="text-gray-500 line-clamp-3 text-sm leading-relaxed font-sans">
                                            {post.excerpt}
                                        </Text>
                                        <div className="flex items-center gap-2 text-xs font-medium text-gray-400 font-sans pt-1">
                                            <span>{post.readTime}</span>
                                            <span>•</span>
                                            <span>{new Date(post.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </Container>
                </section>
            </main>
        </div>
    );
}
