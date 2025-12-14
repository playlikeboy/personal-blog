"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    Users,
    Settings,
    Tags,
    Mail,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
import { useState } from "react";

const NAV_ITEMS = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/posts", label: "Posts", icon: FileText },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/categories", label: "Categories", icon: Tags },
    { href: "/admin/tags", label: "Tags", icon: Tags },
    { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
    { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed z-50 bottom-4 right-4 bg-black text-white p-3 rounded-full shadow-lg"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-[calc(100vh-4rem)] md:top-16",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full py-4">
                    <div className="px-6 mb-6">
                        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Menu
                        </h2>
                    </div>

                    <nav className="flex-1 space-y-1 px-3">
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                        isActive
                                            ? "bg-black text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                    )}
                                >
                                    <Icon className="w-5 h-5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="px-3 mt-auto border-t pt-4">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Exit Admin
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
