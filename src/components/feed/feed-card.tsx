"use client";

import { useState, useTransition } from "react";
import { Post } from "@/lib/posts";
import { Title, Text, Button, ActionIcon } from "rizzui";
import { HeartIcon, ChatBubbleLeftIcon, ShareIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { toggleLike } from "@/app/actions/engagement";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface FeedCardProps {
    post: Post;
}

export function FeedCard({ post }: FeedCardProps) {
    const [expanded, setExpanded] = useState(false);
    const [liked, setLiked] = useState(false); // We need to check initial state if possible or assume false until interaction
    const [likeCount, setLikeCount] = useState(post.likesCount);
    const [isPending, startTransition] = useTransition();

    // Note: In real app, we should pass initialLiked status from server or fetch it. 
    // For pure randomness, fetching per card might be heavy, but okay for MVP demo.
    // For now, we rely on optimistic updates for interaction.

    // Content truncation logic
    // We assume post.content might be markdown or plain text. 
    // For simplicity in this feed view, we assume we show 'excerpt' first, then 'content' if expanded.
    // If no excerpt, we truncate content.

    const displayContent = expanded ? (post.content || post.excerpt) : post.excerpt;
    // Simple naive markdown strip if needed, or just render as is if text. 
    // Assuming text for now or simple rendering.

    const handleLike = () => {
        startTransition(async () => {
            const prevLiked = liked;
            setLiked(!prevLiked);
            setLikeCount(prevLiked ? likeCount - 1 : likeCount + 1);

            try {
                const res = await toggleLike(post.id);
                setLiked(res.isLiked);
            } catch (e) {
                // Revert
                setLiked(prevLiked);
                setLikeCount(prevLiked ? likeCount : likeCount); // Reset count logic if complex, but simple match is fine
            }
        });
    };

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <Link href={`/@${post.author?.name ? post.author.name.replace(/\s+/g, '-').toLowerCase() : post.authorId}`}>
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                            {post.author.avatar ? (
                                <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
                                    {post.author.name?.[0]}
                                </div>
                            )}
                        </div>
                    </Link>
                    <div>
                        <Link href={`/@${post.author?.name ? post.author.name.replace(/\s+/g, '-').toLowerCase() : post.authorId}`} className="block font-semibold text-sm hover:underline">
                            {post.author.name}
                        </Link>
                        <span className="text-xs text-gray-400">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="pl-[52px]">
                <Link href={`/${post.slug}`} className="block group">
                    <Title as="h3" className="text-lg font-bold mb-1 group-hover:text-blue-600 transition-colors">
                        {post.title}
                    </Title>
                </Link>

                <div className={cn("text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-2 whitespace-pre-wrap font-serif")}>
                    {/* Render content safely needed? For now just text */}
                    {displayContent}
                </div>

                {!expanded && (post.content && post.content.length > post.excerpt.length) && (
                    <button
                        onClick={() => setExpanded(true)}
                        className="text-sm text-blue-500 font-medium hover:underline focus:outline-none"
                    >
                        Show more
                    </button>
                )}
                {expanded && (
                    <button
                        onClick={() => setExpanded(false)}
                        className="text-sm text-gray-400 font-medium hover:underline focus:outline-none block mt-2"
                    >
                        Show less
                    </button>
                )}
            </div>

            {/* Actions */}
            <div className="pl-[52px] pt-4 flex items-center gap-6">
                <button
                    onClick={handleLike}
                    className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors group"
                >
                    {liked ? (
                        <HeartIconSolid className="w-5 h-5 text-red-500" />
                    ) : (
                        <HeartIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    )}
                    <span className={cn("text-xs font-medium", liked && "text-red-500")}>
                        {likeCount > 0 ? likeCount : "Like"}
                    </span>
                </button>

                <Link href={`/${post.slug}#comments`} className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors">
                    <ChatBubbleLeftIcon className="w-5 h-5" />
                    <span className="text-xs font-medium">
                        {post.commentsCount > 0 ? post.commentsCount : "Comment"}
                    </span>
                </Link>

                <button className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors">
                    <ShareIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
