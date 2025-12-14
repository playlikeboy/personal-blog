"use client";

import { useState } from "react";
import { Post } from "@/lib/posts";
import { FeedCard } from "./feed-card";
import { Button, Loader } from "rizzui";

interface FeedStreamProps {
    initialPosts: Post[];
}

export function FeedStream({ initialPosts }: FeedStreamProps) {
    // In a real infinite scroll, we'd fetch more here. 
    // For now, we display the randomized initial batch.
    const [posts, setPosts] = useState<Post[]>(initialPosts);

    return (
        <div className="space-y-6 max-w-xl mx-auto">
            {posts.map((post) => (
                <FeedCard key={post.id} post={post} />
            ))}

            {posts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No posts found.
                </div>
            )}

            {/* Future Load More Button 
            <div className="flex justify-center pt-8">
                <Button variant="flat">Load More</Button>
            </div>
            */}
        </div>
    );
}
