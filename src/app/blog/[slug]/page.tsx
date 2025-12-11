import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Container } from "@/components/ui/container";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getPostBySlug } from "@/lib/posts";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ScrollProgress } from "@/components/blog/scroll-progress";

interface BlogPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background">
            <ScrollProgress />
            <Header />
            <main className="py-12 md:py-20">
                <Container as="article" className="max-w-3xl">
                    {/* Back Link */}
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-8 transition-colors">
                        <ArrowLeftIcon className="w-4 h-4" />
                        Back to Home
                    </Link>

                    {/* Header */}
                    <header className="mb-10 space-y-6">
                        <div className="flex gap-2 mb-4">
                            {post.tags.map(tag => (
                                <span key={tag} className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl leading-tight text-foreground">
                            {post.title}
                        </h1>
                        <p className="text-xl text-gray-500 leading-relaxed">
                            {post.excerpt}
                        </p>

                        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                                <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
                            </div>
                            <div>
                                <p className="font-medium text-black">{post.author.name}</p>
                                <p className="text-sm text-gray-500">{post.date} · {post.readTime}</p>
                            </div>
                        </div>
                    </header>

                    {/* Cover Image */}
                    <div className="relative aspect-video w-full mb-12 overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
                        <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-blue-600 max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {post.content || ""}
                        </ReactMarkdown>
                    </div>

                </Container>
            </main>
            <Footer />
        </div>
    );
}
