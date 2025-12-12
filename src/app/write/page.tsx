"use client";

import { Container } from "@/components/ui/container";
import { PlateEditor } from "@/components/editor/plate-editor";
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
    const [content, setContent] = useState<Value | undefined>(undefined);
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
            <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm">
                <Container className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowLeftIcon className="h-5 w-5" />
                        </Link>
                        <span className="text-sm text-muted-foreground">Draft in <span className="text-foreground font-medium">Shaswat&apos;s Blog</span></span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            size="sm"
                            className="rounded-full px-4"
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

            <main className="flex-1 py-10">
                <Container className="max-w-3xl">
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Title"
                            className="w-full bg-transparent text-4xl md:text-5xl font-bold placeholder:text-muted-foreground/40 border-none focus:ring-0 p-0"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            autoFocus
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
