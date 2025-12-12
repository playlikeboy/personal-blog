import { getAllPosts } from "@/lib/posts";
import { StoriesList } from "@/components/dashboard/stories-list";

export const dynamic = 'force-dynamic';

export default async function DashboardStoriesPage() {
    const allPosts = await getAllPosts();

    return (
        <StoriesList posts={allPosts} />
    );
}

