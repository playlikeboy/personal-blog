"use server";

import fs from "fs";
import path from "path";
import { redirect } from "next/navigation";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
}

export async function createPost(formData: FormData) {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const tags = formData.get("tags") as string;
    const coverImage = (formData.get("coverImage") as string) || "https://images.unsplash.com/photo-1499750310159-5254f4cc1529?q=80&w=2070&auto=format&fit=crop";

    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const date = new Date().toISOString().split("T")[0];

    const markdownContent = `---
slug: "${slug}"
title: "${title}"
date: "${date}"
excerpt: "${excerpt}"
coverImage: "${coverImage}"
tags: [${tags.split(",").map(t => `"${t.trim()}"`).join(", ")}]
author:
  name: "Anonymous"
  avatar: "https://randomuser.me/api/portraits/lego/1.jpg"
readTime: "5 min read"
---

${content}
`;

    const filePath = path.join(POSTS_DIR, `${slug}.md`);
    fs.writeFileSync(filePath, markdownContent);

    redirect("/");
}
