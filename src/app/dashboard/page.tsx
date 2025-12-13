'use client';

import { DashboardView } from "@/components/dashboard/dashboard-view";
import { Loader, Text } from "rizzui";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

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
            <div className="flex min-h-screen flex-col bg-background font-sans">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <Loader variant="spinner" size="lg" />
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen flex-col bg-background font-sans">
                <Header />
                <main className="flex-1 flex items-center justify-center text-red-500">
                    <Text>{error}</Text>
                </main>
            </div>
        );
    }

    if (!data) return null;

    return <DashboardView user={data.user} posts={data.posts} stats={data.stats} />;
}
