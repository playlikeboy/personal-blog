/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/rizzui/dist/*.{js,ts,jsx,tsx}", // ⚠️ Required to compile RizzUI styles
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-geist-sans)"],
                mono: ["var(--font-geist-mono)"],
                serif: ["var(--font-playfair)"],
            }
        },
    },
    plugins: [
        require("@tailwindcss/forms"),
    ],
};
