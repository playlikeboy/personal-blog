"use client";

import { Modal } from "@/components/ui/modal";
import { useState } from "react";
import { Button, Input, Textarea, Text } from "rizzui";

interface PublishModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: PublishData) => Promise<void>;
}

export interface PublishData {
    excerpt: string;
    tags: string[];
    coverImage: string;
}

export function PublishModal({ isOpen, onClose, onConfirm }: PublishModalProps) {
    const [excerpt, setExcerpt] = useState("");
    const [tagsInput, setTagsInput] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
            await onConfirm({ excerpt, tags, coverImage });
            onClose();
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Publish Story">
            <div className="space-y-6 mt-2">
                <div>
                    <Text className="mb-1.5 font-medium">Preview Image</Text>
                    <Input
                        placeholder="https://..."
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                    />
                    <Text className="text-xs text-muted-foreground mt-1">Paste a URL for your cover image.</Text>
                </div>

                <div>
                    <Text className="mb-1.5 font-medium">Subtitle / Excerpt</Text>
                    <Textarea
                        placeholder="Write a short summary..."
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        className="min-h-[100px]"
                    />
                </div>

                <div>
                    <Text className="mb-1.5 font-medium">Topics</Text>
                    <Input
                        placeholder="Design, Tech, Life..."
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                    />
                    <Text className="text-xs text-muted-foreground mt-1">Separate tags with commas.</Text>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                    <Button onClick={handleSubmit} isLoading={isSubmitting}>Publish Now</Button>
                </div>
            </div>
        </Modal>
    );
}
