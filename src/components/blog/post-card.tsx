"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { type Post } from "@/lib/posts";
import { Title, Text } from "rizzui";

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="group block"
        >
            <Link href={`/posts/${post.slug}`} className="block relative aspect-[3/2] overflow-hidden bg-muted mb-4">
                {post.coverImage && (post.coverImage.startsWith('http') || post.coverImage.startsWith('/')) && (
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                )}
            </Link>
            <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                        <span key={tag} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {tag}
                        </span>
                    ))}
                </div>
                <Link href={`/posts/${post.slug}`} className="block group">
                    <Title as="h3" className="text-2xl font-bold tracking-tight group-hover:underline decoration-1 underline-offset-4 leading-tight">
                        {post.title}
                    </Title>
                </Link>
                <Text className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                    {post.excerpt}
                </Text>
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1 font-medium">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                </div>
            </div>
        </motion.div>
    );
}
