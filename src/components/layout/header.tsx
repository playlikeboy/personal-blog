"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "rizzui";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

export function Header() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-muted bg-background/80 backdrop-blur-md">
            <Container className="flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight">Minimal.</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    <Link
                        href="/"
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-foreground",
                            pathname === "/" ? "text-foreground" : "text-gray-500"
                        )}
                    >
                        Home
                    </Link>
                    <Link
                        href="/about"
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-foreground",
                            pathname === "/about" ? "text-foreground" : "text-gray-500"
                        )}
                    >
                        About
                    </Link>
                    <Link
                        href="/write"
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-foreground",
                            pathname === "/write" ? "text-foreground" : "text-gray-500"
                        )}
                    >
                        Write
                    </Link>
                </nav>
                <div className="flex items-center gap-2">
                    <button aria-label="Search" className="rounded-full p-2 hover:bg-gray-100 transition-colors">
                        <MagnifyingGlassIcon className="h-5 w-5" />
                    </button>
                    <Link href="/write">
                        <Button size="sm" className="hidden sm:inline-flex rounded-full">
                            Write a Post
                        </Button>
                    </Link>
                </div>
            </Container>
        </header>
    );
}
