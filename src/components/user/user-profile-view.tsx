"use client";

import { Container } from "@/components/ui/container";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PostCard } from "@/components/blog/post-card";
import { Title, Text, Loader, Button, ActionIcon, Tooltip } from "rizzui";
import Image from "next/image";
import { User, Post } from "@/db/types";
import { useEffect, useState, useTransition } from "react";
import { toggleFollow, getFollowStatus, getFollowerStats } from "@/app/actions/user";
import { ArrowUpTrayIcon, CheckIcon, UserPlusIcon, UserMinusIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { FollowsModal } from "./follows-modal";
import { getFollowers, getFollowing } from "@/app/actions/user";

interface UserProfileViewProps {
    username: string;
}

export function UserProfileView({ username }: UserProfileViewProps) {
    const [data, setData] = useState<{ user: User; posts: Post[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Follow State
    const [isFollowing, setIsFollowing] = useState(false);
    const [isSelf, setIsSelf] = useState(false);
    const [stats, setStats] = useState<{ followers: number; following: number; hidden: boolean } | null>(null);
    const [isPending, startTransition] = useTransition();

    // Modal State
    const [activeModal, setActiveModal] = useState<'followers' | 'following' | null>(null);
    const [modalData, setModalData] = useState<User[]>([]);
    const [modalLoading, setModalLoading] = useState(false);

    useEffect(() => {
        if (!username) return;

        // Fetch User Data
        fetch(`/api/u/${username}`)
            .then(res => {
                if (!res.ok) throw new Error("Failed");
                return res.json();
            })
            .then(userData => {
                setData(userData as { user: User; posts: Post[] });
                setLoading(false);

                // If user loaded, fetch follow status & stats
                if ((userData as any)?.user?.id) {
                    getFollowStatus((userData as any).user.id).then(status => {
                        setIsFollowing(status.isFollowing);
                        setIsSelf(status.isSelf);
                    });

                    getFollowerStats((userData as any).user.id).then(setStats);
                }
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, [username]);

    const handleFollow = () => {
        if (!data?.user?.id || isSelf) return;

        startTransition(async () => {
            // Optimistic update
            const prev = isFollowing;
            setIsFollowing(!prev);

            if (stats && !stats.hidden) {
                setStats(prevStats => prevStats ? ({
                    ...prevStats,
                    followers: prev ? prevStats.followers - 1 : prevStats.followers + 1
                }) : null);
            }

            try {
                const result = await toggleFollow(data.user.id);
                setIsFollowing(result.isFollowing);
            } catch (error) {
                // Revert
                setIsFollowing(prev);
                alert("Failed to update follow status. Please sign in.");
            }
        });
    };

    const handleShare = async () => {
        const shareData = {
            title: `${data?.user?.name || username} on Unstory`,
            text: `Check out ${data?.user?.name}'s profile on Unstory.`,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log("Share cancelled");
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                alert("Profile link copied to clipboard!");
            } catch (err) {
                console.error("Failed to copy", err);
            }
        }
    };

    const handleOpenModal = (type: 'followers' | 'following') => {
        if (!data?.user?.id) return;

        setActiveModal(type);
        setModalLoading(true);
        setModalData([]);

        const fetchFn = type === 'followers' ? getFollowers : getFollowing;

        fetchFn(data.user.id)
            .then((users) => {
                setModalData(users as User[]); // Cast to User[] as actions return correct shape
                setModalLoading(false);
            })
            .catch(() => {
                setModalLoading(false);
            });
    };

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
                <Container className="max-w-4xl mt-8">
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

                        <div className="space-y-4 max-w-lg w-full">
                            <Title as="h1" className="text-4xl md:text-5xl font-serif font-medium text-foreground">
                                {user.name}
                            </Title>
                            <div className="text-muted-foreground">@{user.username}</div>

                            {/* Stats */}
                            {stats && !stats.hidden && (
                                <div className="flex justify-center gap-6 text-sm">
                                    <button
                                        onClick={() => handleOpenModal('followers')}
                                        className="flex flex-col hover:opacity-70 transition-opacity cursor-pointer text-center"
                                    >
                                        <span className="font-bold text-foreground text-lg">{stats.followers}</span>
                                        <span className="text-muted-foreground text-xs uppercase tracking-wide">Followers</span>
                                    </button>
                                    <button
                                        onClick={() => handleOpenModal('following')}
                                        className="flex flex-col hover:opacity-70 transition-opacity cursor-pointer text-center"
                                    >
                                        <span className="font-bold text-foreground text-lg">{stats.following}</span>
                                        <span className="text-muted-foreground text-xs uppercase tracking-wide">Following</span>
                                    </button>
                                </div>
                            )}

                            {user.bio && (
                                <Text className="text-lg text-muted-foreground font-light leading-relaxed">
                                    {user.bio}
                                </Text>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-center gap-3 pt-4">
                                {!isSelf && (
                                    <Button
                                        variant={isFollowing ? "outline" : "solid"}
                                        className={cn("px-6 rounded-full", isFollowing ? "border-gray-200" : "")}
                                        onClick={handleFollow}
                                        isLoading={isPending}
                                    >
                                        {isFollowing ? (
                                            <>
                                                <UserMinusIcon className="w-4 h-4 mr-2" />
                                                Following
                                            </>
                                        ) : (
                                            <>
                                                <UserPlusIcon className="w-4 h-4 mr-2" />
                                                Follow
                                            </>
                                        )}
                                    </Button>
                                )}

                                <Tooltip content="Share Profile" placement="top">
                                    <ActionIcon
                                        variant="outline"
                                        className="border-gray-200 rounded-full"
                                        onClick={handleShare}
                                    >
                                        <ArrowUpTrayIcon className="w-5 h-5" />
                                    </ActionIcon>
                                </Tooltip>
                            </div>

                            <div className="inline-flex items-center gap-4 text-sm text-gray-400 font-medium pt-4">
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
            <Footer />

            <FollowsModal
                isOpen={!!activeModal}
                onClose={() => setActiveModal(null)}
                title={activeModal || ""}
                users={modalData}
                loading={modalLoading}
            />
        </div>
    );
}
