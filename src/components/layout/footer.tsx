import { Container } from "@/components/ui/container";

export function Footer() {
    return (
        <footer className="border-t border-muted py-8 mt-auto">
            <Container className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <p className="text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Minimal Blog. All rights reserved.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Built with Next.js & RizzUI</span>
                </div>
            </Container>
        </footer>
    );
}
