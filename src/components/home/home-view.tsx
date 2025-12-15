"use client";

import { Container } from "@/components/ui/container";
import { Button, Title, Text, Grid } from "rizzui";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useUser } from "@stackframe/stack";
import { Post } from "@/lib/posts";
import NextImage from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { getPostImage } from "@/lib/image-utils";
import { formatDate } from "@/lib/utils";

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
    topAuthorPosts: Post[];
    featuredPost: Post | undefined;
    recentPosts: Post[];
}

export function HomeView({ topAuthorPosts, featuredPost, recentPosts }: HomeViewProps) {
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
                            <Link href="/feed" className="group flex items-center gap-2 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-3">
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
                                        <div className="inline-block px-3 py-1 bg-accent/10 text-bg rounded-full text-xs font-bold uppercase tracking-wider">
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
                                            <div className="text-muted-foreground">{featuredPost.readTime} · {formatDate(featuredPost.date)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Container>
                    </section>
                )}

                {/* Lazy Section 1: Manifesto */}
                <motion.section
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="py-32 bg-foreground text-background relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
                        <SparklesIcon className="w-96 h-96" />
                    </div>
                    <Container className="relative z-10 text-center space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-background/20 text-sm font-medium tracking-wider uppercase opacity-80 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-background animate-pulse" />
                            The Philosophy
                        </div>
                        <h3 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium leading-[1.1] max-w-4xl mx-auto">
                            Writing is <span className="italic opacity-70">thinking</span> on paper. <br className="hidden md:block" />
                            Share your rawest ideas.
                        </h3>
                        <p className="text-lg md:text-xl text-background/70 max-w-2xl mx-auto font-light leading-relaxed">
                            No algorithms. No distractions. Just pure expression. Join a community of thinkers, creators, and storytellers who value depth over clicks.
                        </p>
                    </Container>
                </motion.section>

                {/* Lazy Section 2: Editor's Choice */}
                <section className="py-24 pb-40">
                    <Container>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="flex items-end justify-between mb-20"
                        >
                            <h3 className="text-8xl font-serif text-gray-100 dark:text-gray-900 leading-none -ml-4 select-none absolute z-0">
                                Selected
                            </h3>
                            <div className="relative z-10 w-full flex justify-between items-end">
                                <Title as="h2" className="text-3xl font-serif font-medium">Editor&apos;s Choice</Title>
                                <Link href="/u/sh20raj" className="text-sm font-medium border-b border-foreground pb-0.5 hover:opacity-60 transition-opacity">
                                    View Profile
                                </Link>
                            </div>
                        </motion.div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 relative z-10">
                            {topAuthorPosts.map((post, i) => (
                                <motion.div
                                    key={post.slug}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                >
                                    <Link href={`/posts/${post.slug}`} className="group flex flex-col space-y-6">
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
                                                    <span className="text-6xl font-serif text-muted-foreground/10">&quot;</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-xs font-bold tracking-widest uppercase text-muted-foreground">
                                                <span className="group-hover:text-accent transition-colors">{post.tags?.[0] || 'Unstory'}</span>
                                                <span className="font-medium opacity-60">{post.readTime}</span>
                                            </div>
                                            <h4 className="text-2xl font-serif font-medium leading-snug group-hover:underline decoration-1 underline-offset-4 decoration-accent/50">
                                                {post.title}
                                            </h4>
                                            <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed font-light">
                                                {post.excerpt}
                                            </p>
                                            <div className="pt-2 text-xs text-muted-foreground/60 font-medium">
                                                {formatDate(post.date)}
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </Container>
                </section>

                {/* Lazy Section 3: Trending Topics */}
                <section className="py-24 border-y border-gray-100 dark:border-gray-900 bg-secondary/5">
                    <Container>
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <Title as="h2" className="text-2xl font-serif font-medium mb-4">Trending Topics</Title>
                            <Text className="text-muted-foreground font-light">Explore what the world is thinking about.</Text>
                        </motion.div>

                        <div className="flex flex-wrap justify-center gap-4">
                            {["Technology", "Philosophy", "Design", "Life", "Culture", "Future", "Writing", "Minimalism", "Art", "Psychology"].map((topic, i) => (
                                <motion.div
                                    key={topic}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Link href={`/search?q=${topic}`} className="px-8 py-4 rounded-full bg-background border border-border/50 hover:border-foreground/50 hover:bg-foreground hover:text-background transition-all duration-300 text-lg font-medium cursor-pointer">
                                        #{topic}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </Container>
                </section>

                {/* Fresh from the Community */}
                <section className="py-24 pt-0">
                    <Container>
                        <div className="flex items-center justify-between mb-12 border-b border-gray-100 dark:border-gray-800 pb-4">
                            <Title as="h2" className="text-2xl font-serif font-medium">Fresh from the Community</Title>
                            <Link href="/search" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                View All
                            </Link>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                            {recentPosts.map((post) => (
                                <Link key={post.slug} href={`/posts/${post.slug}`} className="group flex flex-col space-y-4">
                                    <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-900 relative">
                                        {isValidImage(post.coverImage) ? (
                                            <NextImage
                                                src={post.coverImage}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-secondary/10 flex items-center justify-center">
                                                <span className="text-4xl text-muted-foreground/10 font-serif">Unstory</span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                            <span className="font-medium text-foreground">{post.author.name}</span>
                                            <span>•</span>
                                            <span>{formatDate(post.date)}</span>
                                        </div>
                                        <h4 className="text-xl font-medium font-serif leading-snug group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h4>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="mt-12 flex justify-center">
                            <Link href="/search">
                                <Button variant="outline" size="lg" className="rounded-full px-8 gap-2">
                                    Show More Stories
                                    <ArrowRightIcon className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </Container>
                </section>
            </main>
        </div >
    );
}
