"use client";

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { UserMenu } from "@/components/layout/user-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "rizzui";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

export function Header() {
    return (
        <header className="fixed top-0 z-50 w-full border-b border-gray-100/50 dark:border-gray-800/50 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
            <Container className="flex h-16 items-center justify-between">
                {/* Logo */}
                <Link href="/" className="font-serif text-2xl font-semibold tracking-tight text-foreground hover:opacity-80 transition-opacity">
                    Unstory.
                </Link>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
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
