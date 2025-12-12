"use client";

import { useStackApp, useUser } from "@stackframe/stack";
import { Container } from "@/components/ui/container";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Title, Text, Button } from "rizzui";
import Link from "next/link";
import NextImage from "next/image";
import {
    UserCircleIcon,
    DocumentTextIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";

export function DashboardView() {
    const user = useUser();
    const app = useStackApp();

    if (!user) return null;

    return (
        <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
            <Header />
            <main className="flex-1 py-20">
                <Container className="max-w-4xl">
                    <div className="mb-16 border-b border-border pb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <Title as="h1" className="text-4xl font-bold tracking-tight mb-2">Dashboard</Title>
                            <Text className="text-muted-foreground">You haven&apos;t published any stories yet.</Text>
                        </div>
                        <Button
                            variant="outline"
                            className="w-fit"
                            onClick={() => app.signOut()}
                        >
                            <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4" />
                            Sign Out
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-12 gap-12">
                        {/* Sidebar / User Info */}
                        <div className="md:col-span-4 space-y-8">
                            <div className="p-6 border border-border bg-muted/30">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-10 w-10 relative overflow-hidden rounded-full bg-muted">
                                        {user.profileImageUrl ? (
                                            <NextImage
                                                src={user.profileImageUrl}
                                                alt={user.displayName || "User"}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <UserCircleIcon className="h-full w-full text-muted-foreground p-2" />
                                        )}
                                    </div>
                                    <div className="overflow-hidden">
                                        <div className="font-semibold truncate">{user.displayName || "User"}</div>
                                        <div className="text-xs text-muted-foreground truncate">{user.primaryEmail}</div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium bg-foreground text-background">
                                        <UserCircleIcon className="w-4 h-4" />
                                        Overview
                                    </Link>
                                    <Link href="/dashboard/stories" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                        <DocumentTextIcon className="w-4 h-4" />
                                        My Stories
                                    </Link>
                                    <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                        <Cog6ToothIcon className="w-4 h-4" />
                                        Settings
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="md:col-span-8 space-y-12">
                            <section>
                                <Title as="h2" className="text-xl font-semibold mb-6 flex items-center justify-between">
                                    <span>Recent Activity</span>
                                </Title>
                                <div className="border border-border p-8 text-center text-muted-foreground">
                                    <p>You haven&apos;t written any stories yet.</p>
                                    <Link href="/write" className="md:hidden mt-4 inline-block text-foreground underline underline-offset-4 text-sm">
                                        Write your first story
                                    </Link>
                                    <Link href="/write" className="hidden md:inline-block mt-4">
                                        <Button variant="outline" className="mt-2">Start Writing</Button>
                                    </Link>
                                </div>
                            </section>

                            <section>
                                <Title as="h2" className="text-xl font-semibold mb-6">
                                    <span>Stats</span>
                                </Title>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="p-6 border border-border">
                                        <div className="text-3xl font-bold mb-1">0</div>
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Stories</div>
                                    </div>
                                    <div className="p-6 border border-border">
                                        <div className="text-3xl font-bold mb-1">0</div>
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Views</div>
                                    </div>
                                    <div className="p-6 border border-border">
                                        <div className="text-3xl font-bold mb-1">0</div>
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Likes</div>
                                    </div>
                                    <div className="p-6 border border-border">
                                        <div className="text-3xl font-bold mb-1">0</div>
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Comments</div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </Container>
            </main>
            <Footer />
        </div>
    );
}
