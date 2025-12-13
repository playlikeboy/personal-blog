"use client";

import { Container } from "@/components/ui/container";
import { Search } from "@/components/blog/search"; // We can keep or remove this since we have /search page. Let's keep a small bar or link?
import { Button, Title, Text } from "rizzui";
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
        <div className="flex min-h-screen flex-col bg-background font-sans antialiased text-foreground selection:bg-black selection:text-white">
            <main className="flex-1">
                {/* Clean Hero Section */}
                <section className="py-24 md:py-40 relative overflow-hidden">
                    <Container className="relative z-10 max-w-4xl mx-auto text-center space-y-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-white/50 backdrop-blur text-xs font-semibold tracking-wide uppercase text-gray-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Engineering & Design
                        </div>
                        <Title as="h1" className="text-6xl md:text-8xl font-black tracking-tight text-foreground leading-[0.95] tracking-tighter">
                            Clarity in <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">Complexity.</span>
                        </Title>
                        <Text className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light text-gray-500">
                            A curated collection of thoughts on software architecture, minimal design, and the future of web development.
                        </Text>

                        <div className="pt-8 flex items-center justify-center gap-4">
                            {!user ? (
                                <Link href="/handler/sign-in">
                                    <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-xl shadow-gray-200 hover:scale-105 transition-transform">
                                        Start Reading
                                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/search">
                                    <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base border-gray-300 hover:bg-gray-100">
                                        Explore Library
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </Container>

                    {/* Abstract bg element */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-gray-100 to-transparent rounded-full blur-3xl opacity-50 -z-10 pointer-events-none" />
                </section>

                {/* Featured Post - Clean Card */}
                {featuredPost && (
                    <section className="py-20">
                        <Container>
                            <div className="flex items-center justify-between mb-12">
                                <Title as="h2" className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Featured Story</Title>
                            </div>
                            <Link href={`/posts/${featuredPost.slug}`} className="group relative block rounded-3xl overflow-hidden bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 transition-all duration-500 shadow-sm hover:shadow-2xl">
                                <div className="grid md:grid-cols-12 gap-0 items-stretch">
                                    <div className="md:col-span-7 relative h-96 md:h-auto overflow-hidden">
                                        {featuredPost.coverImage ? (
                                            <NextImage
                                                src={featuredPost.coverImage}
                                                alt={featuredPost.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                priority
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center text-gray-300">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div className="md:col-span-5 p-8 md:p-12 flex flex-col justify-center space-y-6">
                                        <div className="space-y-4">
                                            <div className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                                {featuredPost.tags?.[0] || "Article"}
                                            </div>
                                            <Title as="h3" className="text-3xl md:text-4xl font-bold tracking-tight leading-tight group-hover:text-gray-700 transition-colors">
                                                {featuredPost.title}
                                            </Title>
                                            <Text className="text-muted-foreground leading-relaxed line-clamp-3">
                                                {featuredPost.excerpt}
                                            </Text>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm font-medium text-gray-400 pt-4">
                                            <span>{featuredPost.readTime || "5 min read"}</span>
                                            <span>•</span>
                                            <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </Container>
                    </section>
                )}

                {/* Grid Layout */}
                <section className="py-20 pb-32">
                    <Container>
                        <div className="flex items-center justify-between mb-16 border-b border-gray-100 pb-6">
                            <Title as="h2" className="text-3xl font-bold tracking-tight">Recent Writings</Title>
                            <Link href="/search" className="text-sm font-medium text-gray-500 hover:text-black transition-colors flex items-center gap-1 group">
                                View search
                                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                            {recentPosts.map((post) => (
                                <Link key={post.slug} href={`/posts/${post.slug}`} className="group block space-y-5">
                                    <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl bg-gray-100 relative shadow-sm transition-all duration-500 group-hover:shadow-xl">
                                        {post.coverImage ? (
                                            <NextImage
                                                src={post.coverImage}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full gradient-bg opacity-50" />
                                        )}
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                                            {post.tags?.[0] || 'Post'}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Title as="h4" className="text-xl font-bold tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
                                            {post.title}
                                        </Title>
                                        <Text className="text-gray-500 line-clamp-2 text-sm leading-relaxed">
                                            {post.excerpt}
                                        </Text>
                                        <div className="text-xs font-medium text-gray-400">
                                            {new Date(post.date).toLocaleDateString()}
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
