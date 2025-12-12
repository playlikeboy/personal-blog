"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Title } from "rizzui";
// Link & ArrowLeftIcon removed (unused)
import { Post } from "@/lib/posts";
import ReactMarkdown from "react-markdown";

interface PostViewProps {
    post: Post | null;
}

export function PostView({ post }: PostViewProps) {
    if (!post) {
        return null;
    }

    return (
        <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
            <Header />
            <article className="flex-1 py-20">
                <Container className="max-w-3xl">
                  
                    <div className="space-y-6 mb-16 text-center">
                        <div className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                            {post.tags?.[0] || "Article"}
                        </div>
                        <Title as="h1" className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                            {post.title}
                        </Title>
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <span>{post.author?.name || "Author"}</span>
                            <span>•</span>
                            <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="prose prose-lg prose-gray mx-auto prose-headings:font-bold prose-headings:tracking-tight prose-a:text-foreground prose-a:no-underline hover:prose-a:underline prose-img:rounded-none prose-img:grayscale hover:prose-img:grayscale-0 transition-all">
                        <ReactMarkdown>{post.content || ""}</ReactMarkdown>
                    </div>
                </Container>
            </article>
            <Footer />
        </div>
    );
}
