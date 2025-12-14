import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { searchPosts } from "@/lib/posts";
import { SearchPageView } from "@/components/search/search-page-view";
import { Container } from "@/components/ui/container";

export const dynamic = "force-dynamic";

interface SearchPageProps {
    searchParams: Promise<{
        q?: string;
        page?: string;
    }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q = "", page = "1" } = await searchParams;
    const pageNum = parseInt(page, 10);
    const limit = 12;

    const { posts, totalCount } = await searchPosts(q, pageNum, limit);
    const totalPages = Math.ceil(totalCount / limit);

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 py-12 md:py-20">
                <Container>
                    <SearchPageView
                        posts={posts}
                        initialQuery={q}
                        currentPage={pageNum}
                        totalPages={totalPages}
                    />
                </Container>
            </main>
            <Footer />
        </div>
    );
}
