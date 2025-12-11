import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getAllPosts } from "@/lib/posts";

export default async function AuthorsPage() {
    const posts = await getAllPosts();

    // Extract unique authors
    const authorsMap = new Map();
    posts.forEach(post => {
        if (!authorsMap.has(post.author.name)) {
            authorsMap.set(post.author.name, {
                name: post.author.name,
                avatar: post.author.avatar,
                postCount: 0
            });
        }
        authorsMap.get(post.author.name).postCount++;
    });

    const authors = Array.from(authorsMap.values());

    return (
        <div className="flex min-h-screen flex-col bg-background font-sans">
            <Header />
            <main className="flex-1 py-12 md:py-20">
                <Container>
                    <div className="mb-12 border-b border-gray-100 pb-8">
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Authors</h1>
                        <p className="text-gray-500">Meet the voices behind the stories.</p>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {authors.map((author) => (
                            <Link
                                key={author.name}
                                href={`/u/${author.name.toLowerCase().replace(/\s+/g, '-')}`}
                                className="group flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-white mb-4 ring-2 ring-white shadow-sm group-hover:scale-105 transition-transform duration-300">
                                    <Image
                                        src={author.avatar}
                                        alt={author.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <h3 className="text-lg font-bold text-foreground mb-1">{author.name}</h3>
                                <p className="text-sm text-gray-500">{author.postCount} {author.postCount === 1 ? 'story' : 'stories'}</p>
                            </Link>
                        ))}
                    </div>
                </Container>
            </main>
            <Footer />
        </div>
    );
}
