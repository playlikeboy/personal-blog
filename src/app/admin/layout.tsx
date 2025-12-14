import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AdminSideNav } from "@/components/admin/admin-side-nav";

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
        <div className="min-h-screen flex flex-col bg-gray-50/20">
            <Header />
            <div className="flex flex-1">
                <aside className="hidden md:block">
                    <AdminSideNav />
                </aside>
                <main className="flex-1 p-8 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-3xl font-bold font-serif">Admin Dashboard</h1>
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                                Admin Access
                            </span>
                        </div>
                        {children}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}
