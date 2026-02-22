/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                // Backgrounds
                dark: {
                    900: "#0b1120",
                    800: "#111827",
                    700: "#1a2236",
                    600: "#1e293b",
                    500: "#334155",
                },
                accent: {
                    DEFAULT: "#3b82f6",
                    light: "#60a5fa",
                    dark: "#1d4ed8",
                    glow: "rgba(59, 130, 246, 0.15)",
                },
                // Status
                success: "#22c55e",
                danger: "#ef4444",
                warn: "#f59e0b",
                info: "#06b6d4",
                // Roles
                admin: "#a855f7",
                artist: "#3b82f6",
                customer: "#22c55e",
            },
        },
    },
    plugins: [],
};
