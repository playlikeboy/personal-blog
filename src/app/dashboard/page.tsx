import { stackServerApp } from "@/stack/server";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const user = await stackServerApp.getUser();

    if (!user) {
        redirect("/handler/sign-in");
    }

    return <DashboardView />;
}
