import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PostCard } from "@/components/blog/post-card";
import { getAllPosts } from "@/lib/posts";

interface UserPageProps {
    params: Promise<{
        username: string;
    }>;
}

export default async function UserPage({ params }: UserPageProps) {
    const { username } = await params;
    const decodedUsername = decodeURIComponent(username); // Simple fix for URL encoding
    const allPosts = await getAllPosts();

    // Case-insensitive match for author name
    const posts = allPosts.filter(post =>
        post.author.name.toLowerCase().replace(/\s+/g, '-').toLowerCase() === decodedUsername.toLowerCase() ||
        post.author.name.toLowerCase() === decodedUsername.toLowerCase()
    );

    // If no posts found, we might want to check if the user exists at all (mock logic)
    // For now, if no posts, we assume 404 or just empty profile

    const author = posts.length > 0 ? posts[0].author : { name: decodedUsername, avatar: `https://ui-avatars.com/api/?name=${decodedUsername}` };

    return (
        <div className="flex min-h-screen flex-col bg-background font-sans">
            <Header />
            <main className="flex-1 py-12 md:py-20">
                <Container>
                    <div className="flex flex-col items-center text-center mb-16 border-b border-gray-100 pb-12">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 mb-6 ring-4 ring-white shadow-lg">
                            <Image
                                src={author.avatar}
                                alt={author.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">{author.name}</h1>
                        <p className="text-gray-500 max-w-md">
                            Writer of {posts.length} stories. Sharing perspectives on design, technology, and life.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <h2 className="text-xl font-bold border-b border-gray-100 pb-4">Latest from {author.name}</h2>
                        {posts.length > 0 ? (
                            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                                {posts.map((post) => (
                                    <PostCard key={post.slug} post={post} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center bg-gray-50 rounded-2xl">
                                <p className="text-gray-500">Hasn&apos;t published any stories yet.</p>
                            </div>
                        )}
                    </div>
                </Container>
            </main>
            <Footer />
        </div>
    );
}
