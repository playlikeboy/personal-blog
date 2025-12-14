'use client';

import { DashboardView } from "@/components/dashboard/dashboard-view";
import { Loader, Text } from "rizzui";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch('/api/dashboard')
            .then(res => {
                if (res.status === 401) {
                    router.push('/handler/sign-in');
                    throw new Error("Unauthorized");
                }
                if (!res.ok) throw new Error("Failed to load");
                return res.json();
            })
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(e => {
                if (e.message !== "Unauthorized") {
                    setError(e.message);
                }
                setLoading(false);
            });
    }, [router]);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[50vh]">
                <Loader variant="spinner" size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center text-red-500 min-h-[50vh]">
                <Text>{error}</Text>
            </div>
        );
    }

    if (!data) return null;

    return <DashboardView user={data.user} posts={data.posts} stats={data.stats} />;
}
