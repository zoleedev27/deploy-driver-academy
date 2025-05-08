"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    const [isDark, setIsDark] = React.useState(false)

    React.useEffect(() => {
        setIsDark(theme === "dark")
    }, [theme])

    const toggleTheme = () => {
        const newTheme = isDark ? "light" : "dark"
        setIsDark(!isDark)
        setTheme(newTheme)
    }

    return (
        <Button variant="outline" className="text-black dark:text-white" size="icon" onClick={toggleTheme}>
            <Sun className={`h-[1.2rem] w-[1.2rem] transition-all ${isDark ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`} />
            <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${isDark ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`} />
        </Button>
    )
}