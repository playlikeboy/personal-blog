/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/rizzui/dist/*.{js,ts,jsx,tsx}", // ⚠️ Required to compile RizzUI styles
    ],
    theme: {
        extend: {
            colors: {
                /*
                 * Unstory Palette
                 */
                background: "#ffffff",
                foreground: "#1A1A1A", // Charcoal Black

                primary: {
                    DEFAULT: "#1A1A1A", // Charcoal Black
                    foreground: "#ffffff",
                },

                secondary: {
                    DEFAULT: "#F2EDE7", // Soft Cream
                    foreground: "#1A1A1A",
                },

                accent: {
                    DEFAULT: "#7BA4FF", // Calm Blue
                    foreground: "#ffffff",
                },

                muted: {
                    DEFAULT: "#F3F4F6", // Gray-100 placeholder
                    foreground: "#6B7280", // Gray-500 text
                }
            },
        },
        fontFamily: {
            sans: ["var(--font-geist-sans)"],
            mono: ["var(--font-geist-mono)"],
        }
    },
    plugins: [
        require("@tailwindcss/forms"),
    ],
};
