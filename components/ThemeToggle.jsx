"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react"; // optional icons

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-2xl bg-gray-200 dark:bg-gray-800 transition"
        >
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
    );
}
