import { Container } from "@/components/ui/container";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function AboutPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background font-sans">
            <Header />
            <main className="flex-1 py-12 md:py-20">
                <Container className="max-w-2xl">
                    <h1 className="text-4xl font-bold tracking-tight mb-6">About Minimal.</h1>
                    <div className="prose prose-lg dark:prose-invert">
                        <p className="text-xl text-gray-500 mb-8 leading-relaxed">
                            We believe in the power of words. In a digital world cluttered with ads, pop-ups, and algorithms, we want to bring focus back to what matters: the story.
                        </p>

                        <h3 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h3>
                        <p>
                            To create the cleanest, fastest, and most distraction-free publishing platform for writers and readers alike. No paywalls (yet), no trackers, just pure content.
                        </p>

                        <h3 className="text-2xl font-semibold mt-8 mb-4">The Stack</h3>
                        <p>
                            Built with Next.js 15, Tailwind CSS v4, and a lot of love. This platform is open source and designed to be community-driven.
                        </p>
                    </div>
                </Container>
            </main>
            <Footer />
        </div>
    );
}
