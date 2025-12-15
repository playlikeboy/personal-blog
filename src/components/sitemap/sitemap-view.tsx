"use client";

import { Container } from "@/components/ui/container";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Title, Text } from "rizzui";
import Link from "next/link";
import { motion } from "framer-motion";
import { HomeIcon, PencilSquareIcon, RectangleStackIcon, UserCircleIcon, MagnifyingGlassIcon, SparklesIcon, BookOpenIcon, UsersIcon } from "@heroicons/react/24/outline";
import { Post } from "@/lib/posts";

interface SitemapViewProps {
    tags: { name: string; slug: string; count: number }[];
    recentPosts: Post[];
}

export function SitemapView({ tags, recentPosts }: SitemapViewProps) {
    const sections = [
        {
            title: "Platform",
            items: [
                { label: "Home", href: "/", icon: HomeIcon, description: "Start here" },
                { label: "Feed", href: "/feed", icon: RectangleStackIcon, description: "Curated stories" },
                { label: "Search", href: "/search", icon: MagnifyingGlassIcon, description: "Find topics" },
                { label: "Write", href: "/write", icon: PencilSquareIcon, description: "Publish story" },
                { label: "Dashboard", href: "/dashboard", icon: UserCircleIcon, description: "Manage content" },
            ]
        },
        {
            title: "Community",
            items: [
                { label: "About", href: "/about", icon: SparklesIcon, description: "Our philosophy" },
                { label: "Authors", href: "/authors", icon: UsersIcon, description: "Meet creators" },
            ]
        }
    ];

    return (
        <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
            <Header />
            <main className="flex-1 py-24 md:py-32">
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-16 md:mb-24 text-center max-w-2xl mx-auto space-y-4"
                    >
                        <Title as="h1" className="text-5xl md:text-6xl font-serif font-medium tracking-tight">
                            Directory
                        </Title>
                        <Text className="text-lg text-muted-foreground font-light">
                            Explore the architecture of Unstory.
                        </Text>
                    </motion.div>

                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
                        {/* Left Column: Navigation */}
                        <div className="lg:col-span-4 space-y-16">
                            {sections.map((section, idx) => (
                                <motion.div
                                    key={section.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="space-y-6"
                                >
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2 opacity-60">
                                        {section.title}
                                    </h3>
                                    <div className="grid gap-4">
                                        {section.items.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className="group flex items-center gap-4 p-4 rounded-2xl bg-secondary/5 hover:bg-secondary/20 border border-transparent hover:border-border/50 transition-all duration-300"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:scale-110 transition-all shadow-sm">
                                                    <item.icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-foreground group-hover:underline underline-offset-4 decoration-1">{item.label}</div>
                                                    <div className="text-xs text-muted-foreground font-light">{item.description}</div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Right Column: Topics & Stories */}
                        <div className="lg:col-span-8 space-y-16">
                            {/* Topics */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-8"
                            >
                                <div className="flex items-center justify-between border-b border-border pb-2">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                                        Topics
                                    </h3>
                                    <Link href="/search" className="text-xs font-medium text-muted-foreground hover:text-foreground">View All</Link>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {tags.map((tag, i) => (
                                        <Link
                                            key={tag.slug}
                                            href={`/search?q=${tag.name}`}
                                            className="px-4 py-2 rounded-full border border-border/60 hover:border-foreground/40 hover:bg-secondary/50 text-sm font-medium transition-colors"
                                        >
                                            #{tag.name} <span className="text-muted-foreground font-light text-xs ml-1">{tag.count}</span>
                                        </Link>
                                    ))}
                                    {tags.length === 0 && (
                                        <div className="text-muted-foreground italic font-light">No topics found yet.</div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Recent Stories */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-8"
                            >
                                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2 opacity-60">
                                    Recent Stories
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {recentPosts.map(post => (
                                        <Link key={post.slug} href={`/posts/${post.slug}`} className="group block space-y-2">
                                            <div className="aspect-video rounded-lg bg-secondary/10 overflow-hidden relative">
                                                {/* Fallback pattern or image would go here */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-secondary/20" />
                                            </div>
                                            <h4 className="font-serif font-medium text-lg leading-tight group-hover:text-primary transition-colors">
                                                {post.title}
                                            </h4>
                                            <div className="text-xs text-muted-foreground">
                                                {new Date(post.date).toLocaleDateString()}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </Container>
            </main>
            <Footer />
        </div>
    );
}
