"use client";

import { useState, useTransition } from "react";
import { toggleFeatured, toggleStaffPick } from "@/app/admin/actions";
import { format } from "date-fns";
import Link from "next/link";
import { Switch, Badge, Text, Button } from "rizzui";
import { useRouter } from "next/navigation";

// Define the type based on the query result
// Define the type based on the query result
type Post = {
    id: string;
    title: string;
    slug: string;
    createdAt: Date | null;
    featured: boolean | null;
    staffPick: boolean | null;
    author: {
        name: string | null;
        email: string;
    } | null;
    tags: {
        tag: {
            id: string;
            slug: string;
            name: string;
        };
    }[];
};

export function AdminView({ posts }: { posts: Post[] }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleFeaturedToggle = async (postId: string, currentState: boolean) => {
        startTransition(async () => {
            const result = await toggleFeatured(postId, !currentState);
            if (!result.success) {
                alert("Failed to update featured status");
            }
        });
    };

    const handleStaffPickToggle = async (postId: string, currentState: boolean) => {
        startTransition(async () => {
            const result = await toggleStaffPick(postId, !currentState);
            if (!result.success) {
                alert("Failed to update staff pick status");
            }
        });
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Title
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Author
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tags
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Featured
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Staff Pick
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {posts.map((post) => {
                            return (
                                <tr key={post.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <Link href={`/${post.slug}`} className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate max-w-[300px]" target="_blank">
                                                {post.title}
                                            </Link>
                                            <span className="text-xs text-gray-500">{post.slug}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{post.author?.name || "Unknown"}</div>
                                        <div className="text-xs text-gray-500">{post.author?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {post.createdAt ? format(post.createdAt, "MMM d, yyyy") : "-"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-wrap gap-1">
                                            {post.tags.slice(0, 3).map(({ tag }) => (
                                                <Badge key={tag.id} variant="flat" size="sm">
                                                    {tag.name}
                                                </Badge>
                                            ))}
                                            {post.tags.length > 3 && (
                                                <Badge variant="flat" size="sm">+{post.tags.length - 3}</Badge>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <Switch
                                            checked={!!post.featured}
                                            onChange={() => handleFeaturedToggle(post.id, !!post.featured)}
                                            disabled={isPending}
                                            className="cursor-pointer"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <Switch
                                            checked={!!post.staffPick}
                                            onChange={() => handleStaffPickToggle(post.id, !!post.staffPick)}
                                            disabled={isPending}
                                            className="cursor-pointer"
                                            color="info" // Use a different color if possible
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {posts.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                    No posts found.
                </div>
            )}
        </div>
    );
}
