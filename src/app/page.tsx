import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Search } from "@/components/blog/search";
import { getAllPosts } from "@/lib/posts";

export default async function Home() {
	const posts = await getAllPosts();

	return (
		<div className="flex min-h-screen flex-col bg-background font-sans">
			<Header />
			<main className="flex-1 py-12 md:py-20">
				<Container>
					<div className="mb-12 text-center md:text-left">
						<h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4 text-foreground">
							Thoughts, stories, <br className="hidden md:block" /> and ideas.
						</h1>
						<p className="text-lg text-gray-500 max-w-2xl">
							A minimalist space for sharing knowledge and perspectives without the noise.
						</p>
					</div>

					<Search posts={posts} />
				</Container>
			</main>
			<Footer />
		</div>
	);
}
