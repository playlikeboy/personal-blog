import { Container } from "@/components/ui/container";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PostCard } from "@/components/blog/post-card";
import { getAllPosts } from "@/lib/posts";

interface TagPageProps {
    params: Promise<{
        tag: string;
    }>;
}

export default async function TagPage({ params }: TagPageProps) {
    const { tag } = await params;
    const decodedTag = decodeURIComponent(tag);
    const allPosts = await getAllPosts();

    const posts = allPosts.filter(post =>
        post.tags.some(t => t.toLowerCase() === decodedTag.toLowerCase())
    );

    if (posts.length === 0) {
        // Optionally render empty state instead of 404
    }

    return (
        <div className="flex min-h-screen flex-col bg-background font-sans">
            <Header />
            <main className="flex-1 py-12 md:py-20">
                <Container>
                    <div className="mb-12">
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Tag</p>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                            #{decodedTag}
                        </h1>
                        <p className="mt-4 text-gray-500">
                            {posts.length} {posts.length === 1 ? 'post' : 'posts'} about {decodedTag}
                        </p>
                    </div>

                    {posts.length > 0 ? (
                        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                            {posts.map((post) => (
                                <PostCard key={post.slug} post={post} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center bg-gray-50 rounded-2xl">
                            <p className="text-gray-500">No posts found with this tag.</p>
                        </div>
                    )}
                </Container>
            </main>
            <Footer />
        </div>
    );
}
