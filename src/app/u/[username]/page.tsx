"use client";

import { UserProfileView } from "@/components/user/user-profile-view";
import { useParams } from "next/navigation";

export default function UserPage() {
    const params = useParams();
    const username = params?.username as string;

    if (!username) return null;

    return <UserProfileView username={username} />;
}
