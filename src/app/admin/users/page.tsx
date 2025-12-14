import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";
import { toggleUserBan, deleteUser } from "../actions";
import { Button } from "rizzui"; // Using RizzUI for buttons as requested/configured
import { Badge } from "rizzui";
import { Trash2, Ban, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Users Management</h2>
                <div className="text-sm text-gray-500">
                    Total Users: {allUsers.length}
                </div>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900">User</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Joined</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {allUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                                {/* Fallback to simple img if Avatar component has issues */}
                                                <img
                                                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name || 'User'}`}
alt = { user.name || "User" }
className = "w-full h-full object-cover"
    />
                                            </div >
    <div>
        <div className="font-medium text-gray-900">{user.name || "Unknown"}</div>
        <div className="text-gray-500 text-xs">{user.email}</div>
    </div>
                                        </div >
                                    </td >
                                    <td className="px-6 py-4">
                                        {user.isBanned ? (
                                            <Badge color="danger" variant="flat">Banned</Badge>
                                        ) : (
                                            <Badge color="success" variant="flat">Active</Badge>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <form action={toggleUserBan.bind(null, user.id, user.isBanned || false)}>
                                                <Button
                                                    type="submit"
                                                    variant="text"
                                                    size="sm"
                                                    color={user.isBanned ? "success" : "danger"}
                                                    className="h-8 w-8 p-0"
                                                    title={user.isBanned ? "Unban User" : "Ban User"}
                                                >
                                                    {user.isBanned ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                                </Button>
                                            </form>

                                            <form action={deleteUser.bind(null, user.id)}>
                                                <Button
                                                    type="submit"
                                                    variant="text"
                                                    size="sm"
                                                    color="danger"
                                                    className="h-8 w-8 p-0 hover:bg-red-50 text-red-600"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </form>
                                        </div>
                                    </td>
                                </tr >
                            ))}
                        </tbody >
                    </table >
                </div >
            </div >
        </div >
    );
}
