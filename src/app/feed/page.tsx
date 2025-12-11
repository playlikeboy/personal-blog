import { Container } from "@/components/ui/container";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PostCard } from "@/components/blog/post-card";
import { getAllPosts } from "@/lib/posts";

export default async function FeedPage() {
    const posts = await getAllPosts();

    return (
        <div className="flex min-h-screen flex-col bg-background font-sans">
            <Header />
            <main className="flex-1 py-12 md:py-20">
                <Container>
                    <div className="mb-12 border-b border-gray-100 pb-8">
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Your Feed</h1>
                        <p className="text-gray-500">The latest stories from across the platform.</p>
                    </div>

                    <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <PostCard key={post.slug} post={post} />
                        ))}
                    </div>
                </Container>
            </main>
            <Footer />
        </div>
    );
}
