"use client";

import { Container } from "@/components/ui/container";
import { Title, Text } from "rizzui";

export function AboutContent() {
    return (
        <main className="flex-1 py-24 md:py-32">
            <Container className="max-w-3xl space-y-16">
                <header className="space-y-6 text-center">
                    <Title as="h1" className="text-5xl md:text-7xl font-serif font-medium tracking-tight leading-none">
                        Our Vision
                    </Title>
                    <Text className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed max-w-2xl mx-auto">
                        A place for your stories, stripped of the noise.
                    </Text>
                </header>

                <div className="space-y-12 text-lg leading-loose text-gray-700 font-sans">
                    <section>
                        <Title as="h2" className="text-2xl font-serif font-medium mb-4">Why Unstory?</Title>
                        <p>
                            Unstory.live is a story-first writing platform designed to help people express their experiences, ideas, emotions, creative writing (poems, shayri, stories, articles, blogs, etc.) and memories freely.
                        </p>
                        <p className="mt-4">
                            Unlike traditional blogging websites, we focus on emotional expression, personal storytelling, and minimal distraction. We believe that the environment shapes the art. Our platform is designed with "Calm Design" principles—soft colors, generous whitespace, and minimal distractions—so you can enter a flow state and write from the heart.
                        </p>
                    </section>

                    <section>
                        <Title as="h2" className="text-2xl font-serif font-medium mb-4">Our Vision</Title>
                        <ul className="list-disc pl-5 space-y-2 marker:text-gray-300">
                            <li><strong>Emotional expression</strong> over technical writing.</li>
                            <li><strong>Flow-state writing</strong> environment.</li>
                            <li><strong>Reader immersion</strong> with calm design.</li>
                            <li><strong>Community</strong> based on appreciation, not vanity metrics.</li>
                        </ul>
                    </section>

                    <section className="pt-8 border-t border-gray-100">
                        <p className="italic text-gray-500 text-center text-base">
                            "Write your story. Share your voice."
                        </p>
                    </section>
                </div>
            </Container>
        </main >
    );
}
