import useSWRInfinite from "swr/infinite";
import { Post } from "@/lib/posts";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface UsePostFeedProps {
    initialPosts?: Post[];
    limit?: number;
    sort?: "latest" | "popular" | "random";
}

export function usePostFeed({ initialPosts, limit = 12, sort = "latest" }: UsePostFeedProps = {}) {
    const getKey = (pageIndex: number, previousPageData: any) => {
        // Reached the end
        if (previousPageData && !previousPageData.length) return null;

        // Simplest approach: /api/posts?page=X&sort=Y
        return `/api/posts?page=${pageIndex + 1}&limit=${limit}&sort=${sort}`;
    };

    const { data, error, size, setSize, isLoading } = useSWRInfinite(getKey, fetcher, {
        fallbackData: initialPosts ? [{ posts: initialPosts, totalCount: 0 }] : undefined,
        revalidateFirstPage: false, // Don't refetch page 1 immediately if we have initial data (unless sort changes?)
        // Actually if sort changes, fallbackData might be stale if passed.
        // SWR handles key changes by resetting, but fallbackData is tied to hook init.
        // If sorting changes, initialPosts (if provided) might not match the new sort.
        // Ideally initialPosts matches the 'sort' prop default.
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
