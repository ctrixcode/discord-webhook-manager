"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useTheme } from "next-themes"
import { Monitor, Moon, Sun } from "lucide-react"

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ]

  return (
    <div className="space-y-3">
      <Label className="text-base font-medium text-white">Theme</Label>
      <p className="text-sm text-slate-300 mb-3">Choose your preferred theme or let the system decide</p>
      <div className="grid grid-cols-3 gap-3">
        {themes.map(({ value, label, icon: Icon }) => (
          <Button
            key={value}
            variant={theme === value ? "default" : "outline"}
            onClick={() => setTheme(value)}
            className="flex items-center gap-2 h-12 bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 text-white"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        ))}
      </div>
    </div>
  )
}
