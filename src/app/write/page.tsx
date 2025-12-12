"use client";

import { Container } from "@/components/ui/container";
import { PlateEditor, defaultValue } from "@/components/editor/plate-editor";
import { Button } from "rizzui";
import { useState } from "react";
import type { Value } from 'platejs';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserMenu } from "@/components/layout/user-menu";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export const dynamic = "force-dynamic";

export default function WritePage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState<Value>(defaultValue);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!title) return;

        setIsSaving(true);
        try {
            const res = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    content,
                }),
            });

            if (res.ok) {
                const post = await res.json() as { slug: string };
                router.push(`/posts/${post.slug}`);
            } else {
                console.error("Failed to save post");
            }
        } catch (error) {
            console.error("Error saving post:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-background font-sans">
            {/* Minimal Header */}
            <header className="sticky top-0 z-50 w-full bg-background/50 backdrop-blur-md border-b border-gray-100/50">
                <Container className="flex h-14 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="group flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeftIcon className="h-4 w-4 text-gray-500 group-hover:text-foreground transition-colors" />
                        </Link>
                        <span className="text-sm text-gray-400">Draft in <span className="text-foreground font-medium">Shaswat&apos;s Blog</span></span>
                    </div>

                    <div className="flex items-center gap-3">
                        <p className="text-xs text-gray-400 hidden sm:block mr-2">
                            {isSaving ? "Saving..." : "Saved"}
                        </p>
                        <Button
                            size="sm"
                            className="rounded-full px-5 font-medium"
                            onClick={handleSave}
                            isLoading={isSaving}
                            disabled={!title}
                        >
                            Publish
                        </Button>
                        <UserMenu />
                    </div>
                </Container>
            </header>

            <main className="flex-1 py-12 md:py-20 lg:py-24">
                <Container className="max-w-3xl">
                    <div className="space-y-8">
                        <input
                            type="text"
                            placeholder="Title..."
                            className="w-full border-0 bg-transparent text-4xl md:text-5xl font-bold placeholder:text-gray-300 border-none   p-0  "
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <div className="min-h-[500px]">
                            <PlateEditor
                                initialValue={content}
                                onChange={setContent}
                            />
                        </div>
                    </div>
                </Container>
            </main>
        </div>
    );
}
