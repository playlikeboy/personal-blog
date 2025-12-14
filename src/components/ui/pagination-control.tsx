import Link from "next/link";
import { Button } from "rizzui";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface PaginationControlProps {
    currentPage: number;
    totalPages: number;
    urlParam?: string; // default "page"
    // Optional: function to generate URL if complex, key-value pairs to preserve
    queryParams?: Record<string, string | number | undefined>;
    baseUrl?: string; // relative or absolute path, e.g. "/search" or "?"
}

export function PaginationControl({ currentPage, totalPages, urlParam = "page", queryParams = {}, baseUrl = "" }: PaginationControlProps) {
    if (totalPages <= 1) return null;

    const createUrl = (page: number) => {
        const params = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                params.set(key, String(value));
            }
        });
        params.set(urlParam, String(page));
        // If baseUrl contains '?', append params with '&', else '?'
        const separator = baseUrl.includes("?") ? "&" : "?";
        // Handle case where baseUrl is empty (implies strictly params) or starts with '?'
        if (baseUrl.startsWith("?")) {
            // Merge existing params? Assuming baseUrl is just path for now or we build full string
            // Simplest: baseUrl is the path.
            return `${baseUrl}${separator}${params.toString()}`;
        }
        return `${baseUrl}${separator}${params.toString()}`;
    };

    return (
        <div className="mt-12 flex justify-center items-center gap-4">
            <Button
                as={Link}
                href={createUrl(currentPage - 1)}
                variant="outline"
                disabled={currentPage <= 1}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
            >
                <ChevronLeftIcon className="w-4 h-4 mr-2" />
                Previous
            </Button>
            <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
            </span>
            <Button
                as={Link}
                href={createUrl(currentPage + 1)}
                variant="outline"
                disabled={currentPage >= totalPages}
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
            >
                Next
                <ChevronRightIcon className="w-4 h-4 ml-2" />
            </Button>
        </div>
    );
}
