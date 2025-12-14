"use client";

import { Container } from "@/components/ui/container";
import { Button, Title, Text, Grid } from "rizzui";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useUser } from "@stackframe/stack";
import { Post } from "@/lib/posts";
import NextImage from "next/image";
import { cn } from "@/lib/utils";
import { getPostImage } from "@/lib/image-utils";

const isValidImage = (url: string | null | undefined) => {
    if (!url) return false;
    try {
        new URL(url);
        return true;
    } catch {
        return url.startsWith('/');
    }
};

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
                {/* Modern Minimal Hero Section */}
                <section className="relative min-h-[80vh] flex flex-col justify-center items-center overflow-hidden border-b border-gray-100 dark:border-gray-900 bg-background text-center">
                    {/* Grain Overlay only - No Blobs */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />

                    <Container className="relative z-10 w-full max-w-4xl mx-auto px-4 flex flex-col items-center gap-10">

                        {/* Main Headline */}
                        <div className="space-y-6">
                            <h1 className="text-5xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-primary leading-[1.1]">
                                Your Story. Owned. <br />
                                <span className="italic text-gray-500 dark:text-gray-400">
                                    Uncensored.
                                </span>{" "}
                                Timeless.
                            </h1>
                        </div>

                        {/* Subheading */}
                        <p className="text-xl md:text-xl text-muted-foreground/90 max-w-2xl font-light leading-relaxed">
                            Unstory is a <span className="text-foreground font-medium">creator-first</span> publishing platform where ideas live beyond algorithms. Write freely, build an audience directly, and <span className="text-foreground font-medium decoration-accent/30 underline decoration-1 underline-offset-4">own every word</span>.
                        </p>

                        {/* CTA Buttons - Simplified */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                            <Link href={user ? "/write" : "/handler/sign-in"}>
                                <Button
                                    size="md"
                                    className="h-14 px-10 rounded-full border border-foreground bg-foreground text-background hover:bg-background hover:text-foreground transition-all duration-300 shadow-lg text-lg font-medium"
                                >
                                    Start Writing — Free
                                </Button>
                            </Link>
                            <Link href="/search" className="group flex items-center gap-2 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-3">
                                <span>Explore Stories</span>
                                <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
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
                                            <NextImage
                                                src={getPostImage(featuredPost)}
                                                alt={featuredPost.title}
                                                fill
                                                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                            />
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
                                        {isValidImage(post.coverImage) ? (
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
