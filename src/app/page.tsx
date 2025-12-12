import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getAllPosts } from "@/lib/posts";
import { stackServerApp } from "@/stack/server";
import { syncUserWithStack } from "@/lib/auth-sync";
import { HomeView } from "@/components/home/home-view";

export default async function Home() {
    // 1. Auth & Sync
    const user = await stackServerApp.getUser();
    if (user) {
        await syncUserWithStack(user);
    }

    // 2. Data Fetching
    const posts = await getAllPosts();

    // 3. Prepare data for client component
    // We pass posts directly as they match the interface (mostly), or we cast them if needed.
    // The previous manual mapping was good for sanitization but led to type mismatch if not careful.
    // Let's rely on the real standard Post type.

    const featuredPost = posts[0];
    const recentPosts = posts.slice(1, 4);

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <HomeView
                posts={posts}
                featuredPost={featuredPost}
                recentPosts={recentPosts}
            />
            <Footer />
        </div>
    );
}

