"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FileText,
    Users,
    Tags,
    FolderTree,
    Mail,
    Settings,
    LogOut
} from "lucide-react";

const navItems = [
    {
        title: "Overview",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Posts",
        href: "/admin/posts",
        icon: FileText,
    },
    {
        title: "Users",
        href: "/admin/users",
        icon: Users,
    },
    {
        title: "Categories",
        href: "/admin/categories",
        icon: FolderTree,
    },
    {
        title: "Tags",
        href: "/admin/tags",
        icon: Tags,
    },
    {
        title: "Newsletter",
        href: "/admin/newsletter",
        icon: Mail,
    },
    {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
];

export function AdminSideNav() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col h-full border-r bg-gray-50/40 w-64 min-h-[calc(100vh-65px)]">
            <div className="flex-1 py-6 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary border-r-2 border-primary"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            )}
                        >
                            <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-gray-500")} />
                            {item.title}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
