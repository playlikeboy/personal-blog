import { getDashboardStats } from "./actions";
import { StatsCard } from "@/components/admin/stats-card";
import { FileText, Users, Eye, Mail } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
    const stats = await getDashboardStats();

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Posts"
                    value={stats.totalPosts}
                    icon={FileText}
                    color="bg-blue-50 text-blue-600"
                />
                <StatsCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                    color="bg-green-50 text-green-600"
                />
                <StatsCard
                    title="Total Views"
                    value={stats.totalViews}
                    icon={Eye}
                    color="bg-purple-50 text-purple-600"
                />
                <StatsCard
                    title="Subscribers"
                    value={stats.totalSubscribers}
                    icon={Mail}
                    color="bg-orange-50 text-orange-600"
                />
            </div>

            <div className="bg-white p-6 rounded-xl border">
                <h3 className="text-lg font-bold font-serif mb-4">Quick Actions</h3>
                <div className="flex gap-4">
                    {/* Placeholder for Quick Actions */}
                    <p className="text-gray-500">Select a section from the sidebar to manage content.</p>
                </div>
            </div>
        </div>
    );
}

