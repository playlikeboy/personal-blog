import { Container } from "@/components/ui/container";

export function Footer() {
    return (
        <footer className="border-t border-border py-12 mt-auto">
            <Container className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
                <div className="font-semibold text-foreground tracking-tight">Minimal.</div>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
                    <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
                    <a href="#" className="hover:text-foreground transition-colors">RSS</a>
                </div>
                <p>
                    &copy; {new Date().getFullYear()} Minimal Blog.
                </p>
            </Container>
        </footer>
    );
}
