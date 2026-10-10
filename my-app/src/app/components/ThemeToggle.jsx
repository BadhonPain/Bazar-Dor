"use client";

import { useEffect, useSyncExternalStore } from "react";

let currentTheme = "light";
const themeListeners = new Set();

function subscribeToTheme(listener) {
    themeListeners.add(listener);
    return () => themeListeners.delete(listener);
}

function getThemeSnapshot() {
    return currentTheme;
}

function setTheme(theme, persist = false) {
    currentTheme = theme;
    document.documentElement.dataset.theme = theme;

    if (persist) {
        try {
            localStorage.setItem("bazar-dor-theme", theme);
        } catch (error) {
            console.error("Unable to save the selected theme", error);
        }
    }

    themeListeners.forEach((listener) => listener());
}

export default function ThemeToggle() {
    const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => "light");

    useEffect(() => {
        let initialTheme;

        try {
            initialTheme = localStorage.getItem("bazar-dor-theme");
        } catch (error) {
            console.error("Unable to read the saved theme", error);
        }

        if (initialTheme !== "light" && initialTheme !== "dark") {
            initialTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";
        }

        setTheme(initialTheme);
    }, []);

    const nextTheme = theme === "dark" ? "light" : "dark";

    return (
        <button
            type="button"
            aria-label={theme === "dark" ? "লাইট থিম চালু করুন" : "ডার্ক থিম চালু করুন"}
            title={theme === "dark" ? "লাইট থিম" : "ডার্ক থিম"}
            onClick={() => {
                setTheme(nextTheme, true);
            }}
            className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#e1e9e2] bg-[#fbfdfb] text-[#34443a] transition hover:bg-[#edf4ef] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#07833f]"
        >
            {theme === "dark" ? (
                <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
                </svg>
            ) : (
                <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                >
                    <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
                </svg>
            )}
        </button>
    );
}
