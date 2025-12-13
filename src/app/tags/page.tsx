'use client';

import { Container } from "@/components/ui/container";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { Title, Text, Loader } from "rizzui";
import { useEffect, useState } from "react";

export default function TagsPage() {
    const [tags, setTags] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/tags')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setTags(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="flex min-h-screen flex-col bg-background font-sans">
            <Header />
            <main className="flex-1 py-12 md:py-20">
                <Container>
                    <div className="mb-12 text-center max-w-2xl mx-auto">
                        <Title as="h1" className="text-4xl font-serif font-medium mb-4">Explore Topics</Title>
                        <Text className="text-lg text-muted-foreground font-light">
                            Discover stories by category and interest.
                        </Text>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader variant="spinner" size="lg" />
                        </div>
                    ) : tags.length > 0 ? (
                        <div className="flex flex-wrap gap-4 justify-center">
                            {tags.map((tag) => (
                                <Link
                                    key={tag.id}
                                    href={`/tags/${encodeURIComponent(tag.name)}`}
                                    className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary/50 hover:bg-secondary transition-colors duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                                >
                                    <span className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">#{tag.name}</span>
                                    <span className="bg-background px-2 py-0.5 rounded-full text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                                        {tag.posts.length}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 text-center">
                            <Text className="text-gray-400 text-lg font-light">No tags found.</Text>
                        </div>
                    )}
                </Container>
            </main>
            <Footer />
        </div>
    );
}
