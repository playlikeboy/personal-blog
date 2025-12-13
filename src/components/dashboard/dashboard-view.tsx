"use client";

import { User } from "@stackframe/stack";
import { Container } from "@/components/ui/container";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Title, Text, Button, Badge } from "rizzui";
import Link from "next/link";
import {
    EyeIcon,
    HeartIcon,
    ChatBubbleLeftIcon,
    PencilIcon,
} from "@heroicons/react/24/outline";
import { Post } from "@/lib/posts";

interface DashboardViewProps {
    user: User;
    posts: Post[];
    stats: {
        stories: number;
        views: number;
        likes: number;
        comments: number;
    };
}

export function DashboardView({ user, posts, stats }: DashboardViewProps) {
    return (
        <div className="flex min-h-screen flex-col bg-background font-sans text-foreground pb-20">
            <Header />
            <main className="flex-1 py-12 md:py-20">
                <Container className="max-w-6xl">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
                        <div>
                            <Title as="h1" className="text-3xl md:text-4xl font-serif font-medium mb-2">
                                Dashboard
                            </Title>
                            <Text className="text-muted-foreground text-lg font-light">
                                Welcome back, {user.displayName}. Here&apos;s how your stories are performing.
                            </Text>
                        </div>
                        <Link href="/write">
                            <Button size="lg" className="rounded-full bg-foreground text-background hover:bg-foreground/90">
                                Write a Story
                            </Button>
                        </Link>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        <StatCard label="Stories" value={stats.stories} icon={PencilIcon} />
                        <StatCard label="Total Views" value={stats.views} icon={EyeIcon} />
                        <StatCard label="Total Likes" value={stats.likes} icon={HeartIcon} />
                        <StatCard label="Comments" value={stats.comments} icon={ChatBubbleLeftIcon} />
                    </div>

                    {/* Stories List */}
                    <section>
                        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-6 mb-8">
                            <Title as="h2" className="text-2xl font-serif font-medium">Your Stories</Title>
                        </div>

                        {posts.length > 0 ? (
                            <div className="grid gap-4">
                                {posts.map((post) => (
                                    <div
                                        key={post.slug}
                                        className="group p-6 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-900/50 transition-all hover:shadow-sm"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    {post.published ? (
                                                        <Badge variant="flat" color="success" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Published</Badge>
                                                    ) : (
                                                        <Badge variant="flat" color="warning" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Draft</Badge>
                                                    )}
                                                    <span className="text-xs text-muted-foreground">{new Date(post.createdAt || new Date()).toLocaleDateString()}</span>
                                                </div>
                                                <Link href={`/posts/${post.slug}`}>
                                                    <h3 className="text-xl font-medium font-serif group-hover:underline decoration-1 underline-offset-4">{post.title}</h3>
                                                </Link>
                                                <p className="text-muted-foreground line-clamp-1 max-w-2xl font-light text-sm">{post.excerpt}</p>
                                            </div>

                                            <div className="flex items-center gap-6 text-sm text-gray-400">
                                                <div className="flex items-center gap-1.5" title="Views">
                                                    <EyeIcon className="w-4 h-4" />
                                                    {post.views || 0}
                                                </div>
                                                <div className="flex items-center gap-1.5" title="Likes">
                                                    <HeartIcon className="w-4 h-4" />
                                                    {post.likesCount || 0}
                                                </div>
                                                <Link href={`/write?slug=${post.slug}`}>
                                                    <Button variant="text" size="sm" className="hidden group-hover:inline-flex text-foreground underline">
                                                        Edit
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50/50 dark:bg-gray-900/20">
                                <Text className="text-muted-foreground mb-4">You haven&apos;t published any stories yet.</Text>
                                <Link href="/write">
                                    <Button variant="outline" className="rounded-full">Start Writing</Button>
                                </Link>
                            </div>
                        )}
                    </section>
                </Container>
            </main>
        </div>
    );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: any }) {
    return (
        <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 flex flex-col justify-between h-32 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-sm font-medium">{label}</span>
                <Icon className="w-5 h-5 opacity-50" />
            </div>
            <div className="text-4xl font-serif font-medium text-foreground">
                {value.toLocaleString()}
            </div>
        </div>
    )
}
