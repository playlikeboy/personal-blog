import type { Metadata } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../stack/client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "Unstory.live | Write your story. Share your voice.",
		template: "%s | Unstory",
	},
	description: "A story-first, emotion-driven blogging platform. No distractions, just your words and the people who connect with them.",
	openGraph: {
		title: "Unstory.live | Write your story. Share your voice.",
		description: "A minimalist space for sharing knowledge and perspectives without the noise.",
		url: "https://unstory.live",
		siteName: "Unstory",
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Unstory.live | Write your story. Share your voice.",
		description: "A minimalist space for sharing knowledge and perspectives without the noise.",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	name: "Unstory",
	url: "https://unstory.live",
	potentialAction: {
		"@type": "SearchAction",
		target: "https://unstory.live/search?q={search_term_string}",
		"query-input": "required name=search_term_string",
	},
};

import { Providers } from "./providers";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
				<StackProvider app={stackClientApp}>
					<StackTheme>
						<script
							type="application/ld+json"
							dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
						/>
						<Providers>{children}</Providers>
					</StackTheme>
				</StackProvider>
			</body>
		</html>
	);
}
