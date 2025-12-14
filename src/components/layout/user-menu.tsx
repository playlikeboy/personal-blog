"use client";

import { useUser } from "@stackframe/stack";
import { User } from "@/db/types";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { Button } from "rizzui";
import Link from "next/link";
import {
    UserIcon,
    PencilSquareIcon,
    ArrowRightOnRectangleIcon,
    Squares2X2Icon
} from "@heroicons/react/24/outline";
import { useEffect, useState, Fragment } from "react";
import { cn } from "@/lib/utils";

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
        <Menu as="div" className="relative ml-3 opacity-100">
            <MenuButton className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                <img
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-transparent hover:ring-gray-100 transition-all"
                    src={user.profileImageUrl || ""}
                    alt={user.displayName || "User"}
                />
            </MenuButton>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl py-1 shadow-lg ring-1 ring-black/5 focus:outline-none border border-gray-100 dark:border-gray-800">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 mb-1">
                        <p className="text-sm font-medium text-foreground truncate">{user.displayName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.primaryEmail}</p>
                    </div>

                    <div className="p-1">
                        <MenuItem>
                            {({ focus }) => (
                                <Link
                                    href="/dashboard"
                                    className={cn(
                                        focus ? 'bg-gray-50 dark:bg-gray-800' : '',
                                        'group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors'
                                    )}
                                >
                                    <Squares2X2Icon className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                                    Dashboard
                                </Link>
                            )}
                        </MenuItem>
                        <MenuItem>
                            {({ focus }) => (
                                <Link
                                    href={`/@${username || (user as any).username || user.id}`}
                                    className={cn(
                                        focus ? 'bg-gray-50 dark:bg-gray-800' : '',
                                        'group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors'
                                    )}
                                >
                                    <UserIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                                    Profile
                                </Link>
                            )}
                        </MenuItem>
                        <MenuItem>
                            {({ focus }) => (
                                <Link
                                    href="/write"
                                    className={cn(
                                        focus ? 'bg-gray-50 dark:bg-gray-800' : '',
                                        'group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors'
                                    )}
                                >
                                    <PencilSquareIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                                    Write Story
                                </Link>
                            )}
                        </MenuItem>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-800 p-1 mt-1">
                        <MenuItem>
                            {({ focus }) => (
                                <button
                                    onClick={() => user.signOut()}
                                    className={cn(
                                        focus ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'text-red-600 dark:text-red-500',
                                        'group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors'
                                    )}
                                >
                                    <ArrowRightOnRectangleIcon className={cn("h-4 w-4", focus ? "text-red-700" : "text-red-500")} />
                                    Sign out
                                </button>
                            )}
                        </MenuItem>
                    </div>
                </MenuItems>
            </Transition>
        </Menu>
    );
}
