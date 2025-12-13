"use client";

import { useUser } from "@stackframe/stack";
import { User } from "@/db/types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, Text } from "rizzui";
import Link from "next/link";
import {
    UserIcon,
    PencilSquareIcon,
    ArrowRightOnRectangleIcon,
    Squares2X2Icon
} from "@heroicons/react/24/outline";

import { useEffect, useState } from "react";

export function UserMenu() {
    const user = useUser();
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            fetch('/api/me')
                .then(res => res.json())
                .then(data => {
                    const u = data as User;
                    if (u.username) setUsername(u.username);
                })
                .catch(err => console.error("Failed to fetch username", err));
        }
    }, [user]);

    if (!user) {
        return (
            <Link href="/handler/sign-in">
                <Button size="sm" variant="outline" className="rounded-full border-gray-200 dark:border-gray-700">
                    Sign In
                </Button>
            </Link>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="cursor-pointer">
                    <Avatar className="h-9 w-9 ring-2 ring-transparent hover:ring-gray-100 transition-all">
                        <AvatarImage src={user.profileImageUrl || ""} alt={user.displayName || "User"} />
                        <AvatarFallback>{user.displayName?.slice(0, 2).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-2" align="end" forceMount>
                <div className="px-2 py-2 mb-2 bg-secondary/30 rounded-lg">
                    <Text className="font-medium text-sm truncate">{user.displayName}</Text>
                    <Text className="text-xs text-muted-foreground truncate opacity-70">
                        {user.primaryEmail}
                    </Text>
                </div>

                <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer flex items-center gap-2 rounded-lg py-2">
                        <Squares2X2Icon className="h-4 w-4" />
                        <span>Dashboard</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={`/u/${username || (user as any).username || user.id}`} className="cursor-pointer flex items-center gap-2 rounded-lg py-2">
                        <UserIcon className="h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/write" className="cursor-pointer flex items-center gap-2 rounded-lg py-2">
                        <PencilSquareIcon className="h-4 w-4" />
                        <span>Write Story</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-2" />

                <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 flex items-center gap-2 rounded-lg py-2"
                    onClick={() => user.signOut()}
                >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    <span>Sign out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
