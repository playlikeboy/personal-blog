"use client";

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { UserMenu } from "@/components/layout/user-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "rizzui";
import { PencilSquareIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export function Header() {
    return (
        <header className="fixed top-0 z-50 w-full border-b border-gray-100/50 dark:border-gray-800/50 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
            <Container className="flex h-16 items-center justify-between">
                {/* Logo */}
                <Link href="/" className="font-serif text-2xl font-semibold tracking-tight text-foreground hover:opacity-80 transition-opacity">
                    Unstory.
                </Link>

                {/* Right Actions - Hidden on Mobile */}
                <div className="hidden md:flex items-center gap-3">
                    <Link href="/feed" aria-label="Feed" className="text-muted-foreground hover:text-foreground transition-colors p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                    </Link>
                    <Link href="/search" aria-label="Search" className="text-muted-foreground hover:text-foreground transition-colors p-2">
                        <MagnifyingGlassIcon className="h-5 w-5" />
                    </Link>

                    <ThemeToggle />

                    <Link href="/write">
                        <Button
                            variant="text"
                            className="hidden sm:inline-flex gap-2 text-sm font-medium text-foreground hover:bg-secondary/50 rounded-full px-4"
                        >
                            <PencilSquareIcon className="w-4 h-4" />
                            Write
                        </Button>
                    </Link>

                    <div className="pl-2 border-l border-gray-200 dark:border-gray-800 ml-1">
                        <UserMenu />
                    </div>
                </div>
            </Container>
        </header>
    );
}
