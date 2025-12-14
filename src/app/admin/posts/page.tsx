import { getAdminData } from "../actions";
import { AdminView } from "@/components/admin/admin-view";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
    const posts = await getAdminData();

    if (!posts) {
        return (
            <div className="p-4 rounded-md bg-red-50 text-red-600">
                Failed to load posts. Please try again later.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Posts Management</h2>
            <AdminView posts={posts} />
        </div>
    );
}
