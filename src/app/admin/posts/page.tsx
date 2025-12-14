import { db } from "@/db";
import { posts, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { toggleStaffPick, deletePost } from "../actions";
import { Button } from "rizzui";
import { Badge } from "rizzui";
import { Trash2, Star, SquarePen, Globe } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
    // Fetch posts with author info
    const allPosts = await db.select({
        post: posts,
        author: users
    })
        .from(posts)
        .leftJoin(users, eq(posts.authorId, users.id))
        .orderBy(desc(posts.createdAt));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Posts Management</h2>
                <div className="text-sm text-gray-500">
                    Total Posts: {allPosts.length}
                </div>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900">Title</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Author</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Stats</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {allPosts.map(({ post, author }) => (
                                <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 max-w-xs">
                                        <div className="font-medium text-gray-900 truncate" title={post.title}>{post.title}</div>
                                        <div className="text-gray-500 text-xs truncate">/{post.slug}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={author?.avatar || `https://ui-avatars.com/api/?name=${author?.name || 'User'}`}
                                                alt={author?.name || "User"}
                                                className="w-6 h-6 rounded-full object-cover"
                                            />
                                            <span className="text-gray-700">{author?.name || "Unknown"}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        <div className="flex items-center gap-3">
                                            <span title="Views">{post.views || 0} views</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            {post.published ? (
                                                <Badge color="success" variant="flat">Published</Badge>
                                            ) : (
                                                <Badge color="warning" variant="flat">Draft</Badge>
                                            )}
                                            {post.staffPick && (
                                                <Badge color="info" variant="flat">Staff Pick</Badge>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <form action={toggleStaffPick.bind(null, post.id, post.staffPick || false)}>
                                                <Button
                                                    type="submit"
                                                    variant="text"
                                                    size="sm"
                                                    className={post.staffPick ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"}
                                                    title={post.staffPick ? "Remove Staff Pick" : "Make Staff Pick"}
                                                >
                                                    <Star className={`w-4 h-4 ${post.staffPick ? 'fill-current' : ''}`} />
                                                </Button>
                                            </form>

                                            <Link href={`/${post.slug}`} target="_blank">
                                                <Button variant="text" size="sm" className="text-gray-500" title="View Live">
                                                    <Globe className="w-4 h-4" />
                                                </Button>
                                            </Link>

                                            <Link href={`/write?id=${post.id}`}>
                                                <Button variant="text" size="sm" className="text-blue-600" title="Edit">
                                                    <SquarePen className="w-4 h-4" />
                                                </Button>
                                            </Link>

                                            <form action={deletePost.bind(null, post.id)}>
                                                <Button
                                                    type="submit"
                                                    variant="text"
                                                    size="sm"
                                                    color="danger"
                                                    className="text-red-500 hover:bg-red-50"
                                                    title="Delete Post"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
