import { getDashboardStats } from "./actions";
import { Text, Title } from "rizzui";
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
                <Title as="h3" className="mb-4">Quick Actions</Title>
                <div className="flex gap-4">
                    {/* Placeholder for Quick Actions */}
                    <Text>Select a section from the sidebar to manage content.</Text>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon: Icon, color }: { title: string, value: number, icon: any, color: string }) {
    return (
        <div className="bg-white p-6 rounded-xl border flex items-center justify-between">
            <div>
                <Text className="text-gray-500 font-medium mb-1">{title}</Text>
                <Title as="h2" className="text-3xl font-bold">{value}</Title>
            </div>
            <div className={`p-4 rounded-full ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    );
}
