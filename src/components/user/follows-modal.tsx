"use client";

import { Modal, Title, ActionIcon, Text } from "rizzui";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { User } from "@/db/types";

interface FollowsModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    users: User[];
    loading: boolean;
}

export function FollowsModal({ isOpen, onClose, title, users, loading }: FollowsModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="bg-background p-6 rounded-2xl max-w-md w-full mx-auto shadow-2xl border border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-6">
                    <Title as="h3" className="text-xl font-medium font-serif capitalize">{title}</Title>
                    <ActionIcon variant="text" onClick={onClose} className="hover:bg-gray-100 rounded-full">
                        <XMarkIcon className="w-5 h-5" />
                    </ActionIcon>
                </div>

                <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-foreground rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    ) : users.length > 0 ? (
                        users.map((user) => (
                            <Link
                                key={user.id}
                                href={`/@${user.username || user.name?.toLowerCase().replace(/\s+/g, '-')}`}
                                onClick={onClose}
                                className="flex items-center gap-4 p-2 hover:bg-secondary/50 rounded-xl transition-colors group"
                            >
                                <div className="relative w-12 h-12 flex-shrink-0 bg-gray-100 rounded-full overflow-hidden border border-gray-100 dark:border-gray-700">
                                    {user.avatar ? (
                                        <Image src={user.avatar} alt={user.name || "User"} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-secondary text-lg font-medium text-foreground/40">
                                            {user.name?.[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">{user.name}</h4>
                                    <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-12 text-muted-foreground font-light">
                            No users found.
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}
