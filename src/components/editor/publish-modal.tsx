"use client";

import { Modal } from "@/components/ui/modal";
import { useState, useEffect } from "react";
import { Button, Input, Textarea, Text } from "rizzui";
import { ImageGeneratorModal } from "./image-generator-modal";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { TagInput } from "@/components/ui/tag-input";
import { generateSummary } from "@/lib/ai-client";

interface PublishModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: PublishData) => Promise<void>;
    postTitle?: string;
    postContext?: string; // Plain text snippet
    initialTags?: string[];
}

export interface PublishData {
    excerpt: string;
    tags: string[];
    coverImage: string;
    published?: boolean;
}

export function PublishModal({ isOpen, onClose, onConfirm, postTitle, postContext, initialTags }: PublishModalProps) {
    const [excerpt, setExcerpt] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

    // AI Modal State
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);

    // Tags State
    const [tagsInput, setTagsInput] = useState<string[]>([]);

    // Hydrate initial tags if provided
    useEffect(() => {
        if (isOpen && initialTags) {
            setTagsInput(initialTags);
        }
    }, [isOpen, initialTags]);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await onConfirm({ excerpt, tags: tagsInput, coverImage });
            onClose();
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGenerateSummary = async () => {
        if (!postContext) return;
        setIsGeneratingSummary(true);
        try {
            const summary = await generateSummary(postContext);
            setExcerpt(summary);
        } catch (e) {
            console.error(e);
            // Optional: Add toast error here
        } finally {
            setIsGeneratingSummary(false);
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title="Publish Story">
                <div className="space-y-6 mt-2">
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <Text className="font-medium">Preview Image</Text>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-xs gap-1.5 text-purple-700 border-purple-200 hover:bg-purple-50"
                                onClick={() => setIsAiModalOpen(true)}
                            >
                                <SparklesIcon className="w-3.5 h-3.5" />
                                Generate with AI
                            </Button>
                        </div>
                        <Input
                            placeholder="https://..."
                            value={coverImage}
                            onChange={(e) => setCoverImage(e.target.value)}
                        />
                        <Text className="text-xs text-muted-foreground mt-1">Paste a URL or generate one.</Text>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <Text className="font-medium">Subtitle / Excerpt</Text>
                            {postContext && (
                                <Button
                                    variant="text"
                                    size="sm"
                                    className="h-6 px-2 text-xs gap-1.5 text-blue-600 hover:bg-blue-50"
                                    onClick={handleGenerateSummary}
                                    isLoading={isGeneratingSummary}
                                    disabled={!postContext}
                                >
                                    <SparklesIcon className="w-3.5 h-3.5" />
                                    Auto-Summarize
                                </Button>
                            )}
                        </div>
                        <Textarea
                            placeholder="Write a short summary..."
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>

                    <div>
                        <Text className="mb-1.5 font-medium">Topics</Text>
                        <TagInput
                            value={tagsInput}
                            onChange={(tags) => setTagsInput(tags)}
                            placeholder="Add topics (e.g. Story, Poem)"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                        <Button onClick={handleSubmit} isLoading={isSubmitting}>Publish Now</Button>
                    </div>
                </div>
            </Modal>

            <ImageGeneratorModal
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
                onSelectImage={(url) => setCoverImage(url)}
                initialTitle={postTitle}
                initialContext={postContext}
                initialTags={tagsInput}
            />
        </>
    );
}

