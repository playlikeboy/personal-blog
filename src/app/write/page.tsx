"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Container } from "@/components/ui/container";
import { createPost } from "@/app/actions";
import { cn } from "@/lib/utils";

export default function WritePage() {
    const [content, setContent] = useState("");
    const [mode, setMode] = useState<"edit" | "preview">("edit");
    const [isPublishing, setIsPublishing] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            <Container className="py-8">
                <form action={createPost} onSubmit={() => setIsPublishing(true)}>
                    <div className="mb-8 flex items-center justify-between">
                        <h1 className="text-3xl font-bold">New Story</h1>
                        <div className="flex items-center gap-2">
                            <div className="flex bg-gray-100 rounded-lg p-1 mr-4">
                                <button
                                    type="button"
                                    onClick={() => setMode("edit")}
                                    className={cn("px-3 py-1.5 text-sm font-medium rounded-md transition-all", mode === "edit" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-black")}
                                >
                                    Write
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode("preview")}
                                    className={cn("px-3 py-1.5 text-sm font-medium rounded-md transition-all", mode === "preview" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-black")}
                                >
                                    Preview
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={isPublishing}
                                className="inline-flex items-center justify-center rounded-full bg-black px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                            >
                                {isPublishing ? "Publishing..." : "Publish"}
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
                        <div className="space-y-6">
                            {/* Metadata Inputs */}
                            <div className="space-y-4">
                                <input
                                    name="title"
                                    placeholder="Title"
                                    className="w-full text-4xl font-bold border-none bg-transparent px-0 placeholder:text-gray-300 focus:ring-0 outline-none"
                                    required
                                />
                                <textarea
                                    name="excerpt"
                                    placeholder="Sub-title / Short description..."
                                    required
                                    className="w-full text-xl text-gray-500 border-none bg-transparent px-0 placeholder:text-gray-300 focus:ring-0 resize-none outline-none"
                                    rows={2}
                                />
                            </div>

                            {/* Editor / Preview Area */}
                            <div className="min-h-[500px]">
                                {mode === "edit" ? (
                                    <textarea
                                        name="content"
                                        placeholder="Tell your story..."
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="w-full h-full min-h-[500px] text-lg leading-relaxed border-none bg-transparent px-0 focus:ring-0 resize-none outline-none"
                                        required
                                    />
                                ) : (
                                    <div className="prose prose-lg dark:prose-invert max-w-none">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {content || "*Nothing to preview*"}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar settings */}
                        <div className="space-y-6 lg:pl-8 lg:border-l border-gray-100">
                            <div className="space-y-4">
                                <p className="font-medium text-gray-500 uppercase text-xs tracking-wider">Publishing Details</p>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Cover Image URL</label>
                                    <input
                                        name="coverImage"
                                        placeholder="https://..."
                                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Tags</label>
                                    <input
                                        name="tags"
                                        placeholder="Design, Tech, Life (comma separated)"
                                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                                    />
                                </div>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                                <p className="mb-2"><strong>Writing Tips:</strong></p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Use standard Markdown.</li>
                                    <li>Keep titles short and punchy.</li>
                                    <li>Add a cover image for better engagement.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </form>
            </Container>
        </div>
    );
}
