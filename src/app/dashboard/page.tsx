import { stackServerApp } from "@/stack/server";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const user = await stackServerApp.getUser();

    if (!user) {
        redirect("/handler/sign-in");
    }

    return <DashboardView user={user} />;
}
