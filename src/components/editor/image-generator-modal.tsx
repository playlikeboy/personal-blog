"use client";

import { Modal } from "@/components/ui/modal";
import { useState, useEffect } from "react";
import { Button, Input, Textarea, Checkbox, Text, Select, Loader } from "rizzui";
import Image from "next/image"; // While we can use this, we might want a raw img for external URLs initially until trusted
import { ArrowPathIcon, SparklesIcon } from "@heroicons/react/24/outline";

interface ImageGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectImage: (url: string) => void;
    initialTitle?: string;
    initialContext?: string; // Plain text from content
    initialTags?: string[];
}

const MODELS = [
    { label: "Flux (Default)", value: "flux" },
    { label: "Turbo", value: "turbo" },
];

export function ImageGeneratorModal({ isOpen, onClose, onSelectImage, initialTitle = "", initialContext = "", initialTags = [] }: ImageGeneratorModalProps) {
    const [prompt, setPrompt] = useState("");
    const [seed, setSeed] = useState(12);
    const [width, setWidth] = useState(576);
    const [height, setHeight] = useState(1024);
    const [enhance, setEnhance] = useState(true);
    const [nologo, setNologo] = useState(true);
    const [model, setModel] = useState("flux");

    const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Hydrate template on open
    useEffect(() => {
        if (isOpen) {
            const categories = initialTags.length > 0 ? initialTags.join(", ") : "abstract themes";
            const truncatedContent = initialContext.slice(0, 100) + (initialContext.length > 100 ? "..." : "");

            // Construct default prompt
            const defaultPrompt = `create a poster for poem <title>${initialTitle}</title> with {${categories}} and <content>\n${truncatedContent}\n</content>`;
            setPrompt(defaultPrompt);
            // Randomize seed initially for fun
            setSeed(Math.floor(Math.random() * 1000));
        }
    }, [isOpen, initialTitle, initialContext, initialTags]);

    const handleGenerate = () => {
        setIsLoading(true);
        // Construct URL
        // New Format: https://image.pollinations.ai/prompt/{prompt}?params...
        const encodedPrompt = encodeURIComponent(prompt);
        const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&model=${model}&nologo=${nologo}&enhance=${enhance}`;

        // Pre-fetch to validate (optional, but ensures it loads)
        const img = new window.Image();
        img.src = url;
        img.onload = () => {
            setGeneratedUrl(url);
            setIsLoading(false);
        };
        img.onerror = () => {
            // Even if it fails to load immediately, sometimes it's just slow. 
            // But usually this means error.
            console.error("Image load failed");
            setIsLoading(false);
            // check if its a 404 or just slow? 
            // For now, let's set it anyway so user can see broken image if it really is broken, 
            // or maybe it loads eventually.
            // Actually, let's keep the error behavior but maybe softer?
            // "Failed to generate image. Please try again."
            alert("Failed to load image preview. It might still work if you use it.");
            setGeneratedUrl(url);
        };
    };

    const handleUseImage = () => {
        if (generatedUrl) {
            onSelectImage(generatedUrl);
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="AI Image Generator" className="max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Left: Controls */}
                <div className="space-y-4">
                    <div>
                        <Text className="font-medium mb-1">Prompt</Text>
                        <Textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={6}
                            placeholder="Describe your image..."
                            className="font-mono text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Width"
                            type="number"
                            value={width}
                            onChange={(e) => setWidth(Number(e.target.value))}
                        />
                        <Input
                            label="Height"
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(Number(e.target.value))}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Seed"
                            type="number"
                            value={seed}
                            onChange={(e) => setSeed(Number(e.target.value))}
                        />
                        <div className="space-y-1">
                            <Text className="font-medium text-sm mb-1">Model</Text>
                            <Select
                                options={MODELS}
                                value={MODELS.find(m => m.value === model)}
                                onChange={(opt: any) => setModel(opt.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                        <Checkbox
                            label="Enhance"
                            checked={enhance}
                            onChange={(e) => setEnhance(e.target.checked)}
                        />
                        <Checkbox
                            label="No Logo"
                            checked={nologo}
                            onChange={(e) => setNologo(e.target.checked)}
                        />
                    </div>

                    <Button
                        size="lg"
                        className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                        onClick={handleGenerate}
                        isLoading={isLoading}
                    >
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        Imagine
                    </Button>
                </div>

                {/* Right: Preview */}
                <div className="border rounded-xl bg-gray-50 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
                    {generatedUrl ? (
                        <div className="relative w-full h-full flex flex-col">
                            <div className="relative flex-1 bg-black/5">
                                {/* Use standard img for external blob/url to avoid Next.js domain config issues for arbitrary unknown domains if possible, 
                                     though Pollinations is consistent. Safe to use img tag for dynamic external content. */}
                                <img
                                    src={generatedUrl}
                                    alt="Generated Preview"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="p-4 bg-white border-t flex justify-between items-center">
                                <Text className="text-xs text-gray-500">Image generation by Pollinations AI</Text>
                                <Button onClick={handleUseImage}>Use This Image</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 p-8">
                            <SparklesIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <Text>Enter parameters and click Imagine<br />to generate a cover.</Text>
                        </div>
                    )}

                    {isLoading && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 backdrop-blur-sm">
                            <div className="text-center">
                                <Loader variant="spinner" size="lg" className="mx-auto mb-4 text-purple-600" />
                                <Text className="text-purple-900 font-medium animate-pulse">Dreaming...</Text>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}

