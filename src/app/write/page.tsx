"use client";

import { Container } from "@/components/ui/container";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PlateEditor } from "@/components/editor/plate-editor";

export default function WritePage() {
    return (
        <div className="flex min-h-screen flex-col bg-background font-sans">
            <Header />
            <main className="flex-1 py-12 md:py-20">
                <Container className="max-w-4xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Editor</h1>
                        <p className="text-gray-500">Create your story using the block editor.</p>
                    </div>

                    <div className="border rounded-xl min-h-[500px] p-4 bg-white shadow-sm">
                        <PlateEditor />
                    </div>
                </Container>
            </main>
            <Footer />
        </div>
    );
}
