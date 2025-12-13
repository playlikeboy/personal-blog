import { Container } from "@/components/ui/container";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Title, Text } from "rizzui";

export const metadata = {
    title: "About Unstory",
};

export default function AboutPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background font-sans">
            <Header />
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
                                The internet has become loud. Algorithms dictate what we see, and vanity metrics dictate what we write.
                                <strong>Unstory.live</strong> was born from a desire to return to the essence of blogging: human connection through storytelling.
                            </p>
                        </section>

                        <section>
                            <Title as="h2" className="text-2xl font-serif font-medium mb-4">Calm Design</Title>
                            <p>
                                We believe that the environment shapes the art. Our platform is designed with "Calm Design" principles—soft colors, generous whitespace, and minimal distractions—so you can enter a flow state and write from the heart.
                            </p>
                        </section>

                        <section>
                            <Title as="h2" className="text-2xl font-serif font-medium mb-4">Community, Not Crowds</Title>
                            <p>
                                We value depth over breadth. View counts are private. There are no public "likes" to chase.
                                Instead, we foster a community where appreciation is genuine and feedback is meaningful.
                            </p>
                        </section>

                        <section className="pt-8 border-t border-gray-100">
                            <p className="italic text-gray-500 text-center text-base">
                                "Write your story. Share your voice."
                            </p>
                        </section>
                    </div>
                </Container>
            </main>
            <Footer />
        </div>
    );
}
