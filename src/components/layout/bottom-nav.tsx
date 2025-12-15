"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, MagnifyingGlassIcon, PencilSquareIcon, RectangleStackIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { HomeIcon as HomeIconSolid, MagnifyingGlassIcon as MagnifyingGlassIconSolid, PencilSquareIcon as PencilSquareIconSolid, RectangleStackIcon as RectangleStackIconSolid, UserCircleIcon as UserCircleIconSolid } from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        {
            label: "Home",
            href: "/",
            icon: HomeIcon,
            activeIcon: HomeIconSolid,
        },
        {
            label: "Search",
            href: "/search",
            icon: MagnifyingGlassIcon,
            activeIcon: MagnifyingGlassIconSolid,
        },
        {
            label: "Write",
            href: "/write",
            icon: PencilSquareIcon,
            activeIcon: PencilSquareIconSolid,
            isPrimary: true,
        },
        {
            label: "Feed",
            href: "/feed",
            icon: RectangleStackIcon,
            activeIcon: RectangleStackIconSolid,
        },
        // Using a general profile link for now, could be dynamic based on auth
        {
            label: "Profile",
            href: "/dashboard",
            icon: UserCircleIcon,
            activeIcon: UserCircleIconSolid,
        },
    ];

    // Hide if inside editor
    if (pathname.startsWith('/write') && pathname !== '/write') return null;

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 pt-2 pointer-events-none">
            <motion.nav
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-background/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-full px-2 py-2 flex items-center justify-between pointer-events-auto mx-auto max-w-sm"
            >
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                    const Icon = isActive ? item.activeIcon : item.icon;

                    if (item.isPrimary) {
                        return (
                            <Link key={item.href} href={item.href} className="relative group">
                                <motion.div
                                    whileTap={{ scale: 0.9 }}
                                    className="w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center shadow-lg mx-2"
                                >
                                    <Icon className="w-6 h-6" />
                                </motion.div>
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-12 h-12 rounded-full transition-colors relative",
                                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <motion.div whileTap={{ scale: 0.8 }}>
                                <Icon className="w-6 h-6" />
                            </motion.div>
                            {isActive && (
                                <motion.div
                                    layoutId="bottom-nav-indicator"
                                    className="absolute -bottom-1 w-1 h-1 bg-foreground rounded-full"
                                />
                            )}
                        </Link>
                    )
                })}
            </motion.nav>
        </div>
    );
}
