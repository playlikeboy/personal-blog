import { getAllPosts, getMostLikedPost, getPostsByUsername, getRecentPosts } from "@/lib/posts";
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
    const featuredPost = await getMostLikedPost();
    const topAuthorPosts = await getPostsByUsername('sh20raj', 3);
    const recentPosts = await getRecentPosts(6, featuredPost?.id);

    return (
        <HomeView
            topAuthorPosts={topAuthorPosts}
            featuredPost={featuredPost}
            recentPosts={recentPosts}
        />
    );
}

