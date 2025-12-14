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
        // Debounce logic manually or with library
        // Since I don't have a library, I'll use a timer approach outside or simple timeout here.
        // A simple way is to use a useEffect with debounced value pattern, but here just raw timeout:
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
            // But checking vs current URL:
            const currentQ = searchParams.get("q") || "";
            if (currentQ !== inputValue && !(currentQ === "" && inputValue === "")) {
                router.push(`/search?${params.toString()}`);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [inputValue, router, searchParams]);

    return (
        <div className="space-y-12">
            <div className="max-w-2xl mx-auto text-center space-y-6">
                <Title as="h1" className="text-4xl md:text-5xl font-bold tracking-tight">
                    Explore Stories
                </Title>
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
                    <input
                        value={inputValue}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search by title..."
                        className="w-full rounded-2xl border border-gray-200 py-4 pl-14 pr-6 text-lg shadow-sm outline-none focus:border-gray-400 focus:ring-0 transition-all placeholder:text-gray-400"
                        autoFocus
                    />
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                    <Text className="text-lg font-medium text-muted-foreground">
                        {initialQuery ? `Results for "${initialQuery}"` : "All Posts"}
                    </Text>
                    {/* Note: We assume total count functionality might be passed, but passing totalPages is enough for pagination. 
                        posts.length is just the current page. We don't have total count here easily unless passed. 
                        We can omit exact count or pass it. I'll omit for now or just generic.
                    */}
                </div>

                {posts.length === 0 ? (
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
                    <>
                        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                            <AnimatePresence mode="popLayout">
                                {posts.map((post) => (
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

                        <PaginationControl
                            currentPage={currentPage}
                            totalPages={totalPages}
                            queryParams={{ q: initialQuery }}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
