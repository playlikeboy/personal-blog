import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

const ADMIN_EMAIL = "sh20raj@gmail.com";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await stackServerApp.getUser();

    if (!user || user.primaryEmail !== ADMIN_EMAIL) {
        redirect("/");
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50/30">
            <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
                <Header />
            </div>

            <div className="flex pt-[72px] min-h-screen">
                <AdminSidebar />

                <main className="flex-1 w-full overflow-x-hidden">
                    <div className="max-w-7xl mx-auto p-6 md:p-8">
                        <div className="mb-8">
                            <h1 className="text-2xl md:text-3xl font-bold font-serif text-gray-900">
                                Dashboard
                            </h1>
                            <p className="text-gray-500 mt-1">Manage your blog content and users.</p>
                        </div>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
