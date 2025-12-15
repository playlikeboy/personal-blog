import type { Metadata, Viewport } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../stack/client";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const playfair = Playfair_Display({
	variable: "--font-playfair",
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
	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
		title: "Unstory",
	},
	applicationName: "Unstory",
	formatDetection: {
		telephone: false,
	},
};

export const viewport: Viewport = {
	themeColor: "#ffffff",
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false, // For "native" feel
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
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { BottomNav } from "@/components/layout/bottom-nav";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="icon" href="/favicon.ico" sizes="any" />
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-background text-foreground`}>
				<StackProvider app={stackClientApp}>
					<StackTheme>
						<script
							type="application/ld+json"
							dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
						/>
						<Providers>
							<div className="pb-24 md:pb-0 min-h-screen">
								{children}
							</div>
							<BottomNav />
							<InstallPrompt />
						</Providers>
					</StackTheme>
				</StackProvider>
			</body>
		</html>
	);
}
