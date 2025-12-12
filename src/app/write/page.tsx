"use client";

import { Container } from "@/components/ui/container";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PlateEditor } from "@/components/editor/plate-editor";
import { Button, Input } from "rizzui";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function WritePage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState<unknown>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!title || !content) return;

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
            <Header />
            <main className="flex-1 py-12 md:py-20">
                <Container className="max-w-4xl">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight mb-2">Editor</h1>
                            <p className="text-muted-foreground">Create your story using the block editor.</p>
                        </div>
                        <Button
                            onClick={handleSave}
                            isLoading={isSaving}
                            disabled={!title || !content}
                        >
                            Publish Story
                        </Button>
                    </div>

                    <div className="space-y-6">
                        <Input
                            placeholder="Enter your title..."
                            size="lg"
                            variant="outline"
                            className="[&_input]:text-4xl [&_input]:font-bold [&_input]:bg-transparent [&_input]:border-none [&_input]:p-0 [&_input]:placeholder:text-muted-foreground/50"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <div className="border rounded-xl min-h-[500px] bg-background shadow-sm">
                            {/* <PlateEditor 
                                initialValue={content}
                                onChange={setContent}
                            /> */}
                            <div className="border p-4">Editor Temporarily Disabled for Debugging</div>
                        </div>
                    </div>
                </Container>
            </main>
            <Footer />
        </div>
    );
}
