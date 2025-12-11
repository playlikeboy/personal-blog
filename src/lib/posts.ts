import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Post {
    slug: string;
    title: string;
    excerpt: string;
    coverImage: string;
    date: string;
    author: {
        name: string;
        avatar: string;
    };
    readTime: string;
    tags: string[];
    content?: string; // Markdown content
}

const POSTS_DIR = path.join(process.cwd(), "content/posts");

export async function getAllPosts(): Promise<Post[]> {
    if (!fs.existsSync(POSTS_DIR)) {
        return [];
    }

    const files = fs.readdirSync(POSTS_DIR).filter((file) => file.endsWith(".md"));

    const posts = files.map((file) => {
        const filePath = path.join(POSTS_DIR, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(fileContent);

        return {
            ...data,
            content,
        } as Post;
    });

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
    const posts = await getAllPosts();
    return posts.find((post) => post.slug === slug);
}
