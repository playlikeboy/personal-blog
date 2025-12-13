"use client";

import { Container } from "@/components/ui/container";
import { Button, Title, Text, Grid } from "rizzui";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useUser } from "@stackframe/stack";
import { Post } from "@/lib/posts";
import NextImage from "next/image";
import { cn } from "@/lib/utils";

interface HomeViewProps {
    posts: Post[];
    featuredPost: Post | undefined;
    recentPosts: Post[];
}

export function HomeView({ posts, featuredPost, recentPosts }: HomeViewProps) {
    const user = useUser();

    return (
        <div className="flex min-h-screen flex-col bg-background font-sans antialiased text-foreground selection:bg-accent selection:text-white pt-16">
            <main className="flex-1">
                {/* Handcrafted Hero Section */}
                <section className="relative py-24 md:py-32 flex flex-col items-center justify-center overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/50 rounded-full blur-[120px] opacity-60 dark:opacity-20 pointer-events-none" />
                    </div>

                    <Container className="space-y-12 text-center max-w-4xl relative z-10">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-sm animate-fade-in-up">
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                                The New Standard
                            </span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-medium tracking-tight text-foreground leading-[0.9] animate-fade-in-up delay-100">
                            Unleash the <br />
                            <span className="italic text-gray-400 dark:text-gray-600">Story.</span>
                        </h1>

                        {/* Subheading */}
                        <Text className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up delay-200">
                            A sanctuary for creativity. Share poems, thoughts, and memories in a <span className="text-foreground font-medium">lightweight, minimal environment.</span>
                        </Text>

                        {/* CTA Group */}
                        <div className="flex items-center justify-center gap-6 pt-8 animate-fade-in-up delay-300">
                            <Link href={user ? "/write" : "/handler/sign-in"}>
                                <Button
                                    size="lg"
                                    className="rounded-full h-14 px-10 text-lg bg-foreground text-background hover:bg-foreground/90 transition-all hover:scale-105 shadow-xl shadow-gray-200/50 dark:shadow-none"
                                >
                                    Start Writing
                                </Button>
                            </Link>
                            <Link href="/about">
                                <Button
                                    size="lg"
                                    variant="text"
                                    className="rounded-full h-14 px-8 text-lg text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Our Vision <ArrowRightIcon className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </Container>
                </section>

                {/* Featured Story - Magazine Layout */}
                {featuredPost && (
                    <section className="py-24 border-t border-gray-100 dark:border-gray-900">
                        <Container>
                            <div className="grid lg:grid-cols-12 gap-12 items-center">
                                <div className="lg:col-span-7 relative group cursor-pointer">
                                    <Link href={`/posts/${featuredPost.slug}`}>
                                        <div className="aspect-[16/10] overflow-hidden rounded-[2rem] bg-gray-100 dark:bg-gray-900 relative shadow-2xl shadow-gray-200/50 dark:shadow-none">
                                            {featuredPost.coverImage ? (
                                                <NextImage
                                                    src={featuredPost.coverImage}
                                                    alt={featuredPost.title}
                                                    fill
                                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-secondary/30 text-4xl font-serif text-muted-foreground/20 italic">
                                                    Unstory
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                </div>
                                <div className="lg:col-span-5 space-y-8">
                                    <div className="space-y-4">
                                        <div className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase tracking-wider">
                                            Featured Story
                                        </div>
                                        <Link href={`/posts/${featuredPost.slug}`} className="block group">
                                            <h2 className="text-4xl md:text-5xl font-serif font-medium leading-tight group-hover:text-accent transition-colors duration-300">
                                                {featuredPost.title}
                                            </h2>
                                        </Link>
                                        <p className="text-lg text-muted-foreground leading-relaxed font-light">
                                            {featuredPost.excerpt}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <div className="bg-secondary w-10 h-10 rounded-full flex items-center justify-center text-primary font-serif font-bold text-sm">
                                            {featuredPost.author?.name?.[0] || "A"}
                                        </div>
                                        <div className="text-sm">
                                            <div className="font-semibold text-foreground">{featuredPost.author?.name || "Anonymous"}</div>
                                            <div className="text-muted-foreground">{featuredPost.readTime} · {new Date(featuredPost.date).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Container>
                    </section>
                )}

                {/* Masonry-ish Grid for Recent */}
                <section className="py-24 pb-40">
                    <Container>
                        <div className="flex items-end justify-between mb-20">
                            <h3 className="text-8xl font-serif text-gray-100 dark:text-gray-900 leading-none -ml-4 select-none absolute z-0">
                                Stories
                            </h3>
                            <div className="relative z-10 w-full flex justify-between items-end">
                                <Title as="h2" className="text-3xl font-serif font-medium">Recent Writings</Title>
                                <Link href="/search" className="text-sm font-medium border-b border-foreground pb-0.5 hover:opacity-60 transition-opacity">
                                    View Archive
                                </Link>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 relative z-10">
                            {recentPosts.map((post) => (
                                <Link key={post.slug} href={`/posts/${post.slug}`} className="group flex flex-col space-y-6">
                                    <div className="aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-900 relative">
                                        {post.coverImage ? (
                                            <NextImage
                                                src={post.coverImage}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                            />
                                        ) : (
                                            <div className="w-full h-full p-8 flex flex-col justify-between bg-secondary/10 hover:bg-secondary/20 transition-colors">
                                                <span className="text-6xl font-serif text-muted-foreground/10">"</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        <div className="text-xs font-bold tracking-widest uppercase text-muted-foreground group-hover:text-accent transition-colors">
                                            {post.tags?.[0] || 'Unstory'}
                                        </div>
                                        <h4 className="text-2xl font-serif font-medium leading-snug group-hover:underline decoration-1 underline-offset-4 decoration-accent/50">
                                            {post.title}
                                        </h4>
                                        <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed font-light">
                                            {post.excerpt}
                                        </p>
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
