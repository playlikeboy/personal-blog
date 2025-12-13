'use client';

import { Container } from "@/components/ui/container";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PostCard } from "@/components/blog/post-card";
import { Title, Text, Loader } from "rizzui";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserPage() {
    const params = useParams();
    const username = params?.username as string;
    const [data, setData] = useState<{ user: any; posts: any[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!username) return;
        fetch(`/api/u/${username}`)
            .then(res => {
                if (!res.ok) throw new Error("Failed");
                return res.json(); // Explicitly cast if needed, but 'any' state handles it for now
            })
            .then(data => {
                setData(data as any);
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, [username]);

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col bg-background font-sans">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <Loader variant="spinner" size="lg" />
                </main>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex min-h-screen flex-col bg-background font-sans">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <Text className="text-gray-400 text-lg">User not found.</Text>
                </main>
            </div>
        );
    }

    const { user, posts } = data;

    return (
        <div className="flex min-h-screen flex-col bg-background font-sans">
            <Header />
            <main className="flex-1 py-12 md:py-20 pb-40">
                <Container className="max-w-4xl">
                    <div className="flex flex-col items-center text-center space-y-6 mb-24">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-secondary border-4 border-background shadow-xl">
                            {user.avatar ? (
                                <Image
                                    src={user.avatar}
                                    alt={user.name || "User"}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl text-foreground/20 font-serif">
                                    {user.name?.[0] || "U"}
                                </div>
                            )}
                        </div>

                        <div className="space-y-4 max-w-lg">
                            <Title as="h1" className="text-4xl md:text-5xl font-serif font-medium text-foreground">
                                {user.name}
                            </Title>
                            {user.bio && (
                                <Text className="text-lg text-muted-foreground font-light leading-relaxed">
                                    {user.bio}
                                </Text>
                            )}
                            <div className="inline-flex items-center gap-4 text-sm text-gray-400 font-medium pt-2">
                                <span>{posts.length} Stories</span>
                                <span>•</span>
                                <span>Joined {user.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-12">
                        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                            <Title as="h3" className="text-xl font-serif font-medium">Published Writings</Title>
                        </div>

                        {posts.length > 0 ? (
                            <div className="grid gap-x-12 gap-y-16 sm:grid-cols-2">
                                {posts.map((post: any) => (
                                    <PostCard key={post.slug} post={post} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-24 text-center">
                                <Text className="text-gray-400 text-lg font-light">Hasn&apos;t published any stories yet.</Text>
                            </div>
                        )}
                    </div>
                </Container>
            </main>
            <Footer />
        </div>
    );
}
