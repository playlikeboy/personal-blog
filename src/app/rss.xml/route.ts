import { getAllPosts } from "@/lib/posts";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const posts = await getAllPosts();

        const siteUrl = "https://unstory.live";
        const feedOptions = {
            title: "Unstory.live | Minimalist Blogging",
            description: "A space for stories, emotions, and calm reading.",
            id: siteUrl,
            link: siteUrl,
            language: "en",
            copyright: `All rights reserved ${new Date().getFullYear()}, Unstory.live`,
            generator: "Unstory",
        };

        const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${feedOptions.title}</title>
    <link>${feedOptions.link}</link>
    <description>${feedOptions.description}</description>
    <language>${feedOptions.language}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${posts.map((post: any) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/feed/${post.slug}</link>
      <guid>${siteUrl}/feed/${post.slug}</guid>
      <pubDate>${post.createdAt ? new Date(post.createdAt).toUTCString() : new Date().toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt || ""}]]></description>
    </item>
    `).join('')}
  </channel>
</rss>`;

        return new NextResponse(feed, {
            headers: {
                'Content-Type': 'application/xml',
            },
        });
    } catch (e: any) {
        console.error("RSS Generation Error:", e);
        return new NextResponse(
            `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Error</title></channel></rss>`,
            {
                status: 200,
                headers: { 'Content-Type': 'application/xml' }
            }
        );
    }
}
