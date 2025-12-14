import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getAllPosts } from "@/lib/posts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
            <main className="flex-1 py-12 md:py-20 lg:py-24">
                <Container>
                    <div className="max-w-2xl">
                        <h1 className="text-4xl font-bold tracking-tight mb-4">Authors</h1>
                        <p className="text-xl text-muted-foreground mb-16">Meet the voices behind the stories.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {authors.map((author) => (
                            <Link
                                key={author.name}
                                href={`/@${author.username || author.name.toLowerCase().replace(/\s+/g, '-')}`}
                                className="group flex flex-col items-center text-center space-y-4"
                            >
                                <Avatar className="w-24 h-24 sm:w-32 sm:h-32 group-hover:scale-105 transition-transform duration-300 ring-offset-2 ring-1 ring-transparent group-hover:ring-gray-200">
                                    <AvatarImage
                                        src={author.avatar}
                                        alt={author.name}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="text-2xl sm:text-4xl bg-gray-100">
                                        {author.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                
                                <div className="space-y-1">
                                    <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                                        {author.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground uppercase tracking-wide text-xs">
                                        {author.postCount} {author.postCount === 1 ? 'Article' : 'Articles'}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </Container>
            </main>
            <Footer />
        </div>
    );
}
