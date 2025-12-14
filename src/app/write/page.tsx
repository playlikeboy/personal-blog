"use client";

import { Container } from "@/components/ui/container";
import { PlateEditor, defaultValue } from "@/components/editor/plate-editor";
import { Button } from "rizzui";
import { useState, useEffect } from "react";
import type { Value } from 'platejs';
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { UserMenu } from "@/components/layout/user-menu";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PublishModal, PublishData } from "@/components/editor/publish-modal";

export const dynamic = "force-dynamic";

export default function WritePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editSlug = searchParams.get("slug");

    const [title, setTitle] = useState("");
    const [content, setContent] = useState<Value>(defaultValue);
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(!!editSlug);

    // Initial Data for Edit Mode
    const [initialData, setInitialData] = useState<Partial<PublishData> | null>(null);

    // Load from LocalStorage if not editing
    useEffect(() => {
        if (!editSlug) {
            const savedTitle = localStorage.getItem("draft-title");
            const savedContent = localStorage.getItem("draft-content");
            if (savedTitle) setTitle(savedTitle);
            if (savedContent) {
                try {
                    setContent(JSON.parse(savedContent));
                } catch (e) { console.error(e); }
            }
        }
    }, [editSlug]);

    // Save to LocalStorage
    useEffect(() => {
        if (!editSlug) {
            const timeout = setTimeout(() => {
                localStorage.setItem("draft-title", title);
                localStorage.setItem("draft-content", JSON.stringify(content));
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [title, content, editSlug]);

    useEffect(() => {
        if (editSlug) {
            fetch(`/api/posts/${editSlug}`)
                .then(res => {
                    if (!res.ok) throw new Error("Failed to load post");
                    return res.json();
                })
                .then(responseData => {
                    const data = responseData as { title: string; content?: any; excerpt?: string; tags?: { tag: { name: string } }[]; coverImage?: string };
                    setTitle(data.title);
                    if (data.content) {
                        try {
                            const parsed = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
                            setContent(parsed);
                        } catch (e) {
                            console.error("Failed to parse content", e);
                        }
                    }
                    setInitialData({
                        excerpt: data.excerpt,
                        tags: data.tags?.map((t: any) => t.tag.name) || [],
                        coverImage: data.coverImage
                    });
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setIsLoading(false);
                });
        }
    }, [editSlug]);

    const handlePublish = async (data: PublishData) => {
        setIsSaving(true);
        try {
            const url = editSlug ? `/api/posts/${editSlug}` : "/api/posts";
            const method = editSlug ? "PUT" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    content,
                    ...data
                }),
            });

            if (res.ok) {
                // Clear draft
                if (!editSlug) {
                    localStorage.removeItem("draft-title");
                    localStorage.removeItem("draft-content");
                }
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

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading editor...</div>;
    }

    return (
        <div className="flex min-h-screen flex-col bg-background font-sans">
            <header className="sticky top-0 z-50 w-full bg-background/50 backdrop-blur-md border-b border-gray-100/50">
                <Container className="flex h-14 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="group flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeftIcon className="h-4 w-4 text-gray-500 group-hover:text-foreground transition-colors" />
                        </Link>
                        <span className="text-sm text-gray-400">
                            {editSlug ? "Editing" : "Draft"} in <span className="text-foreground font-medium">Shaswat&apos;s Blog</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <p className="text-xs text-gray-400 hidden sm:block mr-2">
                            {isSaving ? (editSlug ? "Updating..." : "Publishing...") : "Saved"}
                        </p>
                        <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full px-5 font-medium hidden sm:inline-flex"
                            onClick={() => handlePublish({ published: false, tags: [], excerpt: "", coverImage: "" } as any)} // Minimal data for draft
                            isLoading={isSaving}
                            disabled={!title}
                        >
                            Save Draft
                        </Button>
                        <Button
                            size="sm"
                            className="rounded-full px-5 font-medium"
                            onClick={() => setIsModalOpen(true)}
                            isLoading={isSaving}
                            disabled={!title}
                        >
                            {editSlug ? "Update" : "Publish"}
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
                            className="w-full border-0 bg-transparent text-4xl md:text-5xl font-bold placeholder:text-gray-300 border-none p-0 outline-none focus:ring-0"
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

            <PublishModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handlePublish}
                postTitle={title}
                postContext={extractTextFromValue(content)}
                initialTags={initialData?.tags}
            // TODO: Wire up initial data to modal default values if needed
            />
        </div>
    );
}

function extractTextFromValue(value: any[]): string {
    if (!Array.isArray(value)) return "";
    return value.map(node => {
        if (node.text) return node.text;
        if (node.children) return extractTextFromValue(node.children);
        return "";
    }).join("\n");
}
