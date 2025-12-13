"use client";

import { useState, useMemo } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Fuse from "fuse.js";
import { Post } from "@/lib/posts";
import { PostCard } from "@/components/blog/post-card";
import { AnimatePresence, motion } from "framer-motion";
import { Title, Text } from "rizzui";

interface SearchPageViewProps {
    posts: Post[];
}

export function SearchPageView({ posts }: SearchPageViewProps) {
    const [query, setQuery] = useState("");

    const fuse = useMemo(() => {
        return new Fuse(posts, {
            keys: ["title", "excerpt", "tags"],
            threshold: 0.3,
        });
    }, [posts]);

    const results = useMemo(() => {
        if (!query) return posts; // Show all by default or empty? User often likes to explore. Let's show all.
        return fuse.search(query).map((result) => result.item);
    }, [query, posts, fuse]);

    return (
        <div className="space-y-12">
            <div className="max-w-2xl mx-auto text-center space-y-6">
                <Title as="h1" className="text-4xl md:text-5xl font-bold tracking-tight">
                    Explore Stories
                </Title>
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by title, tag, or content..."
                        className="w-full rounded-2xl border border-gray-200 py-4 pl-14 pr-6 text-lg shadow-sm outline-none focus:border-gray-400 focus:ring-0 transition-all placeholder:text-gray-400"
                        autoFocus
                    />
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                    <Text className="text-lg font-medium text-muted-foreground">
                        {query ? `Results for "${query}"` : "All Posts"}
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                        {results.length} {results.length === 1 ? "result" : "results"}
                    </Text>
                </div>

                {results.length === 0 ? (
                    <div className="py-20 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                            <MagnifyingGlassIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h4 className="mb-2 text-xl font-medium text-foreground">No matches found</h4>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                            We couldn&apos;t find any posts matching your search. Try adjusting your terms.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence mode="popLayout">
                            {results.map((post) => (
                                <motion.div
                                    key={post.slug}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <PostCard post={post} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
