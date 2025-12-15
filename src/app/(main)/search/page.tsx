import { type Metadata } from "next";
import { searchPosts } from "@/lib/posts";
import { SearchPageView } from "@/components/search/search-page-view";
import { Container } from "@/components/ui/container";

export const dynamic = "force-dynamic";

interface SearchPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { searchParams }: SearchPageProps
): Promise<Metadata> {
    const params = await searchParams;
    const query = params.q as string | undefined;

    return {
        title: query ? `Search results for "${query}"` : "Search",
        description: query
            ? `Explore stories about ${query} on Unstory.`
            : "Search deeply through stories, authors, and topics on Unstory.",
        robots: {
            index: true,
            follow: true,
        }
    }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const params = await searchParams;
    const q = (params.q as string) || "";
    const page = parseInt((params.page as string) || "1", 10);
    const limit = 12;

    const { posts, totalCount } = await searchPosts(q, page, limit);

    return (
        <main className="min-h-screen py-16 md:py-24 bg-background">
            <Container>
                <SearchPageView
                    posts={posts}
                    initialQuery={q}
                    currentPage={page}
                    totalPages={Math.ceil(totalCount / limit)}
                />
            </Container>
        </main>
    );
}
