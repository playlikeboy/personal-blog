import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getAllPosts } from "@/lib/posts";
import { SearchPageView } from "@/components/search/search-page-view";
import { Container } from "@/components/ui/container";

export const dynamic = "force-dynamic";

export default async function SearchPage() {
    const posts = await getAllPosts();

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 py-12 md:py-20">
                <Container>
                    <SearchPageView posts={posts} />
                </Container>
            </main>
            <Footer />
        </div>
    );
}
