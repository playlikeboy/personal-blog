"use client";

import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Post } from "@/lib/posts";
import { PostCard } from "@/components/blog/post-card";
import { AnimatePresence, motion } from "framer-motion";
import { Title, Text } from "rizzui";
import { useRouter, useSearchParams } from "next/navigation";
import { PaginationControl } from "@/components/ui/pagination-control";
import { useSearchPosts } from "@/hooks/use-search";
import { useDebounce } from "use-debounce";

interface SearchPageViewProps {
    posts: Post[];
    initialQuery?: string;
    currentPage: number;
    totalPages: number;
}

export function SearchPageView({ posts: initialPosts, initialQuery = "", currentPage, totalPages }: SearchPageViewProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [inputValue, setInputValue] = useState(initialQuery);
    const [debouncedQuery] = useDebounce(inputValue, 300);

    // Fetch on client side when query changes
    const { posts: searchResults, isLoading } = useSearchPosts(debouncedQuery);

    // Use initial posts if query matches initialQuery and we are loading or have no data yet
    // But simpler: just use searchResults if query is present, otherwise initial
    const displayPosts = debouncedQuery ? searchResults : (debouncedQuery === initialQuery ? initialPosts : []);

    // Update URL silently without full reload
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (debouncedQuery) {
            params.set("q", debouncedQuery);
        } else {
            params.delete("q");
        }
        params.delete("page"); // Reset page on new search

        // Shallow push to update URL
        router.push(`/search?${params.toString()}`);
    }, [debouncedQuery, router, searchParams]);


    const handleSearch = (term: string) => {
        setInputValue(term);
    };

    return (
        <div className="space-y-16 max-w-5xl mx-auto">
            {/* Minimal Header & Input */}
            <div className="space-y-8 py-8 border-b border-border/40">
                <Title as="h1" className="text-4xl md:text-5xl font-serif font-medium text-foreground tracking-tight">
                    Search
                </Title>
                <div className="relative max-w-2xl">
                    <div className="relative group">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            value={inputValue}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search stories, people, or tags..."
                            className="w-full bg-secondary/30 hover:bg-secondary/50 focus:bg-background border border-transparent focus:border-input rounded-full py-4 pl-12 pr-6 text-lg placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300"
                            autoFocus
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {/* Results Header */}
                <div className="flex items-center justify-between">
                    <Text className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                        {debouncedQuery ? `Results for "${debouncedQuery}"` : "Recent Posts"}
                    </Text>
                    {/* Simplified pagination info or removed for infinite scroll future */}
                </div>

                {displayPosts.length === 0 && !isLoading ? (
                    <div className="py-32 text-center opacity-60">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/30 mb-6">
                            <MagnifyingGlassIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h4 className="mb-2 text-xl font-serif text-foreground">No stories found</h4>
                        <p className="text-muted-foreground font-light">
                            Try searching for something else.
                        </p>
                    </div>
                ) : (
                    <>
                        {isLoading && displayPosts.length === 0 && (
                            <div className="py-20 text-center text-muted-foreground">Searching...</div>
                        )}
                        <div className="grid gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                            <AnimatePresence mode="popLayout">
                                {displayPosts.map((post) => (
                                    <motion.div
                                        key={post.slug}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <PostCard post={post} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
