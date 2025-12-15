# Unstory.live

> **"Write your story. Share your voice."**

Unstory.live is a story-first writing platform designed to help people express their experiences, ideas, emotions, creative writing(poems, shayri, stories articles, blogs, etc.) and memories freely. Unlike traditional blogging websites, we focus on emotional expression, personal storytelling, and minimal distraction.

![Unstory Banner](https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2666&auto=format&fit=crop)

## 🌟 Vision
-   **Emotional expression** over technical writing.
-   **Flow-state writing** environment.
-   **Reader immersion** with calm design.
-   **Community** based on appreciation, not vanity metrics.

## 🎨 Design System
Based on the "Calm Design" philosophy:
-   **Primary**: Charcoal Black (`#1A1A1A`)
-   **Secondary**: Soft Cream (`#F2EDE7`)
-   **Accent**: Calm Blue (`#7BA4FF`)
-   **Typography**: *Playfair Display* (Headings), *Inter* (Body).

## 🛠 Tech Stack
-   **Framework**: Next.js 15 (App Router)
-   **Database**: Turso (LibSQL) with Drizzle ORM
-   **Auth**: Stack Auth
-   **Styling**: Tailwind CSS + RizzUI
-   **Editor**: Plate.js (Rich Text)

## 🚀 Features
-   **Flow Editor**: Distraction-free writing experience.
-   **Unstory Stories**: Read immersive stories from the community.
-   **Analytics**: Private view counts and insights for authors.
-   **SEO**: Built-in dynamic metadata and structured data.

## 📦 Getting Started

### Prerequisites
-   Node.js 18+
-   Bun (recommended)

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/appedme/unstory.git
    cd unstory
    ```
2.  Install dependencies:
    ```bash
    bun install
    ```
3.  Set up environment variables (`.env.local`):
    ```env
    TURSO_DB_URL=...
    TURSO_AUTH_TOKEN=...
    NEXT_PUBLIC_STACK_PROJECT_ID=...
    NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=...
    STACK_SECRET_SERVER_KEY=...
    ```
4.  Run the development server:
    ```bash
    bun dev
    ```

## 📄 License
MIT
