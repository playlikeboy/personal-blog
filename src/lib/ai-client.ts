export async function generateSummary(text: string): Promise<string> {
    if (!text) return "";

    // Truncate to avoid extremely long URLs/inputs, though GET usually limited.
    // Pollinations might handle POST, but simple GET is documented often.
    // Let's stick to a reasonable length for the context.
    const truncatedText = text.slice(0, 1500).replace(/\s+/g, ' ').trim();

    const instruction = "Summarize the following text into exactly 2 concise sentences suitable for a blog post excerpt. Do not include any intro or outro. Text:";
    const prompt = `${instruction} ${truncatedText}`;

    try {
        // Pollinations Text API: https://text.pollinations.ai/{prompt}
        // It returns raw text.
        const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`);

        if (!response.ok) {
            throw new Error(`Pollinations API Error: ${response.statusText}`);
        }

        const summary = await response.text();
        return summary.trim();
    } catch (error) {
        console.error("Failed to generate summary:", error);
        throw error;
    }
}
