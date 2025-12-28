import type { Config } from "tailwindcss";

// Theme 0: Classic Blue & Gold
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      scrollBehavior: ['smooth'],
      colors: {
        background: "#ffffff",
        foreground: "#171717",
        bgAlt: "#f0f9ff",
        bgLight: "#e0f2fe",
        bgPale: "#dbeafe",
        textMuted: "#64748b",
        textDark: "#1e293b",
        error: "#ef4444",
        success: "#10b981",
        primary: {
          DEFAULT: "#eff6ff",
          light: "#f0f9ff",
          pale: "#dbeafe",
          hover: "#dbeafe",
          foreground: "#171717",
        },
        secondary: {
          DEFAULT: "#1e40af",
          dark: "#1e3a8a",
          medium: "#3b82f6",
          light: "#60a5fa",
        },
        accent: {
          DEFAULT: "#f59e0b",
          dark: "#d97706",
          darker: "#b45309",
          light: "#fde68a",
        },
        highlight: {
          DEFAULT: "#0d9488",
          dark: "#0f766e",
          light: "#5eead4",
        },
        border: {
          light: "#bfdbfe",
          medium: "#3b82f6",
          pale: "#e5e7eb",
          accent: "#fbbf24",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
