import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AboutContent } from "./about-content";

export const metadata = {
    title: "About Unstory",
    description: "Learn more about Unstory, its mission, and its team.",
};

export default function AboutPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background font-sans">
            <Header />
            <AboutContent />
            <Footer />
        </div>
    );
}

