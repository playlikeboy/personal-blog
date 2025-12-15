import useSWRInfinite from "swr/infinite";
import { Post } from "@/lib/posts";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface UsePostFeedProps {
    initialPosts?: Post[];
    limit?: number;
}

export function usePostFeed({ initialPosts, limit = 12 }: UsePostFeedProps = {}) {
    const getKey = (pageIndex: number, previousPageData: any) => {
        // Reached the end
        if (previousPageData && !previousPageData.length) return null;

        // First page, we might want to use initial data or just fetch
        // Note: SWRInfinite + initialData is tricky. 
        // Usually standard pattern: fetch from page 1 always or start from page 2 if hydrating.
        // For simplicity: we'll start fetching from page 1 (or 2 if we assume initial is page 1)

        // Simplest approach: /api/posts?page=X
        return `/api/posts?page=${pageIndex + 1}&limit=${limit}`;
    };

    const { data, error, size, setSize, isLoading } = useSWRInfinite(getKey, fetcher, {
        fallbackData: initialPosts ? [initialPosts] : undefined,
        revalidateFirstPage: false, // Don't refetch page 1 immediately if we have initial data
    });

    const posts = data ? data.flatMap((page: any) => page.posts) : [];
    const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
    const isEmpty = (data?.[0] as any)?.posts?.length === 0;
    // Type assertion for SWR data array which is array of page objects
    const isReachingEnd = isEmpty || (data && (data[data.length - 1] as any)?.posts?.length < limit);

    return {
        posts,
        error,
        isLoadingMore,
        size,
        setSize,
        isReachingEnd,
    };
}
