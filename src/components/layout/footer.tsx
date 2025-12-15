'use client';

import Link from "next/link";
import { Text } from "rizzui";
import { Container } from "@/components/ui/container";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-gray-100 dark:border-gray-800 bg-background py-12 mt-auto">
            <Container>
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <Link href="/" className="text-2xl font-serif font-bold text-foreground tracking-tight hover:opacity-80 transition-opacity">
                            Unstory.live
                        </Link>
                        <Text className="text-sm text-gray-400 font-light">
                            © {currentYear} Unstory. All rights reserved.
                        </Text>
                    </div>

                    <nav className="flex items-center gap-8">
                        <Link href="/about" className="hover:text-foreground transition-colors">
                            About
                        </Link>
                        <Link href="/directory" className="hover:text-foreground transition-colors">
                            Directory
                        </Link>
                        <Link href="/rss.xml" className="hover:text-foreground transition-colors">
                            RSS
                        </Link>
                        <Link href="/tags" className="text-sm font-medium text-gray-500 hover:text-foreground transition-colors">
                            Topics
                        </Link>
                        <a href="mailto:hello@unstory.live" className="text-sm font-medium text-gray-500 hover:text-foreground transition-colors">
                            Contact
                        </a>
                        <Link href="/rss.xml" className="text-sm font-medium text-gray-500 hover:text-foreground transition-colors">
                            RSS
                        </Link>
                        <Link href="/sitemap.xml" className="text-sm font-medium text-gray-500 hover:text-foreground transition-colors">
                            Sitemap
                        </Link>
                    </nav>
                </div>
            </Container>
        </footer>
    );
}
