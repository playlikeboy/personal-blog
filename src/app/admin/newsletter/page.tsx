import { getNewsletterSubscribers } from "../actions";
import { format } from "date-fns";
import { Badge } from "rizzui";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
    const subscribers = await getNewsletterSubscribers();

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Newsletter Subscribers</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden border">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {subscribers.map((sub) => (
                            <tr key={sub.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {sub.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <Badge color={sub.isActive ? "success" : "danger"}>
                                        {sub.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {sub.createdAt ? format(sub.createdAt, "MMM d, yyyy") : "-"}
                                </td>
                            </tr>
                        ))}
                        {subscribers.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No subscribers found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
