import { Container } from "@/components/ui/container";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const dynamic = 'force-dynamic';

export default function UserPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background font-sans">
            <Header />
            <main className="flex-1 py-12 md:py-20 flex items-center justify-center">
                <Container>
                    <div className="text-center">
                        <h1 className="text-2xl font-serif mb-4">Profile Unavailable</h1>
                        <p className="text-muted-foreground">User profiles are currently under maintenance.</p>
                    </div>
                </Container>
            </main>
            <Footer />
        </div>
    );
}

export const metadata = {
    title: "User | Unstory.live"
}
