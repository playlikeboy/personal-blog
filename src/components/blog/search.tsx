"use client";

import { useState, useMemo } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Fuse from "fuse.js";
import { Post } from "@/lib/posts";
import { PostCard } from "./post-card";
import { AnimatePresence } from "framer-motion";

interface SearchProps {
    posts: Post[];
}

export function Search({ posts }: SearchProps) {
    const [query, setQuery] = useState("");

    const fuse = useMemo(() => {
        return new Fuse(posts, {
            keys: ["title", "excerpt", "tags"],
            threshold: 0.3,
        });
    }, [posts]);

    const results = useMemo(() => {
        if (!query) return posts;
        return fuse.search(query).map((result) => result.item);
    }, [query, posts, fuse]);

    return (
        <div className="space-y-8">
            <div className="relative max-w-md mx-auto md:mx-0">
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search posts..."
                        className="w-full rounded-full border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-gray-400 focus:ring-0"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {query && (
                    <p className="text-gray-500 text-sm">
                        Found {results.length} results for &quot;{query}&quot;
                    </p>
                )}

                {results.length === 0 ? (
                    <div className="py-20 text-center">
                        <h4 className="mb-2 text-lg font-medium text-foreground">No posts found</h4>
                        <p className="text-gray-500">Try searching for something else.</p>
                    </div>
                ) : (
                    <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence mode="popLayout">
                            {results.map((post) => (
                                <PostCard key={post.slug} post={post} />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
