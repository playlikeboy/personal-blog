import { Container } from "@/components/ui/container";
import { PostCard } from "@/components/blog/post-card";
import { getAllPosts } from "@/lib/posts";

interface CategoryPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;
    const category = decodeURIComponent(slug);
    const allPosts = await getAllPosts();

    // For MVP: treating tags as categories or checking if a post has a 'category' field
    // Use loose matching to find anything relevant
    const posts = allPosts.filter(post =>
        // Check if category matches a tag or explicit category field if it existed
        post.tags.some(t => t.toLowerCase() === category.toLowerCase())
    );

    return (
        <div className="py-12 md:py-20">
            <Container>
                <div className="mb-12">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Category</p>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl capitalize">
                        {category}
                    </h1>
                    <p className="mt-4 text-gray-500">
                        Explore our thoughts on {category}
                    </p>
                </div>

                {posts.length > 0 ? (
                    <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <PostCard key={post.slug} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center bg-gray-50 rounded-2xl">
                        <p className="text-gray-500">No posts found in this category.</p>
                    </div>
                )}
            </Container>
        </div>
    );
}
