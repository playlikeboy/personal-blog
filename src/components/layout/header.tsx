"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/container";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { UserButton } from "@stackframe/stack";

export function Header() {
    const pathname = usePathname();

    const navItems = [
        { label: "Home", href: "/" },
        { label: "Feed", href: "/feed" },
        { label: "Authors", href: "/authors" },
        { label: "About", href: "/about" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <Container className="flex h-16 items-center justify-between">
                <Link href="/" className="font-bold tracking-tighter text-xl">
                    Minimal.
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-foreground",
                                pathname === item.href ? "text-foreground" : "text-muted-foreground"
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <button aria-label="Search" className="text-muted-foreground hover:text-foreground transition-colors">
                        <MagnifyingGlassIcon className="h-5 w-5" />
                    </button>
                    <Link href="/write" className="text-sm font-medium hover:underline underline-offset-4 hidden sm:block">
                        Write
                    </Link>
                    <UserButton />
                </div>
            </Container>
        </header>
    );
}
