import useSWR from "swr";
import { Post } from "@/lib/posts";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useSearchPosts(query: string) {
    const { data, error, isLoading } = useSWR(
        query ? `/api/posts?q=${encodeURIComponent(query)}` : null,
        fetcher
    );

    return {
        posts: (data as Post[]) || [],
        isLoading,
        isError: error,
    };
}
