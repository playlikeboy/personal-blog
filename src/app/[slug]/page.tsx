"use client";

import { UserProfileView } from "@/components/user/user-profile-view";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootSlugPage() {
    const params = useParams();
    const slug = params?.slug as string; // slug is encoded, e.g. %40username

    if (!slug) return notFound();

    const decoded = decodeURIComponent(slug);

    if (decoded.startsWith('@')) {
        const username = decoded.slice(1);
        return <UserProfileView username={username} />;
    }

    // Handle other slugs or 404
    return notFound();
}
