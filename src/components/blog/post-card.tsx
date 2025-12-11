"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { type Post } from "@/lib/posts";

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="group flex flex-col gap-4"
        >
            <Link href={`/blog/${post.slug}`} className="relative block aspect-[3/2] overflow-hidden rounded-xl bg-gray-100">
                <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </Link>
            <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                            {tag}
                        </span>
                    ))}
                </div>
                <Link href={`/blog/${post.slug}`} className="group-hover:underline decoration-gray-400 underline-offset-4">
                    <h3 className="text-xl font-bold leading-snug">
                        {post.title}
                    </h3>
                </Link>
                <p className="text-gray-500 line-clamp-2 text-sm">{post.excerpt}</p>
                <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                </div>
            </div>
        </motion.div>
    );
}
