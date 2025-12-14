"use client";

import { useState, useEffect, useRef } from "react";
import { Input, Loader, Badge } from "rizzui";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { searchTags, TagResult } from "@/app/actions/tags";


export interface TagInputProps {
    value: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
}

export function TagInput({ value, onChange, placeholder = "Add a topic..." }: TagInputProps) {
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState<TagResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Simple debounce using timeout since use-debounce might not be installed
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (inputValue.trim().length > 0) {
                setIsLoading(true);
                try {
                    const results = await searchTags(inputValue);
                    // Filter out already selected tags
                    const filtered = results.filter(r => !value.includes(r.name));
                    setSuggestions(filtered);
                    setShowSuggestions(true);
                } catch (e) {
                    console.error(e);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [inputValue, value]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
            removeTag(value[value.length - 1]);
        }
    };

    const addTag = (name: string) => {
        const trimmed = name.trim();
        if (trimmed && !value.includes(trimmed)) {
            onChange([...value, trimmed]);
        }
        setInputValue("");
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const removeTag = (name: string) => {
        onChange(value.filter(t => t !== name));
    };

    const wrapperRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={wrapperRef}>
            <div className="flex flex-wrap gap-2 p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 focus-within:ring-2 ring-primary/20 transition-all min-h-[42px]">
                {value.map((tag) => (
                    <Badge
                        key={tag}
                        variant="flat"
                        size="md"
                        className="pr-1 gap-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-0"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5 transition-colors"
                        >
                            <XMarkIcon className="w-3 h-3" />
                        </button>
                    </Badge>
                ))}

                <input
                    type="text"
                    className="flex-1 bg-transparent border-none outline-none text-sm min-w-[120px] placeholder:text-gray-400 p-1"
                    placeholder={value.length === 0 ? placeholder : ""}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => inputValue && setShowSuggestions(true)}
                />
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && (inputValue.length > 0) && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {isLoading ? (
                        <div className="p-3 text-center">
                            <Loader size="sm" />
                        </div>
                    ) : (
                        <>
                            {suggestions.map((suggestion) => (
                                <button
                                    key={suggestion.id}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-zinc-800 flex justify-between items-center"
                                    onClick={() => addTag(suggestion.name)}
                                >
                                    <span>{suggestion.name}</span>
                                    <span className="text-xs text-gray-400">{suggestion.count} posts</span>
                                </button>
                            ))}
                            <button
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-zinc-800 text-primary border-t border-gray-50 dark:border-zinc-800"
                                onClick={() => addTag(inputValue)}
                            >
                                <span className="font-medium">Create "{inputValue}"</span>
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
