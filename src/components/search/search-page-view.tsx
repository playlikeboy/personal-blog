"use client";

import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Post } from "@/lib/posts";
import { PostCard } from "@/components/blog/post-card";
import { AnimatePresence, motion } from "framer-motion";
import { Title, Text } from "rizzui";
import { useRouter, useSearchParams } from "next/navigation";
import { PaginationControl } from "@/components/ui/pagination-control";

interface SearchPageViewProps {
    posts: Post[];
    initialQuery?: string;
    currentPage: number;
    totalPages: number;
}

export function SearchPageView({ posts, initialQuery = "", currentPage, totalPages }: SearchPageViewProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [inputValue, setInputValue] = useState(initialQuery);

    // Sync input with URL param changes (e.g. navigation)
    useEffect(() => {
        setInputValue(initialQuery);
    }, [initialQuery]);

    const handleSearch = (term: string) => {
        setInputValue(term);
    };

    // Debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            // Reset to page 1 on new search
            params.set("page", "1");
            if (inputValue) {
                params.set("q", inputValue);
            } else {
                params.delete("q");
            }
            // Only push if different (avoid loops/initial)
            const currentQ = searchParams.get("q") || "";
            if (currentQ !== inputValue && !(currentQ === "" && inputValue === "")) {
                router.push(`/search?${params.toString()}`);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [inputValue, router, searchParams]);

    return (
        <div className="space-y-16 max-w-5xl mx-auto">
            {/* Minimal Header & Input */}
            <div className="space-y-8 py-8 border-b border-border/40">
                <Title as="h1" className="text-4xl md:text-5xl font-serif font-medium text-foreground tracking-tight">
                    Search
                </Title>
                <div className="relative group">
                    <input
                        value={inputValue}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Type to search..."
                        className="w-full bg-transparent border-none p-0 text-3xl md:text-5xl font-light placeholder:text-muted-foreground/30 focus:ring-2 focus:ring-primary text-foreground transition-all"
                        autoFocus
                    />
                    {/* Subtle underline animation or indicator could go here, for now just relying on the massive clean text */}
                </div>
            </div>

            <div className="space-y-8">
                {/* Results Header */}
                <div className="flex items-center justify-between">
                    <Text className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                        {initialQuery ? `Results for "${initialQuery}"` : "Recent Posts"}
                    </Text>
                    <Text className="text-xs text-muted-foreground/50">
                        {posts.length > 0 ? `Page ${currentPage} of ${totalPages}` : ''}
                    </Text>
                </div>

                {posts.length === 0 ? (
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
                        <div className="grid gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                            <AnimatePresence mode="popLayout">
                                {posts.map((post) => (
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

                        <div className="pt-12 border-t border-border/40">
                            <PaginationControl
                                currentPage={currentPage}
                                totalPages={totalPages}
                                queryParams={{ q: initialQuery }}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
