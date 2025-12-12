"use client";

import { useUser } from "@stackframe/stack";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "rizzui";
import Link from "next/link";
import {
    UserIcon,
    PencilSquareIcon,
    RectangleGroupIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    HomeIcon,
    NewspaperIcon,
    UsersIcon
} from "@heroicons/react/24/outline";

export function UserMenu() {
    const user = useUser();

    if (!user) {
        return (
            <Link href="/handler/sign-in">
                <Button size="sm" variant="outline" className="rounded-full">
                    Sign In
                </Button>
            </Link>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="text" className="relative h-8 w-8 rounded-full p-0 overflow-hidden border border-border">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profileImageUrl || ""} alt={user.displayName || "User"} />
                        <AvatarFallback>{user.displayName?.slice(0, 2).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.primaryEmail}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Navigation Group */}
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs font-normal text-muted-foreground px-2 py-1.5">
                        Navigation
                    </DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                        <Link href="/" className="cursor-pointer w-full flex items-center">
                            <HomeIcon className="mr-2 h-4 w-4" />
                            <span>Home</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/feed" className="cursor-pointer w-full flex items-center">
                            <NewspaperIcon className="mr-2 h-4 w-4" />
                            <span>Feed</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="cursor-pointer w-full flex items-center">
                            <RectangleGroupIcon className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/authors" className="cursor-pointer w-full flex items-center">
                            <UsersIcon className="mr-2 h-4 w-4" />
                            <span>Authors</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                {/* User Group */}
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs font-normal text-muted-foreground px-2 py-1.5">
                        Account
                    </DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                        <Link href={`/u/${user.id}`} className="cursor-pointer w-full flex items-center">
                            <UserIcon className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/write" className="cursor-pointer w-full flex items-center">
                            <PencilSquareIcon className="mr-2 h-4 w-4" />
                            <span>Write a Story</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/handler/account-settings" className="cursor-pointer w-full flex items-center">
                            <Cog6ToothIcon className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={() => user.signOut()}
                >
                    <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
