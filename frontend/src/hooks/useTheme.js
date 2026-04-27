import { useState, useEffect } from "react"

export function useTheme() {
    const [theme, setTheme] = useState(() => {
        try {
            return localStorage.getItem("topify_theme") || "light"
        } catch {
            return "light"
        }
    })

    useEffect(() => {
        const root = document.documentElement
        if (theme === "dark") {
            root.classList.add("dark")
        } else {
            root.classList.remove("dark")
        }
        localStorage.setItem("topify_theme", theme)
    }, [theme])

    const toggleTheme = () =>
        setTheme((prev) => (prev === "dark" ? "light" : "dark"))

    return { theme, toggleTheme }
}