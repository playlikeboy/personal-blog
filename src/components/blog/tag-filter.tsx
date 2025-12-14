"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, Text } from "rizzui";

const sortOptions = [
    { label: "Recommended", value: "recommended" },
    { label: "Latest", value: "latest" },
    { label: "Popular", value: "popular" },
];

export function TagFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get("sort") || "recommended";

    const handleSortChange = (option: any) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", option.value);
        params.set("page", "1"); // Reset directly to page 1
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex items-center justify-between mb-8">
            <Text className="font-medium text-gray-500">
                Sorted by
            </Text>
            <div className="w-48">
                <Select
                    options={sortOptions}
                    value={sortOptions.find(o => o.value === currentSort)}
                    onChange={handleSortChange}
                    variant="outline"
                    className="w-full"
                />
            </div>
        </div>
    );
}
