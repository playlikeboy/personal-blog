import useSWR from "swr";
import { Post } from "@/lib/posts";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface UseSearchPostsProps {
    query: string;
    page?: number;
    limit?: number;
}

export function useSearchPosts({ query, page = 1, limit = 12 }: UseSearchPostsProps) {
    const { data, error, isLoading } = useSWR(
        query ? `/api/posts?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}` : null,
        fetcher,
        {
            keepPreviousData: true, // Keep data while loading new page
        }
    );

    return {
        posts: (data?.posts as Post[]) || [],
        totalCount: (data?.totalCount as number) || 0,
        isLoading,
        isError: error,
    };
}
